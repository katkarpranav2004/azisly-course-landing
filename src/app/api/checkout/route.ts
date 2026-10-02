import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createCashfreeOrder } from "@/lib/cashfree";
import { sanitizeAttribution } from "@/lib/attribution";
import { collegeContent } from "@/content/college";
import { corporateContent } from "@/content/corporate";
import { courseContent } from "@/content/course";
import type { Audience } from "@/content/types";

const CONTENT_BY_AUDIENCE = {
  college: collegeContent,
  corporate: corporateContent,
  course: courseContent,
} satisfies Record<Audience, unknown>;

const PHONE_RE = /^[0-9]{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveAmount(audience: Audience): number {
  const { pricing } = CONTENT_BY_AUDIENCE[audience];
  const now = Date.now();
  const offerIsLive =
    now >= new Date(pricing.offerStartedAt).getTime() &&
    now <= new Date(pricing.offerEndsAt).getTime();
  return offerIsLive ? pricing.offerPrice : pricing.listPrice;
}

export async function POST(request: NextRequest) {
  let payload: {
    audience?: string;
    name?: string;
    email?: string;
    phone?: string;
    attribution?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { audience, name, email, phone } = payload;

  if (audience !== "college" && audience !== "corporate" && audience !== "course") {
    return NextResponse.json({ error: "Invalid audience" }, { status: 400 });
  }
  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: "Please enter your full name" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }
  if (!phone || !PHONE_RE.test(phone.replace(/\D/g, "").slice(-10))) {
    return NextResponse.json({ error: "Please enter a valid 10-digit phone number" }, {
      status: 400,
    });
  }

  const normalizedPhone = phone.replace(/\D/g, "").slice(-10);
  const amount = resolveAmount(audience);
  const orderId = `azisly_${audience}_${Date.now()}_${randomUUID().slice(0, 8)}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  try {
    const order = await createCashfreeOrder({
      orderId,
      amount,
      currency: CONTENT_BY_AUDIENCE[audience].pricing.currency,
      customerId: `cust_${Date.now()}`,
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: normalizedPhone,
      returnUrl: `${siteUrl}/order/status?order_id={order_id}&audience=${audience}`,
      note: `Azisly AI Corporate Analyst (${audience})`,
      tags: { page: audience, ...sanitizeAttribution(payload.attribution) },
    });

    return NextResponse.json({
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
    });
  } catch (error) {
    console.error("Cashfree order creation failed", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again in a moment." },
      { status: 502 }
    );
  }
}

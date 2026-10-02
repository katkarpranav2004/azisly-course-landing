import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { sendWelcomeEmail } from "@/lib/email/send";
import type { EmailAudience } from "@/lib/email/config";

/**
 * Cashfree calls this after a payment. For a successful one, it queues the welcome email to the address
 * the buyer typed on the payment form (read from the payload, nobody types it twice).
 *
 * Set up once in the Cashfree dashboard: Developers, Webhooks, add  https://<your-site>/api/webhooks/cashfree
 * (for both payment forms / the payment events). Needs CASHFREE_SECRET_KEY to verify the signature.
 */

type Json = Record<string, unknown>;
const obj = (v: unknown): Json => (v && typeof v === "object" ? (v as Json) : {});
const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);

function verify(raw: string, request: NextRequest): "ok" | "bad" | "no-secret" {
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!secret) return "no-secret";
  const ts = request.headers.get("x-webhook-timestamp") ?? "";
  const sig = request.headers.get("x-webhook-signature") ?? "";
  const expected = createHmac("sha256", secret).update(ts + raw).digest("base64");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? "ok" : "bad";
}

/** Which of the two payment forms was paid. Only the form and order notes are looked at, never the buyer's own text. */
function audienceOf(data: Json): EmailAudience | null {
  const hints = [JSON.stringify(obj(data.form)), JSON.stringify(obj(data.payment_form)), str(obj(data.order).order_note), JSON.stringify(obj(data.order).order_tags ?? {})]
    .filter(Boolean)
    .join(" ");
  if (/college/i.test(hints)) return "college";
  if (/corporate/i.test(hints)) return "corporate";
  return null;
}

export async function POST(request: NextRequest) {
  const raw = await request.text();

  const check = verify(raw, request);
  if (check === "bad") return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  if (check === "no-secret" && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  let body: Json;
  try {
    body = obj(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = str(body.type) ?? "";
  const data = obj(body.data);
  const payment = obj(data.payment);
  const order = obj(data.order);

  // Only completed payments get an email (ignore failed and abandoned ones).
  const failed = /FAIL|DROP|PENDING|CANCEL/i.test(type) || (str(payment.payment_status) && !/SUCCESS/i.test(str(payment.payment_status)!));
  const orderStatus = str(order.order_status);
  if (failed || (orderStatus && !/PAID|SUCCESS/i.test(orderStatus))) {
    return NextResponse.json({ ok: true, skipped: "not a successful payment" });
  }

  const customer = { ...obj(data.customer_details), ...obj(order.customer_details) };
  const email = str(customer.customer_email) ?? str(data.customer_email);
  const name = str(customer.customer_name) ?? str(data.customer_name);
  const orderId = str(order.order_id) ?? str(data.order_id) ?? str(payment.cf_payment_id);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !orderId) {
    return NextResponse.json({ ok: true, skipped: "no usable email or order id in the payload" });
  }

  let audience = audienceOf(data);
  if (!audience) {
    audience = "corporate";
    console.warn("Cashfree webhook: could not tell which form was paid; defaulting to the corporate email", { orderId });
  }

  const result = await sendWelcomeEmail({ to: email, name, orderId, audience });
  if (result.status === "failed") {
    // A non-2xx makes Cashfree retry the webhook later, which is what we want for a provider hiccup.
    console.error("Welcome email failed", { orderId, detail: result.detail });
    return NextResponse.json({ ok: false, error: result.detail }, { status: 502 });
  }

  // No buyer details in the log.
  console.log("Welcome email", { orderId, audience, status: result.status, sendAt: result.sendAt });
  return NextResponse.json({ ok: true, audience, status: result.status, sendAt: result.sendAt });
}

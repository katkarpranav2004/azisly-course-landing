import { NextRequest, NextResponse } from "next/server";
import { getCashfreeOrderStatus } from "@/lib/cashfree";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ error: "order_id is required" }, { status: 400 });
  }

  try {
    const order = await getCashfreeOrderStatus(orderId);
    return NextResponse.json({
      orderId: order.order_id,
      status: order.order_status,
      amount: order.order_amount,
      currency: order.order_currency,
    });
  } catch (error) {
    console.error("Cashfree order status lookup failed", error);
    return NextResponse.json(
      { error: "Could not fetch order status." },
      { status: 502 }
    );
  }
}

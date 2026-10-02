import "server-only";

const CASHFREE_ENV = process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";

const BASE_URL =
  CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const API_VERSION = "2023-08-01";

function getAuthHeaders() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error(
      "Cashfree is not configured. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in the environment."
    );
  }

  return {
    "x-client-id": appId,
    "x-client-secret": secretKey,
    "x-api-version": API_VERSION,
    "Content-Type": "application/json",
  };
}

export interface CreateOrderParams {
  orderId: string;
  amount: number;
  currency: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  note: string;
  /** shown on the order in the Cashfree dashboard (UTM source, campaign, etc.) */
  tags?: Record<string, string>;
}

export interface CashfreeOrderResponse {
  order_id: string;
  payment_session_id: string;
  order_status: string;
}

export async function createCashfreeOrder(
  params: CreateOrderParams
): Promise<CashfreeOrderResponse> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      order_id: params.orderId,
      order_amount: params.amount,
      order_currency: params.currency,
      customer_details: {
        customer_id: params.customerId,
        customer_name: params.customerName,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone,
      },
      order_meta: {
        return_url: params.returnUrl,
      },
      order_note: params.note,
      ...(params.tags && Object.keys(params.tags).length > 0 ? { order_tags: params.tags } : {}),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cashfree order creation failed (${res.status}): ${body}`);
  }

  return res.json();
}

export interface CashfreeOrderStatus {
  order_id: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED" | string;
  order_amount: number;
  order_currency: string;
}

export async function getCashfreeOrderStatus(
  orderId: string
): Promise<CashfreeOrderStatus> {
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cashfree order lookup failed (${res.status}): ${body}`);
  }

  return res.json();
}

export function getCashfreeMode(): "sandbox" | "production" {
  return CASHFREE_ENV;
}

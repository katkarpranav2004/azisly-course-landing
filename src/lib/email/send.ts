import "server-only";
import { getEmailConfig, type EmailAudience } from "./config";
import { renderWelcomeEmail } from "./welcome";

/**
 * Queues the welcome email with Resend, scheduled EMAIL_DELAY_MINUTES (default 5) after the payment.
 * The provider holds the email until then, so nothing on our side has to wait or run a timer.
 *
 *   RESEND_API_KEY   from resend.com (required to really send)
 *   EMAIL_FROM       e.g. "Azisly <hello@azisly.ai>" (the domain must be verified in Resend)
 *   EMAIL_REPLY_TO   optional, where replies go
 *   EMAIL_DELAY_MINUTES   optional, default 5
 *
 * Without RESEND_API_KEY it is a dry run: nothing is sent, and the result says what would have been.
 * The order id is the idempotency key, so a repeated webhook never produces a second email.
 */
export interface SendResult {
  status: "queued" | "dry-run" | "failed";
  detail?: string;
  sendAt?: string;
}

export async function sendWelcomeEmail(input: { to: string; name?: string; orderId: string; audience: EmailAudience }): Promise<SendResult> {
  const delay = Math.max(0, Number(process.env.EMAIL_DELAY_MINUTES ?? 5) || 5);
  const sendAt = new Date(Date.now() + delay * 60_000).toISOString();
  const mail = renderWelcomeEmail({
    audience: input.audience,
    name: input.name,
    orderId: input.orderId,
    config: getEmailConfig(input.audience, false),
  });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    return { status: "dry-run", detail: "RESEND_API_KEY or EMAIL_FROM not set; nothing was sent", sendAt };
  }

  // RESEND_API_URL exists only so tests can point this at a local stand-in server.
  const res = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `welcome-${input.orderId}`,
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      reply_to: process.env.EMAIL_REPLY_TO || undefined,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      scheduled_at: sendAt,
    }),
  });

  if (!res.ok) {
    return { status: "failed", detail: `Resend responded ${res.status}`, sendAt };
  }
  return { status: "queued", sendAt };
}

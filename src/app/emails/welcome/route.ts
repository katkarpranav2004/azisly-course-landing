import { NextRequest } from "next/server";
import { getEmailConfig } from "@/lib/email/config";
import { renderWelcomeEmail } from "@/lib/email/welcome";

/**
 * Design preview of the welcome email, as a normal web page.
 *   /emails/welcome?name=Riya               the HTML email
 *   /emails/welcome?format=text             the plain-text version
 *   /emails/welcome?tap=1                   the tap-to-open gift box (real mail only gives this to Apple Mail)
 * By default this shows what Gmail and most other apps get: the gift opens by itself (animated GIF) and the card sits below it,
 * so it can be copied into a message as it is.
 * Missing links and the credit code are shown as clearly marked samples here, never in real sends.
 */
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const mail = renderWelcomeEmail({
    name: q.get("name") || "Riya Sharma",
    orderId: "AZ-SAMPLE-1042",
    interactive: q.get("tap") === "1",
    // images load from whichever server is showing the preview, so it works before anything is deployed
    config: { ...getEmailConfig(true), siteUrl: request.nextUrl.origin },
  });

  const asText = q.get("format") === "text";
  return new Response(asText ? mail.text : mail.html, {
    headers: {
      "Content-Type": asText ? "text/plain; charset=utf-8" : "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

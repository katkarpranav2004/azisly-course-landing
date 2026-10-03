import { NextRequest } from "next/server";
import { getEmailConfig, type EmailAudience } from "@/lib/email/config";
import { renderWelcomeEmail } from "@/lib/email/welcome";

/**
 * Design preview of the welcome email, as a normal web page.
 *   /emails/welcome?audience=college|corporate&name=Riya        the HTML email
 *   /emails/welcome?audience=corporate&format=text              the plain-text version
 *   /emails/welcome?audience=college&gif=1                      the gift as the animated GIF that Gmail and most other apps get
 * The tap-to-open gift box is on here for every browser; in real mail only Apple Mail gets it.
 * Missing links and the credit code are shown as clearly marked samples here, never in real sends.
 */
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const audience: EmailAudience = q.get("audience") === "college" ? "college" : "corporate";
  const mail = renderWelcomeEmail({
    audience,
    name: q.get("name") || "Riya Sharma",
    orderId: "AZ-SAMPLE-1042",
    interactive: q.get("gif") !== "1",
    // images load from whichever server is showing the preview, so it works before anything is deployed
    config: { ...getEmailConfig(audience, true), siteUrl: request.nextUrl.origin },
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

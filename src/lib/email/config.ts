import "server-only";

export type EmailAudience = "college" | "corporate";

/**
 * Everything the welcome email needs that the team supplies later. All of it comes from environment
 * variables (Vercel: Settings, Environment Variables), so nothing here needs a code change:
 *
 *   EMAIL_ZOOM_URL              the Zoom link for the live classes
 *   EMAIL_WHATSAPP_URL          WhatsApp group invite (optional)
 *   EMAIL_AZISLY_URL            link to the Azisly AI Interview practice page (default: https://azisly.ai)
 *   EMAIL_CREDIT_CODE_COLLEGE   code that adds the 50 free credits, for students
 *   EMAIL_CREDIT_CODE_CORPORATE code that adds the 50 free credits, for working professionals
 *   EMAIL_CLASS_DATES           optional, "|" separated, one date/time per class in order (13 items)
 *   EMAIL_SUPPORT_EMAIL         support address shown in the footer (default: support@azisly.ai)
 *
 * A missing link or code is left out of the real email (a section is hidden, never shown as a dead
 * button). In the design preview, missing ones are filled with clearly fake sample values instead.
 */
export interface EmailConfig {
  siteUrl: string;
  zoomUrl?: string;
  whatsappUrl?: string;
  azislyUrl: string;
  creditCode?: string;
  classDates: string[];
  supportEmail: string;
  /** true when sample values were filled in (design preview only; never used for real sends) */
  sample: boolean;
}

export function getEmailConfig(audience: EmailAudience, preview = false): EmailConfig {
  const env = process.env;
  const siteUrl = (env.NEXT_PUBLIC_SITE_URL || "https://azisly-course-landing.vercel.app").replace(/\/$/, "");
  const codeKey = audience === "college" ? env.EMAIL_CREDIT_CODE_COLLEGE : env.EMAIL_CREDIT_CODE_CORPORATE;

  const dates = (env.EMAIL_CLASS_DATES || "")
    .split("|")
    .map((d) => d.trim())
    .filter(Boolean);

  return {
    siteUrl,
    zoomUrl: env.EMAIL_ZOOM_URL || (preview ? "https://zoom.us/j/0000000000" : undefined),
    whatsappUrl: env.EMAIL_WHATSAPP_URL || (preview ? "https://chat.whatsapp.com/SAMPLE" : undefined),
    azislyUrl: env.EMAIL_AZISLY_URL || "https://azisly.ai",
    creditCode: codeKey || (preview ? "SAMPLE50" : undefined),
    classDates: dates,
    supportEmail: env.EMAIL_SUPPORT_EMAIL || "support@azisly.ai",
    sample: preview && !(env.EMAIL_ZOOM_URL && codeKey),
  };
}

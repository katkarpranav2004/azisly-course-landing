import "server-only";
import { cohort, curriculum, MODULE_COUNT } from "@/content/shared";
import type { EmailAudience, EmailConfig } from "./config";

/**
 * The post-payment welcome email: 1 thanks, 2 welcome, 3 schedule, 4 link, then the Azisly banner with
 * 50 free AI Interview practice credits. Built from nested tables with inline styles because that is the
 * only layout every mail app (Outlook included) renders the same way. No images are required to read it.
 */

const INK = "#1c1d1f";
const MUTED = "#5e6266";
const PURPLE = "#5624d0";
const LINE = "#e6e4f0";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const BANNER = {
  college: {
    audience: "Freshers",
    headline: "50 free credits for AI Interview practice",
    body: "Rehearse your first interviews with Azisly's AI Interview practice before the real ones. Add your 50 free credits with the code below.",
    cta: "Claim my 50 free credits",
  },
  corporate: {
    audience: "Working professionals",
    headline: "50 free credits for AI Interview practice",
    body: "Rehearse your next interview with Azisly's AI Interview practice before the real one. Add your 50 free credits with the code below.",
    cta: "Claim my 50 free credits",
  },
} as const;

function withUtm(url: string, audience: EmailAudience) {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "welcome-email");
    u.searchParams.set("utm_medium", "email");
    u.searchParams.set("utm_campaign", "interview-credits");
    u.searchParams.set("utm_content", audience);
    return u.toString();
  } catch {
    return url;
  }
}

function firstClass() {
  const d = new Date(cohort.startsAt);
  const day = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(d);
  const time = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(d).toUpperCase();
  return `${day} · ${time} IST`;
}

/** A button that survives Outlook: a coloured table cell with the link filling it. */
function button(label: string, href: string, kind: "primary" | "ghost" | "yellow" = "primary") {
  const style = {
    primary: { bg: PURPLE, fg: "#ffffff", border: PURPLE },
    ghost: { bg: "#ffffff", fg: PURPLE, border: PURPLE },
    yellow: { bg: "#ffd23f", fg: "#1a0a2e", border: "#ffd23f" },
  }[kind];
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0;"><tr><td align="center" bgcolor="${style.bg}" style="border-radius:10px;border:2px solid ${style.border};"><a href="${esc(href)}" target="_blank" style="display:inline-block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;line-height:20px;color:${style.fg};text-decoration:none;border-radius:10px;">${esc(label)}</a></td></tr></table>`;
}

function sectionLabel(n: number, text: string) {
  return `<p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:${PURPLE};">${n} &nbsp;·&nbsp; ${esc(text)}</p>`;
}

export interface WelcomeInput {
  audience: EmailAudience;
  name?: string;
  orderId?: string;
  config: EmailConfig;
}

export function renderWelcomeEmail({ audience, name, orderId, config }: WelcomeInput) {
  const first = (name || "").trim().split(/\s+/)[0];
  const hello = first ? esc(first.charAt(0).toUpperCase() + first.slice(1)) : "there";
  const banner = BANNER[audience];
  const claimUrl = withUtm(config.azislyUrl, audience);
  const logo = `${config.siteUrl}/logos/azisly-white.png`;
  const portrait = `${config.siteUrl}/email/prasun.png`;
  const subject = "You're in! Welcome to the AI Corporate Analyst program";
  const preheader = `Your seat is confirmed. Class 1 is live on ${cohort.platform} on ${cohort.startsLabel}. Your links and 50 free interview-practice credits are inside.`;

  const classRows = curriculum
    .map((m, i) => {
      const when = config.classDates[i];
      return `<tr><td width="34" valign="top" style="padding:7px 0;border-top:1px solid ${LINE};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:${PURPLE};">${String(m.index).padStart(2, "0")}</td><td valign="top" style="padding:7px 8px 7px 0;border-top:1px solid ${LINE};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:${INK};">${esc(m.title)}</td><td align="right" valign="top" style="padding:7px 0;border-top:1px solid ${LINE};font-family:Arial,Helvetica,sans-serif;font-size:12.5px;line-height:20px;color:${MUTED};white-space:nowrap;">${when ? esc(when) : ""}</td></tr>`;
    })
    .join("");

  const linkBlock = config.zoomUrl
    ? `<p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:${INK};">Use this one link for every live class. Save it, and join from your phone or laptop a few minutes early.</p>
${button(`Join the live classes on ${cohort.platform}`, config.zoomUrl)}
<p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12.5px;line-height:19px;color:${MUTED};">If the button does not work, copy this link into your browser:<br><a href="${esc(config.zoomUrl)}" style="color:${PURPLE};word-break:break-all;">${esc(config.zoomUrl)}</a></p>`
    : `<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:${INK};">Your ${cohort.platform} link for the live classes is on its way. We will send it to this email and ${cohort.deliveredVia === "email and WhatsApp" ? "on WhatsApp" : "by message"} before Class 1.</p>`;

  const whatsapp = config.whatsappUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;"><tr><td>${button("Join the WhatsApp group", config.whatsappUrl, "ghost")}</td></tr></table>`
    : "";

  const codeBox = config.creditCode
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" style="margin:16px 0 4px 0;"><tr><td style="border:2px dashed #ffd23f;border-radius:10px;padding:10px 18px;"><p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#cdbbff;">Your code</p><p style="margin:2px 0 0 0;font-family:'Courier New',Courier,monospace;font-size:24px;font-weight:bold;letter-spacing:3px;color:#ffd23f;">${esc(config.creditCode)}</p></td></tr></table><div style="clear:both;font-size:0;line-height:0;height:1px;">&nbsp;</div>`
    : "";

  const sampleNotice = config.sample
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background:#fff3cd;padding:8px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#664d03;">DESIGN PREVIEW: the Zoom link, WhatsApp link and credit code below are sample values and are not used in real emails.</td></tr></table>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(subject)}</title>
<!--[if mso]><style>table,td,p,a{font-family:Arial,Helvetica,sans-serif !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f3f1fb;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${esc(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
${sampleNotice}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f1fb" style="background:#f3f1fb;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;">

    <!-- header -->
    <tr><td bgcolor="#4b1fb8" style="background:#4b1fb8;padding:22px 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td align="left"><img src="${esc(logo)}" width="132" alt="Azisly.ai" style="display:block;border:0;height:auto;max-width:132px;"></td>
        <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:#d9ccff;">Seat confirmed</td>
      </tr></table>
    </td></tr>

    <!-- 1 thanks -->
    <tr><td style="padding:34px 28px 8px 28px;">
      ${sectionLabel(1, "Thank you")}
      <h1 style="margin:0 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:36px;color:${INK};">Thank you, ${hello}. Your seat is confirmed.</h1>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">Your payment for <b>AI Corporate Analyst</b> went through, and you are enrolled in the ${MODULE_COUNT} live classes.${orderId ? ` Keep this reference handy: <b>${esc(orderId)}</b>.` : ""}</p>
    </td></tr>

    <!-- 2 welcome -->
    <tr><td style="padding:26px 28px 8px 28px;">
      ${sectionLabel(2, "Welcome")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f5ff;border-radius:14px;"><tr>
        <td width="84" valign="top" style="padding:18px 0 18px 18px;"><img src="${esc(portrait)}" width="64" height="64" alt="Prasun Choudhary" style="display:block;border:0;border-radius:32px;"></td>
        <td valign="top" style="padding:18px 18px 18px 14px;">
          <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:${INK};">Welcome aboard. Over the next ${MODULE_COUNT} sessions you will go from using AI for quick answers to building your own agents, dashboards and a working prototype. No coding needed. Come curious, and bring a real task from your day.</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:19px;color:${MUTED};"><b style="color:${INK};">Prasun Choudhary</b><br>Founder, Azisly.ai</p>
        </td>
      </tr></table>
    </td></tr>

    <!-- 3 schedule -->
    <tr><td style="padding:26px 28px 8px 28px;">
      ${sectionLabel(3, "Schedule")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#efe9ff" style="background:#efe9ff;border-radius:14px;"><tr><td style="padding:16px 18px;">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${PURPLE};">Class 1 starts</p>
        <p style="margin:4px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:28px;color:${INK};">${esc(firstClass())}</p>
        <p style="margin:2px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:19px;color:${MUTED};">Live on ${cohort.platform}, taught by Prasun himself</p>
      </td></tr></table>
      <p style="margin:16px 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:${INK};">All ${MODULE_COUNT} classes</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${classRows}<tr><td colspan="3" style="border-top:1px solid ${LINE};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr></table>
      ${config.classDates.length ? "" : `<p style="margin:10px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12.5px;line-height:19px;color:${MUTED};">Exact dates and timings for each class will be shared before it begins.</p>`}
    </td></tr>

    <!-- 4 link -->
    <tr><td style="padding:26px 28px 30px 28px;">
      ${sectionLabel(4, "Your link")}
      ${linkBlock}
      ${whatsapp}
    </td></tr>

    <!-- Azisly banner -->
    <tr><td bgcolor="#1a0a2e" style="background:#1a0a2e;padding:30px 28px 32px 28px;">
      <img src="${esc(logo)}" width="104" alt="Azisly.ai" style="display:block;border:0;height:auto;max-width:104px;margin:0 0 18px 0;">
      <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:#ffd23f;">A gift for ${esc(banner.audience.toLowerCase())}</p>
      <h2 style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:32px;color:#ffffff;">${esc(banner.headline)}</h2>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#ddd3f5;">${esc(banner.body)}</p>
      ${codeBox}
      <div style="margin-top:18px;">${button(banner.cta, claimUrl, "yellow")}</div>
    </td></tr>

    <!-- footer -->
    <tr><td style="padding:22px 28px 26px 28px;">
      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:12.5px;line-height:19px;color:${MUTED};">Questions? Just reply to this email or write to <a href="mailto:${esc(config.supportEmail)}" style="color:${PURPLE};">${esc(config.supportEmail)}</a>.</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11.5px;line-height:18px;color:#8a8d94;">You are receiving this because you enrolled in AI Corporate Analyst. Azisly Technologies Private Limited.</p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `Thank you, ${first || "there"}. Your seat is confirmed.`,
    "",
    `Your payment for AI Corporate Analyst went through, and you are enrolled in the ${MODULE_COUNT} live classes.${orderId ? ` Reference: ${orderId}.` : ""}`,
    "",
    "WELCOME",
    `Over the next ${MODULE_COUNT} sessions you will go from using AI for quick answers to building your own agents, dashboards and a working prototype. No coding needed. - Prasun Choudhary, Founder, Azisly.ai`,
    "",
    "SCHEDULE",
    `Class 1 starts ${firstClass()}, live on ${cohort.platform}.`,
    ...curriculum.map((m, i) => `${String(m.index).padStart(2, "0")}  ${m.title}${config.classDates[i] ? `  (${config.classDates[i]})` : ""}`),
    config.classDates.length ? "" : "Exact dates and timings for each class will be shared before it begins.",
    "",
    "YOUR LINK",
    config.zoomUrl ? `Join the live classes on ${cohort.platform}: ${config.zoomUrl}` : `Your ${cohort.platform} link is on its way. We will send it before Class 1.`,
    config.whatsappUrl ? `WhatsApp group: ${config.whatsappUrl}` : "",
    "",
    `${banner.headline.toUpperCase()} (${banner.audience})`,
    banner.body,
    config.creditCode ? `Your code: ${config.creditCode}` : "",
    `${banner.cta}: ${claimUrl}`,
    "",
    `Questions? Reply to this email or write to ${config.supportEmail}.`,
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");

  return { subject, html, text };
}

import "server-only";
import { cohort, curriculum, MODULE_COUNT } from "@/content/shared";
import type { EmailAudience, EmailConfig } from "./config";

/**
 * The post-payment welcome email, styled after a clean corporate newsletter: a mint header panel (logo,
 * links, headline, framed photo, button), then a white body (greeting, a note from Prasun, three numbers,
 * the schedule as soft grey cards, the class link) and a mint panel with the Azisly gift of 50 free
 * AI Interview practice credits.
 *
 * Built from nested tables with inline styles because that is the only layout every mail app (Outlook
 * included) renders the same way. The pictures (hero photo, gift artwork; sources in scripts/email-art)
 * are decoration; everything that is personal or changes (name, order reference, date, links, code,
 * copy) is live text, so it still reads with images switched off.
 */

const NAVY = "#0b2540";
const MINT = "#bdfbba";
const SOFT = "#f6f6f6";
const TEXT = "#26364a";
const MUTED = "#5b6676";
const LINE = "#e3e7ec";
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Inter,'Segoe UI',Arial,Helvetica,sans-serif";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const BANNER = {
  college: {
    audience: "Freshers",
    headline: "50 free credits for AI Interview practice",
    body: "Rehearse your first interviews with AI before the real ones.",
    cta: "Claim my 50 free credits",
  },
  corporate: {
    audience: "Working professionals",
    headline: "50 free credits for AI Interview practice",
    body: "Rehearse your next interview with AI before the real one.",
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

function classParts() {
  const d = new Date(cohort.startsAt);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { ...o, timeZone: "Asia/Kolkata" }).format(d);
  return {
    day: f({ day: "numeric" }),
    month: f({ month: "short" }).toUpperCase(),
    weekday: f({ weekday: "long" }),
    time: f({ hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase(),
  };
}

/** How many classes the email lists inline; the rest are one tap away on the schedule page. */
const PREVIEW_CLASSES = 3;

type Kind = "navy" | "outline";

/** A button that survives Outlook: a coloured table cell with the link filling it. */
function button(label: string, href: string, kind: Kind = "navy", full = false, cls = "") {
  const s = kind === "navy" ? { bg: NAVY, fg: "#ffffff" } : { bg: "#ffffff", fg: NAVY };
  return `<table role="presentation" ${cls ? `class="${cls}" ` : ""}${full ? 'width="100%" ' : ""}cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="${s.bg}" style="border-radius:10px;border:2px solid ${NAVY};"><a href="${esc(href)}" target="_blank" style="display:${full ? "block" : "inline-block"};padding:${full ? 15 : 13}px 26px;font-family:${SANS};font-size:15px;font-weight:bold;line-height:20px;color:${s.fg};text-decoration:none;border-radius:10px;">${esc(label)}</a></td></tr></table>`;
}

/** A thin divider line between sections of the body. */
const rule = (margin = "28px 0") => `<div style="margin:${margin};border-top:1px solid ${LINE};font-size:0;line-height:0;">&nbsp;</div>`;

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
  const img = (file: string) => `${config.siteUrl}/${file}`;
  const cls = classParts();
  const monthName = cls.month.charAt(0) + cls.month.slice(1).toLowerCase();
  const scheduleUrl = `${config.siteUrl}/schedule`;
  const subject = "You're in! Welcome to the AI Corporate Analyst program";
  const preheader = `Your seat is confirmed. Class 1 is live on ${cohort.platform} on ${cohort.startsLabel}. Your links and 50 free interview-practice credits are inside.`;
  const headline = first ? `You&rsquo;re in, ${hello}!` : `You&rsquo;re in!`;

  const navLink = (label: string, href: string) =>
    `<a href="${esc(href)}" target="_blank" style="font-family:${SANS};font-size:13.5px;line-height:20px;color:${NAVY};text-decoration:none;padding:0 11px;">${esc(label)}</a>`;
  const nav = [navLink("Schedule", scheduleUrl), navLink("Support", `mailto:${config.supportEmail}`), navLink("Azisly.ai", config.azislyUrl)].join("");

  const classCards = curriculum
    .slice(0, PREVIEW_CLASSES)
    .map((m, i) => {
      const when = config.classDates[i];
      return `<tr><td style="padding:0 0 8px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SOFT}" style="background:${SOFT};border-radius:12px;"><tr>
        <td width="62" valign="middle" style="padding:12px 0 12px 14px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="38" height="38" align="center" bgcolor="${MINT}" style="border-radius:19px;font-family:${SANS};font-size:13px;font-weight:bold;color:${NAVY};">${String(m.index).padStart(2, "0")}</td></tr></table></td>
        <td valign="middle" style="padding:12px 8px 12px 0;font-family:${SANS};font-size:15px;line-height:21px;font-weight:bold;color:${NAVY};">${esc(m.title)}</td>
        ${when ? `<td align="right" valign="middle" style="padding:12px 16px 12px 0;font-family:${SANS};font-size:12.5px;line-height:18px;color:${MUTED};white-space:nowrap;">${esc(when)}</td>` : ""}
      </tr></table></td></tr>`;
    })
    .join("");

  const stat = (value: string, label: string) =>
    `<td width="33%" valign="top" style="padding:0 6px 0 0;"><p style="margin:0;font-family:${SANS};font-size:36px;line-height:40px;font-weight:bold;color:${NAVY};">${value}</p><p style="margin:2px 0 0 0;font-family:${SANS};font-size:13px;line-height:18px;color:${MUTED};">${label}</p></td>`;

  const linkBlock = config.zoomUrl
    ? `<p style="margin:0 0 16px 0;font-family:${SANS};font-size:15.5px;line-height:24px;color:${TEXT};">One link for every live class. Save it, and join from your phone or laptop a few minutes early.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td class="stack2" style="padding:0 10px 10px 0;">${button(`Join the live classes on ${cohort.platform}`, config.zoomUrl, "navy", false, "btnfull")}</td>${config.whatsappUrl ? `<td class="stack2" style="padding:0 0 10px 0;">${button("Join the WhatsApp group", config.whatsappUrl, "outline", false, "btnfull")}</td>` : ""}</tr></table>
<p style="margin:4px 0 0 0;font-family:${SANS};font-size:12.5px;line-height:19px;color:${MUTED};">Button not working? Copy this link into your browser:<br><a href="${esc(config.zoomUrl)}" style="color:${NAVY};word-break:break-all;">${esc(config.zoomUrl)}</a></p>`
    : `<p style="margin:0;font-family:${SANS};font-size:15.5px;line-height:24px;color:${TEXT};">Your ${cohort.platform} link for the live classes is on its way. We will send it to this email and ${cohort.deliveredVia === "email and WhatsApp" ? "on WhatsApp" : "by message"} before Class 1.</p>${config.whatsappUrl ? `<div style="margin-top:16px;">${button("Join the WhatsApp group", config.whatsappUrl, "outline")}</div>` : ""}`;

  // The code on a white ticket with a dashed edge, on the mint gift panel.
  const codeBox = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background:#ffffff;border:2px dashed ${NAVY};border-radius:12px;"><tr><td align="center" style="padding:11px 12px;">
    ${
      config.creditCode
        ? `<p style="margin:0;font-family:${SANS};font-size:10.5px;font-weight:bold;letter-spacing:2.2px;text-transform:uppercase;color:${MUTED};">Your code</p><p style="margin:3px 0 0 0;font-family:${SANS};font-size:25px;line-height:30px;font-weight:bold;letter-spacing:4px;color:${NAVY};">${esc(config.creditCode)}</p>`
        : `<p style="margin:0;font-family:${SANS};font-size:10.5px;font-weight:bold;letter-spacing:2.2px;text-transform:uppercase;color:${MUTED};">Claim yours</p><p style="margin:3px 0 0 0;font-family:${SANS};font-size:17px;line-height:24px;font-weight:bold;color:${NAVY};">Tap the button below</p>`
    }
  </td></tr></table>`;

  const sampleNotice = config.sample
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background:#fff3cd;padding:8px 12px;font-family:${SANS};font-size:12px;color:#664d03;">DESIGN PREVIEW: the Zoom link, WhatsApp link and credit code below are sample values and are not used in real emails.</td></tr></table>`
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
<style>
  @media only screen and (max-width:480px){
    .pad{padding-left:20px !important;padding-right:20px !important;}
    .h1{font-size:28px !important;line-height:36px !important;}
    .heroimg{width:100% !important;height:auto !important;}
    .stack{display:block !important;width:100% !important;box-sizing:border-box !important;text-align:center !important;}
    .giftimg{margin:0 auto !important;}
    .stack2{display:block !important;width:100% !important;padding-right:0 !important;box-sizing:border-box !important;}
    .btnfull{width:100% !important;}
    .bigday{font-size:50px !important;line-height:50px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#eef1f4;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${esc(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
${sampleNotice}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef1f4" style="background:#eef1f4;">
<tr><td align="center" style="padding:24px 12px 32px 12px;">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background:#ffffff;border-radius:20px;">

    <!-- header panel: logo, links, headline, framed photo, button -->
    <tr><td style="padding:10px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${MINT}" style="background:${MINT};border-radius:16px;">
        <tr><td align="center" style="padding:30px 20px 4px 20px;"><img src="${esc(img("logos/azisly-brand.png"))}" width="124" alt="Azisly.ai" style="display:block;border:0;height:auto;max-width:124px;"></td></tr>
        <tr><td align="center" style="padding:12px 10px 0 10px;">${nav}</td></tr>
        <tr><td class="pad" align="center" style="padding:30px 30px 0 30px;">
          <h1 class="h1" style="margin:0;font-family:${SANS};font-size:36px;line-height:44px;font-weight:bold;color:${NAVY};">${headline}<br>Your seat is confirmed.</h1>
        </td></tr>
        <tr><td align="center" style="padding:24px 24px 0 24px;"><img class="heroimg" src="${esc(img("email/hero-photo.png"))}" width="520" alt="Prasun Choudhary, your instructor" style="display:block;width:100%;max-width:520px;height:auto;border:0;"></td></tr>
        <tr><td class="pad" align="center" style="padding:26px 44px 0 44px;">
          <p style="margin:0;font-family:${SANS};font-size:16px;line-height:25px;color:${NAVY};">Welcome to the AI Corporate Analyst program. Your first live class is <b>${esc(cls.weekday)}, ${esc(cls.day)} ${esc(monthName)}</b> at ${esc(cls.time)} IST.</p>
        </td></tr>
        <tr><td align="center" style="padding:22px 20px 38px 20px;">${button("View your schedule", scheduleUrl, "navy")}</td></tr>
      </table>
    </td></tr>

    <!-- body -->
    <tr><td class="pad" style="padding:34px 36px 6px 36px;">
      <p style="margin:0 0 12px 0;font-family:${SANS};font-size:19px;line-height:26px;font-weight:600;color:${NAVY};">Hi <b>${hello}</b> &#128075;</p>
      <p style="margin:0;font-family:${SANS};font-size:16px;line-height:26px;color:${TEXT};">Thank you for joining <b>AI Corporate Analyst</b>. Your payment went through and your seat is locked in for all ${MODULE_COUNT} live classes. Here is everything you need, in one place.${orderId ? ` Your order reference is <b style="color:${NAVY};">${esc(orderId)}</b>.` : ""}</p>

      ${rule("28px 0 26px 0")}

      <!-- welcome: a note from Prasun -->
      <h2 style="margin:0 0 16px 0;font-family:${SANS};font-size:25px;line-height:32px;font-weight:bold;color:${NAVY};">A note from Prasun</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;"><tr>
        <td width="64" valign="middle"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${MINT}" style="border-radius:30px;padding:3px;"><img src="${esc(img("email/prasun.png"))}" width="54" height="54" alt="Prasun Choudhary" style="display:block;border:0;border-radius:27px;"></td></tr></table></td>
        <td valign="middle"><p style="margin:0;font-family:${SANS};font-size:16px;line-height:22px;font-weight:bold;color:${NAVY};">Prasun Choudhary</p><p style="margin:1px 0 0 0;font-family:${SANS};font-size:13px;line-height:18px;color:${MUTED};">Your instructor, Founder of Azisly.ai</p></td>
      </tr></table>
      <p style="margin:0;font-family:${SANS};font-size:16px;line-height:27px;color:${TEXT};">Welcome aboard! Over ${MODULE_COUNT} live sessions you will go from using AI for quick answers to building your own <b style="background:${MINT};padding:0 4px;color:${NAVY};">agents</b>, <b style="background:${MINT};padding:0 4px;color:${NAVY};">dashboards</b> and a working <b style="background:${MINT};padding:0 4px;color:${NAVY};">prototype</b>. No coding needed. Come curious, and bring a real task from your day.</p>
      <p style="margin:12px 0 0 0;font-family:${SERIF};font-size:28px;line-height:32px;font-style:italic;color:${NAVY};">Prasun</p>

      ${rule("28px 0 24px 0")}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        ${stat(String(MODULE_COUNT), "Live classes")}${stat("4", "Real builds")}${stat("0", "Coding needed")}
      </tr></table>

      ${rule("26px 0 28px 0")}

      <!-- schedule -->
      <h2 style="margin:0 0 16px 0;font-family:${SANS};font-size:25px;line-height:32px;font-weight:bold;color:${NAVY};">Your schedule</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${MINT}" style="background:${MINT};border-radius:14px;"><tr>
        <td width="124" align="center" valign="middle" style="padding:18px 6px 18px 14px;border-right:2px dashed ${NAVY};">
          <p class="bigday" style="margin:0;font-family:${SANS};font-size:56px;line-height:56px;font-weight:bold;color:${NAVY};">${esc(cls.day)}</p>
          <p style="margin:4px 0 0 0;font-family:${SANS};font-size:14px;font-weight:bold;letter-spacing:4px;color:${NAVY};">${esc(cls.month)}</p>
        </td>
        <td valign="middle" style="padding:18px 18px 18px 22px;">
          <p style="margin:0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:1.8px;text-transform:uppercase;color:#2f6b3a;">Class 1 starts</p>
          <p style="margin:4px 0 0 0;font-family:${SANS};font-size:20px;line-height:26px;font-weight:bold;color:${NAVY};">${esc(cls.weekday)}, ${esc(cls.time)} IST</p>
          <p style="margin:3px 0 0 0;font-family:${SANS};font-size:13px;line-height:19px;color:${NAVY};">Live on ${cohort.platform}, taught by Prasun himself</p>
        </td>
      </tr></table>
      <p style="margin:22px 0 10px 0;font-family:${SANS};font-size:13px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:${MUTED};">${MODULE_COUNT} classes, 4 real builds</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${classCards}</table>
      <p style="margin:6px 0 16px 0;font-family:${SANS};font-size:13.5px;line-height:20px;color:${MUTED};">+ ${MODULE_COUNT - PREVIEW_CLASSES} more classes, from AI Excel to your own prototype</p>
      ${button(`View all ${MODULE_COUNT} classes`, scheduleUrl, "navy")}

      ${rule("30px 0 28px 0")}

      <!-- link -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SOFT}" style="background:${SOFT};border-radius:16px;"><tr><td class="pad" style="padding:26px 26px 20px 26px;">
        <p style="margin:0 0 8px 0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">Your class link</p>
        <h2 style="margin:0 0 10px 0;font-family:${SANS};font-size:24px;line-height:30px;font-weight:bold;color:${NAVY};">Your seat is one tap away.</h2>
        ${linkBlock}
      </td></tr></table>
    </td></tr>

    <!-- Azisly gift: a mint panel with the artwork on the left, like the call-to-action card in the reference -->
    <tr><td style="padding:26px 10px 10px 10px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${MINT}" style="background:${MINT};border-radius:16px;"><tr>
        <td class="stack" width="236" align="center" valign="middle" style="padding:18px 0 18px 14px;font-size:0;line-height:0;"><img class="giftimg" src="${esc(img("email/gift-mint.png"))}" width="220" alt="A friendly robot interviewer and a gold coin worth 50 credits." style="display:block;border:0;width:220px;max-width:100%;height:auto;"></td>
        <td class="stack pad" valign="middle" style="padding:26px 28px 26px 10px;">
          <p style="margin:0 0 8px 0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#2f6b3a;">A bonus gift for ${esc(banner.audience.toLowerCase())}</p>
          <h2 style="margin:0 0 8px 0;font-family:${SANS};font-size:25px;line-height:31px;font-weight:bold;color:${NAVY};">50 free credits for AI Interview practice</h2>
          <p style="margin:0 0 16px 0;font-family:${SANS};font-size:14.5px;line-height:22px;color:${NAVY};">${esc(banner.body)}</p>
          ${codeBox}
          <div style="margin-top:14px;">${button(banner.cta, claimUrl, "navy", true)}</div>
        </td>
      </tr></table>
    </td></tr>

    <!-- footer -->
    <tr><td class="pad" align="center" style="padding:30px 36px 8px 36px;">
      <img src="${esc(img("logos/azisly-brand.png"))}" width="112" alt="Azisly.ai" style="display:block;border:0;height:auto;max-width:112px;margin:0 auto;">
      ${rule("22px 0 12px 0")}
      <div>${nav}</div>
      ${rule("12px 0 18px 0")}
      <p style="margin:0 0 8px 0;font-family:${SANS};font-size:12.5px;line-height:19px;color:${MUTED};">Questions? Just reply to this email or write to <a href="mailto:${esc(config.supportEmail)}" style="color:${NAVY};text-decoration:underline;">${esc(config.supportEmail)}</a>.</p>
      <p style="margin:0;font-family:${SANS};font-size:11.5px;line-height:18px;color:#8a93a1;">You are receiving this because you enrolled in AI Corporate Analyst. Azisly Technologies Private Limited.</p>
    </td></tr>
    <tr><td style="font-size:0;line-height:0;height:26px;">&nbsp;</td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `Thank you, ${first || "there"}. Your seat is confirmed.`,
    "",
    `Your payment for AI Corporate Analyst went through and your seat is locked in for all ${MODULE_COUNT} live classes.${orderId ? ` Reference: ${orderId}.` : ""}`,
    "",
    "WELCOME",
    `Over ${MODULE_COUNT} sessions you will go from using AI for quick answers to building your own agents, dashboards and a working prototype. No coding needed. - Prasun Choudhary, Founder, Azisly.ai`,
    "",
    "SCHEDULE",
    `Class 1 starts ${cls.weekday} ${cls.day} ${cls.month}, ${cls.time} IST, live on ${cohort.platform}.`,
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

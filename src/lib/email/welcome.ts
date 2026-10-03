import "server-only";
import { cohort, curriculum, MODULE_COUNT } from "@/content/shared";
import type { EmailAudience, EmailConfig } from "./config";

/**
 * The post-payment welcome email: a hero that confirms the seat, then 1 thanks, 2 welcome, 3 schedule,
 * 4 link, and a dark finale with the Azisly gift of 50 free AI Interview practice credits.
 *
 * Built from nested tables with inline styles because that is the only layout every mail app (Outlook
 * included) renders the same way. The eye-catching parts are pre-made images (Prasun in the hero and the
 * gift artwork, sources in scripts/email-art); everything that is personal or changes (name, order reference,
 * date, links, code, copy) is live text, so it still reads with images switched off.
 */

const INK = "#1c1d1f";
const MUTED = "#5e6266";
const PURPLE = "#5624d0";
const PINK = "#ff4fd8";
const YELLOW = "#ffd23f";
const DEEP = "#16082f";
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Arial,Helvetica,sans-serif";

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

type Kind = "primary" | "yellow" | "white" | "outline" | "dark" | "pink";

/** A button that survives Outlook: a coloured table cell with the link filling it. */
function button(label: string, href: string, kind: Kind = "primary", full = false) {
  const s = {
    primary: { bg: PURPLE, fg: "#ffffff", border: PURPLE },
    yellow: { bg: YELLOW, fg: "#1a0a2e", border: YELLOW },
    white: { bg: "#ffffff", fg: PURPLE, border: "#ffffff" },
    outline: { bg: "transparent", fg: "#ffffff", border: "#ffffff" },
    dark: { bg: "#2a0f66", fg: "#ffffff", border: "#2a0f66" },
    pink: { bg: PINK, fg: "#1a0a2e", border: PINK },
  }[kind];
  const radius = full ? 999 : 12;
  return `<table role="presentation" ${full ? 'width="100%" ' : ""}cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="${s.bg}" style="border-radius:${radius}px;border:2px solid ${s.border};"><a href="${esc(href)}" target="_blank" style="display:${full ? "block" : "inline-block"};padding:${full ? 16 : 14}px 26px;font-family:${SANS};font-size:15px;font-weight:bold;line-height:20px;color:${s.fg};text-decoration:none;border-radius:${radius}px;">${esc(label)}</a></td></tr></table>`;
}
/** Small pill that numbers each section. */
function pill(n: string, text: string, bg: string, fg: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${bg}" style="border-radius:999px;padding:6px 14px;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:${fg};">${n ? `${n} &nbsp;&middot;&nbsp; ` : ""}${esc(text)}</td></tr></table>`;
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
  const img = (file: string) => `${config.siteUrl}/${file}`;
  const cls = classParts();
  const scheduleUrl = `${config.siteUrl}/schedule`;
  const monthName = cls.month.charAt(0) + cls.month.slice(1).toLowerCase();
  const headline = first
    ? `You&rsquo;re in,<br><span style="font-style:italic;color:${YELLOW};">${hello}.</span>`
    : `You&rsquo;re <span style="font-style:italic;color:${YELLOW};">in.</span>`;
  const subject = "You're in! Welcome to the AI Corporate Analyst program";
  const preheader = `Your seat is confirmed. Class 1 is live on ${cohort.platform} on ${cohort.startsLabel}. Your links and 50 free interview-practice credits are inside.`;

  const classRows = curriculum
    .slice(0, PREVIEW_CLASSES)
    .map((m, i) => {
      const when = config.classDates[i];
      return `<tr><td width="42" valign="middle" style="padding:6px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="30" height="26" align="center" bgcolor="#2c1366" style="border-radius:8px;font-family:${SANS};font-size:12px;font-weight:bold;color:#ff9be9;">${String(m.index).padStart(2, "0")}</td></tr></table></td><td valign="middle" style="padding:6px 8px 6px 0;font-family:${SANS};font-size:14.5px;line-height:20px;color:#f1eaff;">${esc(m.title)}</td><td align="right" valign="middle" style="padding:6px 0;font-family:${SANS};font-size:12.5px;line-height:20px;color:#bda9ee;white-space:nowrap;">${when ? esc(when) : ""}</td></tr>`;
    })
    .join("");

  const linkBlock = config.zoomUrl
    ? `<p style="margin:0 0 18px 0;font-family:${SANS};font-size:15.5px;line-height:24px;color:#f4eeff;">One link for every live class. Save it, and join from your phone or laptop a few minutes early.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0 12px 10px 0;">${button(`Join the live classes on ${cohort.platform}`, config.zoomUrl, "yellow")}</td>${config.whatsappUrl ? `<td style="padding:0 0 10px 0;">${button("Join the WhatsApp group", config.whatsappUrl, "outline")}</td>` : ""}</tr></table>
<p style="margin:6px 0 0 0;font-family:${SANS};font-size:12.5px;line-height:19px;color:#e6d9ff;">Button not working? Copy this link into your browser:<br><a href="${esc(config.zoomUrl)}" style="color:#ffffff;word-break:break-all;">${esc(config.zoomUrl)}</a></p>`
    : `<p style="margin:0;font-family:${SANS};font-size:15.5px;line-height:24px;color:#f4eeff;">Your ${cohort.platform} link for the live classes is on its way. We will send it to this email and ${cohort.deliveredVia === "email and WhatsApp" ? "on WhatsApp" : "by message"} before Class 1.</p>${config.whatsappUrl ? `<div style="margin-top:16px;">${button("Join the WhatsApp group", config.whatsappUrl, "outline")}</div>` : ""}`;

  // A golden ticket with punched-out sides on the dark finale: "50 free credits" on the left, the code on the right.
  const couponRight = config.creditCode
    ? `<p style="margin:0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2.4px;text-transform:uppercase;color:#8a5200;">Your code</p>
<p style="margin:4px 0 0 0;font-family:${SANS};font-size:28px;line-height:32px;font-weight:bold;letter-spacing:4px;color:#1a0a2e;">${esc(config.creditCode)}</p>
<p style="margin:5px 0 0 0;font-family:${SANS};font-size:12px;line-height:17px;color:#6b4300;">Enter it on Azisly to add your 50 credits</p>`
    : `<p style="margin:0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2.4px;text-transform:uppercase;color:#8a5200;">Claim yours</p>
<p style="margin:4px 0 0 0;font-family:${SERIF};font-size:21px;line-height:27px;font-style:italic;font-weight:bold;color:#1a0a2e;">Tap the button below</p>`;
  const coupon = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${YELLOW}" style="margin:0;border-radius:16px;background-color:${YELLOW};background-image:linear-gradient(135deg,#ffe27a 0%,#ffc21a 100%);"><tr>
  <td width="14" valign="middle" style="font-size:0;line-height:0;"><img src="${esc(img("email/notch-gift-left.png"))}" width="14" height="28" alt="" style="display:block;border:0;"></td>
  <td width="132" align="center" valign="middle" style="padding:18px 6px;"><p class="coupon50" style="margin:0;font-family:${SERIF};font-size:40px;line-height:44px;font-style:italic;font-weight:bold;color:#2a1500;">Gift</p><p style="margin:4px 0 0 0;font-family:${SANS};font-size:10.5px;font-weight:bold;letter-spacing:2.2px;text-transform:uppercase;color:#7a4600;">Just for you</p></td>
  <td valign="middle" style="padding:16px 14px 16px 20px;border-left:2px dashed #c98a00;">${couponRight}</td>
  <td width="14" align="right" valign="middle" style="font-size:0;line-height:0;"><img src="${esc(img("email/notch-gift-right.png"))}" width="14" height="28" alt="" style="display:block;border:0;"></td>
</tr></table>`;
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
    .h1{font-size:44px !important;line-height:48px !important;}
    .herophoto{text-align:center !important;}
    .herophoto img{margin:0 auto !important;}
    .bigday{font-size:62px !important;line-height:62px !important;}
    .coupon50{font-size:34px !important;line-height:38px !important;}
    .stack{display:block !important;width:100% !important;box-sizing:border-box !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#120728;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${esc(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
${sampleNotice}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#120728" style="background:#120728;">
<tr><td align="center" style="padding:22px 12px 28px 12px;">

  <!-- top bar on the dark canvas -->
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
    <tr>
      <td align="left" style="padding:0 6px 16px 6px;"><img src="${esc(img("logos/azisly-white.png"))}" width="124" alt="Azisly.ai" style="display:block;border:0;height:auto;max-width:124px;"></td>
      <td align="right" style="padding:0 6px 16px 6px;font-family:${SANS};font-size:12px;letter-spacing:.6px;color:#a995d8;">${orderId ? `Order ${esc(orderId)}` : ""}</td>
    </tr>
  </table>

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;">

    <!-- hero: one message, one photo -->
    <tr><td bgcolor="#34108a" style="background-color:#34108a;background-image:linear-gradient(180deg,#2b0e72 0%,#5320c4 100%);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="stack pad" valign="middle" style="padding:40px 8px 36px 36px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${YELLOW}" style="border-radius:999px;padding:7px 15px;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2.2px;text-transform:uppercase;color:#1a0a2e;">Seat confirmed</td></tr></table>
          <h1 class="h1" style="margin:20px 0 0 0;font-family:${SERIF};font-size:50px;line-height:54px;font-weight:bold;color:#ffffff;">${headline}</h1>
          <p style="margin:18px 0 0 0;font-family:${SANS};font-size:16px;line-height:25px;color:#e4d8ff;">Welcome to the AI Corporate Analyst program. Your first live class is <b style="color:#ffffff;">${esc(cls.weekday)}, ${esc(cls.day)} ${esc(monthName)}</b> at ${esc(cls.time)} IST.</p>
        </td>
        <td class="stack herophoto" width="260" valign="bottom" align="right" style="font-size:0;line-height:0;"><img src="${esc(img("email/prasun-hero.png"))}" width="260" alt="Prasun Choudhary, your instructor" style="display:block;width:260px;max-width:100%;height:auto;border:0;"></td>
      </tr></table>
    </td></tr>

    <tr><td bgcolor="#5320c4" style="background:#5320c4;font-size:0;line-height:0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="pad" bgcolor="#ffffff" style="background:#ffffff;border-radius:24px 24px 0 0;padding:30px 36px 8px 36px;font-size:16px;line-height:normal;">
        ${pill("1", "Thank you", "#ffe3f8", "#b0127a")}
        <p style="margin:16px 0 0 0;font-family:${SANS};font-size:17px;line-height:27px;color:${INK};"><b>${hello}</b>, thank you for joining <b>AI Corporate Analyst</b>. Your payment went through and your seat is locked in for all ${MODULE_COUNT} live classes.</p>
        <p style="margin:12px 0 0 0;font-family:${SANS};font-size:15px;line-height:24px;color:${MUTED};">Here is everything you need, in four quick steps.${orderId ? ` Your order reference is <b style="color:${INK};">${esc(orderId)}</b>.` : ""}</p>
      </td></tr></table>
    </td></tr>
    <!-- 2 welcome: a note from Prasun -->
    <tr><td bgcolor="${DEEP}" style="background:${DEEP};font-size:0;line-height:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="pad" bgcolor="#ffffff" style="background:#ffffff;border-radius:0 0 26px 26px;padding:26px 36px 36px 36px;font-size:16px;line-height:normal;">
      ${pill("2", "Welcome", "#e9e1ff", PURPLE)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;border-radius:20px;background-color:#f6f2ff;border:2px solid #e3d8ff;"><tr><td style="padding:26px 26px 24px 26px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="72" valign="middle"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${PINK}" style="border-radius:34px;padding:3px;"><img src="${esc(img("email/prasun.png"))}" width="60" height="60" alt="Prasun Choudhary" style="display:block;border:0;border-radius:30px;"></td></tr></table></td>
          <td valign="middle"><p style="margin:0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2.4px;text-transform:uppercase;color:${PURPLE};">A note from your instructor</p><p style="margin:3px 0 0 0;font-family:${SERIF};font-size:20px;line-height:26px;font-weight:bold;color:${INK};">Prasun Choudhary</p></td>
        </tr></table>
        <p style="margin:18px 0 0 0;font-family:${SERIF};font-size:20px;line-height:32px;font-style:italic;color:${INK};"><span style="font-size:44px;line-height:20px;color:${PINK};font-style:normal;vertical-align:-14px;">&ldquo;</span>Welcome aboard! Over ${MODULE_COUNT} live sessions you will go from using AI for quick answers to building your own <b style="background:#fff0a8;padding:0 4px;">agents</b>, <b style="background:#fff0a8;padding:0 4px;">dashboards</b> and a working <b style="background:#fff0a8;padding:0 4px;">prototype</b>. No coding needed. Come curious, and bring a real task from your day.<span style="font-size:44px;line-height:20px;color:${PINK};font-style:normal;vertical-align:-14px;">&rdquo;</span></p>
        <p style="margin:16px 0 0 0;font-family:${SERIF};font-size:30px;line-height:34px;font-style:italic;color:${PURPLE};">Prasun</p>
        <p style="margin:0;font-family:${SANS};font-size:12.5px;line-height:18px;color:${MUTED};">Founder, Azisly.ai</p>
      </td></tr></table>
    </td></tr></table></td></tr>

    <!-- 3 schedule (dark) -->
    <tr><td class="pad" bgcolor="${DEEP}" style="background:${DEEP};padding:34px 36px 26px 36px;">
      ${pill("3", "Schedule", YELLOW, "#1a0a2e")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;background:#2a1260;border-radius:18px;"><tr>
        <td width="128" align="center" valign="middle" style="padding:20px 8px 20px 20px;border-right:2px dashed #5a3aa8;">
          <p class="bigday" style="margin:0;font-family:${SERIF};font-size:74px;line-height:70px;font-weight:bold;color:${YELLOW};">${esc(cls.day)}</p>
          <p style="margin:6px 0 0 0;font-family:${SANS};font-size:15px;font-weight:bold;letter-spacing:4px;color:#ffffff;">${esc(cls.month)}</p>
        </td>
        <td valign="middle" style="padding:20px 20px 20px 22px;">
          <p style="margin:0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:1.8px;text-transform:uppercase;color:#ff9be9;">Class 1 starts</p>
          <p style="margin:5px 0 0 0;font-family:${SERIF};font-size:21px;line-height:27px;color:#ffffff;">${esc(cls.weekday)}, ${esc(cls.time)} IST</p>
          <p style="margin:4px 0 0 0;font-family:${SANS};font-size:13px;line-height:19px;color:#cdbbff;">Live on ${cohort.platform}, taught by Prasun himself</p>
        </td>
      </tr></table>
      <p style="margin:22px 0 6px 0;font-family:${SANS};font-size:13px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:#ffffff;">${MODULE_COUNT} classes, 4 real builds</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${classRows}
        <tr><td colspan="3" style="padding:8px 0 4px 0;font-family:${SANS};font-size:13px;line-height:19px;color:#bda9ee;">+ ${MODULE_COUNT - PREVIEW_CLASSES} more classes, from AI Excel to your own prototype</td></tr>
      </table>
      <div style="margin-top:14px;">${button(`View all ${MODULE_COUNT} classes`, scheduleUrl, "outline")}</div>
    
    </td></tr>

    <!-- 4 link (gradient): dissolves in from the dark section above and out into the dark finale below -->
    <tr><td bgcolor="#6a2bd9" style="background-color:#6a2bd9;background-image:linear-gradient(135deg,#4b1fb8 0%,#8a2fe0 55%,#d02fc4 100%);">
      <img src="${esc(img("email/fade-from-dark.png"))}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="pad" style="padding:4px 36px 6px 36px;">
        ${pill("4", "Your link", "#ffffff", PURPLE)}
        <h2 style="margin:16px 0 10px 0;font-family:${SERIF};font-size:30px;line-height:36px;color:#ffffff;">Your seat is one tap away.</h2>
        ${linkBlock}
      </td></tr></table>
      <img src="${esc(img("email/fade-to-dark.png"))}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:auto;border:0;margin-top:14px;">
    </td></tr>

    <!-- Azisly gift: a dark, glowing finale -->
    <tr><td class="pad" bgcolor="${DEEP}" style="background:${DEEP};padding:2px 36px 4px 36px;">
      ${pill("", `Bonus gift for ${banner.audience.toLowerCase()}`, PINK, "#1a0a2e")}
      <h2 style="margin:16px 0 8px 0;font-family:${SERIF};font-size:34px;line-height:40px;color:#ffffff;">50 free credits<br><span style="font-style:italic;color:${YELLOW};">for AI Interview practice</span></h2>
      <p style="margin:0;font-family:${SANS};font-size:16px;line-height:25px;color:#d8c9ff;">${esc(banner.body)}</p>
    </td></tr>
    <tr><td bgcolor="${DEEP}" style="background:${DEEP};font-size:0;line-height:0;"><img src="${esc(img("email/gift-art.png"))}" width="600" alt="A gold coin worth 50 credits next to a friendly robot interviewer asking &quot;Tell me about yourself&quot;." style="display:block;width:100%;max-width:600px;height:auto;border:0;"></td></tr>
    <tr><td class="pad" bgcolor="${DEEP}" style="background:${DEEP};padding:4px 36px 8px 36px;">
      ${coupon}
      <div style="margin-top:22px;">${button(`${banner.cta}  →`, claimUrl, "pink", true)}</div>
      <p style="margin:26px 0 0 0;"><img src="${esc(img("logos/azisly-white.png"))}" width="104" alt="Azisly.ai" style="display:block;border:0;height:auto;max-width:104px;"></p>
    </td></tr>
    <!-- footer -->
    <tr><td class="pad" bgcolor="${DEEP}" style="padding:22px 36px 28px 36px;background:${DEEP};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #35205f;padding-top:18px;">
        <p style="margin:0 0 6px 0;font-family:${SANS};font-size:12.5px;line-height:19px;color:#b8a6e6;">Questions? Just reply to this email or write to <a href="mailto:${esc(config.supportEmail)}" style="color:#ffb3ee;">${esc(config.supportEmail)}</a>.</p>
        <p style="margin:0;font-family:${SANS};font-size:11.5px;line-height:18px;color:#8f7fbf;">You are receiving this because you enrolled in AI Corporate Analyst. Azisly Technologies Private Limited.</p>
      </td></tr></table>
    </td></tr>

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

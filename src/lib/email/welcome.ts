import "server-only";
import { cohort, curriculum, MODULE_COUNT } from "@/content/shared";
import type { EmailAudience, EmailConfig } from "./config";

/**
 * The post-payment welcome email, styled after a clean corporate newsletter: a header panel in the landing
 * page's own theme (sunset for students, studio for working professionals; logo, links, headline, button),
 * then a white body (greeting, a note from Prasun, three numbers,
 * the schedule as soft grey cards with a dropdown for the full list, the class link) and a mint panel with the Azisly gift of 50 free
 * AI Interview practice credits.
 *
 * Built from nested tables with inline styles because that is the only layout every mail app (Outlook
 * included) renders the same way. The pictures (opening animation, gift artwork; sources in scripts/email-art)
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
    cta: "Sign up and claim 50 credits",
  },
  corporate: {
    audience: "Working professionals",
    headline: "50 free credits for AI Interview practice",
    body: "Rehearse your next interview with AI before the real one.",
    cta: "Sign up and claim 50 credits",
  },
} as const;

/** The first card wears the landing page's own theme: sunset for students, studio for working professionals. */
const HERO = {
  college: {
    css: "linear-gradient(180deg,#e0338f 0,#e0338f 112px,#a43bd8 58%,#5a6bff 100%)",
    bg: "#e0338f",
    border: "",
    nav: "#ffffff",
    sub: "#ffffff",
    head: "'Arial Black','Helvetica Neue',Arial,sans-serif",
    headWeight: "900",
    headColor: "#ffffff",
    // the white highlighter bar the student page puts under its accent words
    accent: "background:linear-gradient(transparent 62%,rgba(255,255,255,.34) 62%,rgba(255,255,255,.34) 92%,transparent 92%);padding:0 4px;color:#ffffff;",
    btnBg: "#ffffff",
    btnFg: "#7a1d6b",
    btnRadius: 18,
  },
  corporate: {
    css: "linear-gradient(180deg,#f3efff 0,#f3efff 112px,#ebe5ff 100%)",
    bg: "#f3efff",
    border: "border:1px solid #e0daf5;",
    nav: "#1c1d1f",
    sub: "#33363b",
    head: SERIF,
    headWeight: "bold",
    headColor: "#1c1d1f",
    accent: "color:#5624d0;",
    btnBg: "#5624d0",
    btnFg: "#ffffff",
    btnRadius: 12,
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
  /** Switch the tap-to-open gift on for every viewer (the browser preview). In mail it is limited to Apple Mail. */
  interactive?: boolean;
  audience: EmailAudience;
  name?: string;
  orderId?: string;
  config: EmailConfig;
}

export function renderWelcomeEmail({ audience, name, orderId, config, interactive = false }: WelcomeInput) {
  const first = (name || "").trim().split(/\s+/)[0];
  const hello = first ? esc(first.charAt(0).toUpperCase() + first.slice(1)) : "there";
  const banner = BANNER[audience];
  const claimUrl = withUtm(config.azislyUrl, audience);
  const img = (file: string) => `${config.siteUrl}/${file}`;
  const cls = classParts();
  const monthName = cls.month.charAt(0) + cls.month.slice(1).toLowerCase();
  const subject = "You're in! Welcome to the AI Corporate Analyst program";
  const preheader = `Your seat is confirmed. Class 1 is live on ${cohort.platform} on ${cohort.startsLabel}. Your links and 50 free interview-practice credits are inside.`;
  const headline = first ? `You&rsquo;re in, ${hello}!` : `You&rsquo;re in!`;

  const theme = HERO[audience];
  const navLink = (label: string, href: string, color: string) =>
    `<a href="${esc(href)}" target="_blank" style="font-family:${SANS};font-size:13.5px;line-height:20px;color:${color};text-decoration:none;padding:0 11px;">${esc(label)}</a>`;
  const navWith = (color: string) => [navLink("Support", `mailto:${config.supportEmail}`, color), navLink("Azisly.ai", config.azislyUrl, color)].join("");
  const nav = navWith(NAVY); // footer
  const heroNav = navWith(theme.nav);

  const classRows = (from: number, to: number) =>
    curriculum
      .slice(from, to)
      .map((m, k) => {
        const when = config.classDates[from + k];
        return `<tr><td style="padding:0 0 8px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SOFT}" style="background:${SOFT};border-radius:12px;"><tr>
        <td width="62" valign="middle" style="padding:12px 0 12px 14px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="38" height="38" align="center" bgcolor="${MINT}" style="border-radius:19px;font-family:${SANS};font-size:13px;font-weight:bold;color:${NAVY};">${String(m.index).padStart(2, "0")}</td></tr></table></td>
        <td valign="middle" style="padding:12px 8px 12px 0;font-family:${SANS};font-size:15px;line-height:21px;font-weight:bold;color:${NAVY};">${esc(m.title)}</td>
        ${when ? `<td align="right" valign="middle" style="padding:12px 16px 12px 0;font-family:${SANS};font-size:12.5px;line-height:18px;color:${MUTED};white-space:nowrap;">${esc(when)}</td>` : ""}
      </tr></table></td></tr>`;
      })
      .join("");
  const firstClasses = classRows(0, PREVIEW_CLASSES);
  const moreClasses = classRows(PREVIEW_CLASSES, curriculum.length);

  const stat = (value: string, label: string) =>
    `<td width="33%" valign="top" style="padding:0 6px 0 0;"><p style="margin:0;font-family:${SANS};font-size:36px;line-height:40px;font-weight:bold;color:${NAVY};">${value}</p><p style="margin:2px 0 0 0;font-family:${SANS};font-size:13px;line-height:18px;color:${MUTED};">${label}</p></td>`;

  const linkBlock = config.zoomUrl
    ? `<p style="margin:0 0 16px 0;font-family:${SANS};font-size:15.5px;line-height:24px;color:${TEXT};">One link for every live class. Save it, and join from your phone or laptop a few minutes early.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td class="stack2" style="padding:0 10px 10px 0;">${button(`Join the live classes on ${cohort.platform}`, config.zoomUrl, "navy", false, "btnfull")}</td>${config.whatsappUrl ? `<td class="stack2" style="padding:0 0 10px 0;">${button("Join the WhatsApp group", config.whatsappUrl, "outline", false, "btnfull")}</td>` : ""}</tr></table>
<p style="margin:4px 0 0 0;font-family:${SANS};font-size:12.5px;line-height:19px;color:${MUTED};">Button not working? Copy this link into your browser:<br><a href="${esc(config.zoomUrl)}" style="color:${NAVY};word-break:break-all;">${esc(config.zoomUrl)}</a></p>`
    : `<p style="margin:0;font-family:${SANS};font-size:15.5px;line-height:24px;color:${TEXT};">Your ${cohort.platform} link for the live classes is on its way. We will send it to this email and ${cohort.deliveredVia === "email and WhatsApp" ? "on WhatsApp" : "by message"} before Class 1.</p>${config.whatsappUrl ? `<div style="margin-top:16px;">${button("Join the WhatsApp group", config.whatsappUrl, "outline")}</div>` : ""}`;

  const sampleNotice = config.sample
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background:#fff3cd;padding:8px 12px;font-family:${SANS};font-size:12px;color:#664d03;">DESIGN PREVIEW: the Zoom link and WhatsApp link below are sample values and are not used in real emails.</td></tr></table>`
    : "";

  // Tap-to-open gift. Mail apps cannot run scripts, so a hidden checkbox plus CSS does the opening.
  // Only apps that honour it get it (Apple Mail / iOS Mail, detected by a Safari-only @supports test, and the
  // browser preview); everyone else sees the animated GIF of the same box and the card straight away.
  const ixRules = `
    .ixonly{display:block !important;max-height:none !important;overflow:visible !important;position:static !important;opacity:1 !important;}
    .gifonly{display:none !important;max-height:0 !important;}
    .stage{cursor:pointer;-webkit-tap-highlight-color:transparent;}
    .boxgrp{transform-origin:50% 87%;animation:wiggle 2.8s ease-in-out infinite;}
    .lid{transform-origin:50% 72%;transition:transform .85s cubic-bezier(.2,.9,.3,1.25);}
    .tapcap{animation:tapin 1.6s ease-in-out infinite;}
    .cardwrap{max-height:0;overflow:hidden;opacity:0;transform:translateY(-90px) scale(.88);transform-origin:50% 0;}
    #gift:checked ~ .stage .boxgrp{animation:none;}
    #gift:checked ~ .stage .lid{transform:translate(-23.1%,-46%) rotate(-24deg);}
    #gift:checked ~ .stage .conf{animation:burst 1.7s ease-out forwards;}
    #gift:checked ~ .stage .light{animation:lightin .9s ease-out forwards;}
    #gift:checked ~ .stage .tapcap{animation:none;opacity:0;}
    .moreclasses{max-height:0;overflow:hidden;opacity:0;transition:max-height .9s ease,opacity .6s ease;}
    #sch:checked ~ .moreclasses{max-height:1600px;opacity:1;}
    .t-close{display:none;}
    #sch:checked ~ label .t-open{display:none;}
    #sch:checked ~ label .t-close{display:inline;}
    .car{transition:transform .3s ease;}
    #sch:checked ~ label .car{transform:rotate(180deg);}
    #gift:checked ~ .cardwrap{max-height:1400px;opacity:1;transform:none;transition:max-height 1s ease .55s,opacity .7s ease .65s,transform .9s cubic-bezier(.2,.9,.3,1.15) .55s;}
    @keyframes wiggle{0%,60%,100%{transform:rotate(0)}66%{transform:rotate(-3.5deg)}72%{transform:rotate(3.5deg)}78%{transform:rotate(-3deg)}84%{transform:rotate(2.5deg)}90%{transform:rotate(0)}}
    @keyframes tapin{0%,100%{opacity:.6;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
    @keyframes burst{0%{opacity:0;transform:scale(.3)}22%{opacity:1}100%{opacity:0;transform:scale(1.25)}}
    @keyframes lightin{0%{opacity:0;transform:scale(.45)}100%{opacity:1;transform:scale(1)}}`;
  const ixCss = interactive ? ixRules : `@supports (-webkit-appearance:none) and (stroke-color:transparent){${ixRules}}`;

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
    .stack{display:block !important;width:100% !important;box-sizing:border-box !important;text-align:center !important;}
    .giftimg{margin:0 auto !important;}
    .stack2{display:block !important;width:100% !important;padding-right:0 !important;box-sizing:border-box !important;}
    .btnfull{width:100% !important;}
    .bigday{font-size:50px !important;line-height:50px !important;}
    .h2s{font-size:22px !important;line-height:29px !important;}
  }
  ${ixCss}
</style>
</head>
<body style="margin:0;padding:0;background:#eef1f4;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${esc(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
${sampleNotice}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef1f4" style="background:#eef1f4;">
<tr><td align="center" style="padding:24px 12px 32px 12px;">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background:#ffffff;border-radius:20px;">

    <!-- header panel, in the landing page's own theme: opening animation with the logo, links, headline, button -->
    <tr><td style="padding:10px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${theme.bg}" style="background-color:${theme.bg};background-image:${theme.css};border-radius:16px;${theme.border}">
        <!-- opening: two party poppers pop in the top corners and shower confetti, once, then settle on the logo -->
        <tr><td style="font-size:0;line-height:0;"><img src="${esc(img(`email/popper-top-${audience}.gif`))}" width="580" alt="Azisly.ai" style="display:block;width:100%;max-width:580px;height:auto;border:0;border-radius:16px 16px 0 0;"></td></tr>
        <tr><td align="center" style="padding:4px 10px 0 10px;">${heroNav}</td></tr>
        <tr><td class="pad" align="center" style="padding:30px 30px 0 30px;">
          <h1 class="h1" style="margin:0;font-family:${theme.head};font-size:36px;line-height:46px;font-weight:${theme.headWeight};color:${theme.headColor};">${headline}<br><span style="${theme.accent}">Your seat is confirmed.</span></h1>
        </td></tr>
        <tr><td class="pad" align="center" style="padding:20px 44px 42px 44px;">
          <p style="margin:0;font-family:${SANS};font-size:16px;line-height:25px;color:${theme.sub};">Welcome to the AI Corporate Analyst program. Your first live class is <b>${esc(cls.weekday)}, ${esc(cls.day)} ${esc(monthName)}</b> at ${esc(cls.time)} IST.</p>
        </td></tr>
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
      <!--[if !mso]><!-->
      <input type="checkbox" id="sch" class="ixinput" style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
      <!--<![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${firstClasses}</table>
      <!--[if !mso]><!-->
      <label for="sch" class="ixonly" style="display:none;max-height:0;overflow:hidden;mso-hide:all;cursor:pointer;margin:2px 0 6px 0;"><span style="display:inline-block;padding:12px 20px;border:2px solid ${NAVY};border-radius:10px;font-family:${SANS};font-size:15px;line-height:20px;font-weight:bold;color:${NAVY};"><span class="t-open">Show all ${MODULE_COUNT} classes</span><span class="t-close">Hide the list</span><span class="car" style="display:inline-block;width:0;height:0;margin-left:10px;vertical-align:middle;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${NAVY};"></span></span></label>
      <!--<![endif]-->
      <!-- the other classes: a dropdown where the mail app allows it, otherwise simply listed -->
      <div class="moreclasses"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${moreClasses}</table></div>

      ${rule("30px 0 28px 0")}

      <!-- link -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SOFT}" style="background:${SOFT};border-radius:16px;"><tr><td class="pad" style="padding:26px 26px 20px 26px;">
        <p style="margin:0 0 8px 0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">Your class link</p>
        <h2 style="margin:0 0 10px 0;font-family:${SANS};font-size:24px;line-height:30px;font-weight:bold;color:${NAVY};">Your seat is one tap away.</h2>
        ${linkBlock}
      </td></tr></table>
    </td></tr>

    <!-- Azisly gift: a wrapped surprise. Tap the box (Apple Mail, browser preview) or watch it open (GIF everywhere else), then the card comes out -->
    <tr><td align="center" style="padding:34px 10px 10px 10px;">
      <p style="margin:0 0 8px 0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2.4px;text-transform:uppercase;color:#2f6b3a;">One more thing</p>
      <h2 class="h2s" style="margin:0 0 4px 0;font-family:${SANS};font-size:26px;line-height:33px;font-weight:bold;color:${NAVY};">A surprise is waiting for you</h2>

      <!--[if !mso]><!-->
      <input type="checkbox" id="gift" class="ixinput" style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
      <!--<![endif]-->
      <img class="gifonly" src="${esc(img("email/gift-box.gif"))}" width="580" alt="A gift box shakes and pops open with a burst of confetti." style="display:block;width:100%;max-width:580px;height:auto;border:0;margin:0 auto;">
      <!--[if !mso]><!-->
      <label for="gift" class="ixonly stage" style="display:none;max-height:0;overflow:hidden;mso-hide:all;width:100%;max-width:580px;margin:0 auto;">
        <span style="display:block;position:relative;width:100%;height:0;padding-bottom:50%;">
          <img class="glow" src="${esc(img("email/gift-glow.png"))}" alt="" style="position:absolute;left:0%;top:0%;width:100%;height:100%;border:0;">
          <img class="light" src="${esc(img("email/gift-light.png"))}" alt="" style="position:absolute;left:0%;top:0%;width:100%;height:100%;border:0;opacity:0;">
          <span class="boxgrp" style="display:block;position:absolute;left:0;top:0;width:100%;height:100%;">
            <img class="base" src="${esc(img("email/gift-base.png"))}" alt="" style="position:absolute;left:28.333%;top:49.333%;width:43.333%;height:47.333%;border:0;">
            <img class="lid" src="${esc(img("email/gift-lid.png"))}" alt="" style="position:absolute;left:28.333%;top:22%;width:43.333%;height:33.333%;border:0;">
          </span>
          <img class="conf" src="${esc(img("email/gift-burst.png"))}" alt="" style="position:absolute;left:0%;top:0%;width:100%;height:100%;border:0;opacity:0;">
        </span>
        <span class="tapcap" style="display:block;margin:2px 0 8px 0;font-family:${SANS};font-size:15px;line-height:22px;font-weight:bold;color:${NAVY};text-align:center;">Tap the gift to open it</span>
      </label>
      <!--<![endif]-->

      <div class="cardwrap" style="text-align:left;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${MINT}" style="background:${MINT};border-radius:16px;"><tr>
        <td class="stack" width="236" align="center" valign="middle" style="padding:18px 0 18px 14px;font-size:0;line-height:0;"><img class="giftimg" src="${esc(img("email/gift-mint.png"))}" width="220" alt="A friendly robot interviewer and a gold coin worth 50 credits." style="display:block;border:0;width:220px;max-width:100%;height:auto;"></td>
        <td class="stack pad" valign="middle" style="padding:26px 28px 26px 10px;">
          <p style="margin:0 0 8px 0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#2f6b3a;">A bonus gift for ${esc(banner.audience.toLowerCase())}</p>
          <h2 style="margin:0 0 8px 0;font-family:${SANS};font-size:25px;line-height:31px;font-weight:bold;color:${NAVY};">50 free credits for AI Interview practice</h2>
          <p style="margin:0 0 16px 0;font-family:${SANS};font-size:14.5px;line-height:22px;color:${NAVY};">${esc(banner.body)}</p>
          <div>${button(banner.cta, claimUrl, "navy", true)}</div>
        </td>
      </tr></table>
      </div>
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
    `${banner.cta}: ${claimUrl}`,
    "",
    `Questions? Reply to this email or write to ${config.supportEmail}.`,
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");

  return { subject, html, text };
}

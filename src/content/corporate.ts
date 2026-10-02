import type { AudienceContent } from "./types";
import { curriculum, faculty } from "./shared";

/**
 * PLACEHOLDER: listPrice, seatsLeft, dates and testimonials. Confirm before launch.
 */
export const corporateContent: AudienceContent = {
  audience: "corporate",
  theme: "launch",
  metaTitle: "AI Corporate Analyst for Working Professionals | Azisly",
  metaDescription:
    "Stop losing hours to reports, Excel and slides. 13 hands-on modules and 4 real builds that make you the AI person on your team.",
  eyebrow: "Azisly · Launch edition",
  headline: "Be the one your team turns to for",
  headlineAccent: "AI.",
  subheadline:
    "Your manager is already asking “can AI do this faster?” The people who can say yes are getting the projects, the visibility and the promotions. This makes you one of them.",
  heroBullets: [
    "Win back the hours you lose every week to reports, Excel and slides",
    "13 hands-on modules, 4 real builds you can use at work",
    "No coding needed. Built for analysts, managers and operators",
  ],
  primaryCta: "Grab the launch offer",
  trustStats: [
    { value: "13", label: "Applied modules" },
    { value: "4", label: "Deployable builds" },
    { value: "1:1", label: "Doubt support" },
  ],
  agitation: {
    heading: "If you're a working professional, you've probably felt this.",
    points: [
      "You spend hours every week on reports, spreadsheets and decks that someone using AI finishes before lunch.",
      "A junior on your team uses AI better than you do, and leadership has started to notice.",
      "When someone in a meeting says “let's use AI for this”, you nod along. But you couldn't actually set it up.",
      "Every few months there's another round of “AI-led restructuring” news, and you're not sure where your role lands.",
      "Another appraisal, the same feedback: “good work, but you need to upskill.”",
    ],
    closer: {
      lead: "The gap isn't talent. It's 13 hands-on sessions,",
      accent: "and it closes faster than you think.",
    },
  },
  outcomes: [
    {
      title: "Get your hours back",
      description:
        "Automate the reporting, data cleaning and deck-building that eat your week, with agents and tools you build yourself.",
    },
    {
      title: "Become the AI person on your team",
      description:
        "When leadership asks “can we use AI for this?”, be the one who can actually set it up, with a framework that works on any tool your company adopts.",
    },
    {
      title: "Proof for your next appraisal",
      description:
        "An agent, a dashboard and a prototype you can demo: the kind of visible result that gets noticed in reviews.",
    },
  ],
  curriculum,
  faculty,
  closing: {
    lead: "A year from now, you'll either be using AI,",
    accent: "or reporting to someone who does.",
  },
  pricing: {
    currency: "INR",
    listPrice: 29999,
    offerPrice: 5999,
    offerStartedAt: "2026-09-30T00:00:00+05:30",
    offerEndsAt: "2026-10-09T23:59:59+05:30",
    seatsLeft: 70,
  },
  paymentUrl: "https://payments.cashfree.com/forms?code=AzCorporateAnalystforCorporate",
  // Unused by the pages (they read their testimonials from the *-launch / studio copy), so left empty
  // rather than shipping made-up quotes in the page data.
  testimonials: [],
  faq: [
    {
      question: "I'm not technical. Is this too advanced for me?",
      answer:
        "No coding is needed. The program is built for analysts, managers and operators: people who need AI to do their job better, not to become engineers.",
    },
    {
      question: "I'm already stretched at work. Will I actually finish?",
      answer:
        "There are 13 sessions of 30–60 minutes each, with teaching plus hands-on practice. Most professionals spend 3–4 hours a week, and the builds use your real work, so the time pays back fast.",
    },
    {
      question: "I already use ChatGPT. What's different here?",
      answer:
        "Most people stop at asking ChatGPT questions. This takes you to building with AI (agents, dashboards, automations and prototypes), which is where the real time savings and visibility come from.",
    },
    {
      question: "Can I enroll my team instead of just myself?",
      answer:
        "Yes. Reach out after enrolling and we'll set up team seats and a shared onboarding session.",
    },
    {
      question: "What happens after the offer ends?",
      answer:
        "The course goes back to the full price of ₹29,999. The ₹5,999 launch price (GST included) is only for enrollments made before the countdown hits zero.",
    },
  ],
};

import type { AudienceContent } from "./types";
import type { Testimonial } from "./corporate-launch";
import { cohort, curriculum, faculty } from "./shared";

/** One CTA label used on every button of the page (CRO brief: one colour, one text). */
export const CTA = "Enroll now";

// The placeholder switch (see next.config.ts). Resolved at build time, so the data below is dropped from the bundle when it is off.
const SAMPLES_ON = process.env.SAMPLE_CONTENT === "on";


/**
 * Shared course content (curriculum highlights, credentials, USPs, placeholder testimonials) used by the studio design.
 * PLACEHOLDER: listPrice, seatsLeft and dates. Confirm before launch.
 */
export const courseContent: AudienceContent = {
  audience: "course",
  theme: "studio",
  metaTitle: "AI Corporate Analyst with Prasun Choudhary | Azisly",
  metaDescription:
    "A hands-on program led by Prasun Choudhary (IIT Kharagpur, London Business School). 13 live sessions and 4 real AI builds that make you the AI person in any room.",
  eyebrow: "Newly launched",
  headline: "AI Corporate Analyst",
  headlineAccent: "",
  subheadline:
    "Learn to work with AI the way top analysts do. Over 13 live, hands-on sessions you go from the basics of how AI thinks to building your own agents, dashboards and a working prototype. No coding or technical background needed.",
  heroBullets: [],
  primaryCta: "Enroll now",
  trustStats: [],
  agitation: { heading: "", points: [], closer: { lead: "", accent: "" } },
  outcomes: [],
  curriculum,
  faculty,
  closing: { lead: "Start building with AI", accent: "this week." },
  pricing: {
    currency: "INR",
    listPrice: 11999,
    offerPrice: 5999,
    offerStartedAt: "2026-09-30T00:00:00+05:30",
    offerEndsAt: "2026-10-03T23:59:59+05:30",
    seatsLeft: 70,
  },
  testimonials: [],
  faq: [
    {
      question: "Who is this program for?",
      answer:
        "Students, freshers and working professionals who want to actually use AI in their work. If you can use a spreadsheet, you can do this program.",
    },
    {
      question: "Do I need any coding or technical background?",
      answer: "No. Every module starts from zero and builds up with guided, hands-on practice.",
    },
    {
      question: "What happens after I pay?",
      answer: `You get a confirmation and the ${cohort.platform} link on ${cohort.deliveredVia} right after payment. Class 1 is live on ${cohort.startsLabel}, and every class link reaches you the same way.`,
    },
    {
      question: "How are the sessions delivered?",
      answer: `13 live classes on ${cohort.platform}, 30 to 60 minutes each, taught by Prasun himself. Each one combines teaching with hands-on practice, so you build as you learn.`,
    },
    {
      question: "What will I have built by the end?",
      answer:
        "Your own AI agent, an AI dashboard agent, survey and summarizer agents, and a working prototype. Plus a certificate of completion.",
    },
    {
      question: "How long do I have access?",
      answer: "It's a one-time payment of ₹5,999 (GST included) with lifetime access to the course material.",
    },
  ],
};

export const course = {
  includes: [
    "13 live, hands-on sessions",
    "4 real AI builds",
    "RTCO prompting framework",
    "1:1 doubt support",
    "Certificate of completion",
    "Lifetime access to course material",
  ],
  // Trust markers shown right under the hero. Add "students taught" once there is a real number.
  credentials: [
    { value: "IIT Kharagpur", label: "Engineering", logo: "IIT Kharagpur" },
    { value: "London Business School", logo: "London Business School" },
    { value: "OYO International", label: "Ex-President", logo: "OYO" },
    { value: "20+ years", label: "Corporate leadership", icon: "years" as const },
    { value: "13 countries", label: "Work experience, 4 continents", icon: "globe" as const },
  ],
  /** Rotating line on the hero photo's name tag. */
  founderHighlights: ["Engineering, IIT Kharagpur", "Ex-President, OYO International", "Experience across 13 countries"],
  usp: [
    {
      title: "Live with Prasun himself",
      text: `Not pre-recorded videos. All 13 classes are taught live on ${cohort.platform}, so you can ask, try and get unstuck in the moment.`,
    },
    {
      title: "A fraction of the usual price",
      text: "₹5,999 one time, GST included. That's under ₹500 per live class, for a program priced well below comparable AI courses.",
    },
    {
      title: "Built on real corporate use cases",
      text: "Reports, dashboards, research and presentations: the work teams actually do, with four real builds you can show.",
    },
  ],
  nextSteps: [
    { title: "Pay securely", text: "₹5,999 via Cashfree. UPI, cards and net banking. GST included." },
    { title: `Get your ${cohort.platform} link`, text: `Sent instantly on ${cohort.deliveredVia}, along with your onboarding details.` },
    { title: `Join class 1 on ${cohort.startsLabel}`, text: `Live on ${cohort.platform} with Prasun. 13 classes, building as you go.` },
    { title: "Graduate with proof", text: "Four real AI builds, a certificate and lifetime access to the material." },
  ],
  painSolutions: [
    { pain: "Hours lost every week to manual reports and spreadsheets", solution: "Automate them with AI agents you build yourself", source: "Modules 5 to 7" },
    { pain: "You use ChatGPT, but only for quick answers", solution: "Get reliable, high-quality output with the RTCO framework", source: "Module 2" },
    { pain: "New AI tools every week, and you can't keep up", solution: "Master the core tools teams actually use, and how to pick the right one", source: "Modules 3 and 4" },
    { pain: "You freeze when someone asks you to build with AI", solution: "Build your own agent, a dashboard and a working prototype", source: "Modules 6 to 9" },
    { pain: "Your resume and profile look like everyone else's", solution: "Show four real builds and a certificate of completion", source: "Modules 6 to 13" },
  ],
  // Placeholder names and quotes (`sample: true`), so these render in development only.
  // To publish one, replace the name and quote with that person's real words, get their
  // consent to use the photo, and set `sample: false`.
  testimonials: (!SAMPLES_ON ? [] : [
    { sample: true, name: "Aarav Sen", photo: "/testimonials/learner-1.webp", photoFocus: [43, 48], photoZoom: 1.6, quote: "I automated my weekly report in the third week. It paid for the whole program." },
    { sample: true, name: "Nikhil Joshi", photo: "/testimonials/learner-2.webp", photoFocus: [42, 34], photoZoom: 1.6, quote: "My dashboard agent was the first thing every interviewer asked about." },
    { sample: true, name: "Rahul Yadav", photo: "/testimonials/learner-3.webp", photoFocus: [47, 33], photoZoom: 1.6, quote: "I finally know what to ask AI, and how to check what it gives back." },
    { sample: true, name: "Ananya Mehra", photo: "/testimonials/learner-9.webp", photoFocus: [42, 40], photoZoom: 3, quote: "Practical from day one. No fluff, just building." },
    { sample: true, name: "Riya Sharma", photo: "/testimonials/learner-10.webp", photoFocus: [40, 43], photoZoom: 1.9, quote: "The prototype module made AI finally click for me." },
    { sample: true, name: "Sourav Mondal", photo: "/testimonials/learner-6.webp", photoFocus: [55, 43], photoZoom: 2.1, quote: "My month-end deck went from two days to an afternoon." },
    { sample: true, name: "Karan Bhatia", photo: "/testimonials/learner-7.webp", photoFocus: [43, 46], photoZoom: 1.6, quote: "I built something I could actually demo to leadership." },
    { sample: true, name: "Ishaan Rao", photo: "/testimonials/learner-8.webp", photoFocus: [44, 39], photoZoom: 1.5, quote: "Zero coding background and I still built my own AI agent." },
  ]) as Testimonial[],
};

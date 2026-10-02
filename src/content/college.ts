import type { AudienceContent } from "./types";
import { curriculum, faculty } from "./shared";

/**
 * PLACEHOLDER: listPrice, seatsLeft, dates and testimonials. Confirm before launch.
 */
export const collegeContent: AudienceContent = {
  audience: "college",
  theme: "sunset",
  metaTitle: "AI Corporate Analyst for Students | Azisly",
  metaDescription:
    "Recruiters now shortlist freshers who can work with AI. 13 hands-on modules and 4 real builds that make your resume impossible to ignore.",
  eyebrow: "Student launch offer · 50% off",
  headline: "Don't graduate without",
  headlineAccent: "this AI skill.",
  subheadline:
    "Recruiters are shortlisting freshers who can work with AI. If your resume still says “MS Office”, you're already behind. This fixes that in 13 sessions.",
  heroBullets: [
    "4 real AI builds that make your resume stand out in placements",
    "Zero coding or AI background needed. Any branch, any year",
    "Certificate you can put straight on your resume and LinkedIn",
  ],
  primaryCta: "Grab the student offer",
  trustStats: [
    { value: "13", label: "Hands-on modules" },
    { value: "4", label: "Real builds" },
    { value: "1:1", label: "Doubt support" },
  ],
  agitation: {
    heading: "Be honest: does any of this sound like you?",
    points: [
      "You've sent dozens of applications and heard back from almost none. Your resume looks exactly like everyone else's in your batch.",
      "Your syllabus was written years ago. Companies are now hiring for AI skills nobody in college is teaching you.",
      "You use ChatGPT for assignments, but if an interviewer asked you to build something with AI, you'd freeze.",
      "Entry-level work is exactly what AI is automating first. The “safe” fresher roles are quietly shrinking.",
      "You've saved three AI playlists on YouTube. You haven't finished a single one.",
    ],
    closer: {
      lead: "None of this is your fault. But it is your problem,",
      accent: "and it's fixable in 13 sessions.",
    },
  },
  outcomes: [
    {
      title: "A resume that gets shortlisted",
      description:
        "4 real builds (your own AI agent, a dashboard agent and a working prototype) that give interviewers something to actually ask you about.",
    },
    {
      title: "A real answer to “Do you know AI?”",
      description:
        "Explain and demo how you use ChatGPT, Claude, Perplexity and more, instead of just name-dropping them like everyone else.",
    },
    {
      title: "A head start your batchmates don't have",
      description:
        "Structured, guided skills in 13 sessions. Not another half-finished playlist or a certificate nobody reads.",
    },
  ],
  curriculum,
  faculty,
  closing: {
    lead: "Next placement season, you'll either have AI on your resume,",
    accent: "or be competing against people who do.",
  },
  pricing: {
    currency: "INR",
    listPrice: 11999,
    offerPrice: 5999,
    offerStartedAt: "2026-09-30T00:00:00+05:30",
    offerEndsAt: "2026-10-03T23:59:59+05:30",
    seatsLeft: 42,
  },
  paymentUrl: "https://payments.cashfree.com/forms/AzAICorporateAnalystforCollegeStudents",
  testimonials: [
    {
      name: "Ananya R.",
      role: "Final-year student",
      quote:
        "I put my dashboard agent project on my resume and it was the first thing every interviewer asked about.",
    },
    {
      name: "Rohit S.",
      role: "Engineering graduate",
      quote:
        "I'd used ChatGPT casually for two years and still learned an entirely different level of using it well.",
    },
  ],
  faq: [
    {
      question: "I'm from a non-tech branch (commerce, arts, BBA). Is this for me?",
      answer:
        "Yes. No coding is needed, and every module starts from zero. Analysts, marketers and managers use these exact skills every day. Your branch doesn't matter.",
    },
    {
      question: "Will this actually help me in placements?",
      answer:
        "It gives you proof most freshers don't have: 4 real builds and a certificate you can show and talk about in interviews. No course can promise a job, but this gives you a real edge in the room.",
    },
    {
      question: "I already use ChatGPT. Why do I need this?",
      answer:
        "Using ChatGPT for answers is where everyone is. This takes you to building with AI (agents, dashboards, prototypes), which is what companies are actually hiring for.",
    },
    {
      question: "How much time does it take?",
      answer:
        "13 sessions of 30–60 minutes each, teaching plus hands-on practice. Most students spend 3–4 hours a week, easy to fit around college.",
    },
    {
      question: "What happens after the offer ends?",
      answer:
        "The course goes back to the full price of ₹11,999. The ₹5,999 launch price (GST included) is only for enrollments made before the countdown hits zero.",
    },
  ],
};

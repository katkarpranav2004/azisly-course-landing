import type { ActivityEvent } from "./corporate-launch";
import { course } from "./course";

// The placeholder switch (see next.config.ts). Resolved at build time, so the data below is dropped from the bundle when it is off.
const SAMPLES_ON = process.env.SAMPLE_CONTENT === "on";


/**
 * Copy for the college launch page. Items flagged `sample: true` render in development only
 * (see SHOW_SAMPLES) and must be replaced with real data before they can ship.
 */

export const hero = {
  eyebrow: "AI Corporate Analyst · for students & freshers",
  headline: "Don't graduate without",
  headlineAccent: "this AI skill.",
  sub: "Recruiters are shortlisting freshers who can work with AI. 13 hands-on sessions, 4 real builds, one certificate. Any branch, zero coding.",
};

export const duo = {
  boyLabel: "🎓 Final-year · B.Com",
  girlLabel: "🚀 Fresher · BBA",
  rolesHeading: "Roles that ask for AI skills",
  disclaimer:
    "Logos and job titles are examples of where these skills are in demand, not openings. They belong to their owners. No partnership, endorsement or hiring promise implied.",
};

export const pain = {
  eyebrow: "Reality check",
  heading: "Sound familiar?",
  sub: "If two of these hit home, keep scrolling.",
  cleared: "Every single one of these is fixable.",
  clearedSub: "Keep scrolling to see how.",
  lines: [
    { emoji: "😩", text: "Dozens of applications. Almost zero replies.", hit: "Almost zero replies." },
    { emoji: "📄", text: "Your resume looks exactly like your batch's.", hit: "exactly like your batch's." },
    { emoji: "📚", text: "Last decade's syllabus. Next year's jobs.", hit: "Next year's jobs." },
    { emoji: "😶", text: "ChatGPT for assignments. Freeze when asked to build.", hit: "Freeze when asked to build." },
    { emoji: "🏃", text: "The AI race moves daily. You are stuck at the start line.", hit: "stuck at the start line." },
    { emoji: "📱", text: "Dozens of AI reels saved on Insta. Never watched again.", hit: "Never watched again." },
  ],
};

export const transformation = {
  shed: ["Rejected", "Generic resume", "Falling behind"],
  enough: "Enough.",
  turn: "Here's what changes.",
  proof: "13 sessions. 4 real builds. A resume that gets noticed.",
};

export const benefits = {
  eyebrow: "Benefits you get",
  heading: "What you'll actually gain",
  counters: [
    { value: 13, label: "Live sessions" },
    { value: 4, label: "Real builds" },
    { value: 60, suffix: " min", label: "Per session" },
    { value: 1, label: "Certificate" },
  ],
  cards: [
    { emoji: "📈", title: "A resume that gets shortlisted", line: "4 builds that give interviewers something real to ask about.", source: "Modules 6–9" },
    { emoji: "🎤", title: "A real answer to “Do you know AI?”", line: "Demo ChatGPT, Claude, Perplexity and more instead of just name-dropping them.", source: "Modules 2–4" },
    { emoji: "🛠️", title: "A portfolio, not a playlist", line: "Your own agent, a dashboard agent and a working prototype.", source: "4 builds" },
    { emoji: "🎓", title: "A certificate for LinkedIn", line: "Proof you cleared all 13 levels, from AI Curious to AI Corporate Analyst.", source: "Module 13" },
  ],
};

export const proof = {
  eyebrow: "Student stories",
  heading: "From students who've taken it",
  // Same eight placeholder learners (photo + name, no designation) as the studio design.
  // They stay sample: true, so they render in development only until replaced with real ones.
  testimonials: course.testimonials,
};

/** SAMPLE ONLY: wire to real enrollment events before showing in production. */
export const demoActivity: ActivityEvent[] = !SAMPLES_ON ? [] : [
  { sample: true, name: "Someone", city: "Jaipur" },
  { sample: true, name: "Aditi", city: "Pune" },
  { sample: true, name: "Rohan", city: "Delhi" },
  { sample: true, name: "Sneha", city: "Bengaluru" },
  { sample: true, name: "Someone", city: "Lucknow" },
  { sample: true, name: "Kabir", city: "Kolkata" },
];

export const final = {
  includes: ["13 live, hands-on sessions", "4 real builds for your portfolio", "RTCO prompting framework", "1:1 doubt support", "Certificate for LinkedIn"],
};

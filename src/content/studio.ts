import type { Audience, FaqItem } from "./types";
import type { Testimonial } from "./corporate-launch";
import { course, courseContent } from "./course";
import { collegeContent } from "./college";
import { corporateContent } from "./corporate";
import { cohort } from "./shared";

/**
 * Copy for the "studio" landing design, one set per audience. The components are shared;
 * only this text changes between audiences.
 */
export interface StudioPainRow {
  pain: string;
  solution: string;
  /** module range shown as "Fixed in" */
  source: string;
  /** substring of `solution` that gets the mint highlighter */
  mark: string;
  /** the module names behind `source` (desktop margin note) */
  note: string;
}

export interface StudioCopy {
  hero: { eyebrow: string; title: string; tagline: string; body: string };
  /** `logo` names an entry in experts.founderLogos; `icon` is used where there is no logo */
  credentials: { value: string; label: string; logo?: string; icon?: "years" | "globe" }[];
  founderHighlights: string[];
  pain: { kicker: string; standfirst: string; rows: StudioPainRow[] };
  /** exactly three: live, price, real work */
  usp: [{ title: string; text: string }, { title: string; text: string }, { title: string; text: string }];
  testimonials: Testimonial[];
  includes: string[];
  nextSteps: { title: string; text: string }[];
  faq: FaqItem[];
}

const LIVE = `Live on ${cohort.platform}`;

const afterPaying: FaqItem = {
  question: "What happens after I pay?",
  answer: `You get a confirmation and the ${cohort.platform} link on ${cohort.deliveredVia} right after payment. Class 1 is live on ${cohort.startsLabel}, and every class link reaches you the same way.`,
};

/** Generic copy; also the fallback if no audience-specific set applies. */
const courseStudio: StudioCopy = {
  hero: {
    eyebrow: `Newly launched · ${LIVE}`,
    title: courseContent.headline,
    tagline: "Take your career further with AI",
    body: "13 live classes with Prasun Choudhary. Learn to analyse, automate and build with AI, up to your own agents and a working prototype. No coding needed.",
  },
  credentials: course.credentials,
  founderHighlights: course.founderHighlights,
  pain: {
    kicker: "Your work week, edited",
    standfirst: "Five things that hold people back at work, crossed out. Each fix maps to the exact module where you learn it.",
    rows: [
      { ...course.painSolutions[0], mark: "AI agents", note: "Excel and data, your own AI agent, the dashboard agent" },
      { ...course.painSolutions[1], mark: "RTCO framework", note: "The RTCO Prompting Framework" },
      { ...course.painSolutions[2], mark: "core tools", note: "LLMs vs ChatGPT, AI Tool Mastery" },
      { ...course.painSolutions[3], mark: "your own agent", note: "Your agent, dashboard agent, survey agents, prototype" },
      { ...course.painSolutions[4], mark: "four real builds", note: "All four builds, then graduation" },
    ],
  },
  usp: [course.usp[0], course.usp[1], course.usp[2]],
  testimonials: course.testimonials,
  includes: course.includes,
  nextSteps: course.nextSteps,
  faq: courseContent.faq,
};

/** /college: students and freshers, placement-focused. */
const collegeStudio: StudioCopy = {
  hero: {
    eyebrow: `For students & freshers · ${LIVE}`,
    title: "AI Corporate Analyst",
    tagline: "Don't graduate without this AI skill",
    body: "13 live classes with Prasun Choudhary. Build 4 real AI projects for your resume, from your own agent to a working prototype. Any branch, zero coding.",
  },
  credentials: course.credentials,
  founderHighlights: course.founderHighlights,
  pain: {
    kicker: "Your placement season, edited",
    standfirst: "Five things standing between you and that first offer, crossed out. Each fix maps to the exact module where you learn it.",
    rows: [
      {
        pain: "Your syllabus is years old. Recruiters are hiring for AI skills.",
        solution: "Learn the AI skills companies hire for, from zero",
        source: "Modules 1 to 4",
        mark: "AI skills",
        note: "AI Basics, RTCO, LLMs vs ChatGPT, AI Tool Mastery",
      },
      {
        pain: "You use ChatGPT for assignments, but freeze when asked to build with it",
        solution: "Build your own AI agent, step by step",
        source: "Module 6",
        mark: "your own AI agent",
        note: "Building Your Own AI Agent",
      },
      {
        pain: "Fresher roles are the first ones AI is automating",
        solution: "Be the fresher who automates the work instead",
        source: "Modules 5 to 7",
        mark: "automates the work",
        note: "Excel and data, your own agent, the dashboard agent",
      },
      {
        pain: "Dozens of AI reels saved on Insta. Never watched again.",
        solution: "13 live classes where you actually build, not just watch",
        source: "All 13 modules",
        mark: "actually build",
        note: `Teaching plus hands-on practice, live on ${cohort.platform}`,
      },
      {
        pain: "Your resume looks like everyone else's in your batch",
        solution: "Walk into placements with four real builds and a certificate",
        source: "Modules 6 to 13",
        mark: "four real builds",
        note: "All four builds, then graduation",
      },
    ],
  },
  usp: [
    {
      title: "Live with Prasun himself",
      text: `Not another playlist you'll never finish. All 13 classes are live on ${cohort.platform}, so you can ask, try and get unstuck in the moment.`,
    },
    {
      title: "Priced for students",
      text: "₹5,999 one time, GST included. That's under ₹500 per live class, half the regular ₹11,999.",
    },
    {
      title: "Projects recruiters ask about",
      text: "Four real builds for your resume and LinkedIn: an AI agent, a dashboard agent, survey agents and a working prototype.",
    },
  ],
  testimonials: course.testimonials,
  includes: ["13 live, hands-on sessions", "4 real AI builds for your resume", "RTCO prompting framework", "1:1 doubt support", "Certificate of completion", "Lifetime access to course material"],
  nextSteps: course.nextSteps,
  faq: [...collegeContent.faq.slice(0, 3), afterPaying, ...collegeContent.faq.slice(3)],
};

/** /corporate: working professionals, time and visibility at work. */
const corporateStudio: StudioCopy = {
  hero: {
    eyebrow: `For working professionals · ${LIVE}`,
    title: "AI Corporate Analyst",
    tagline: "Be the one your team turns to for AI",
    body: "13 live classes with Prasun Choudhary. Win back the hours lost to reports, Excel and slides, and build agents, dashboards and a prototype you can demo at work. No coding needed.",
  },
  credentials: course.credentials,
  founderHighlights: course.founderHighlights,
  pain: {
    kicker: "Your work week, edited",
    standfirst: "Five things that hold professionals back at work, crossed out. Each fix maps to the exact module where you learn it.",
    rows: [
      {
        pain: "Hours lost every week to reports AI finishes before lunch",
        solution: "Automate them with AI agents you build yourself",
        source: "Modules 5 to 7",
        mark: "AI agents",
        note: "Excel and data, your own AI agent, the dashboard agent",
      },
      {
        pain: "A junior uses AI better than you, and leadership has noticed",
        solution: "Become the person your team asks about AI",
        source: "Modules 1 to 4",
        mark: "your team",
        note: "AI Basics, RTCO, LLMs vs ChatGPT, AI Tool Mastery",
      },
      {
        pain: "You nod along in AI meetings, but couldn't set it up yourself",
        solution: "Build an agent, a dashboard and a prototype you can demo",
        source: "Modules 6 to 9",
        mark: "you can demo",
        note: "Your agent, dashboard agent, survey agents, prototype",
      },
      {
        pain: "Decks and month-end reports eat your evenings",
        solution: "Build boardroom-ready presentations in a fraction of the time",
        source: "Module 12",
        mark: "a fraction of the time",
        note: "Corporate Presentations with AI",
      },
      {
        pain: "Same appraisal, same line: you need to upskill",
        solution: "Show four real builds and a certificate at your next review",
        source: "Modules 6 to 13",
        mark: "four real builds",
        note: "All four builds, then graduation",
      },
    ],
  },
  usp: [
    {
      title: "Live with Prasun himself",
      text: `Not pre-recorded videos. All 13 classes are live on ${cohort.platform}, 30 to 60 minutes each, built around a working week.`,
    },
    {
      title: "A fraction of the usual price",
      text: "₹5,999 one time, GST included. That's under ₹500 per live class, against the regular ₹29,999.",
    },
    {
      title: "Built on your real work",
      text: "Reports, dashboards, research and presentations: the work you already do, with four builds you can demo to your manager.",
    },
  ],
  testimonials: course.testimonials,
  includes: course.includes,
  nextSteps: course.nextSteps,
  faq: [...corporateContent.faq.slice(0, 3), afterPaying, ...corporateContent.faq.slice(3)],
};

export const STUDIO_COPY: Record<Audience, StudioCopy> = {
  course: courseStudio,
  college: collegeStudio,
  corporate: corporateStudio,
};

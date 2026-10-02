import type { CurriculumModule, Faculty } from "./types";

export const faculty: Faculty = {
  founder: {
    name: "Prasun Choudhary",
    role: "Founder, Azisly.ai",
    credentials: "Engineering, IIT Kharagpur · London Business School · Ex-President, OYO International",
    photo: "/faculty/prasun-choudhary.png",
    bio: [
      "A distinctive blend of IIT engineering excellence, global business-school expertise, and two decades of hands-on corporate leadership across 4 continents and 13 countries.",
      "Founder of Azisly.ai, bringing a global perspective and entrepreneurial leadership to the intersection of technology, business, and innovation.",
    ],
    stats: [
      { value: "20+", label: "Years in corporate leadership" },
      { value: "4", label: "Continents" },
      { value: "13", label: "Countries" },
    ],
    pedigree: ["IIT Kharagpur", "London Business School", "Sapient", "Infosys", "ICICI Bank", "OYO"],
  },
  // Mentor bios are role-based placeholders until LinkedIn details are supplied.
  mentors: [
    {
      name: "Sanjeet Yadav",
      role: "Product Manager, Azisly.ai",
      photo: "/faculty/sanjeet-yadav.png",
      linkedin: "https://www.linkedin.com/in/yadavsanjeet/",
      bio: [
        "Leads product at Azisly.ai, turning AI capabilities into tools people actually use. Brings the product manager's lens: what to build, for whom, and why it matters.",
      ],
    },
    {
      name: "Abhishek Jha",
      role: "CTO, Azisly.ai",
      photo: "/faculty/abhishek-jha.webp",
      linkedin: "https://www.linkedin.com/in/abhishek-jha-ab4a1b73/",
      bio: [
        "Leads technology at Azisly.ai, building the AI systems behind the platform. Brings the engineer's view of how models, agents and automations really work under the hood.",
      ],
    },
  ],
};

/**
 * Curriculum is identical for both audiences; only framing/copy differs.
 * Source of truth: 1AI Corporate Analyst/AICorpAnalyst.xlsx (13 sessions).
 */
export const curriculum: CurriculumModule[] = [
  {
    index: 1,
    stage: "AI Curious",
    title: "AI Basics",
    description:
      "How AI actually works (tokens, models, token costs and generative AI) so you understand what you're using and where it breaks.",
  },
  {
    index: 2,
    stage: "AI Prompt Expert",
    title: "The RTCO Prompting Framework",
    description:
      "A repeatable structure for getting reliable, high-quality outputs from any AI tool, practised until it's second nature.",
  },
  {
    index: 3,
    stage: "AI Literate",
    title: "LLMs vs ChatGPT: Are They the Same?",
    description:
      "The difference between the model, the product and the company behind it, and how to pick the right one for the job.",
  },
  {
    index: 4,
    stage: "AI User",
    title: "AI Tool Mastery",
    description:
      "Hands-on with ChatGPT, Claude, Perplexity, Genspark, Skywork and Manus, going from casual user to power user.",
  },
  {
    index: 5,
    stage: "AI Data Analyst",
    title: "AI for Excel & Data Analysis",
    description:
      "Clean data, write formulas and think in dashboards, with AI as your co-analyst on real spreadsheets.",
  },
  {
    index: 6,
    stage: "AI Builder",
    title: "Building Your Own AI Agent",
    tag: "Build",
    description:
      "Understand how AI agents work, then design and build your own that automates a real task end-to-end.",
  },
  {
    index: 7,
    stage: "AI Builder",
    title: "The AI Dashboard Agent",
    tag: "Build",
    description:
      "Use AI to turn raw data into a working dashboard: the kind of project that stands out in a portfolio or a review.",
  },
  {
    index: 8,
    stage: "AI Product Builder",
    title: "AI for Product Thinking: Surveys & User Insights",
    tag: "Build",
    description:
      "Learn how products get built from user research, then build a survey agent and a summarizer agent of your own.",
  },
  {
    index: 9,
    stage: "AI Product Builder",
    title: "Building a Prototype",
    tag: "Build",
    description:
      "Take an idea to a working prototype using Lovable and API keys: something real you can click through and demo.",
  },
  {
    index: 10,
    stage: "AI Strategist",
    title: "AI for Marketing Growth",
    description:
      "Create LinkedIn, social and blog content with AI, learn SEO basics, and put together a simple growth strategy.",
  },
  {
    index: 11,
    stage: "AI Builder",
    title: "Creating Videos with AI",
    description:
      "Use AI video tools to produce polished videos without a camera crew or editing background.",
  },
  {
    index: 12,
    stage: "AI Corporate Analyst",
    title: "Corporate Presentations with AI",
    description:
      "Build sharp, boardroom-ready presentations in a fraction of the usual time.",
  },
  {
    index: 13,
    stage: "AI Corporate Analyst",
    title: "Wrap-up & Graduation",
    tag: "Certificate",
    description:
      "Bring everything together, review what you've built, and graduate as an AI Corporate Analyst.",
  },
];

/**
 * Batch logistics, shared by every page and the checkout flow.
 * Keep these real: the CRO brief requires an actual start date (urgency must not be fake).
 */
export const cohort = {
  /** ISO date of live class 1 */
  startsAt: "2026-10-15T19:00:00+05:30",
  startsLabel: "15 Oct",
  platform: "Zoom",
  /** what the learner receives right after paying */
  deliveredVia: "email and WhatsApp",
} as const;

/** How many people have attended Prasun's sessions so far (figure supplied by the team; shown in the heroes). */
export const reach = {
  college: "15k+ students attended",
  corporate: "15k+ working professionals attended",
} as const;

/**
 * "Trusted by professionals from" card on the corporate hero. Only keep this if learners from these
 * companies have actually attended; logos belong to their owners (the note under the card says so).
 */
export const trustedBy = {
  heading: "Trusted by professionals from",
  logos: "/logos/trusted-by.png",
  alt: "OYO, Amazon, Microsoft and Google",
} as const;

/** The intro video opened from the hero ("Watch the intro"). Drop a new file at the same path to replace it. */
export const introVideo = {
  src: "/video/intro.mp4",
  length: "1:25",
  title: "Watch the intro",
  caption: "See what you'll learn and how it helps in real work.",
} as const;

export const MODULE_COUNT = curriculum.length;
export const BUILD_COUNT = curriculum.filter((m) => m.tag === "Build").length;

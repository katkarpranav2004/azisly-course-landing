/**
 * Copy and data for the corporate launch page that has no equivalent on the college page.
 * Items flagged `sample: true` are placeholders: they render in development only and are
 * hidden from production builds until replaced with real data.
 */

/** Sample content renders in development only, so placeholders can never ship by accident. */
// The placeholder switch (see next.config.ts). Resolved at build time, so the data below is dropped from the bundle when it is off.
const SAMPLES_ON = process.env.SAMPLE_CONTENT === "on";

export const SHOW_SAMPLES = SAMPLES_ON;

export interface PainLine {
  emoji: string;
  text: string;
  /** substring of `text` rendered in the danger colour */
  hit: string;
}

export interface Benefit {
  title: string;
  line: string;
  detail: string;
  source: string;
  icon: "clock" | "chart" | "bot" | "presentation";
  gradient: [string, string];
}

export interface Testimonial {
  name: string;
  role?: string;
  quote: string;
  /** headshot in /public; initials are shown until one is supplied */
  photo?: string;
  /**
   * Where the face sits in the square avatar crop (x%, y%, with object-position 50% 25%).
   * The avatar zooms around it so the face lands centred.
   */
  photoFocus?: [number, number];
  /** zoom into the face (1 = no zoom) */
  photoZoom?: number;
  /** optional short video testimonial (mp4 in /public or a hosted file URL) */
  video?: string;
  sample?: boolean;
}

export interface ActivityEvent {
  name: string;
  city: string;
  sample?: boolean;
}

export const hero = {
  eyebrow: "AI Corporate Analyst · for working professionals",
  headline: "Be the one your team turns to for",
  headlineAccent: "AI.",
  sub: "13 hands-on sessions that turn analysts, managers and operators into the person who actually builds with AI: reports, dashboards, agents.",
  forWho: ["Analysts", "Managers", "Operators", "Consultants"],
};

export const pain = {
  eyebrow: "Reality check",
  heading: "Sound familiar?",
  lines: [
    { emoji: "😩", text: "Hours lost to reports AI finishes before lunch.", hit: "Hours lost" },
    { emoji: "📉", text: "Excel everywhere. Insights nowhere.", hit: "Insights nowhere." },
    { emoji: "😰", text: "A junior uses AI better than you. Leadership noticed.", hit: "Leadership noticed." },
    { emoji: "😶", text: "You nod along in AI meetings. You couldn't set it up.", hit: "You couldn't set it up." },
    { emoji: "😨", text: "“AI restructuring” in the news. Is your role next?", hit: "Is your role next?" },
    { emoji: "😓", text: "Same appraisal. Same line: “You need to upskill.”", hit: "“You need to upskill.”" },
  ] satisfies PainLine[],
};

export const transformation = {
  shed: ["Manual reports", "Guesswork", "Falling behind"],
  enough: "Enough of the problem.",
  turn: "Here's what changes.",
  proof: "13 sessions. 4 real builds. A new way of working.",
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
    {
      title: "Hours back, every week",
      line: "Automate the reports, data cleaning and decks that eat your week.",
      detail: "You build the agents that do it, instead of watching someone else's demo.",
      source: "Modules 5–7",
      icon: "clock",
      gradient: ["#10b981", "#22d3ee"],
    },
    {
      title: "AI-powered analysis",
      line: "Turn raw spreadsheets into answers and live dashboards.",
      detail: "Clean, analyse and visualise data with AI as your co-analyst.",
      source: "Modules 5 & 7",
      icon: "chart",
      gradient: ["#3b82f6", "#22d3ee"],
    },
    {
      title: "The AI person on your team",
      line: "When leadership asks “can AI do this?”, you're the one who sets it up.",
      detail: "The RTCO framework works on any tool your company adopts next.",
      source: "Modules 2, 4 & 6",
      icon: "bot",
      gradient: ["#8b5cf6", "#c084fc"],
    },
    {
      title: "Boardroom-ready output",
      line: "Presentations, content and videos in a fraction of the time.",
      detail: "Polished, executive-ready work without a design team.",
      source: "Modules 10–12",
      icon: "presentation",
      gradient: ["#3b82f6", "#8b5cf6"],
    },
  ] satisfies Benefit[],
};

export const proof = {
  eyebrow: "Learner stories",
  heading: "From people who've taken it",
  // SAMPLE ONLY: replace with real, attributable learner quotes.
  testimonials: !SAMPLES_ON ? [] : [
    { sample: true, name: "Learner name", role: "Senior Business Analyst", quote: "Automated a weekly reporting task in week 3. It paid for itself before I'd finished the program." },
    { sample: true, name: "Learner name", role: "Marketing Manager", quote: "The dashboard agent became something my team uses every single week." },
    { sample: true, name: "Learner name", role: "Operations Lead", quote: "I finally understood what to actually ask AI, and how to check its answers." },
    { sample: true, name: "Learner name", role: "Finance Analyst", quote: "My month-end deck went from two days to an afternoon." },
    { sample: true, name: "Learner name", role: "Product Manager", quote: "Built a working prototype I could put in front of leadership." },
    { sample: true, name: "Learner name", role: "Consultant", quote: "Clients now ask me how I turn things around so fast." },
  ] satisfies Testimonial[],
};

/** SAMPLE ONLY: wire to real enrollment events before showing in production. */
export const demoActivity: ActivityEvent[] = !SAMPLES_ON ? [] : [
  { sample: true, name: "Someone", city: "Jammu" },
  { sample: true, name: "Rahul", city: "Delhi" },
  { sample: true, name: "Priya", city: "Pune" },
  { sample: true, name: "Arjun", city: "Bengaluru" },
  { sample: true, name: "Someone", city: "Hyderabad" },
  { sample: true, name: "Neha", city: "Mumbai" },
];

export const experts = {
  eyebrow: "Who teaches you",
  heading: "People who've actually done it",
  founderCredential: "IIT Kharagpur · London Business School · Ex-President, OYO International",
  /** highlighted under the name; matches the credentials strip on the studio design */
  founderTitle: "Ex-President, OYO International",
  founderCutout: "/faculty/prasun-cutout.webp",
  founderProof: "Two decades of corporate leadership across 4 continents and 13 countries.",
  founderLogos: [
    { name: "Sapient", src: "/logos/sapient.png", w: 120, h: 46 },
    { name: "Infosys", src: "/logos/infosys.png", w: 126, h: 54 },
    { name: "ICICI Bank", src: "/logos/icici.png", w: 44, h: 40 },
    { name: "OYO", src: "/logos/oyo.png", w: 42, h: 38 },
    { name: "London Business School", src: "/logos/lbs.png", w: 40, h: 42 },
    { name: "IIT Kharagpur", src: "/logos/iit-kgp.png", w: 45, h: 49 },
  ],
  azislyLogo: { name: "Azisly.ai", src: "/logos/azisly.png", w: 130, h: 38 },
};

export const final = {
  includes: [
    "13 live, hands-on sessions",
    "4 real builds: agents, dashboard, prototype",
    "RTCO prompting framework",
    "1:1 doubt support",
    "Certificate of completion",
  ],
};



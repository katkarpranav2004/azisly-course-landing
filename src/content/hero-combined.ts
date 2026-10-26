/**
 * Copy for the hero of the combined landing page (students and working professionals).
 * Everything here comes from claims already on the two landing pages or in the course material;
 * ratings and "trusted by" company claims are deliberately not included because nothing backs them up yet.
 */
export const heroCombined = {
  livePill: "Live Cohort",
  eyebrow: "AI Corporate Analyst Program",
  topPills: ["Live on Zoom", "Hands-on Projects", "For Students & Professionals"],
  lineOne: "Learn AI.",
  lineTwo: "Apply it at work.",
  body: "13 live classes with Prasun Choudhary. Master AI-powered Excel, reports, presentations, dashboards and AI agents with real-world projects.",
  bodyStrong: "No coding needed.",
  features: [
    { icon: "excel", title: "AI-powered Excel", text: "Automate analysis and reports" },
    { icon: "reports", title: "Reports & Presentations", text: "Build decks faster" },
    { icon: "agents", title: "AI Agents & Workflows", text: "Save hours of repetitive work" },
    { icon: "dashboards", title: "Dashboards & Prototypes", text: "Turn ideas into real projects" },
  ],
  offerTag: "Limited time offer",
  note: "Learn directly from Prasun",
  credentials: [
    { icon: "school", title: "IIT Kharagpur", text: "Engineering alumnus" },
    { icon: "work", title: "Former OYO leader", text: "Ex-President, OYO International" },
    { icon: "globe", title: "13 countries", text: "International work experience" },
    { icon: "years", title: "20+ years", text: "Corporate leadership" },
  ],
  strip: {
    reachNumber: "15,000+",
    reachLabel: "learners attended",
    facts: "13 live classes · 4 real AI builds · Certificate",
    toolsLabel: "You will work with",
    tools: "ChatGPT · Claude · Genspark · Lovable · Excel",
  },
} as const;

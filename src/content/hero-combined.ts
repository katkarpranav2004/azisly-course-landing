/** Copy for the hero of the combined landing page (students and working professionals). Matches the approved reference design. */
export const heroCombined = {
  livePill: "Live Cohort",
  eyebrow: "AI Corporate Analyst Program",
  topPills: [
    { icon: "video", label: "Live on Zoom" },
    { icon: "file", label: "Hands-on Projects" },
    { icon: "users", label: "For Students & Professionals" },
  ],
  lineOne: "Learn AI.",
  lineTwo: "Apply it at work.",
  body: "13 live classes with Prasun Choudhary. Master AI-powered Excel, reporting, presentations, dashboards and AI agents with real-world projects.",
  bodyStrong: "No coding needed.",
  features: [
    { icon: "excel", title: "AI-powered Excel", text: "Automate analysis & reports" },
    { icon: "reports", title: "Reports & Presentations", text: "Create professional decks in minutes" },
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
    rating: "4.8/5",
    ratingLabel: "average rating",
    trustedLabel: "Trusted by students and professionals from",
    more: "+ many more",
    avatars: [1, 2, 3, 6, 7],
  },
} as const;

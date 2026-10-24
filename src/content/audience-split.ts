/**
 * Copy for the "who is this for" section of the combined landing page. Each card explains why the same
 * course fits one audience, then sends that audience to its own payment form (so the welcome email and
 * the order record stay correct per audience).
 */
export interface AudienceCard {
  audience: "college" | "corporate";
  label: string;
  title: string;
  /** one line naming the problem this audience has today */
  challenge: string;
  reasons: string[];
  cta: string;
}

export const audienceSplit = {
  title: "Built for where you are",
  accent: "where you are",
  subtitle: "Same live classes, same price, same certificate. Pick the one that fits you.",
  cards: [
    {
      audience: "college",
      label: "For college students & freshers",
      title: "Stand out before placement season",
      challenge: "Every CV looks the same, and recruiters now shortlist freshers who can work with AI.",
      reasons: [
        "Four real AI builds give you something to show and talk about in interviews",
        "Learn the AI skills companies are hiring for, from prompts to agents and dashboards",
        "Any branch, any year, with zero coding",
        "A certificate you can add to your resume and LinkedIn",
      ],
      cta: "Enroll as a student",
    },
    {
      audience: "corporate",
      label: "For working professionals",
      title: "Win back your week and lead on AI",
      challenge: "More work, less time, and a new AI tool every month.",
      reasons: [
        "Automate the reports, Excel work and decks that eat your week",
        "Become the person your team turns to for AI",
        "Build an agent, a dashboard and a prototype you can demo to your manager",
        "Built for analysts, managers and operators, with no coding needed",
      ],
      cta: "Enroll as a working professional",
    },
  ] as AudienceCard[],
} as const;

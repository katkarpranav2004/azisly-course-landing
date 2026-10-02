export type Audience = "college" | "corporate" | "course";
export type Theme = "holo" | "sunset" | "launch" | "studio";

export interface CurriculumModule {
  index: number;
  stage: string;
  title: string;
  description: string;
  tag?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export interface Outcome {
  title: string;
  description: string;
}

export interface PricingConfig {
  currency: string;
  listPrice: number;
  offerPrice: number;
  /** ISO date string: when the current launch offer ends */
  offerEndsAt: string;
  /** ISO date string: server only charges offerPrice between offerStartedAt and offerEndsAt */
  offerStartedAt: string;
  seatsLeft: number;
}

export interface FacultyMember {
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
  credentials?: string;
  bio: string[];
}

export interface Faculty {
  founder: FacultyMember & {
    stats: { value: string; label: string }[];
    pedigree: string[];
  };
  mentors: FacultyMember[];
}

export interface AudienceContent {
  audience: Audience;
  theme: Theme;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  /** rendered after `headline` with the theme's accent treatment */
  headlineAccent: string;
  subheadline: string;
  heroBullets: string[];
  primaryCta: string;
  trustStats: { value: string; label: string }[];
  agitation: {
    heading: string;
    points: string[];
    /** the turn from pain to promise, shown under the points */
    closer: { lead: string; accent: string };
  };
  outcomes: Outcome[];
  curriculum: CurriculumModule[];
  faculty: Faculty;
  closing: { lead: string; accent: string };
  pricing: PricingConfig;
  /**
   * Hosted Cashfree payment form. When set, every Enroll button on the page sends the visitor
   * straight to it; when absent, the on-site form and /api/checkout are used instead.
   */
  paymentUrl?: string;
  testimonials: Testimonial[];
  faq: FaqItem[];
}

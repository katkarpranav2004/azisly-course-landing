# Azisly: AI Corporate Analyst landing pages

Ad landing pages for the **AI Corporate Analyst** course on azisly.ai. Next.js (App Router) with Tailwind v4 and framer-motion.

> This is a newer Next.js than most docs describe. Read `node_modules/next/dist/docs/` before changing routing or data APIs (see `AGENTS.md`).

## Pages

| Route | What it is |
| --- | --- |
| `/college` | Students: Sunset Glass design |
| `/college/v2` | Students: the newer "studio" design (not indexed) |
| `/corporate` | Working professionals: the "studio" design |
| `/corporate/v1` | Working professionals: earlier launch design (not indexed) |
| `/course` | General audience: "studio" design |
| `/course/classic` | General audience: WebVeda-style layout |
| `/course/variants` | Internal design options (not indexed, not linked) |
| `/order/status` | Payment result page for the on-site checkout |

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Where things live

- `src/content/`: all copy, prices, FAQs, testimonials, curriculum. `college.ts` and `corporate.ts` hold each audience's pricing and `paymentUrl`; `studio.ts` holds the words for the "studio" design; `shared.ts` holds the 13 modules, faculty and the class start date.
- `src/components/course/`: the "studio" design sections (hero, credentials strip, pain to solution, why this, testimonials, mentors and modules, price, next steps).
- `src/components/college/`, `src/components/launch/`: the Sunset Glass college page and the earlier corporate design.
- `public/`: images and logos. These include photos of real people; keep the repository private.

## Payments

Two ways to take payment:

1. **Hosted Cashfree form** (used by `/college` and `/corporate`): set `paymentUrl` on the audience's content. Every Enroll button sends the visitor to that form. The post-payment message and redirect are configured in the Cashfree form itself.
2. **On-site form** (used when there is no `paymentUrl`, e.g. `/course`): posts to `/api/checkout`, which creates a Cashfree order. Copy `.env.example` to `.env.local` and fill in the Cashfree keys. Prices are resolved on the server per audience.

## Before launch

- Testimonials, the "just enrolled" popup and learner photos are placeholders (`sample: true`). They render in development only; replace them with real, consented ones.
- `offerEndsAt` in `src/content/*.ts` is a hard deadline. After it, the on-site checkout charges the list price.
- Set the real class start date in `src/content/shared.ts` (`cohort`).

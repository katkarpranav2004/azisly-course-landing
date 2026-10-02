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
| `/order/status` | Payment result page for the on-site checkout |

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Where things live

- `src/content/`: all copy, prices, FAQs, testimonials, curriculum. `college.ts` and `corporate.ts` hold each audience's pricing and `paymentUrl`; `studio.ts` holds the words for the "studio" design (its `course` entry is the generic fallback copy); `shared.ts` holds the 13 modules, faculty and the class start date.
- `src/components/course/`: the "studio" design sections (used by `/corporate` and `/college/v2`; the folder name is historical) (hero, credentials strip, pain to solution, why this, testimonials, mentors and modules, price, next steps).
- `src/components/college/`, `src/components/launch/`: the Sunset Glass college page and the earlier corporate design.
- `public/`: images and logos. These include photos of real people; keep the repository private.

## Payments

Two ways to take payment:

1. **Hosted Cashfree form** (used by `/college` and `/corporate`): set `paymentUrl` on the audience's content. Every Enroll button sends the visitor to that form. The post-payment message and redirect are configured in the Cashfree form itself.
2. **On-site form** (used when an audience has no `paymentUrl`): posts to `/api/checkout`, which creates a Cashfree order. Copy `.env.example` to `.env.local` and fill in the Cashfree keys. Prices are resolved on the server per audience.

## Before launch

- Testimonials, the "just enrolled" popup and learner photos are placeholders (`sample: true`). They render in development only; replace them with real, consented ones.
- `offerEndsAt` in `src/content/*.ts` is a hard deadline. After it, the on-site checkout charges the list price.
- Set the real class start date in `src/content/shared.ts` (`cohort`).

## Deployment

- Hosted on Vercel as the `azisly-course-landing` project, connected to this repository. Every push to `main` deploys to production.
- **Deployment Protection is on for all deployments**, including the main `*.vercel.app` address: visitors need to sign in to Vercel. To open the site to the public, turn it off in Vercel under Settings, then Deployment Protection. Do that only after the placeholder photos in `public/testimonials/` are replaced or removed, since files in `public/` are reachable by direct URL.
- On Vercel's free Hobby plan, deployments are only allowed for commits authored by the project owner. A commit authored by anyone else shows up as **Blocked**. Commit as the owner, or move the project to a team.
- No environment variables are needed for `/college` and `/corporate` (they use the hosted Cashfree forms). The on-site checkout (only used if an audience has no `paymentUrl`) needs the Cashfree keys from `.env.example` set in Vercel.
- To serve these pages at `azisly.ai/college` and `azisly.ai/corporate`, forward those paths from the main azisly.ai site to this project.
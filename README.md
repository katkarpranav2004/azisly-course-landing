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

- **Placeholder content is showing on purpose** (testimonials with learner photos, the "just enrolled" popup, the "Sample" data in `src/content/`) so the pages can be reviewed as designed. Replace it with real, consented testimonials before launch (see Going live below).
- `offerEndsAt` in `src/content/*.ts` is a hard deadline (currently 9 Oct 2026, 11:59 PM IST, the same for every visitor). After it, the on-site checkout charges the list price.
- Set the real class start date in `src/content/shared.ts` (`cohort`).
- **Seats left** is a fixed number today (`seatsLeft` in `src/content/college.ts` and `corporate.ts`). It should track real remaining seats. Plan: lower it with each actual enrolment (for example from Cashfree payment confirmations, or by editing the number as seats are sold). It is deliberately not a random counter: a count that drops without real sign-ups is false urgency, which India's 2023 dark-pattern guidelines prohibit, and the CRO checklist asks for "actual seats left".
- The "15k+ ... attended" lines come from `reach` in `src/content/shared.ts`; keep them to a figure the team can stand behind.

## Deployment

- Hosted on Vercel as the `azisly-course-landing` project, connected to this repository. Every push to `main` deploys to production.
- **The site is public**, so share the link freely for review. While placeholders show, every page sends a `noindex` header so search engines do not pick up the placeholder text.
- On Vercel's free Hobby plan, deployments are only allowed for commits authored by the project owner. A commit authored by anyone else shows up as **Blocked**. Commit as the owner, or move the project to a team.
- No environment variables are needed for `/college` and `/corporate` (they use the hosted Cashfree forms). The on-site checkout (only used if an audience has no `paymentUrl`) needs the Cashfree keys from `.env.example` set in Vercel.
- To serve these pages at `azisly.ai/college` and `azisly.ai/corporate`, forward those paths from the main azisly.ai site to this project.

## Going live (replacing the placeholders)

1. Add the real testimonials (name, short quote, consented photo) to `src/content/course.ts`. Put the photos in a folder other than `public/testimonials/`, without `sample: true`.
2. In Vercel, add the environment variable `HIDE_SAMPLE_CONTENT=true` for Production and redeploy.

With that variable set, the placeholder testimonials, photos and "just enrolled" entries are removed from the build, `/testimonials/*` is refused, and the `noindex` header is dropped so the site can be indexed.

## Welcome email (sent automatically after payment)

When a buyer pays on either Cashfree form, Cashfree calls `/api/webhooks/cashfree`. For a successful payment this reads the buyer's name and email from the payment itself and queues the welcome email, scheduled 5 minutes later (Resend holds it until then). Student-form payments get the freshers version, corporate-form payments the working-professionals version. The same order is never emailed twice.

- **Design preview:** `/emails/welcome?audience=college` and `/emails/welcome?audience=corporate` (add `&format=text` for the plain-text version). Samples fill any link or code that is not set yet; real emails never use the samples. The email itself is built in `src/lib/email/welcome.ts`.
- **Settings** (all in Vercel, Environment Variables; see `.env.example`): `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_ZOOM_URL`, `EMAIL_WHATSAPP_URL`, `EMAIL_AZISLY_URL`, optionally `EMAIL_CLASS_DATES`. A link that is not set is simply left out of the real email.
- **Turning it on:** verify the sending domain in Resend, set the variables above plus `CASHFREE_SECRET_KEY`, then add `https://<site>/api/webhooks/cashfree` under Developers, Webhooks in Cashfree. Until `RESEND_API_KEY` is set the route does a dry run and sends nothing.
- **Check with one real test payment** before ads go out: Cashfree's form webhook payload can differ slightly from the standard one, so confirm the email address and the student/corporate detection on a real order.

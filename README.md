# Atharva Corrugations — website

The corporate site for Atharva Corrugations Pvt. Ltd. Planning documents are in `docs/planning/`; build progress is in `CORRUGATIONS_DEV_PROGRESS.md`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server. Unverified claims are outlined |
| `npm run build` | Preview/staging build: unverified claims render, with a banner; `noindex` |
| `npm run build:launch` | Production build: claims gate blocks first, then only confirmed claims render |
| `npm run check` | Typecheck, lint, unit tests, contrast, banned strings, claims report |
| `npm run check:claims:launch` | The claims gate in blocking (production) mode |
| `npm run test:e2e` | Playwright + axe against a running build (run `npm run build` first; uses the installed Chrome locally) |
| `NEXT_PUBLIC_GA_ID=G-TEST npm run build && CONSENT_TEST=1 npx playwright test consent` | The analytics consent tests, which need a build with a GA ID (Google is blocked at the network) |

Node 24 or later.

## Review deployment (client review on Vercel)

Import the repository into Vercel with no environment variables. `vercel.json` builds the **preview** version:

- Every claim is shown, including unverified ones, under a banner counting them, so the client can check the facts.
- The site is `noindex` (header, meta and robots), so search engines ignore it.
- Both forms work and show every state, but say "Review copy: not delivered": without `RESEND_API_KEY` nothing is emailed.
- The draft privacy policy is visible at `/privacy-policy`, marked as a draft for counsel.

Turn on Vercel Deployment Protection if the link should not be open to anyone who has it. For go-live, follow `docs/LAUNCH_RUNBOOK.md`: setting `LAUNCH=true` on Production switches to the launch build.

## The claims rule

Every company fact lives once, in `src/data/claims.ts`, keyed by its Source Audit ID. Pages read facts through `<Gated claim="F-xx">` or `<TitleBlock>`, never by typing a number into a component. To publish a fact, change its `label` to `CONFIRMED` and add `evidence` and `verifiedOn` once the client's document is in hand.

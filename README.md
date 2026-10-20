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

Node 24 or later.

## The claims rule

Every company fact lives once, in `src/data/claims.ts`, keyed by its Source Audit ID. Pages read facts through `<Gated claim="F-xx">` or `<TitleBlock>`, never by typing a number into a component. To publish a fact, change its `label` to `CONFIRMED` and add `evidence` and `verifiedOn` once the client's document is in hand.

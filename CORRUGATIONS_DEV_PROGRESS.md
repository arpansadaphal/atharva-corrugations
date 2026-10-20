# Atharva Corrugations — Development Progress

Keep this file under 200 lines (Roadmap Phase C). Newest entry first.

## Status

| Milestone | Roadmap stage | Status |
|---|---|---|
| M1 Foundation | C1 | Done 2026-10-20 (commit 4e14176) |
| M2 Shell (navbar, footer, floating WhatsApp, 404) | C2 | **Done 2026-10-20, awaiting owner review** |
| M3 Quote flow | C3 | Not started (needs F-3 decision: delivery location required?) |
| M4 Homepage | C4 + C7 | Blocked on G2 (hero and component comps) |
| M5–M9 | C5–C8, Phases D–E | Not started |

## Decisions recorded (2026-10-20)

- G2 waived for foundation-only work (M1). Hero and component comps are still required before M4.
- Tailwind v4 instead of 3.4 (overrides TD-02). Tokens are CSS variables mapped in `@theme`; the default palette and breakpoints are removed so only tokens compile.
- Repo: this folder, git `main`, planning docs in `docs/planning/`. No remote yet.
- Canonical Polymers reference: `../atharva/Atharva-polymers`. Navbar permanently white (settles D-04).
- Claim statuses: CONFLICT → verify, EXTERNAL → restricted. RESTRICTED facts are not stored in the repo.
- Banned strings: scanned in `src/`, `public/` and `package.json`, with a per-file allow-list. Docs, tests and scripts are not scanned.
- Claim expiry: judged at build time (`CLAIMS_AS_OF` in `build:launch`, plus `check-claims`), because prerendering may not read the clock.

## 2026-10-20 — M2 Shell

- Navbar: permanently white and sticky; the hairline becomes a shadow on scroll. Text wordmark plus "An Atharva Group company" until the logo arrives (Q-06). Products dropdown is a disclosure: Enter and Space open it, Escape closes it and returns focus, focus leaving closes it, hover opens it. Active link is accent with a persistent underline. WhatsApp control in ink (green only in the quote band and the floating control) and Request a quote.
- **Deviation:** the full desktop header starts at **1280 px**, not 1024 (Design §12). It needs about 1,100 px at the 15 px nav size and wrapped onto two lines at 1024. Below 1280 the header shows the menu button. This is a header-only `nav` variant; the shared breakpoints are unchanged.
- Mobile menu: modal dialog on textured ink, focus trapped, body scroll locked, Escape and link taps close it, focus returns to the menu button.
- Footer: flat ink, four columns, 2×2 on tablet, accordion on mobile with the plant and contact columns always open. Group panel with the Group office. GSTIN, CIN and the map link are gated, so hidden at launch until verified.
- Floating WhatsApp: ink on green, safe-area aware, token WEB-FLOAT, message names the page's subject. Gated by a new claim **F-58 (VERIFY, Q-29)**, so it is **off in production** until the client confirms it.
- WhatsApp builder `src/lib/whatsapp.ts`. Added tokens WEB-PRODUCTS, WEB-INDUSTRIES, WEB-QUALITY, WEB-ABOUT, WEB-QUOTE and WEB-OTHER for pages the Technical §10 list omits. The number comes from claim F-12, not the `NEXT_PUBLIC_WHATSAPP_NUMBER` env var, keeping one source.
- Branded 404 with Request a quote, View products and Contact.
- Crease Mark now draws when it enters the viewport (IntersectionObserver); shown statically without JS. No animation library was needed.
- Noise texture: a static tiled SVG image (the cheap option in Technical §8), on the mobile menu only so far. Real-device paint test still pending.
- `check-claims` now fails if a client component imports the gate (LAUNCH is server-only).
- Playwright + axe (34 e2e tests): no horizontal scroll at 360/390/768/1024/1280/1440 on `/`, `/specimen` and the 404; no serious or critical axe issues at 390 and 1440; dropdown keyboard behaviour; mobile menu modality; footer accordion; 44 px targets; floating control colours and token; 404 status.
- Data: `src/data/products.ts` (slugs, names, MCB status; Sheets folds to `/products#sheets-pads-and-inserts`), `src/data/navigation.ts`.
- Links to pages not built yet (`/products`, `/industries`, `/request-quote`, `/privacy-policy`…) 404 until their milestones.

## 2026-10-20 — M1 Foundation

- Next.js 16.4.2 (Cache Components and Partial Prefetching on, as scaffolded), React 19.3, TS strict, Tailwind 4.3.3. All versions pinned exactly.
- Design §5.2 tokens, Inter 300–600, container, grid, section padding, focus ring, reduced motion, Crease Mark.
- Claims registry (`src/data/claims.ts`), Group constants (`src/group/group.ts`), gate logic (`src/lib/claims.ts`), `<Gated>`, `<TitleBlock>`, `<SectionHeader>`, `<Button>`, preview banner.
- Scripts: `check:contrast` (26 pairs, all match Design §5.3), `check:banned`, `check:claims` (and `:launch`).
- 30 unit tests (Vitest). `/specimen` is dev and preview only; it returns 404 in the launch build.
- Verified: typecheck, lint, test, all checks, preview build, launch build. No horizontal scroll at 360, 390, 768 and 1024 px (CDP emulation).

## Known open items

- `npm audit`: 5 high, all in dev tooling under `eslint-config-next` (braces → micromatch → fast-glob). The suggested "fix" downgrades to Next 14 config, so it is not applied. Re-check on the next `eslint-config-next` release.
- `unrs-resolver` postinstall was blocked by npm's allowScripts. Lint works without it; approve it only if import resolution misbehaves.
- Noise texture needs the real mid-range Android paint test (Technical §8).
- Product dropdown drawings (Design §13) wait for the illustration set (C7).
- No favicon until the logo arrives (Q-06).

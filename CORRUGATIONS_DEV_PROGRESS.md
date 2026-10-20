# Atharva Corrugations — Development Progress

Keep this file under 200 lines (Roadmap Phase C). Newest entry first.

## Status

| Milestone | Roadmap stage | Status |
|---|---|---|
| M1 Foundation | C1 | Done 2026-10-20 (commit 4e14176) |
| M2 Shell (navbar, footer, floating WhatsApp, 404) | C2 | Done 2026-10-20 (commit 229c886) |
| M3 Quote flow | C3 | Done 2026-10-20 (commit fb199b4). Delivery location on standby, optional |
| G2 design comps | Phase B | **Approved 2026-10-20**: Hero version 1, 58% copy column, components approved |
| M4 Homepage | C4 + C7 | In progress |
| M5–M9 | C5–C8, Phases D–E | Not started |

## Decisions recorded (2026-10-20)

- **G2 approved:** Hero A version 1 (title block in the drawing sheet's bottom band); copy column 7/12 (≈58%).
- **Owner override of Strategy SD-06 on the homepage:** no in-house/partner matrix. H5 shows what the plant does, grouped by stage (converting, printing and finishing, protection, quality checks), with varnish and coating marked "through partners". Whether the Manufacturing & Quality page keeps a matrix is open for M6.

- G2 waived for foundation-only work (M1). Hero and component comps are still required before M4.
- Tailwind v4 instead of 3.4 (overrides TD-02). Tokens are CSS variables mapped in `@theme`; the default palette and breakpoints are removed so only tokens compile.
- Repo: this folder, git `main`, planning docs in `docs/planning/`. No remote yet.
- Canonical Polymers reference: `../atharva/Atharva-polymers`. Navbar permanently white (settles D-04).
- Claim statuses: CONFLICT → verify, EXTERNAL → restricted. RESTRICTED facts are not stored in the repo.
- Banned strings: scanned in `src/`, `public/` and `package.json`, with a per-file allow-list. Docs, tests and scripts are not scanned.
- Claim expiry: judged at build time (`CLAIMS_AS_OF` in `build:launch`, plus `check-claims`), because prerendering may not read the clock.

## 2026-10-20 — G2 design comps (`/specimen/home`, dev and preview only)

- Parametric RSC dieline generator (`src/components/illustration/dieline.ts`) and `DielinePlate`: cuts solid, creases dashed 6/4, L/W/H callouts, no sizes claimed. Draw sequence ≈1.2 s, CSS only, once: cut wipe, then creases, callouts and title block.
- Hero A in two variants for the owner to choose (Design §9 contradicts itself):
  1. title block in the drawing sheet's bottom band;
  2. strip at the base of the copy.
  On mobile both put the strip right after the CTAs. A new e2e test proves H1, both CTAs and three strip cells fit the 390×844 first screen (Roadmap §6).
- **Hero layout change:** copy 7/12 (≈58%), not ≈55%, so the H1 holds to three lines (Design §6). H1 is 52 px from 1024 px and 64 px from 1440 px (new token `display-md`). The sheet title block stays 2×2 until 1440 px.
- Components:
  - FamilyIndex: index rows, stretched link. Only the RSC drawing exists; the others show "Drawing to come" in dev and preview and nothing in production.
  - ProcessSteps: gated on F-30.
  - IndustryGrid: gated on F-46, F-27 and F-45.
  - CapabilityMatrix: real table; production keeps only the confirmed varnish/coating partner row until F-29 is verified.
  - IsoCertificateCard: gated on F-40.
  - QuoteBand.
- New claims: F-27 (product → industry, rows 1–3, CONFIRMED), F-27-allied (VERIFY), F-29 (processes, VERIFY), F-29-varnish (CONFIRMED), F-30 (design support, CONFIRMED), F-46 (top four industries, CONFIRMED).
- Fixed: the matrix's screen-reader-only labels escaped its scroll container and widened the page at 360 and 390 px.
- Not built as comps: the H5 manufacturing split, H6 specialised items and H7 trust row. These are assembled from the parts above in M4.
- Tests: 65 unit, 64 e2e.

## 2026-10-20 — M3 Quote flow

- `/request-quote` (Sitemap §6.9): form 7/12 plus sidebar 5/12 (what we need, internal-dimensions illustration I-12, drawings by WhatsApp or email reply, phone and hours). On mobile, a "What we need" disclosure sits above the form and the sidebar follows it; the specification group collapses and reopens itself if it has errors.
- Fields and rules per Sitemap §7.2 / Technical §7.2, one zod schema shared by browser and server (`src/lib/rfq-schema.ts`). Board options and industries are resolved through the claims gate, so production offers only "Not sure" until ply data is verified, and the server rejects any option the page did not show.
- **Delivery location: optional for now** (`DELIVERY_LOCATION_REQUIRED` in rfq-schema.ts, one line to flip). Strategy §5.4 says optional, Sitemap §7.2 required; owner undecided.
- **Provisional limits** (the docs give none): dimensions 10–5000 mm, quantity ≤ 10,000,000, weight ≤ 100,000 kg. All three dimensions or none, unless "I will send a drawing or sample instead" is ticked.
- `?type=custom` (Sitemap §7.1) maps to a Quote marked "(from Custom Packaging)", because §7.2's radio has only Quote / Product / Sample.
- States per Sitemap §7.5: error summary that takes focus and links to fields; inline errors via aria-describedby; "Sending…" with inputs disabled; success replaces the form with reference, summary and a WhatsApp link carrying the reference; error keeps every input and offers WhatsApp and phone; 15 s timeout.
- `POST /api/rfq` (`src/lib/rfq-handler.ts`): JSON only, 32 KB cap, honeypot, ≥ 3 s fill time, Turnstile hook (off until the widget is built), the same schema, reference `ACQ-YYMMDD-XXXX` (India date, Crockford base-32). Team email goes to sales@, cc the named contact, bcc the archive, Reply-To the customer; then the auto-reply (Reply-To sales@). A failed team email returns 502 (error state); a failed auto-reply does not lose the lead. Logs carry the reference only.
- Email over Resend's HTTP API (no SDK). Without a key, preview and dev log the send; production refuses. Values HTML-escaped, CR/LF stripped from headers.
- **Forms stay offline in production** until the privacy policy is published (claim F-66, MISSING, Q-09): the page shows WhatsApp and email instead, and the API answers 503.
- The privacy notice beside the submit button is a **draft for counsel** (Q-09: retention period and privacy contact unknown, so neither is stated).
- Floating WhatsApp hidden on `/request-quote`, so it can never cover the submit button.
- New claims: F-45 (industries, CONFIRMED), F-58 (floating WhatsApp, VERIFY), F-66 (privacy policy, MISSING).
- **Fix:** LAUNCH and CLAIMS_AS_OF are now inlined at build time (next.config `env`). Before this, a launch build served without LAUNCH at runtime had its API running in preview mode while the pages were in production mode.
- Buttons no longer wrap; the header quote button wrapped at 1440 px.
- Banned-string allow-list: one entry, the "header-injection" security comment in `src/lib/email.ts` (the false positive predicted in audit F-5).
- `useFieldArray` dropped: its random row IDs are not allowed while Cache Components prerenders. Quantity rows are tracked by count.
- Tests: 59 unit, 54 e2e (validation and focus, real end-to-end success through the API, forced failure, speed rejection, 15 s timeout, prefill, quantity rows, mobile collapse, keyboard submit, axe on every state).
- Next 16 with Cache Components does not accept `runtime` or `preferredRegion` route exports, so the Mumbai region (Technical §7.3) goes in hosting config (M8).

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
- Turnstile widget not built; `verifyTurnstile` is wired server-side but inactive while the keys are empty.
- UTM capture on landing (Technical §10) comes with analytics (M7); the form already reads UTM from its URL and session storage.
- The internal-dimensions illustration needs the client's technical reviewer (SD-10).
- No rate limiting yet: Technical §7.6 puts it in the platform firewall (M8).

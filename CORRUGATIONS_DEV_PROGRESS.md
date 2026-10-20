# Atharva Corrugations — Development Progress

Keep this file under 200 lines (Roadmap Phase C). Newest entry first.

## Status

| Milestone | Roadmap stage | Status |
|---|---|---|
| M1 Foundation | C1 | Done 2026-10-20 (commit 4e14176) |
| M2 Shell (navbar, footer, floating WhatsApp, 404) | C2 | Done 2026-10-20 (commit 229c886) |
| M3 Quote flow | C3 | Done 2026-10-20 (commit fb199b4). Delivery location on standby, optional |
| G2 design comps | Phase B | **Approved 2026-10-20**: Hero version 1, 58% copy column, components approved |
| M4 Homepage | C4 + C7 (part) | Done 2026-10-20 (commit 45f2e16) |
| M5 Products hub and family template | C5 | Done 2026-10-20 (commit dee4b09) |
| M6 Inner pages | C6 | Done 2026-10-20 (commit 5b403ba) |
| M7 SEO, analytics, privacy | C8 | Done 2026-10-20 (commit fdec93a) |
| M8 QA and pre-launch | Phase D | **Automatable part done 2026-10-20**; open items in `docs/QA_CHECKLIST.md` need devices, accounts or the client |
| M9 Launch | Phase E | Waits for G6/G7; steps in `docs/LAUNCH_RUNBOOK.md` |

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

## 2026-10-21: Review polish (from `FRONTEND_QUALITY_AUDIT.md`)

- **Products dropdown:** hover and click no longer conflict. Hover opens it, a click pins it open, a second click closes it. Touch taps toggle it. Escape, focus leaving and an outside click still close it.
- **Drawings:** the four "Drawing to come" placeholders are replaced by real drawings in the dieline language, in `src/components/illustration/drawings.tsx`:
  - die-cut, heavy-duty, partition, angle corner and honeycomb;
  - single, double and triple-wall board in section on the family page.

  The paper-core drawing still waits for a sample (Design §7.4).
- **Client review mode (preview and dev only):**
  - Unconfirmed facts are outlined with a kraft dashed line. The banner gives the count, links to the checklist and can hide the outlines.
  - `/review` lists every open fact with its value, what is needed and links to where it appears. The facts come from the claims registry; `src/data/claim-locations.ts` holds only locations, and a unit test fails if an open fact has no entry.
  - `/review` returns a 404 in production, and production HTML carries no review markup (checked on the launch build).
- **Hero:**
  - The drawing sheet hugs the dieline and the 4:3 box is gone.
  - The sheet's facts stay 2×2 at every width.
  - The facts no longer fade in.
  - The drawing is capped at 34 rem below 1024 px.
- **Floating WhatsApp:** below 768 px it appears after half a screen of scrolling and hides while the footer is in view. Desktop is unchanged.
- **Mobile scanning:** each family row puts a small drawing beside its name. Capability and quality lists are two columns on phones. The homepage is 700 px shorter at 390 px.
- **Fixes:**
  - About lists the plant only; the duplicate Group office is removed.
  - Contact and the quote metadata take the reply time from F-16.
  - `/specimen` is now `next dev` only.
  - The header logo link's name matches its visible text (WCAG 2.5.3).
  - `Gated` puts the review marker on a single child element, so lists keep valid children.
- **Test environment:**
  - The CSP's `upgrade-insecure-requests` is sent only on Vercel (HTTPS) builds. WebKit applied it to `http://localhost`, so no script loaded in the WebKit and mobile-Safari runs.
  - Form tests wait for hydration, because a `<select>` choice made before React attaches is reset.

## 2026-10-20 — Fixes from the hosted client review

- **Page stopped scrolling after using the navbar.**
  - Cause: the mobile menu locks body scrolling while open. If the window widened past the desktop breakpoint while it was open (a Mac window going full screen), CSS hid the menu but its state stayed open. The lock never released, and the now-visible desktop links navigated with the page still locked.
  - Fix: the navbar closes the menu on every route change, and when a `matchMedia` listener sees desktop width.
  - Two regression e2e tests cover it: widen-then-navigate, and navigate-from-menu.
- **Menu button at laptop window sizes.** The full navbar needs 1,050 px of content and fits from a 1120 px window, so the header breakpoint moved from 1280 to **1152 px** (`nav` variant in globals.css, `NAV_DESKTOP_QUERY` in Navbar.tsx). Type and spacing unchanged. Tablets in landscape (1024–1151) keep the menu button. A test checks the switch at exactly 1151/1152 and no overflow at 1152.
- One local build reused stale CSS for the breakpoint change; a clean build fixed it and it could not be reproduced. If a Vercel deploy shows old styles, redeploy without the build cache.

## 2026-10-20 — M8 QA and pre-launch (automatable part)

- **Security headers** (`security-headers.ts`, Technical §11):
  - CSP without nonces: nonces would force dynamic rendering and break Partial Prerendering, so `'unsafe-inline'` scripts are allowed for Next's bootstrap and all else is limited to self.
  - Google origins are added only with a GA ID, Cloudflare only with Turnstile, `'unsafe-eval'` only in dev.
  - HSTS one year, without includeSubDomains or preload until the DNS and mail hosts are known (C-02). Also nosniff, strict-origin referrer, X-Frame-Options DENY, Permissions-Policy; `X-Powered-By` removed.
  - e2e checks the headers and that no page reports a CSP violation, including after GA consent.
- zod set to `jitless`: it tried `new Function`, which the CSP blocks, so every form page logged a violation.
- **First-load JS:** zod now loads when a form is first focused (`rfq-options.ts` holds the zod-free constants). Contact went from 201 to 169 KB, the quote page from 204 to 173 KB.
  - New `npm run check:bundle` measures what each page's HTML loads, excluding `noModule` polyfills and prefetched routes, which Lighthouse's resource summary wrongly counted.
  - **Budgets:** 170 KB for home and content pages (Technical §8 sets it for home); **180 KB for the two form pages** (react-hook-form plus the form, about 18 KB). Hero SVG 2.6 KB (budget 30 KB).
- **Lighthouse CI** (`lighthouserc.json`, `npm run lhci`): launch build, four pages, median of three, **DevTools throttling**. Every assertion passes: Performance 99–100, Accessibility, Best Practices and SEO 100, LCP 1.5–1.6 s, CLS ≤ 0.016.
  - Simulated throttling gave LCP 2.0–2.8 s on some pages. Unthrottled LCP is 136 ms; I tested and ruled out font swap and hydration, so it is treated as a simulation artefact. Recorded in the QA checklist.
- **Cross-browser:** WebKit (desktop and iPhone 13 size) passes the cross-browser e2e set. Firefox runs in CI on Linux only; Playwright's Firefox cannot create a profile on the development Mac (macOS 27). Run it locally with `E2E_FIREFOX=1`.
- `vercel.json`: region `bom1`, build command `build:vercel` (launch build only for Production).
- Dependabot (weekly npm, monthly actions).
- CI now runs: audit (production dependencies), checks, preview build with all browsers, bundle budgets, the consent build, then the launch build with Lighthouse CI.
- `scripts/synthetic-rfq.ts` plus a weekly workflow, switched on by the `SITE_URL` repository variable. Tested locally: reference ACQ-261020-ERYS.
- `docs/QA_CHECKLIST.md` (Roadmap §7 with status) and `docs/LAUNCH_RUNBOOK.md` (accounts, DNS inventory, staging, go/no-go, cut-over, rollback, after launch).

## 2026-10-20 — M7 SEO, analytics, privacy

- **Sitemap** (`/sitemap.xml`): launched routes only. Production lists 8 pages: no folded families, no privacy policy until F-66, no specimen. No `lastModified`: prerender cannot read the clock, and a wrong date is worse than none.
- **Robots:** production allows all except `/api/` and points at the sitemap; preview disallows everything. Preview and staging also send `X-Robots-Tag: noindex, nofollow` (next.config) alongside the noindex meta.
- **Structured data** (`src/lib/schema.ts`), built from gated claims:
  - Organization (address, sales contact point with hours) and WebSite on the homepage;
  - BreadcrumbList from every breadcrumb;
  - deliberately left out: logo (Q-06), foundingDate (C-05), parentOrganization (Q-26), sameAs, and any Product, FAQ or review markup;
  - "<" escaped per the Next.js JSON-LD guide.
- Open Graph defaults (en_IN, site name), Twitter large card, and a generated 1200×630 share image (H-A headline, Crease Mark; no logo, no unverified facts).
- **Analytics** (`src/components/analytics/Analytics.tsx`, TD-06):
  - UTM captured once per session on landing; the quote form sends it.
  - One delegated listener records `whatsapp_click` (with source token), `phone_click`, `email_click` and `product_cta_click` from the `data-event` attributes; the RFQ events were already wired.
  - Events always go to `window.acplEvents`, a local list that never leaves the browser, and reach GA4 only after consent.
  - **GA4 only with `NEXT_PUBLIC_GA_ID` and after Accept.** Without an ID there is no notice and nothing is sent. Decline loads nothing. The choice is stored in this browser, and "Analytics choices" in the footer reopens it.
- **Privacy policy** (`/privacy-policy`):
  - a **draft for counsel**, written from what the site actually collects (quote and contact fields, UTM tags, analytics with consent; no IP stored; providers Vercel, Resend and Google);
  - covers rights under the DPDP Act 2023, cookies and changes;
  - open points marked "Counsel to confirm": legal name, providers and cross-border wording, retention, privacy contact (Q-09), publication date;
  - preview only; a 404 in production until F-66 is confirmed;
  - `check-claims` fails if F-66 is confirmed while counsel notes remain;
  - the footer privacy link appears only once the policy is live.
- Tests: 87 unit, 168 e2e (2 consent tests run on a GA build: `NEXT_PUBLIC_GA_ID=G-TEST npm run build && CONSENT_TEST=1 npx playwright test consent`).
- Not done: Content-Security-Policy and security headers (M8). GA "key events" (`rfq_submit_success`, `whatsapp_click`) are marked in the GA admin, not in code.

## 2026-10-20 — M6 Inner pages

- **Industries** (`/industries`): four anchored sector sections, each with:
  - what we make for it, from the client's mapping (F-27, with "HRSC" stripped, Q-17);
  - packaging considerations (general guidance, gated on technical review F-18-copy);
  - packaging families (links follow the MCB) and a quote CTA.
  Then "Also serving" and the quote band. No compliance wording (e2e search of Roadmap §6 terms).
- **Custom Packaging** (`/custom-packaging`):
  - C1 header naming the confirmed inputs;
  - C2 six steps, each with "you provide / you receive" (no durations);
  - C3 inputs; C4 outputs (gated F-30-routine, Q-22);
  - C5 testing (F-38); C6 tooling (F-30-tooling, MISSING: hidden until the policy text exists);
  - C7 five questions (tooling ownership left out until Q-23; no lead times or MOQ);
  - C8 quote band to `?type=custom`.
- **Manufacturing & Quality** (`/manufacturing-and-quality`):
  - plant overview title block (location, plants, operating since);
  - capabilities grouped by stage on ink;
  - process flow built only from confirmed steps;
  - quality section with the customer-audit statement, certificate and rating cards, and practices;
  - sustainability statements (F-44, VERIFY), then the quote band.
  - **No in-house/partner matrix**: your homepage decision carried over, since you did not say otherwise; the table is easy to restore if wanted. No area, capacity or team figures.
- **About** (`/about`): three paragraphs from confirmed facts; Atharva Group on ink with the Group office; founders (F-09, VERIFY); milestones (2014 confirmed; 2025 and 2026 VERIFY); locations; contact band. No vision, mission or values; no revenue.
- **Contact** (`/contact`):
  - four routes (quote, WhatsApp, call, email);
  - a general enquiry form (`/api/contact`, reference prefix **ACG**, routed to the general address with the archive BCC, plus auto-reply);
  - reply times, phones, emails, plant with map link, Group office;
  - careers line. The form is offline in production until the privacy policy exists (F-66).
- Shared: `PageHeader`, `screenEnvelope` (both forms share the abuse checks), `readJson`, `zodResolver`, `customerEmail`.
- **Rhythm fixes across M5/M6** (found by checking the rule on every page, not just home): the products hub merged "Not sure" into the comparison section; the family page's construction section moved to ink; Manufacturing & Quality folded the certificates into the quality section; the Custom Packaging process went to ink. A new e2e test checks the rhythm on every page.
- Fixed:
  - the empty tooling heading;
  - "cad files" lower-casing;
  - colour-only inline links on Contact (now underlined, WCAG 1.4.1);
  - the quote page had no surface tag.
- New claims: F-30-routine, F-30-tooling, F-44, F-52-tape, F-52-expansion; F-18-copy now covers all general technical guidance.
- Tests: 80 unit, 158 e2e.

## 2026-10-20 — M5 Products hub and family template

- **Minimum content bar is now computed, not hard-coded** (`src/lib/mcb.ts`). Per mode it counts:
  - verified formats (≥ 1);
  - applications (≥ 2);
  - spec fields (≥ 4);
  - drawings plus approved photos (≥ 2).
- Nav, footer, the homepage family index and related links all use `familyHref`, so a family gets its own page by itself once its evidence is confirmed.
- **Today:**
  - **production:** no family passes, so every family lives on the hub and every `/products/<family>` URL is a 404;
  - **preview:** Corrugated boxes passes (2 drawings: RSC + full overlap; 5 spec fields) and has a page; the other four fold.
- `/products` hub: header with breadcrumb and family anchors; every family as an anchored section (summary, applications, formats, drawings, gated spec table, prefilled quote CTA, link to the full page when one exists); comparison table (real table; empty columns dropped; no customisation column, as there is no per-family evidence); "Not sure which fits?" → `?family=help`; quote band.
- `/products/[family]` template, F1–F9:
  - F1 header: breadcrumb, H1, applications, CTAs.
  - F2 formats: drawings, plus a "Quote for this style" link → `?family=&format=`.
  - F3 board table and plain-language flute guide; F4 printing and finishing (varnish and coating "through partners").
  - F5 applications; F6 what we need to quote, with the dimensions diagram.
  - F7 photographs: none yet. F8 related families; F9 quote band prefilled with the family.
- Dieline generator now does **full overlap** as well as RSC (`slottedDieline`, `style: 'fol'`).
- New claims: F-18 (formats, CONFIRMED), F-22 (paper types, VERIFY), and F-18-copy (VERIFY), which gates the format descriptions and flute guide we wrote until the client technical reviewer signs off (SD-10). F-27 rows carry ply; F-27-allied carries its applications.
- **Proxy** (`src/proxy.ts`, Next 16's renamed middleware) returns a true 404 for unknown family slugs. Without it they returned 200 with not-found content (a soft 404), because request-time params stream before `notFound()`.
- HRSC is still not shown anywhere (Q-17).
- Tests: 76 unit, 87 e2e.

## 2026-10-20 — M4 Homepage

- `/` assembled per Sitemap §6.1: Hero A (version 1), What we make, From specification to delivery, Industries, Manufacturing and quality, Specialised (H6), Certificates and ratings (H7), Who we are (H8), quote band.
- H6 renders only with ≥ 2 items that have an approved photograph and a verified spec: none yet, so it is always absent. H7 renders only verified certificate or rating cards; absent at launch today.
- **G4 gating test:** the homepage is rendered in three states: all claims (preview), only confirmed (production), and some (ISO verified). Each must keep the rhythm rule (≤ 2 dark, ≤ 3 light in a row, footer included) and render no unverified text in production.
- **Trust floor today: 2 of 4** (customers audit the plant, Atharva Group). `check-claims` reports it. At G6 the owner decides between the reduced homepage and delay.
- The certificate card no longer states a scope; it shows only fields held in the claim (issuer, validity, number).
- Lighthouse mobile (launch build, local): Performance 96–99, Accessibility 100, Best Practices 100, SEO 100. CLS 0.
- **LCP at risk:** 2.2–2.8 s simulated against the 2.5 s budget; 1.5 s with DevTools throttling. The LCP element is the hero H1 text. Re-measure in Lighthouse CI and on a real mid-range Android (M8).
- Fixed: canonical origin falls back to https://www.atharvacorrugations.com (env overrides). Added a neutral Crease Mark favicon (not a logo; replaced when the logo arrives, Q-06); the missing favicon had caused a console 404.
- Tests: 69 unit, 63 e2e.

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

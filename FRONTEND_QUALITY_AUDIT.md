# Atharva Corrugations: Frontend Quality Audit

**Date:** 20 October 2026
**Build audited:** commit `277a8d5` (working tree clean, in sync with `origin/main`), preview build served locally with `next start` on port 3200. This is the same mode the hosted client review uses (no `LAUNCH`, no email provider).
**Auditor's caveat:** I built this site, so I have tried to judge it as an outsider would. Where a weakness comes from a decision I made, it is called out as such.

---

## 1. Executive summary

The site is **technically sound and honest, but visually under-evidenced.**

- **Strong:**
  - an enforced evidence model (no unverified claim can reach production);
  - clean semantic HTML;
  - working forms with full error handling;
  - no layout overflow on any route or width tested;
  - no console errors or failed requests;
  - small JavaScript payloads;
  - a passing automated test suite.
- **Weak:** perceived quality. The design direction (the dieline graphic language) is intelligent, but on screen the site is mostly **text, hairlines and lists on white and navy**, with:
  - **no photography**;
  - **one real drawing type**;
  - **four visible "Drawing to come" placeholders** on the homepage;
  - a **default-looking blue accent**.
- **Overall impression:** to a procurement buyer it reads as a careful, credible but unfinished site. To the client it may read as a high-fidelity prototype rather than a finished premium site.

**Two defects should be fixed before the client looks further:**

1. **The Products dropdown closes when a mouse user clicks it.** Hover opens it, and the natural click then toggles it shut. Reproduced in this audit.
2. **"Drawing to come" placeholder boxes are visible** in four of the five "What we make" rows on the homepage. In a client review they signal unfinished work.

**The biggest lever is evidence, not decoration:**

- real plant photographs;
- completing the illustration set (Design §7.4: only items 1–2 and 12 exist);
- the client's logo and colour.

Photographs and the logo depend on the client; the illustrations do not.

**Overall readiness for a professional client review: 6/10.** It is fit for a *content-verification* review once the two defects are fixed and the reviewer is told what to check. It is not yet fit to be judged as the finished visual product.

---

## 2. Project and design-document understanding

- **Stack:**
  - Next.js 16.4.2 App Router with Cache Components and Partial Prefetching, React 19.3, TypeScript strict;
  - Tailwind CSS 4.3, with design tokens as CSS variables and the default palette removed;
  - react-hook-form plus zod (zod lazy-loaded); lucide icons;
  - Vitest and Playwright (with axe) for tests.
- **Static rendering:** all pages except the two form APIs are static. `/products/[family]` prerenders five slugs; a Proxy returns real 404s for unknown slugs.
- **Documents:** the seven planning documents are in `docs/planning/`, not the project root; they were moved there at project start with your approval. There is no `CLAUDE.md`; Next.js's generated `AGENTS.md` is present.
- **Authoritative requirements used for this audit:**
  - Design Direction: "Structure, Specified", the dieline language, Hero A, tokens, motion budget, family contract.
  - Sitemap §6: page plans. Strategy §3–§6: buyers, conversion, the trust floor.
  - Roadmap §5–§6: Definition of Done and per-page acceptance criteria.
- **Approved deviations recorded in `CORRUGATIONS_DEV_PROGRESS.md`:**
  - Tailwind v4;
  - Hero version 1 with a 58% copy column;
  - full navigation from 1152 px;
  - no in-house/partner matrix (owner decision);
  - delivery location optional (on standby);
  - 180 KB budget for the form pages.
- **Business facts:** every company fact comes from `src/data/claims.ts`, keyed by Source Audit ID. In this preview build, VERIFY claims render with a banner ("23 claims in the registry are unverified"). The launch build hides them.

---

## 3. Routes and viewport coverage

Observed in a real browser (Playwright MCP, Chromium):

| Route | 1440 | 1152 | 834 | 390 | Status |
|---|---|---|---|---|---|
| `/` | ✓ | ✓ | ✓ | ✓ | 200 |
| `/products` | ✓ | ✓ | ✓ | ✓ | 200 |
| `/products/corrugated-boxes` | ✓ | ✓ | ✓ | ✓ | 200 (other families 404 by design, MCB) |
| `/industries` | ✓ | ✓ | ✓ | ✓ | 200 |
| `/custom-packaging` | ✓ | ✓ | ✓ | ✓ | 200 |
| `/manufacturing-and-quality` | ✓ | ✓ | ✓ | ✓ | 200 |
| `/about` | ✓ | ✓ | ✓ | ✓ | 200 |
| `/contact` | ✓ | ✓ | ✓ | ✓ | 200 |
| `/request-quote` | ✓ | ✓ | ✓ | ✓ | 200 |
| `/privacy-policy` (draft) | ✓ | ✓ | ✓ | ✓ | 200 in preview, 404 in launch |
| `/no-such-page` | ✓ | ✓ | ✓ | ✓ | 404 (branded) |
| `/specimen`, `/specimen/home` (internal) | ✓ | ✓ | ✓ | ✓ | 200 in preview: **reachable on the review deployment** |

On every route at every width:
- horizontal overflow was 0 px;
- one H1;
- 0 `<img>` without `alt`;
- 0 `svg[role=img]` without an accessible name;
- 0 console errors and 0 failed requests (other than the intended 404 document).

**Screenshots** (`docs/audit/screenshots/`):
- full pages: `{1440,834,390}-<route>.png` and `1152-{home,products,contact}.png`;
- viewport crops: `v-1440-home-first-screen.png`, `v-1440-home-families.png`, `v-1440-home-manufacturing.png`, `v-1440-products-dropdown.png`, `v-1440-focus-visible.png`, `v-390-home-first-screen.png`, `v-390-home-families.png`, `v-390-mobile-menu.png`, `v-834-home-first-screen.png`.

**Not inspected:** the hosted Vercel deployment (no URL given; the local build is the same commit and mode); Firefox; real devices.

---

## 4. Scores

These are expert heuristic ratings, not measurements. Measured figures are cited only where I obtained them.

| # | Category | Score |
|---|---|---|
| 1 | Visual design and art direction | **6** |
| 2 | Brand distinctiveness | **5** |
| 3 | Typography and layout | **7** |
| 4 | Imagery and visual storytelling | **3** |
| 5 | Content hierarchy and UX | **7** |
| 6 | Mobile and responsive quality | **7** |
| 7 | Interaction and motion quality | **6** |
| 8 | Accessibility | **8** |
| 9 | Functional reliability | **7** |
| 10 | Performance and technical implementation | **8** |
| 11 | SEO and metadata fundamentals | **8** |
| 12 | Overall readiness for a professional client review | **6** |

### 1. Visual design and art direction: 6/10

- **Reason:** a coherent, disciplined system: hairlines, title blocks, the Crease Mark, controlled dark/light rhythm (tested on every page). It looks deliberate rather than templated in its structure.
- **Evidence:** `v-1440-home-first-screen.png` has a confident Light 300 headline and a drawing sheet with a title block. `v-1440-home-manufacturing.png` has a well-proportioned split with the dashed crease divider.
- **Most important weakness:** the concept is under-executed. The hero drawing is small, thin and static once drawn; the sheet frame has an empty band between the drawing and the title block. Most sections are an eyebrow, an H2, then a hairline list, so pages feel like well-typeset documents rather than art-directed spreads.
- **To reach 9:**
  - complete the illustration set (Design §7.4 items 3–11);
  - give the drawing more presence (scale, a cross-section detail, a second plate on inner pages);
  - real photography as evidence (Design §10);
  - one or two signature compositions beyond the hero, for example a large flute cross-section or a plant photograph spread.

### 2. Brand distinctiveness: 5/10

- **Reason:** the dieline idea is genuinely specific to a corrugated converter. But the visual system around it (Inter, slate-900 navy, `#2563EB` blue, white) is the most common modern B2B palette.
- **Evidence:** the accent is still the provisional Group blue (D-01); there is no logo (text wordmark only, Q-06). The "cover the logo" test in Design §15 currently fails in the wrong direction: there is no logo, and with the dieline covered the site could belong to many companies.
- **Most important weakness:** the brand layer (logo, accent colour) is missing, so the identity rests entirely on line drawings.
- **To reach 9:** the client's logo and colour applied through the D-01 rule (the token swap is already built); kraft used more boldly in illustrations; photography with a recognisable plant character.

### 3. Typography and layout: 7/10

- **Reason:** a good type scale, a 68-character measure, tabular numerals, sentence-case headings, and an H1 that holds to three lines on desktop.
- **Evidence:** the hero H1 is three lines at 1440 (`v-1440-home-first-screen.png`).
- **Weaknesses:**
  - The hero title-block cells are cramped at 1440: "Ranjangaon MIDC, Pune" wraps to three lines and "Part of Atharva Group" to three.
  - Several inner pages leave large empty right halves: About's company paragraphs, and the Industries sector sections, whose right columns hold two short facts. See `1440-about.png` and `1440-industries.png`.
  - Density is inconsistent: Manufacturing has long lists, About is very sparse.
- **To reach 9:** rebalance the sparse layouts (a two-column About with a facts panel; Industries with a drawing or icon per sector); make the hero title block 2×2 until about 1600 px or shorten the values; vary section composition.

### 4. Imagery and visual storytelling: 3/10

- **Reason:** a manufacturing website with **zero photographs and one drawing type** cannot show what the plant does.
- **Evidence:**
  - The only drawings are the RSC and full-overlap dielines and the dimension diagram.
  - Four "Drawing to come" boxes appear on the homepage (`v-1440-home-families.png`, `v-390-home-families.png`).
  - No industry, process, or product imagery anywhere.
- **Most important weakness:** no visual proof of a real plant. Strategy §6 ranks plant evidence the second most important trust signal.
- **To reach 9:**
  - the Tier 1 shot list (Content §6.2). The cheapest high-impact shots are P-04 (flute-edge macro) and P-05 (palletised boxes), doable on a phone in an hour;
  - the remaining illustrations;
  - a Hero B switch once a wide production photo exists.
  - The photographs are client-dependent; the illustrations are not.

### 5. Content hierarchy and UX: 7/10

- **Reason:** the "specify → quote" path is clear. The quote CTA is consistent everywhere, WhatsApp is always one tap away, family pages prefill the form, and the quote form asks only what changes the price.
- **Evidence:** prefill and validation are covered by e2e tests (passing in this audit); the "Not sure which fits?" path works.
- **Weaknesses:**
  - The homepage is long and list-heavy: 10,348 px at 390 wide; 6,631 px at 1440.
  - Every page ends with the same quote band.
  - In preview, the reviewer cannot tell **which** facts are unverified: the banner gives a count but nothing is marked. That undermines the purpose of the review.
- **To reach 9:**
  - a review mode that visibly marks unverified facts, plus a claims checklist page for the client to sign off;
  - trim the homepage on mobile (collapse the long capability and quality lists);
  - page-specific quote-band headlines.

### 6. Mobile and responsive quality: 7/10

- **Reason:** no overflow at any width; the menu is modal and accessible; forms are comfortable; the 390×844 first-screen acceptance test passes.
- **Evidence and weaknesses:**
  - On the mobile first screen the floating WhatsApp button covers the hero strip's "Plant" value (`v-390-home-first-screen.png`).
  - At 834 wide (tablet) the hero dieline renders very large, nearly full width and taller than the copy block, unbalancing the first two screens (`v-834-home-first-screen.png`).
  - The preview banner takes about 90 px on mobile (review builds only).
- **To reach 9:** cap the hero drawing's width on tablet; keep the floating button off the hero; shorten mobile pages.

### 7. Interaction and motion quality: 6/10

- **Reason:** motion is restrained and on-brief (hero draw, Crease Marks, hovers), and respects reduced motion.
- **Evidence and weaknesses:**
  - **Defect:** the Products dropdown opens on hover and the click then closes it (`afterHover: true → afterClick: false`, reproduced with real pointer events).
  - The hero's fact strip and callouts are invisible for about 0.9–1.2 s while the draw sequence runs (`v-1440-focus-visible.png` caught it mid-sequence with an empty title block), so key facts arrive last.
  - The scroll-lock bug found in hosted testing (now fixed) shows pointer and resize interactions had been under-tested.
- **To reach 9:** fix the dropdown (click opens, hover only previews, a short close delay); show the strip from the start; add pointer-and-resize e2e cases for every interactive component.

### 8. Accessibility: 8/10

- **Reason:**
  - axe finds no serious or critical issues on any route at 390 and 1440 (e2e, run in this audit);
  - visible 2 px focus rings, white on dark (`v-1440-focus-visible.png`);
  - skip link first in the tab order;
  - one H1 and sequential headings on every page;
  - labelled form fields with an error summary that takes focus;
  - computed contrast passes on all 26 token pairs (`npm run check:contrast`).
- **Most important weakness:** not yet verified with real screen readers, 200%/400% zoom or real devices. The dropdown defect also affects mouse users of assistive tools.
- **To reach 9:** NVDA and VoiceOver passes on home, a family page and the quote flow; a zoom pass; fix the dropdown.

### 9. Functional reliability: 7/10

- **Reason:**
  - every route resolves; forms validate, submit (to a logging transport), and handle success, server error and timeout;
  - 194 Chrome e2e tests and 87 unit tests pass (both run in this audit);
  - unknown family slugs are real 404s.
- **Weaknesses:**
  - the dropdown defect;
  - the forms deliver nothing on the review deployment (clearly labelled), and are offline in production until the privacy policy exists;
  - `/specimen` and `/specimen/home` are reachable on the review deployment, exposing internal labels such as "Gate G2" and "Homepage components for approval".
- **To reach 9:** fix the dropdown; hide the internal pages on review deployments; connect Resend on staging so the client can test real delivery.

### 10. Performance and technical implementation: 8/10

- **Reason:** static rendering, small HTML (8–14 KB gzipped), lazy-loaded validation, no third parties without consent.
- **Measured in this audit** (`npm run check:bundle`): first-load JS of 160 KB on home, 155 KB on content pages, 169 KB on contact and 173 KB on the quote page; all within budget. The hero SVG is 2.6 KB.
- **Measured earlier the same day** (M8, previous commit; Lighthouse CI with DevTools throttling): Performance 99–100, LCP 1.5–1.6 s, CLS ≤ 0.016. **Not re-run in this audit.**
- **Weaknesses:**
  - simulated-throttling Lighthouse gave LCP of 2.0–2.8 s;
  - the framework baseline (about 155 KB) leaves little headroom;
  - each Crease Mark creates its own IntersectionObserver.
- **To reach 9:** a real-device check; one shared observer; keep watching the baseline after each dependency update.

### 11. SEO and metadata fundamentals: 8/10

- **Reason:**
  - per-page titles and descriptions; canonical URLs on www;
  - a sitemap of launched routes only; robots rules and `noindex` on staging;
  - Organization, WebSite and BreadcrumbList JSON-LD built from verified facts;
  - a 1200×630 share image;
  - all covered by e2e and unit tests (passing).
- **Weaknesses:**
  - thin content on several pages;
  - at launch every product family folds into the hub, so there are no family landing pages for "die cut boxes" or "heavy duty boxes" searches;
  - no logo in the structured data;
  - local search (Google Business Profile) not started.
- **To reach 9:** evidence-backed family pages passing the MCB; the logo in the schema; a Google Business Profile; Search Console data after launch.

### 12. Overall readiness for a professional client review: 6/10

- **Reason:** reliable and honest, and the client can verify content. But placeholders, absent imagery and the default palette make it look unfinished. The dropdown defect would be noticed within the first minute of use.
- **To reach 9:** the P0 fixes, a review mode that marks unverified facts, and the completed illustration set. Photographs and the logo would take it further, but depend on the client.

---

## 5. Visual review notes

| Area | Observation | Type |
|---|---|---|
| Hero (desktop) | Strong headline hierarchy and clear CTAs. The drawing sits small inside a large frame; there is an empty band between drawing and title block; title-block values wrap to three lines | Subjective plus a layout weakness |
| Hero (tablet 834) | The drawing scales to about 670 px wide, dominating the second screen | Layout defect |
| Hero (mobile) | The first screen meets acceptance; the floating WhatsApp button covers the "Plant" strip value | Layout defect |
| Hero motion | Facts in the title block appear last (≈1 s) | Design preference with a UX cost |
| What we make | One real drawing and four "Drawing to come" boxes; generous rows otherwise clean | **Defect for client review** |
| Process steps | Clear numbered sequence; reads well | Fine |
| Industries grid | Clean 2×2; the arrows add little; no imagery | Subjective |
| Manufacturing | Best composed section; a dense right column of lists; on mobile a long vertical list | Fine on desktop, long on mobile |
| Trust row | Two cards on a mostly empty band | Acceptable while evidence is thin |
| Who we are | Text left, addresses right; fine | Fine |
| Footer | Complete and correct; dense; GSTIN and CIN visible in preview | Fine |
| About | Sparse; **the Group office is listed twice on the same page** (Group band and Locations) | Redundancy |
| Industries page | Large empty right halves | Layout weakness |
| Contact | Clear four-route grid; the "Review copy" notice is appropriate | Fine |
| Quote page | Well-structured form; the sidebar diagram helps | Fine |

---

## 6. Functional and technical findings

**Observed:**

1. **Dropdown click-after-hover closes the menu.** `src/components/layout/Navbar.tsx`, ProductsMenu: a `mouseenter` listener opens it and `onClick` toggles it. Reproduced: hover gives `aria-expanded=true`, click gives `false`.
2. **Internal pages reachable on the review deployment.** `/specimen` and `/specimen/home` return 404 only in launch builds. They are `noindex`, but a client could open them.
3. **Hard-coded reply time** bypasses the claims rule. `src/app/contact/page.tsx:32` says "reply within 2 working days" literally instead of reading claim F-16. The request-quote metadata description does the same, though Sitemap §4.2 prescribes that text.
4. **Duplicated address markup** in four places: Footer, CompanyGroup, Contact, About. A maintenance risk, and the cause of the About duplication.
5. **One IntersectionObserver per Crease Mark** (`CreaseMark.tsx`). Minor; a shared observer would be leaner.
6. **No console errors, warnings or failed requests** on any audited route.
7. **Secrets:** none in tracked files (scanned during the review-deployment preparation; `.env.example` has empty values).
8. **Unsupported claims:** none in production by construction (`check:claims` passes). In preview all VERIFY claims render, as designed, but they are **not visibly distinguished** for the reviewer (see §4.5).
9. **Dependencies:** lean. `npm audit --omit=dev`: 0 vulnerabilities. 5 high remain in dev-only lint tooling (no non-breaking fix).

**Tests run in this audit:** `npm run check` (typecheck, lint, 87 unit tests, contrast, banned strings, claims gate), `npm run check:bundle`, `npx playwright test --project=chrome` (194 passed, 2 skipped by design), `npm audit`. All pass.

---

## 7. Accessibility, responsive, SEO and performance findings

- **Accessibility:**
  - axe clean (e2e);
  - focus visible;
  - keyboard tab order: skip link, logo, nav, WhatsApp, quote, hero CTAs;
  - headings sequential;
  - SVG drawings named;
  - reduced motion respected.
  - Open: screen-reader and zoom passes; the dropdown pointer defect.
- **Responsive:** zero overflow at 390/834/1152/1440. Defects: the tablet hero drawing scale and the mobile floating-button overlap. Weakness: mobile page lengths (home 10,348 px, products 8,162 px).
- **SEO:** see §4.11. All mechanics present and tested.
- **Performance:** see §4.10. Budgets measured today; Lighthouse figures are from earlier today on the previous commit.

---

## 8. Prioritised backlog

**P0: blocks the review or damages trust**

| ID | Page / component | Problem | Evidence | Fix | Impact | Effort | Dependencies / risks |
|---|---|---|---|---|---|---|---|
| P0-1 | Header, Products dropdown | Hover opens it; the click then closes it | Pointer reproduction in §6.1 | Click always opens (or toggles only when opened by click); hover opens with a ~150 ms close delay; add a pointer e2e test | Main product navigation works for mouse users | Low | None |
| P0-2 | Home, "What we make" (`FamilyIndex`) | Four "Drawing to come" placeholders on the review build | `v-1440-home-families.png` | Short term: render no placeholder in any mode (keep the row text). Proper fix: P1-1 | Removes the strongest "unfinished" signal | Low | None |

**P1: high-impact improvements**

| ID | Page / component | Problem | Fix | Impact | Effort | Dependencies |
|---|---|---|---|---|---|---|
| P1-1 | Illustration set | Only RSC/FOL and the dimension diagram exist; Design §7.4 lists 12 | Draw die-cut folder, heavy-duty with edge protectors, pad/partition set, roll, angle corner, honeycomb section, and flute cross-sections (single/double/triple wall) | Fills five families, enables the flute guide visual, strengthens the concept | Medium–high (Design estimate 1.5–2.5 days) | Client technical review (SD-10) |
| P1-2 | Review mode | The reviewer cannot see which facts are unverified | In preview, subtly mark VERIFY values (dotted underline with a tooltip "to confirm: F-23"), plus a `/review` page listing every claim with status and the question to answer | Turns the review into decisions; the core purpose of this phase | Medium | Keep out of launch builds |
| P1-3 | Photography | No photographs anywhere | Brief the client on the Tier 1 list; P-04 and P-05 on a phone first. Then Hero B and the Manufacturing photo | Largest credibility gain | Client-dependent | Q-07 |
| P1-4 | Brand | No logo; provisional accent | Apply the logo and colour via D-01 (token swap plus contrast script) | Distinctiveness | Low once assets arrive | Q-06 |
| P1-5 | Hero | Cramped title block; small drawing in a large frame; facts appear last; oversized at 834 | Title block 2×2 until about 1600 px; scale the drawing to fill the sheet; render the strip immediately (animate only the drawing); cap drawing width on tablet | First impression | Low–medium | Re-check the 390×844 acceptance test |
| P1-6 | Internal pages on review | `/specimen*` reachable | 404 unless `NODE_ENV=development`, or a `SHOW_SPECIMEN` flag | Avoids client confusion | Low | None |
| P1-7 | Mobile first screen | The floating WhatsApp button covers hero text | Show it only after the hero has scrolled past, or offset the hero bottom padding | Mobile polish | Low | Keep the quote-page rule |

**P2: polish**

| ID | Problem | Fix | Effort |
|---|---|---|---|
| P2-1 | The Group office appears twice on About | Remove it from the Locations section, or merge the sections | Low |
| P2-2 | Hard-coded "2 working days" on Contact | Read claim F-16 | Low |
| P2-3 | Address markup duplicated in four components | One `Address` component | Low |
| P2-4 | Long mobile pages | Collapse capability and quality lists on mobile; tighter family rows | Medium |
| P2-5 | Sparse inner layouts (About, Industries) | Add facts panels or sector drawings; rebalance columns | Medium |
| P2-6 | Same quote band on every page | Page-specific headline and supporting line | Low |
| P2-7 | "RSC" unexplained on Industries | Expand on first use | Low |
| P2-8 | One observer per Crease Mark | A shared observer | Low |

**P3: not worth it now**

Dark mode; Hindi or Marathi versions; animated section transitions beyond the motion budget; per-family share images; a client-side CMS. None of these improve trust or conversion at this stage.

---

## 9. Top five improvements

1. **Finish the illustration set (P1-1, absorbing P0-2).** This is the one visual investment fully in our control. It completes the site's own concept, removes every placeholder, and gives five families and the flute guide real content. Photographs need the client; drawings do not.
2. **Fix the Products dropdown (P0-1).** A broken primary navigation control undoes every other polish. It costs minutes.
3. **Add a proper client-review mode (P1-2).** The current review shows unverified facts without marking them. A marked review gets corrections and approvals back, which unblocks the trust floor (2 of 4 today) and the launch.
4. **Get photography moving (P1-3).** Even six phone photos (flute macro, pallets, die cutting, test lab, design desk, plant exterior) would turn "credible but abstract" into "real plant".
5. **Strengthen the first screen (P1-5 with P1-4).** Scale the drawing, fix the title block, show facts immediately, and apply the logo and colour when they arrive. The first screen decides whether a buyer reads on.

These outrank smaller decorative changes because perceived quality here is limited by **missing evidence and unfinished elements**, not by styling details. More motion or effects would push against the brief (Design §11) without fixing the cause.

---

## 10. Recommended next milestone: "Review polish" (before more client sessions)

- **Scope:** P0-1, P0-2, P1-2, P1-5, P1-6, P1-7, P2-1, P2-2, P2-3; start P1-1 with the four family drawings plus flute cross-sections.
- **Verification:**
  - new pointer e2e tests for the dropdown;
  - screenshots at 390/834/1152/1440 compared with this audit;
  - the existing suite, budgets and claims gate;
  - client technical review of the new drawings.
- **Estimate:** about 2–4 working days, most of it the drawings.

---

## 11. Limitations and tests not performed

- **Hosted Vercel site not inspected** (no URL given). I audited a local build of the same commit in the same preview mode; hosting-specific behaviour (headers at the edge, Deployment Protection, caching) is unverified.
- **Lighthouse not re-run** in this audit. The figures cited are from Lighthouse CI earlier the same day on the previous commit (the navbar fix changed no rendering cost).
- **Firefox:** Playwright's Firefox cannot start on this Mac; it runs in CI on Linux only. WebKit and mobile WebKit were not re-run in this audit; they passed earlier today.
- **Not tested:** real iOS/Android devices, Edge, Samsung Internet, NVDA/VoiceOver, 200%/400% zoom, real email delivery (no provider configured), consent behaviour with a real GA ID (only a test-ID build earlier today), the hosted site's network performance.
- **Screenshot artefacts:** full-page captures sometimes show eyebrows without their Crease Mark. I tested this: all marks draw on scroll and after a fast jump, so it is a capture-timing artefact, not a defect.
- **Subjectivity:** scores 1–4, 7 and 12 are design judgements. Defects are listed separately from preferences in §5 and §8.

**Files created by this audit:** `FRONTEND_QUALITY_AUDIT.md` and `docs/audit/screenshots/` (51 images). No application file was changed.

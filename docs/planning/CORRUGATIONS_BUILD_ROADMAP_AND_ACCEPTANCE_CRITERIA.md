# CORRUGATIONS_BUILD_ROADMAP_AND_ACCEPTANCE_CRITERIA.md
**Atharva Corrugations Pvt. Ltd. — Website Planning · Document 7 of 7**
Version 1.0 · 12 October 2026 · Status: for owner review
Depends on: all six preceding documents.

**No design implementation and no production code begin before gate G0 (owner approval of this plan).** Estimates below are labelled estimates for one developer working in focus, exclude client waiting time, and are ranges, not commitments (the Polymers documents themselves disagree on effort, Audit P-09).

---

## 1. Phases

### Phase A: Planning and client clarification

| Item | Detail |
|---|---|
| **Deliverables** | The seven planning documents; decisions SD-01 to SD-10, TD-01 to TD-06, D-01 to D-10 recorded; client batch 1 (Q-01 to Q-16) and file list sent; Polymers as-built materials received (current `dev_progress`, navigation config, navbar, About blueprint, or repository access); domain, DNS and mail-host inventory started |
| **Dependencies** | Owner review; client responses |
| **Approval gates** | G0, G1 |
| **Completion criteria** | Plan approved; every P0 question answered or its default accepted in writing; logo received or the placeholder accent accepted; domain registrant identified; a client technical reviewer named; framework version decision made |
| **Estimate** | 1–2 weeks elapsed, dominated by client response time |

### Phase B: Design definition

| Item | Detail |
|---|---|
| **Deliverables** | Token sheet with the contrast report; Hero A comps (desktop and mobile); component sheet (FamilyIndexRow, TitleBlock, ProcessSteps, CapabilityMatrix, RfqForm states); layouts for Home, one family page and the quote page at three breakpoints; illustration set drafts and the dieline specification; motion specification; photography brief issued and a shoot date requested |
| **Dependencies** | G0; logo or placeholder; decisions D-01 to D-05 |
| **Approval gate** | G2 |
| **Completion criteria** | Owner signs off tokens, hero, illustration style and component sheet; the client technical reviewer has checked every drawing; contrast checks pass |
| **Estimate** | 1–2 weeks |

### Phase C: Implementation

| Item | Detail |
|---|---|
| **Deliverables** | The build in §3; a progress log `CORRUGATIONS_DEV_PROGRESS.md` (kept under 200 lines, the Polymers convention) created at the start |
| **Dependencies** | G2; G1 decisions on repo, framework, hosting |
| **Approval gates** | G3, G4, G5 |
| **Completion criteria** | All launch pages built to the Definition of Done (§5) with content integrated to the extent evidence exists |
| **Estimate** | About 26–33 working days (5–7 weeks) focused; elapsed time is longer because content arrives in stages |

### Phase D: Quality assurance

| Item | Detail |
|---|---|
| **Deliverables** | Green CI; manual matrix executed; accessibility, performance, SEO and security-header audits; end-to-end quote test through real email; link check; claims-gate report; banned-strings report; DNS rehearsal on staging |
| **Dependencies** | G5 |
| **Approval gate** | G6 |
| **Completion criteria** | §7 checklist complete; zero non-confirmed claims on launched pages; trust-floor count recorded; client preview approved |
| **Estimate** | 4–6 working days |

### Phase E: Launch and measurement

| Item | Detail |
|---|---|
| **Deliverables** | DNS cut-over (Technical §12.2); Search Console and Bing verified; analytics key events live; uptime monitor; synthetic form test scheduled; Google Business Profile started and listing corrections requested (client actions); post-launch review dates set |
| **Dependencies** | G6; domain control; email verified |
| **Approval gate** | G7 |
| **Completion criteria** | Production serves over HTTPS on the canonical domain; company email unaffected; first real submission received and answered |
| **Estimate** | 1–2 working days plus the monitoring period in §8 |

---

## 2. Approval gates

| Gate | Name | Criteria | Approver |
|---|---|---|---|
| **G0** | Plan approved | Owner has reviewed the seven documents; decisions recorded; scope (§4) accepted | Owner |
| **G1** | Inputs and standards freeze | P0 questions closed or defaulted; Polymers as-built materials received (Audit §1.2); accent source decided; domain owner identified; technical reviewer named; Next.js and Tailwind versions decided | Owner |
| **G2** | Design approved | Tokens, Hero A, illustration style, component sheet signed off | Owner; technical reviewer for drawings |
| **G3** | Foundation and shell | Fresh scaffold, tokens, claims gate running in CI, navbar, footer, WhatsApp control, quote API sending to a test sender; staging protected | Owner |
| **G4** | Homepage v1 | All nine sections work; **gating verified** by rendering with all claims, some claims and only confirmed claims; rhythm and CTA rules pass | Owner |
| **G5** | Launch pages complete | All launch pages built; family-page MCB decisions recorded; content integrated as far as evidence exists | Owner |
| **G6** | QA and claims | §7 checklist complete; zero non-confirmed claims; trust-floor recorded; client preview approved | Owner and client approver (Sales and Marketing Head) |
| **G7** | Go / no-go | DNS rehearsal passed; email send and receive verified; privacy notice live; rollback ready; no open blocker | Owner |

**Trust-floor rule at G6:** the homepage must carry at least four verified signals from Strategy §6 rows 1–8. If it cannot, launch the reduced homepage (Sitemap §6.1) or delay.

---

## 3. Build sequence (estimates, focused days)

| Stage | Work | Depends on | Days |
|---|---|---|---|
| **C1** | Scaffold on Next.js 16; tokens and contrast script; utilities; claims registry, `Gated`, check scripts; CI; progress log | G2, G1 | 2–3 |
| **C2** | Shell: navbar with Products dropdown and mobile overlay, footer with Group panel, floating WhatsApp, 404 | C1 | 2 |
| **C3** | **Quote flow early** (it is the primary conversion and depends on DNS lead time): form, schema, API, spam control, emails, success and error states, WhatsApp builder | C1; Q-01 for sending domain | 3–4 |
| **C4** | Homepage: Hero A (1.5), families, process and industries (2), manufacturing and quality with matrix fallback (1.5), specialised, trust, company, quote band (1.5) | C2 | 6–7 |
| **C5** | Products hub and family template with data files | C4 | 3 |
| **C6** | Industries, Custom Packaging, Manufacturing and Quality, About, Contact | C5 | 4–5 |
| **C7** | Illustration set and dieline generator (runs in parallel from Phase B) | Design §7.4 | 1.5–2.5 |
| **C8** | SEO metadata, schema, sitemap, robots; analytics events; privacy notice and policy page | C6 | 2 |
| **C9** | Content integration as evidence arrives; Hero B swap if photographs exist | Content gates | 2–4 rolling |

Reuse of the Polymers foundation shortens C1 and C2 **only if** the foundation files described in `dev_progress` exist and pass QA (TR-1). The build is smaller than Polymers: no metrics, export, case-study or gallery work.

---

## 4. Launch-critical and optional

| Launch-critical | Optional or later |
|---|---|
| Home, Products hub, Industries, Custom Packaging, Manufacturing and Quality, About, Contact, Request a Quote | Hero B (needs photographs) |
| Family pages that pass the MCB; others folded into the hub | Standalone allied-product pages |
| Quote flow with email, archive copy, reference and WhatsApp handoff | File upload (Technical §7.9) |
| Floating WhatsApp, privacy notice and policy page, 404 | Packaging specification guide |
| Claims registry and gate; banned-string check; CI | Case studies, gallery, standalone Careers, Group companies page |
| Analytics events and Search Console | Hindi or Marathi versions |
| Domain, DNS and email cut-over rehearsed | Cookieless analytics, A/B tests |

No recurring-cost item is optional-by-default: hosting Pro is required (Technical §12).

---

## 5. Definition of Done

### 5.1 Every section or page
- Uses design tokens only; no hard-coded colours or numbers.
- Renders correctly at 360, 390, 768, 1024 and 1440 px with no horizontal page scroll.
- All facts come from the registry; **tested in three states** (all claims, some claims, only confirmed claims) with no empty blocks, holes or layout shift.
- Accessibility: axe reports no serious or critical issues; keyboard-only path works; focus visible; reduced motion honoured.
- Performance: meets the Technical §8 budgets on the page.
- Technical copy reviewed by the client's reviewer (SD-10); no unreviewed claims.
- SEO metadata, canonical and breadcrumbs present; one H1.
- At most two CTAs per section; WhatsApp green appears only in the quote band and the floating control.
- Analytics events wired and verified in debug view.
- Pull request reviewed; CI green.

### 5.2 Templates
- **Family page:** formats rendered from data; spec fields only if confirmed; "what we need to quote" present; quote CTA prefills the form from the URL; folded-page behaviour tested.
- **Quote flow:** states in Sitemap §7.5 all demonstrable; reference format correct; archive copy sent; auto-reply sent; keyboard and screen-reader pass.
- **Home section:** rhythm rule respected; gated sections absent, not empty, when evidence is missing.

---

## 6. Acceptance criteria by page

| Page | Criteria (all must hold) |
|---|---|
| **Home** | On a 390×844 viewport the first screen shows the H1, the primary CTA, the WhatsApp CTA and at least three strip cells without scrolling. Lighthouse mobile LCP ≤ 2.5 s and CLS < 0.1. With only confirmed claims, the page renders without H6 and H7 and without empty space. No more than two dark sections in a row and three light. The hero drawing has a text alternative |
| **Products hub** | Every launched family is linked; folded families appear as anchored sections; the comparison table is a real table; empty cells are not rendered |
| **Family page** | At least one format, no unverified spec field, applications exactly as the client named them, working prefilled quote link |
| **Industries** | Four anchored sections plus "also serving"; a search of site copy for compliance terms (`GMP`, `food-grade`, `food safe`, `FDA`, `FSSC`, `BRC`, `pharma-grade`, `FSC`, `PEFC`, `WRAP`, `worldwide`, `global`, `export markets`) returns no unreviewed instance |
| **Custom Packaging** | Six steps, accepted inputs, only the outputs the client confirmed, no lead times or MOQ anywhere |
| **Manufacturing and Quality** | Capability matrix is a real table with varnish and coating under partners; area, capacity and team numbers appear only if confirmed; certificate cards have no border radius and only verified items |
| **About** | Group section present; founders named only if approved; no "Registered office" text unless verified |
| **Contact** | Every route works: `tel:`, `mailto:`, WhatsApp, map link opens the plant location; hours and reply expectations shown; careers line present |
| **Request a Quote** | Valid submission shows a reference and sends the team email, the archive copy and the auto-reply within 60 seconds in production tests; invalid input shows inline errors and an error summary that takes focus; a forced failure shows the error state with input preserved and WhatsApp and phone links; honeypot and Turnstile reject abuse; works at 360 px, keyboard-only and with a screen reader; success is announced |
| **Privacy policy** | Published, linked from the form and footer, names a contact for requests |
| **404** | Branded, links to Products, Request a Quote, Contact |
| **Global** | Floating WhatsApp on every page and clear of submit buttons; analytics events fire; sitemap lists only launched routes; robots and canonical correct; structured data validates; no non-confirmed claim reachable |

---

## 7. QA and launch checklist (Corrugations additions to the Polymers lists)

The Polymers QA and launch checklists (Master Plan §14 and §20) apply, minus the Polymers-only items (impact metrics, export section, gallery). Add:

**Claims and content**
- [ ] `check-claims` passes in production mode; report archived.
- [ ] `check-banned-strings` passes; allow-list reviewed.
- [ ] Trust-floor count recorded; reduced homepage decision made if needed.
- [ ] ISO certificate, EcoVadis scorecard (if shown), GST and CIN checked against documents; address string identical across site, schema, footer and listings.
- [ ] No Polymers number, phrase, keyword or customer anywhere; WhatsApp number, emails and analytics ID differ from Polymers values.
- [ ] Every drawing reviewed by the client's technical reviewer; captioned "Illustration".
- [ ] Photographs have consent and no customer branding.

**Functionality**
- [ ] Quote form end to end in production: team email, archive copy, auto-reply, reference, WhatsApp handoff.
- [ ] Deliverability checked to Gmail, Outlook and the client's own mail; not in spam.
- [ ] Prefill from every entry point (Sitemap §7.1).
- [ ] WhatsApp links open with the correct message and source token.

**Infrastructure**
- [ ] DNS records exported; TTL lowered; MX untouched; send and receive test before and after cut-over; rollback ready.
- [ ] HTTPS, apex to `www` redirect, security headers present; staging protected and `noindex`.
- [ ] Search Console and Bing verified; sitemap submitted; uptime monitor on; weekly synthetic test scheduled.

**Compliance**
- [ ] Privacy notice live at the form and in the footer; counsel's comments resolved.
- [ ] Analytics consent behaviour matches the privacy policy (TD-06).

---

## 8. Post-launch plan

| When | Actions |
|---|---|
| **Week 1** | Watch errors and the form daily; confirm real enquiries arrive and are answered; check indexing in Search Console; verify analytics key events; run the first synthetic form test |
| **Weeks 2–4** | Review every quote request for completeness and friction; fix form issues; add photographs as they arrive and switch to Hero B when the trigger is met (Design D-02); client starts the Google Business Profile and listing corrections (Q-36, Q-37) |
| **Day 30** | First KPI review with sales (Strategy §5.6): qualified requests, spec completeness, WhatsApp starts, response time, segment mix |
| **Day 60** | Search Console queries and pages; adjust titles and descriptions; decide whether any deferred page now passes the MCB (Sitemap §8) |
| **Day 90** | Set targets from real data; decide the analytics approach (TD-06) and Phase 2 items: specification guide, case studies, uploads, standalone allied pages |
| **Ongoing** | Weekly synthetic test; monthly dependency updates; **claim expiry reviews**: ISO validity date from the certificate (the client states 01-09-2028), EcoVadis annually, any recognition letter; yearly address and number audit across listings |

---

## 9. Risk register

| ID | Risk | Mitigation | Owner |
|---|---|---|---|
| R-01 | P0 answers arrive late | Defaults ledger (Content §11); build proceeds with placeholders; gate G1 decides | Owner |
| R-02 | Domain or DNS control unresolved, or email disrupted | Early inventory; staging on a preview URL; merge SPF; MX untouched; rollback | Owner, client |
| R-03 | No photographs | Hero A; omission of photograph sections; phone-shot minimum set | Client |
| R-04 | Several VERIFY claims fail | Claims gate removes them; reduced homepage; trust-floor rule | Owner |
| R-05 | Scope creep (extra product pages, export, metrics) | MCB and the deferred list with triggers | Owner |
| R-06 | One approver becomes a bottleneck | Named technical reviewer; batch reviews; clear gate dates | Owner |
| R-07 | Technical copy is wrong | SD-10 review; drawings reviewed; copy drafts flagged until approved | Client reviewer |
| R-08 | Polymers foundation not stable or not as documented | Fresh scaffold; port with tests; repo inspection at G1 | Developer |
| R-09 | Framework or Tailwind upgrades mid-build | Version pinning; decision at G1 | Developer |
| R-10 | Cost surprise (hosting plan) | Cost register agreed at G1 | Owner |
| R-11 | Email deliverability problems | SPF, DKIM, DMARC; test to several providers; archive copy | Developer |
| R-12 | Slow replies erase lead value | Reply-time commitment; shared mailbox; day-30 review | Client |
| R-13 | Cross-contamination with Polymers or marketplace text | Banned-string check; Group constants | Developer |
| R-14 | Estimate uncertainty | Ranges; weekly re-estimate against the progress log | Developer |

---

## 10. Plan self-review

**Is the website clearly suited to a corrugated packaging manufacturer?** Yes: product families by packaging type, specification panels and a flute guide, a quote form built on the inputs buyers use, a design-to-delivery process, an in-house versus partner capability matrix, and a graphic language taken from the dieline.

**Does it help a B2B buyer evaluate the supplier and request a quotation?** Fit, board, process, tests, certificate and reply time are answered before the quote form; the form asks only what changes the price; WhatsApp is always beside it.

**Is every page justified?** Each launched page answers a named buyer question (Strategy §3.3) and passes the minimum content bar, or folds into its parent. Export, metrics, case studies, gallery, sustainability and insights are deferred or rejected with triggers (Sitemap §8).

**Is the design consistent with Polymers without being a clone?** The reuse, adapt, avoid table (Design §1.2) and the family contract (Design §15) separate shared engineering from company expression: new accent source, graphic device, hero, product presentation and imagery.

**Are missing facts and assets clearly identified?** Audit §3 and §7, the conflict register, and 43 questions with defaults (Content §11).

**Are technical recommendations realistic for the scale?** Same stack as Polymers on a supported framework version; no CMS or database; one required recurring cost (hosting), listed; automated gates replace manual vigilance.

**Can a developer implement the plan without guessing?** Routes, sections, data model, enquiry fields and states, tokens, budgets, and acceptance criteria are specified. What still needs input is stated: logo, photographs, evidence, design comps.

**Are launch priorities separated from later enhancements?** §4.

### Known limitations
- The competitor sample is small and the most comparable local rivals were seen mainly through marketplace profiles; no keyword-volume or traffic data was available (Strategy §7).
- The Polymers repository and as-built navbar were not inspected; current Polymers decisions outside the uploaded files are unverified (Audit P-03, TR-1).
- Registry, rating and trade-data observations are third-party and may be stale; they only shaped questions.
- The design is a written proposal; nothing has been drawn or tested with the client.
- Technical corrugated-board statements (ply, flutes, test practices) are general domain knowledge and need the client reviewer.
- DPDP obligations and cross-border processing need counsel.
- Estimates are ranges and exclude client waiting time.
- If the trust-floor test fails, the launch homepage will be thinner than this plan's full version.

**Stop point.** Per the brief, no design implementation or production code begins until the owner reviews and approves this plan (G0).

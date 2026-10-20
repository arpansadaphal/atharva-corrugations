# CORRUGATIONS_DESIGN_DIRECTION.md
**Atharva Corrugations Pvt. Ltd. — Website Planning · Document 4 of 7**
Version 1.0 · 12 October 2026 · Status: for owner review (proposal; no design has been built)
Depends on: Audit, Strategy, Sitemap. Contrast figures were computed on 12 Oct 2026 with the WCAG relative-luminance formula.

**Labelling.** Everything here is a **[Proposal]** unless it cites an existing Polymers document. No brand colour, logo or typeface has been supplied by the client (F-61); nothing below is presented as an existing brand requirement.

---

## 1. Relationship to the Atharva Polymers system

### 1.1 Two categories

**Shared standards (reuse so the sites read as one family):** type system and hierarchy, grid and spacing, section padding, breakpoints, navigation behaviour, button and form conventions, focus and accessibility rules, motion principles and easing, performance targets, SEO templates, WhatsApp rules, code and component quality, the claims discipline.

**Corrugations-specific (propose separately):** accent colour, graphic device, hero, product presentation, industry layout, process presentation, capability presentation, imagery, copy.

### 1.2 Reuse, adapt, avoid

| Polymers pattern | Source | Decision | Reason |
|---|---|---|---|
| Inter, weight-role system (200–600) | `01 Foundation`; `VISUAL_DIRECTION` §6 | **Reuse** (drop weight 200, D-08) | Family type; locked for Polymers |
| 1280 container, 12-column grid, 120/96/72 section padding, breakpoints | `01 Foundation` | **Reuse** | Shared engineering |
| Dark/light rhythm: ≤2 dark, ≤3 light in a row | Master Plan §2.5 | **Reuse** | Checked in Sitemap §6.1 |
| Section header: Specification Mark + eyebrow | `01 Foundation`; `SectionHeader` | **Adapt**: Crease Mark variant; eyebrow only at section level | Own graphic device (§7) |
| Noise overlay on dark sections (not footer) | Master Plan §2.4 | **Reuse**, with a paint-cost test | Family surface quality; test on mid-range Android (Technical §8) |
| Asymmetric hero, photograph bleeding right, gradient join | `03 Hero` | **Adapt**: Hero A dieline plate; Hero B photograph | No photographs exist yet (F-63) |
| Impact Metrics with count-up | `06 Impact Metrics` | **Avoid** | No verified metrics; counters would repeat C-10 |
| "Why Atharva" four-card grid with 3 px left border | `05 Why Atharva` | **Avoid at launch**; differentiators live in the process and manufacturing sections | Provisional pillars lack evidence; the card pattern is generic |
| Product card grid with top-border hover | Master Plan §5.6 | **Adapt**: specification index rows | Five families read better as an index |
| Industries as a 2×2 hairline grid | Master Plan §5.7 | **Reuse** | Family language; fits four industries |
| Manufacturing split with 1 px blue divider | Master Plan §5.8 | **Adapt**: dashed crease divider; capability-matrix fallback | Own device; works without photographs |
| Certification cards, zero radius | Master Plan §5.9 | **Reuse** | Official-document feel |
| Export Markets section | Master Plan §5.10 | **Avoid** | C-01 |
| Case Studies, Careers teaser | Master Plan §5.11–12 | **Avoid at launch** | No content |
| Contact band with WhatsApp green button | Master Plan §5.13 | **Reuse**, with ink text | White on #25D366 is 1.98:1 (P-12) |
| Flat dark footer, four columns, accordion | Master Plan §5.14 | **Reuse** | Shared |
| Navbar transparent-to-white | `02 Navbar` | **Follow the as-built version** once confirmed | D-04 |
| Bottom-border form inputs | Master Plan §6 `/contact`; Appendix §19 | **Reuse**, with a darker border | `slate-300` is 1.48:1 against white (§14) |
| Section reveal on every block | `MOTION_SYSTEM` | **Adapt**: selective, per the system's own final test | §11, D-07 |
| Reference sites (Covestro, Arkema, LANXESS, Schunk, Plansee) | `VISUAL_DIRECTION` §10 | **Replace** | Chosen for chemicals; the corrugated peer set differs (Strategy §7) |
| #2563EB brand blue | `DESIGN_SYSTEM` | **Provisional placeholder only** | Accent comes from the client's logo (D-01) |

---

## 2. Concept: "Structure, Specified."

Corrugated board is strong because of its geometry: two flat liners held apart by a fluted layer. What a customer buys from Atharva is a product turned into a **specified structure**: a dieline, a board build, a tested result. The site therefore does two things everywhere: it **shows structure** (what a pack is made of) and it **asks for specification** (what the buyer needs to tell us).

This is the sibling of Polymers' "Precisely Made". Both express precision in the company's own technical language: Polymers in measurement, Corrugations in the **dieline**, the flat drawing where a solid line is a cut and a dashed line is a crease.

What it looks like in practice: hairline technical drawings, data set as title-block key–value pairs with tabular numerals, one small crease mark at section starts, photography as evidence. No decorative gradients, no patterns, no stock imagery.

---

## 3. Principles

1. **Evidence over ornament.** Every visual element either shows structure or proves something.
2. **One bold idea.** The dieline language carries the identity; everything else stays disciplined.
3. **Drawings show structure; photographs show proof.** Never swap their jobs.
4. **Data is typographic.** Specifications appear as title blocks and tables, not KPI tiles.
5. **Honest states.** A gated element disappears gracefully; the layout never shows a hole.
6. **Family, not clone.** Cover the logo: a visitor should sense the same Group, and still tell the companies apart.

---

## 4. Generic-default review

Checked against the common traits of templated industrial and "editorial" sites, and the decision taken.

| Default to avoid | Where it could creep in | Decision |
|---|---|---|
| Cream background, serif display, terracotta accent | "Kraft paper" temptation | **Rejected.** Surfaces stay white, slate-50 and ink. Kraft appears only as illustration fill and stroke |
| Dark surface with neon accent or glow | Hero, quote band | Rejected. The accent is used at ≤10% of area; no glow |
| Identical rounded cards with icon, title, text | Families, industries, differentiators | Families are index rows, industries a hairline grid, the process a numbered sequence. Only certificates are cards |
| Uppercase eyebrow and dot-joined metadata on every block | Section and card headers | Eyebrows at section level only (D-06); metadata uses title-block key–value form, not dot strings |
| "→" on every link | CTAs, cards | Arrow only on forward-navigation links such as "View" and "All products"; none on buttons or labels |
| Fade-up on every section, hover lift on every card | All pages | Motion budget (§11) |
| Stock factory photography | Hero, banners | None. Own drawings plus client photographs |
| Hero statistic counters | Hero | None. Verified specifications in a title block |
| Gradient meshes, blobs, decorative patterns | Backgrounds | None |
| Icons as decoration | Cards, lists | Icons only where they label (industries); line drawings elsewhere |

Where Polymers locks a convention (uppercase eyebrows, arrow links), Corrugations keeps the convention but uses it sparingly.

---

## 5. Colour

### 5.1 Strategy

Neutral first, accent from the logo, kraft as a material cue. The 60–30–10 rule is kept: light surfaces about 60% of area, dark about 30%, accent at most 10%.

### 5.2 Tokens

| Token | Value | Role |
|---|---|---|
| `--ink-900` | `#0F172A` | Dark primary surface; strong text on light |
| `--ink-800` | `#1E293B` | Dark secondary |
| `--paper-0` | `#FFFFFF` | Light primary |
| `--paper-50` | `#F8FAFC` | Light secondary |
| `--text-body` | `#475569` | Body text on light |
| `--text-muted` | `#64748B` | Secondary text on **white and slate-50 only** |
| `--on-dark-strong` / `-body` / `-muted` | `#FFFFFF` / `#CBD5E1` / `#94A3B8` | Text on ink |
| `--line` | `#E2E8F0` | Decorative hairlines, card edges |
| `--line-ui` | `#64748B` | **Form-control borders** (needs 3:1) |
| `--line-dark` | `#334155` | Hairlines on ink |
| `--accent` | `#2563EB` **(provisional)** | Primary button, links, focus ring, crease mark |
| `--accent-hover` | `#1D4ED8` | Hover and pressed |
| `--accent-on-dark` | `#60A5FA` | Accent text and links on ink |
| `--kraft-200 / 300 / 400 / 600` | `#E7D5B3` / `#D4B98A` / `#BE9B66` / `#8A6A3C` | **Illustration only**: board cross-sections and product drawings. 600 for strokes; 200–400 for fills |
| `--wa` / `--on-wa` | `#25D366` / `#0F172A` | WhatsApp control: green fill, **ink** text and glyph (D-05) |
| `--error` / `--success` | `#B91C1C` / `#15803D` | Form states |

### 5.3 Computed contrast (WCAG 2.x)

| Pair | Ratio | Verdict and use |
|---|---|---|
| Ink on white / on slate-50 | 17.85 / 17.06 | AAA |
| `#475569` on white / slate-50 | 7.58 / 7.24 | AAA, body text |
| `#64748B` on white / slate-50 | 4.76 / 4.55 | AA; muted text and labels on light only |
| `#64748B` on ink | **3.75** | **Fails** for text. Never used on dark |
| `#94A3B8` on ink-900 / ink-800 | 6.96 / 5.71 | AA, muted text on dark |
| `#CBD5E1` on ink-900 / ink-800 | 12.02 / 9.85 | AAA, body on dark |
| White on accent `#2563EB` / hover `#1D4ED8` | 5.17 / 6.70 | AA button text |
| Accent text on white / slate-50 | 5.17 / 4.94 | AA links on light |
| Accent `#2563EB` on ink | 3.45 | Large shapes and marks only, **not text** |
| `#60A5FA` on ink-900 / ink-800 | 7.02 / 5.75 | AA, links on dark |
| **White on `#25D366`** | **1.98** | **Fails.** The Polymers spec uses it |
| **Ink on `#25D366`** | **9.00** | AAA. Used for the WhatsApp control |
| Error `#B91C1C` on white / slate-50 | 6.47 / 6.18 | AA |
| Success `#15803D` on white / slate-50 | 5.02 / 4.79 | AA |
| Kraft-600 `#8A6A3C` on white / slate-50 | 4.99 / 4.77 | AA; strokes |
| Kraft-400 `#BE9B66` on white | 2.60 | Fill only; never the sole carrier of meaning |
| `#CBD5E1` on white | **1.48** | Decorative only; **fails** as a control border |
| `#94A3B8` on white | 2.56 | Fails as a control border |
| `#64748B` on white | 4.76 | **Passes** as a control border |

### 5.4 Usage rules

- Accent: primary button, links, active navigation, focus ring, crease mark. Never a large fill, never a gradient.
- No text in kraft. No text in `#64748B` on dark.
- Form-control borders use `--line-ui`; card and row hairlines may use `--line`.
- The WhatsApp control is the only green on the site, in the quote band and the floating button.
- Dark surfaces carry the shared noise texture except the footer.

### 5.5 Accent decision rule (D-01)

When the logo arrives: sample the primary brand colour; test white-on-accent ≥ 4.5, accent text on white and slate-50 ≥ 4.5, and a lighter variant for text on ink ≥ 4.5; if a test fails, shift lightness within the hue until it passes; if the logo is monochrome, keep the Group blue. The repository ships a small contrast script so the check is repeatable (Technical §5).

---

## 6. Typography

**Family:** Inter, as for Polymers (shared). **Weights:** 300, 400, 500, 600. Weight 200 is not used because there are no display numerals (D-08), saving a font file.

| Role | Weight | Size / line | Notes |
|---|---|---|---|
| Hero H1 | 300 | 64/72 desktop, 40/46 mobile | Sentence case, ≤3 lines, no adjectives without proof |
| Section H2 | 400 | 40/48 desktop, 30/38 mobile | |
| H3 | 500 | 24–28 | Index row names, step titles |
| Body | 400 | 16–18 / 28–30 | ≤68 characters per line |
| Spec text, tables | 400, **tabular numerals** | 14/24 | `font-variant-numeric: tabular-nums` |
| Title-block value | 500–600 | 18–22 | Tabular numerals |
| Title-block label, eyebrow | 600 | 11, uppercase, +0.08–0.1em | Section-level eyebrows only (D-06) |
| Buttons | 600 | 15 | |
| Navigation | 500 | 15 | |

No monospace face: tabular numerals give alignment without a second family. Never justify text; never centre multi-line body copy.

---

## 7. Graphic system: the dieline language

One idea, three expressions.

### 7.1 Crease Mark (replaces the Specification Mark)
A 2 px line in the accent, 28 px wide: a 12 px solid segment (cut) followed by two 4 px dashes (crease), placed 12 px left of a section eyebrow. It draws left to right in 250 ms, once, on the shared easing; reduced motion shows it static. Same size, timing and behaviour as the Polymers mark, so the shared `SectionHeader` carries a `mark` variant and nothing else changes. At architectural scale it becomes the **dashed vertical divider** in the manufacturing split (1 px, `--accent-on-dark`).

### 7.2 Title block
The data device. A grid with hairline rules above and between cells, no fills, no radius. Each cell: a small uppercase label above a tabular-numeral value. Two to four columns. Used for the hero capability strip, spec summaries on family pages and the plant overview. **It renders only confirmed cells.** Quiet when sparse, which is the point.

### 7.3 Technical line illustration
- Stroke 1.5 px (dimension lines 1 px); butt caps; flat colour only; no gradients or shadows.
- Cut lines solid ink (white on dark); crease lines dashed 6/4 in `--text-muted` (`--on-dark-muted` on dark); dimension lines with arrowheads and mm labels in tabular numerals.
- Isometric views at 30°; board cross-sections filled with kraft-200 to 400 with kraft-600 strokes.
- Each drawing carries a text description for assistive technology and is captioned "Illustration" so nobody mistakes it for a product photograph.

### 7.4 Illustration set (scope for approval, D-03)

1. Regular slotted container: dieline and erected box. 2. Full-overlap box. 3. Telescopic box. 4. Die-cut folder-style box. 5. Heavy-duty box with edge protectors. 6. Pad, partition and insert set. 7. Corrugated roll. 8. Paper core assembly (drawn only after the client supplies a sample photograph or specification). 9. Angle-corner profile. 10. Honeycomb panel cross-section. 11. Flute cross-sections: single, double and triple wall (nine-ply only if the construction is confirmed). 12. Internal-dimension diagram for the quote page.

Production: dielines for items 1–2 generated from a small parametric function (length, width, height, board allowance) so hero, family pages and the quote diagram stay consistent; the rest drawn as vectors. Client QA reviews each for technical accuracy (SD-10). Estimated effort 1.5–2.5 working days.

---

## 8. Layout, rhythm and components

Grid, container and spacing are shared. The homepage rhythm is in Sitemap §6.1.

| Component | Status | Essentials |
|---|---|---|
| Navbar | Adapt | Follows the as-built behaviour (D-04); "An Atharva Group company" micro-label by the logo |
| Footer | Reuse | Flat dark; Group panel; legal line |
| SectionHeader | Adapt | `mark` variant; eyebrow optional |
| Button | Reuse | Primary, secondary (outline), outline, WhatsApp (ink text) |
| **FamilyIndexRow** | New | Drawing 3 columns, text 4, specs 3, link 2; hairline rows; hover fills white; arrow shifts 2 px |
| **TitleBlock** | New | §7.2; confirmed cells only |
| **ProcessSteps** | New | Numbered; hairline joiner; vertical on mobile |
| IndustryGrid | Reuse | 2×2 hairline cells, no radius |
| **CapabilityMatrix** | New | Real `<table>`; columns "made at our plant", "arranged with partners" |
| CertificateCard | Reuse | Crisp rectangle, no radius, verified items only |
| QuoteBand | Adapt | Centred 640 px column, ink surface with texture |
| RfqForm | Adapt | Bottom-border inputs in `--line-ui`; labels above; error summary |
| WhatsAppButton | Reuse | Ink glyph on green (D-05) |
| **GroupStrip** | New | Small footer panel; list only after approval |
| Gated | New utility | Renders children only if its claim is confirmed (Technical §4.3) |
| PhotoPlaceholder | Reuse | Development only |

Radius: buttons 8 px (shared); everything else square. Hairlines do the structuring, not boxes.

---

## 9. Hero concept

### Hero A: "The dieline plate" (default for launch)
Dark ink surface, two columns. **Left (≈55%):** crease-mark eyebrow "Corrugated packaging"; H1; one supporting sentence; **Request a quote** and **Chat on WhatsApp** (outlined); the capability TitleBlock at the base. **Right:** a large dieline drawing of a regular slotted container, unfolded: four body panels, glue flap, top and bottom flaps; solid cut lines, dashed crease lines, L, W, H callouts; the TitleBlock sits in the drawing's bottom-right corner exactly where a real drawing's title block sits, so the capability strip and the artwork are one object.

Why it works: the dieline is the most characteristic object in a converter's world; it signals design capability (confirmed, F-30) without a single photograph; it is original artwork, not stock; and it asks nothing of the client.

Motion: lines draw over about 900 ms, callouts fade, the title block fills, total ≈1.2 s, once. Reduced motion and no-JS: static SVG.

### Hero B (when approved photography exists, D-02)
Photograph on the right (≈45%), bleeding to the viewport edge, with the Polymers-style gradient join into ink; the dieline becomes a small inset above the title block. Switch when at least one approved wide production photograph of active machinery (≥1920×1080) is available.

### Composition and hierarchy
Headline Light 300, supporting text in `--on-dark-body`, CTAs, then the title block. One primary action only. Left edge of copy aligns to the grid; the drawing sits on a 12-column span with generous ink around it.

---

## 10. Photography direction (summary; shot list in Content §6)

- **Authentic and plain.** True colour, no filters, no heavy grading; slight warmth on highlights so kraft reads naturally.
- **Subjects that carry proof:** the plant in operation, kraft reels and board stacks, die-cutting and stitching, printing, the test lab, the design table with a dieline on screen and a sample on the cutting table, finished pallets, the loading dock.
- **The cheap, powerful shot:** flute-edge macros of cleanly cut samples, side by side by ply. Doable on a phone in an hour.
- **People:** at least 30% of plant frames show operators or inspectors at work, in PPE. No handshakes, no posed rows.
- **Confidentiality:** no customer names, logos or product details visible on boxes unless cleared.
- **Crops:** 16:9 wide, 4:3 mid, 4:5 detail; each with a safe area for text overlay avoided (text sits beside photographs, not on them).
- **Stock:** none at launch. Missing photographs mean the section is omitted, not filled.

---

## 11. Motion guidelines

**Budget:** three orchestrated moments plus interaction feedback.

1. Hero draw (≈1.2 s, once).
2. Crease-mark draw on section entry (250 ms, once): the family heartbeat.
3. Process-step reveal (a single short stagger, once).

Everything else is interaction feedback: hover, focus, menu open and close, accordion, form states. **No fade-up on every block** (D-07): the shared `MOTION_SYSTEM` final test ("would the page still work without it?") is applied section by section, and reveal survives only where it aids reading order.

**Specifications (shared):** easing `cubic-bezier(0.22, 1, 0.36, 1)`; fast 150–250 ms, medium 300–500 ms, slow ≤900 ms; animate only opacity and transform; scroll triggers fire once; no parallax, loops, count-ups or scroll hijack; reduced motion removes translation and scale and keeps opacity at 300 ms or less.

---

## 12. Responsive behaviour

Breakpoints are shared: mobile 0–767, tablet 768–1023, desktop 1024+, large 1440+. Mobile first; verified at 360, 390, 768, 1024, 1440.

| Component | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero | Copy 55% / plate right | Plate below copy | Stacked; H1 40/46; plate 4:3; title block 2×2; CTAs full width |
| Family index | Four-part rows | Two-part rows | Stacked rows; drawing above text |
| Process | Six steps in a line | 3 + 3 | Vertical timeline |
| Industries | 2×2 hairline grid | 2×2 | 2×2 with reduced padding |
| Manufacturing split | 50/50 | Stacked | Stacked; photograph 280 px; divider horizontal dashed |
| Capability matrix | Full table | Full table | Table scrolls inside its own container |
| Title block | 2–4 columns | 2–4 columns | 2 columns |
| Quote form | Form 7/12 + sidebar 5/12 | Sidebar below | Single column; optional specs collapsible |
| Header | Links, WhatsApp, quote button | Hamburger | Logo, WhatsApp, hamburger |
| Footer | 4 columns | 2×2 | Accordion; contact open |

Touch targets ≥44×44 px. No horizontal page scroll at 360 px.

---

## 13. Navigation and footer approach

- **Header:** logo lockup with "An Atharva Group company" in 11 px muted text; links at 15 px Medium; underline draws in 200 ms on hover; active link in the accent with a persistent underline; Products dropdown as a white panel with a hairline border listing five families with their small drawings; keyboard operable.
- **Mobile overlay:** ink surface with texture; links 24 px; actions at the bottom.
- **Footer:** flat ink; four columns; Group panel above the legal row; contact column always open on mobile; GSTIN and CIN line only after verification.

---

## 14. Accessibility specifics (target: WCAG 2.2 AA)

- Contrast per §5.3; text on dark limited to `#94A3B8` and lighter.
- **Form controls:** borders `#64748B` (4.76:1). The Polymers spec's `slate-300` bottom border is 1.48:1 and would not identify the control. Labels visible above fields; errors by text and icon, not colour alone.
- Focus ring 2 px accent with 2 px offset on light; white ring on ink; never removed.
- Target size ≥44 px for primary controls.
- Reduced motion honoured; hero static fallback.
- Tables use real header cells and scope; the capability matrix and comparison table are navigable by keyboard and screen reader.
- Drawings carry text descriptions; decorative marks are `aria-hidden`.
- Floating WhatsApp control has an accessible name, sits late in tab order, never covers a submit button.
- `lang="en-IN"`; skip link; one H1 per page; certificate PDFs tagged or accompanied by text.

**Backport suggestions for Polymers (outside this scope):** white-on-`#25D366`, `slate-500` on `slate-900` for 11 px labels, and `slate-300` input borders each fail the checks above.

---

## 15. The family contract

| Identical across Atharva sites | Free to differ |
|---|---|
| Type system and scale | Accent colour |
| Grid, spacing, breakpoints | Graphic device (measurement mark, crease mark, …) |
| Token structure and component API | Hero concept |
| Motion principles, easing, "once" rule | Photography subjects |
| Accessibility and performance targets | Section structure and copy |
| WhatsApp and footer Group panel | Product and capability presentation |
| Claims discipline, no cross-contamination | Illustration language |

Test: remove the logo. Same family? Still distinguishable?

---

## 16. Open design decisions

| ID | Decision | Default | Needs |
|---|---|---|---|
| D-01 | Accent and brand colours | Group blue as placeholder; replaced by §5.5 | Logo, brand guideline (Q-06) |
| D-02 | Hero A or B | A for launch; B on the photography trigger | Photographs (Q-07) |
| D-03 | Illustration set scope and review | Approve §7.4 | Client QA reviewer |
| D-04 | Navbar behaviour | As-built Polymers behaviour | Confirmation of as-built (Audit P-03) |
| D-05 | WhatsApp control colours | Green fill, ink glyph and text | Brand-fidelity sign-off |
| D-06 | Eyebrow policy | Section-level only | Approval |
| D-07 | Motion budget | Selective reveals | Approval |
| D-08 | Drop Inter 200 from the font load | Drop | Approval |
| D-09 | Group lockup treatment | Micro-label beside logo | Group mark, naming (Q-26) |
| D-10 | Footer legal line | GSTIN and CIN after checks | Certificates (Q-10) |

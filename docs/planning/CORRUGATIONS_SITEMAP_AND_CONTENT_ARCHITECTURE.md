# CORRUGATIONS_SITEMAP_AND_CONTENT_ARCHITECTURE.md
**Atharva Corrugations Pvt. Ltd. — Website Planning · Document 3 of 7**
Version 1.0 · 12 October 2026 · Status: for owner review
Depends on: Audit (F-, C-, E-, Q- IDs), Strategy (SD- decisions). Component and graphic names (FamilyPlate, TitleBlock, Crease Mark, dieline plate) are defined in `CORRUGATIONS_DESIGN_DIRECTION.md` §7–§8.

---

## 1. Principles and admission rules

1. **Pages earn their place.** A page launches only if it meets the **minimum content bar (MCB, SD-01)**: ≥1 verified format, ≥2 verified applications, ≥4 verified spec fields, ≥2 real photographs or our own technical drawings. A page that fails is a section of its parent until it passes.
2. **Graceful degradation.** Every gated element (a spec field, certificate, photograph, milestone) renders **nothing** when its claim is not confirmed, never a placeholder. Layouts must hold with 1, 2, 3 or 4 items in any gated group.
3. **Source of truth.** Each fact lives once (Technical §4.3); pages read from it.
4. **Two CTAs at most per section**, one primary (Polymers `COMPONENT_LIBRARY` rule, kept).
5. **Verify-before-publish.** Nothing marked VERIFY or RESTRICTED in the Audit appears in production without its evidence (Audit §6).
6. **No Polymers content.** No number, phrase, keyword or customer from the Polymers site or from marketplace listings is reused (Audit C-15, Technical §13).

---

## 2. Sitemap

```
/                                   Home
/products                           Products hub
  /products/corrugated-boxes
  /products/die-cut-boxes
  /products/heavy-duty-and-export-packaging
  /products/sheets-pads-and-inserts
  /products/protective-and-allied-packaging
/industries                         Industries (single page, anchored sections)
/custom-packaging                   Design and engineering support
/manufacturing-and-quality          Plant, capability matrix, quality, certificates
/about                              Company, Atharva Group, founders
/contact                            Contact, general enquiry, careers block
/request-quote                      Structured quotation request
/privacy-policy                     Required before any form goes live
/404, /sitemap.xml, /robots.txt
```

| Page | Launch status | Condition |
|---|---|---|
| Home, Products hub, Industries, Custom Packaging, Manufacturing & Quality, About, Contact, Request a Quote | **Launch-critical** | Content gated per section |
| Privacy Policy | **Launch-critical** | Client policy (Q-09), or a draft for the client's counsel; forms stay offline without it |
| Family pages (5) | **Launch-conditional** | Each must pass the MCB (§6.3 table); failures fold into the hub |
| Careers (standalone) | Later | Openings exist; until then a block on Contact |
| Packaging specification guide | Later | Needs client technical review (SD-10) |
| Case studies, gallery, standalone protective-product pages, group-companies page | Later | See §8 triggers |

---

## 3. Navigation and Group presence

**Primary navigation (desktop):** Products · Industries · Custom Packaging · Manufacturing & Quality · About · Contact. Right zone: WhatsApp control, **Request a quote** button. Home is the logo link.

- **Products** opens a simple dropdown listing the five families plus "All products". It must open on keyboard (Enter/Space on the trigger, Escape closes, focus returns). Do not repeat the Polymers gap where the trigger navigates without opening the panel for keyboard users (S3).
- **Group presence (SD-05):** an "An Atharva Group company" line adjacent to the logo in the header; a Group panel in the footer with the Group office (F-08). No sister-company list until Q-26 is answered.
- **Header surface:** follows the confirmed as-built Polymers behaviour (permanently white, or transparent-to-white). Open item Design D-04; the hero design works with either.
- **Mobile:** logo, WhatsApp control, hamburger. Overlay lists the six links; bottom actions: Request a quote, Chat on WhatsApp. Body scroll locked while open; close on link tap.
- **Footer (four columns, accordion on mobile with the contact column always open):**
  - Column 1: logo, plant address, hours, Group office.
  - Column 2: Products (five families).
  - Column 3: Company links (Industries, Custom Packaging, Manufacturing & Quality, About, Contact).
  - Column 4: Contact (main and sales phones, `sales@`, general address, WhatsApp link), careers line.
  - Bottom: GSTIN and CIN (after verification), Privacy Policy, copyright. Flat dark, no texture (Audit P-04).
- **Floating WhatsApp control** on every page: bottom right, safe-area aware, pre-filled message names the page and carries a source token (§7.6). On `/request-quote` it must never cover the submit button.

---

## 4. URLs, internal linking, search mapping

### 4.1 URL rules
Lower-case, hyphenated, descriptive, no location stuffing, no dates. Trailing slashes off. Canonical on every page.

### 4.2 Titles, descriptions and keyword intent

Keywords are **[Proposal; search volumes unvalidated]**, drawn from S1 §12 plus additions. Titles ≤60 characters, descriptions ≤155. Descriptions use only confirmed or gated-in facts.

| Page | Title | Meta description | Primary intent | Secondary |
|---|---|---|---|---|
| `/` | Corrugated Box Manufacturer in Pune \| Atharva Corrugations | Corrugated boxes, die-cut and heavy-duty packaging made at our Ranjangaon MIDC plant, Pune, with in-house design support. Request a quote. | corrugated box manufacturer Pune | corrugated boxes Ranjangaon MIDC |
| `/products` | Corrugated Packaging Products \| Atharva Corrugations | RSC and die-cut boxes, heavy-duty packs, sheets, pads, inserts, rolls and protective packaging from Ranjangaon MIDC, Pune. Request a quote. | corrugated packaging products | |
| `/products/corrugated-boxes` | RSC Corrugated Boxes, 3 & 5 Ply \| Atharva Corrugations | Regular slotted and full-overlap corrugated boxes in 3 and 5 ply, made to your size at our Pune plant. Send dimensions for a quote. | 5 ply corrugated box manufacturer Pune | RSC box, 3 ply corrugated box |
| `/products/die-cut-boxes` | Die-Cut Corrugated Boxes Manufacturer \| Atharva | Flatbed and rotary die-cut corrugated boxes for engineering goods, sanitary ware and e-commerce, made at our Ranjangaon plant. | die cut corrugated boxes | custom shape corrugated box |
| `/products/heavy-duty-and-export-packaging` | Heavy-Duty Corrugated Boxes, Pune \| Atharva Corrugations | Heavy-duty corrugated boxes and export-type packs for automotive and engineering parts. Moisture-resistant options. Request a quote. | heavy duty corrugated boxes | export packaging boxes (product type only) |
| `/products/sheets-pads-and-inserts` | Corrugated Sheets, Pads, Partitions, Rolls \| Atharva | Corrugated sheets, layer pads, partitions, inserts, dividers and rolls made at Ranjangaon MIDC, Pune. | corrugated sheets and rolls Pune | layer pads, partitions |
| `/products/protective-and-allied-packaging` | Paper Cores, Angle Corners, Honeycomb \| Atharva Corrugations | Paper core assemblies, angle corners, honeycomb and pulp trays for protecting heavy and fragile products. Request a quote. | paper core manufacturer; angle board and edge protector manufacturer | honeycomb packaging |
| `/industries` | Corrugated Packaging by Industry \| Atharva Corrugations | Corrugated packaging for white goods, engineering goods, FMCG and pharma, from our Ranjangaon MIDC plant. | corrugated packaging for [industry] | |
| `/custom-packaging` | Custom Corrugated Packaging Design \| Atharva Corrugations | Send a drawing, CAD file or sample. We design the dieline, make a sample and tool it for production at our Pune plant. | custom corrugated boxes Pune | dieline design, packaging prototype |
| `/manufacturing-and-quality` | Manufacturing & Quality \| Atharva Corrugations, Pune | One plant at Ranjangaon MIDC: converting processes, quality checks and certificates, with what is made in-house and what is not. | corrugated box manufacturing process | |
| `/about` | About Atharva Corrugations \| Part of Atharva Group | Operating since 2014 from Ranjangaon MIDC, Pune. Part of the Atharva Group. | — | |
| `/contact` | Contact Atharva Corrugations \| Ranjangaon MIDC, Pune | Phone, WhatsApp, email and plant address. Monday to Saturday, 9 am to 6 pm. | — | |
| `/request-quote` | Request a Quote \| Atharva Corrugations | Tell us what you pack, the size and quantity. We reply within 2 working days. | — | |

Rich-result schema stays minimal (Technical §6). Never review or rating markup.

### 4.3 Internal linking (hub and spoke)

- Home → hub, every family, Custom Packaging, Manufacturing & Quality, Request a Quote.
- Family ↔ related families; every family → Custom Packaging (design support) and → Request a Quote with `?family=` prefill.
- Industries sections → their relevant families.
- Manufacturing & Quality → Custom Packaging; About → Contact; all pages → Request a Quote and WhatsApp.
- Breadcrumbs on every inner page (visible and in schema).

---

## 5. Shared patterns used across page plans

| Pattern | Used for | Behaviour |
|---|---|---|
| **Section header** | Every major section | Eyebrow names the taxonomy (Products, Industries…) with the Crease Mark; H2 sentence-case; optional one-line description. Not on every sub-block |
| **FamilyPlate / index row** | Families | Drawing thumbnail, name, formats, board, applications, link |
| **TitleBlock** | Spec summaries, hero strip | Key–value grid with hairline rules, tabular numerals; renders only confirmed fields |
| **Process steps** | Custom Packaging, Home | Numbered because the sequence is real |
| **Capability matrix** | Manufacturing & Quality | Two columns: made at our plant / arranged with partners |
| **Certificate card** | Trust | Crisp rectangle, verified items only |
| **Quote band** | Page closers | Headline, two CTAs, phone, hours, reply time |
| **Gated block** | Anything unverified | Renders nothing if its claim is not confirmed |

---

## 6. Page plans

Each page opens with its brief (objective, audience, search intent, message, CTAs, links, assets, gaps, status), then its sections. Sections state: objective · content and message · layout and hierarchy · imagery · interaction · responsive · CTA · SEO and accessibility.

### 6.1 Home — `/`

**Brief**
- **Objective:** let a buyer confirm fit and credibility in under a minute and start a quote.
- **Audience:** all five buyer types (Strategy §3).
- **Search intent:** "corrugated box manufacturer Pune"; brand queries.
- **Primary message:** H-A (Strategy §4.4): corrugated packaging made to your specification, designed with you, from the Ranjangaon MIDC plant.
- **Main CTA:** Request a quote. **Supporting CTA:** Chat on WhatsApp.
- **Internal links:** hub, five families, Industries, Custom Packaging, Manufacturing & Quality, About, Contact.
- **Assets:** logo; dieline plate (ours); plant photographs (client) for Hero B, Manufacturing, Specialised.
- **Missing:** logo, photographs, board and test verification, certificate, machinery list.
- **Status:** launch-critical. **Reduced homepage** (if the trust-floor test fails, Strategy §6): drop H6 and H7; H5 uses confirmed items only.

**Section rhythm (checked against the dark/light rules):** Hero dark → H2 white → H3 slate-50 → H4 white → H5 dark → H6 white → H7 slate-50 → H8 white → H9 dark → footer dark. Never more than three light or two dark in a row.

**H1 · Hero**
- *Objective:* what, where, for whom, how to act, in one screen.
- *Content:* eyebrow "Corrugated packaging" with Crease Mark; H1 per SD-03; one supporting sentence; primary **Request a quote**, secondary **Chat on WhatsApp** (outlined, not green); capability strip (TitleBlock) with up to four cells chosen from: Operating since 2014 · One plant, Ranjangaon MIDC, Pune · Part of Atharva Group (always available) and 3–9 ply board · GSM 120–440 · ISO 9001:2015 (each only when verified). The strip never shows fewer than three cells.
- *Layout/hierarchy:* two columns, copy left (about 55%), dieline plate right. Headline Inter Light; supporting text in a muted tone; CTAs; strip at the base.
- *Imagery:* **Hero A (default):** original dieline drawing of a regular slotted container on ink: solid cut lines, dashed crease lines, dimension callouts, the TitleBlock embedded as the drawing's title block. **Hero B (when approved plant photography exists):** photograph on the right bleeding to the edge, dieline as a small inset. Design D-02.
- *Interaction:* one orchestrated load sequence of about 1.2 seconds (lines draw, callouts fade, strip fills), once, then still. Reduced motion: static.
- *Responsive:* stacked; plate below copy, 4:3; strip becomes a 2×2 grid.
- *CTA:* Request a quote → `/request-quote`; WhatsApp → pre-filled link (§7.6).
- *SEO/a11y:* single H1; the drawing is `role="img"` with a text description; contrast per Design §5; no autoplay beyond the sequence.

**H2 · Packaging families**
- *Objective:* answer "do you make my kind of box?"
- *Content:* eyebrow "Products"; H2 "What we make"; five index rows: Corrugated boxes · Die-cut boxes · Heavy-duty and export packaging · Sheets, pads and inserts · Protective and allied packaging. Each row: line drawing, one-line description, formats, ply or board (gated), "View" link.
- *Layout:* a specification index, not a card grid: hairline rows, drawing at left, text centre, formats and board at right.
- *Imagery:* our line drawings per family (Design §7.4).
- *Interaction:* row hover shifts background and arrow by 2 px; no card lifting.
- *Responsive:* rows stack; drawing above text; hairlines preserved.
- *CTA:* each row → family page (or the hub anchor if the page is folded). One section-level link "All products".
- *SEO/a11y:* H2 then H3 per family; each row one link with a descriptive name; no repeated "Learn more".

**H3 · From specification to delivery**
- *Objective:* turn the confirmed design-support offer into a visible process.
- *Content:* six steps: Brief (drawing, dieline, CAD file, sample, spec sheet or a conversation) → Structural design (dieline and CAD) → Sample and 3D mock-up → Testing support → Tooling (dies and printing plates) → Production and supply. Below: "What you can send us" as a plain list.
- *Layout:* numbered horizontal sequence joined by a hairline, content below each; 3 + 3 on tablet.
- *Imagery:* small line icons or dieline fragments; no photographs required.
- *Interaction:* none required. A one-time stagger is optional and subject to the motion test (Design §11).
- *Responsive:* vertical timeline on mobile.
- *CTA:* "How custom packaging works" → `/custom-packaging`; WhatsApp "Send us your drawing" (pre-filled).
- *SEO/a11y:* ordered list semantics; steps are text, not images.

**H4 · Industries**
- *Objective:* confirm relevance quickly.
- *Content:* four industries confirmed by the client: white goods, engineering goods, FMCG, pharma and healthcare, each with one factual line drawn only from F-27 (for example, regular slotted boxes in 3 and 5 ply for white goods and FMCG; die-cut and heavy-duty packs for engineering goods). Pharma carries a minimal line until Q-25 is answered. A single line "Also serving: automotive and auto components · food and beverage · e-commerce and retail · electrical and electronics · agriculture and produce · textiles · chemicals".
- *Layout:* four equal cells divided by hairlines (precision grid, the family language), no cards.
- *Imagery:* line icons; no stock.
- *Interaction:* hover fills the cell white; arrow shifts 2 px.
- *Responsive:* 2×2 on mobile.
- *CTA:* each cell → `/industries#anchor`; "All industries".
- *SEO/a11y:* each cell one link; avoid compliance wording for pharma and food.
- *Note:* "Export packaging" appears in the client's industry list but is treated as a product type and is not listed here (C-01).

**H5 · Manufacturing and quality**
- *Objective:* prove capability with evidence, not adjectives.
- *Content:* eyebrow "Manufacturing & quality"; H2 (for example, "One plant. Design, board and conversion at Ranjangaon MIDC", with "board" only if confirmed; fallback "One plant. Design and conversion at Ranjangaon MIDC"). TitleBlock: board range, GSM, reel width (gated). Named test practices (bursting strength, box compression, edge crush, moisture, dimensional checks; gated). ISO 9001:2015 certificate card (gated). "Customers audit and approve our plant" (confirmed).
- *Layout:* full-bleed split, dark left, right half photograph. Divider is a dashed vertical crease line (the Crease Mark at architectural scale).
- *Imagery:* real production photograph. **Fallback with no photograph:** the right half holds the capability matrix (in-house versus partners) on a dark surface.
- *Interaction:* the dashed divider draws once.
- *Responsive:* stacked; photograph or matrix below, 280 px tall for photographs.
- *CTA:* "See the plant and process" → `/manufacturing-and-quality`.
- *SEO/a11y:* photograph alt text describes what is visible; the matrix is a real `<table>`.

**H6 · Specialised and protective packaging (gated)**
- *Objective:* make "not a conventional packaging manufacturer" provable.
- *Content:* up to four items, each with photograph and one-line specification: paper core assemblies for compressor packaging; angle corners; honeycomb; paper pulp trays. In-house tape only if verified.
- *Layout:* one larger feature plus smaller items.
- *Gate:* ≥2 items with photograph and verified specification, otherwise the section is omitted.
- *CTA:* → `/products/protective-and-allied-packaging`.

**H7 · Trust and recognition (gated)**
- *Content:* certificate cards, EcoVadis rating with year, the Haier recognition with permission, customer logos with permission. If only the ISO card exists, show it alone.
- *Layout:* crisp-rectangle cards, no radius, on slate-50.
- *Gate:* any item without evidence is not rendered; the whole section is omitted if none remain.

**H8 · Company and Atharva Group**
- *Objective:* identify who is behind the plant, with the Group visible (client request).
- *Content:* three sentences: operating since 2014; one plant at Ranjangaon MIDC; part of the Atharva Group. Plant address, Group office, "Open in Maps" link (no embedded map on the homepage).
- *CTA:* "About us" → `/about`.

**H9 · Quote band**
- *Content:* H2 "Send us your packaging requirement." Supporting: "What you pack, a size and a quantity are enough to start. We reply within 2 working days, Monday to Saturday." Primary **Request a quote**; **Chat on WhatsApp** in WhatsApp green with ink text (the only content-section use of the green, per the family rule); phone line.
- *Layout:* centred, 640 px column, dark with texture.

**Footer and global:** §3.

### 6.2 Products hub — `/products`

**Brief:** objective: let buyers pick a family and compare. Audience: engineers, procurement. Intent: "corrugated packaging products". Message: formats and board options by family. Main CTA: Request a quote. Supporting: WhatsApp. Links: families, Custom Packaging. Assets: family drawings. Missing: spec confirmation, applications for sheets and pads (S1 gives none). Status: launch-critical.

| Section | Plan |
|---|---|
| **P1 Header** | H1 "Corrugated packaging products"; two-line introduction; breadcrumb |
| **P2 Family index** | Same index rows as H2, expanded with formats and applications; folded families appear here as sections with anchors |
| **P3 Comparison table** | Rows: families. Columns: typical use, formats, board options, customisation. Confirmed fields only; empty cells are not shown, so the table narrows rather than showing dashes. Real `<table>` with scope attributes; horizontal scroll inside its own container on mobile |
| **P4 "Not sure which fits?"** | Short block: "Tell us what you are packing and its weight." CTA to `/request-quote?family=help` (the form's "Not sure, help me choose") |
| **P5 Also made at our plant** | Accessories (tape, polybags, pallets) only with a verified `made-at-plant` flag; otherwise omitted (C-07) |
| **P6 Quote band** | As H9 |

### 6.3 Product family template — `/products/[family]`

**Brief (template)**
- **Objective:** let a buyer confirm that this family fits their product, understand board and construction options, and send a prefilled quote request.
- **Audience:** engineers and procurement.
- **Intent:** the family's primary keyword (§4.2).
- **Main CTA:** Request a quote (prefilled family). **Supporting:** WhatsApp (product-aware message).
- **Links:** related families, Custom Packaging, relevant industries.
- **Assets:** family drawings (ours), client photographs, spec sheet.
- **Missing:** specs per family (Q-18, Q-19, Q-20), photographs, applications for sheets and pads.

| Section | Plan |
|---|---|
| **F1 Header** | Breadcrumb; H1 family name; one-sentence description; applications as plain text; Request a quote and WhatsApp |
| **F2 Formats** | One block per format with a line drawing (dimension callouts on the box styles), a two-line description, and where known a TitleBlock |
| **F3 Construction and board** | TitleBlock plus a table: ply, flute, GSM, paper type, reel width; every field gated. A plain-language flute guide in a disclosure element (general guidance, reviewed per SD-10) |
| **F4 Printing and finishing** | What is made at the plant versus arranged with partners (varnish and coating are outsourced); print methods and colours (gated) |
| **F5 Applications** | The industries and products named by the client for this family, nothing added |
| **F6 What we need to quote** | Checklist: internal dimensions (mm), what you pack and its weight, quantity (several if comparing), print, delivery place, required-by date; diagram of internal dimensions |
| **F7 Photographs** | Strip of real photographs, gated; none, no strip |
| **F8 Related** | Two related families |
| **F9 Quote band** | As H9 |

**Family notes and current MCB status (from Audit F-18 to F-29)**

| Family | Formats (confirmed) | Applications (confirmed) | Spec fields | Status today |
|---|---|---|---|---|
| Corrugated boxes | RSC/HRSC (3 and 5 ply), telescopic, full-overlap | White goods, FMCG, electronics, food and beverage | Ply 3 and 5 confirmed; flute, GSM, paper, reel width pending | Passes once board data is verified; expand "HRSC" (Q-17) |
| Die-cut boxes | Flatbed and rotary die-cut | Fruits and vegetables, engineering goods, sanitary ware, e-commerce | Methods pending | Passes with printing and sizing detail |
| Heavy-duty and export | Heavy-duty boxes, export-type boxes (product type) | Automotive, engineering parts, export (as product type) | 7 and 9 ply, moisture and waterproof treatment pending | Needs board detail; no export claims |
| Sheets, pads and inserts | Sheets, layer pads, partitions, inserts, dividers, rolls | **None supplied** | Pending | **Fails MCB; folds into the hub** until Q-25 supplies applications |
| Protective and allied | Paper core assemblies, angle corners, honeycomb, pulp trays | Centrifugal compressor packaging (paper cores) | Pending | Launch only items that pass; tape, polybags, pallets only if `made-at-plant` is verified |

### 6.4 Industries — `/industries`

**Brief:** objective: confirm relevance by sector. Audience: procurement, engineers. Intent: "corrugated packaging for [industry]". Message: what each sector packs and which families serve it. CTA: Request a quote. Links: families. Assets: line icons, application photographs (later). Missing: pharma and food specifics (Q-25), application examples (Q-32). Status: launch-critical.

| Section | Plan |
|---|---|
| **I1 Header** | H1 "Corrugated packaging by industry" |
| **I2 Four sector sections** | Anchors `#white-goods`, `#engineering-goods`, `#fmcg`, `#pharma-healthcare`. Each: *what is packed* (client-confirmed mapping only), *packaging considerations* (general guidance, labelled and reviewed per SD-10, no Atharva-specific outcome implied), *families used* (links), *proof* (gated: recognition, case study), CTA. Alternate layout only if it aids reading; consistent otherwise |
| **I3 Also serving** | The remaining industries as plain text (Home H4 list) |
| **I4 Quote band** | As H9 |

No compliance wording for food or pharma. Automotive appears in the heavy-duty section and in I3 (C-11).

### 6.5 Custom Packaging — `/custom-packaging`

**Brief:** objective: show the confirmed design-support offer as a dependable path from product to production. Audience: engineers, NPD. Intent: "custom corrugated boxes Pune", "dieline design". Message: send what you have, we design, sample, test and tool. CTA: Request a quote (type: custom) and WhatsApp "Send us your drawing". Links: die-cut, heavy-duty, Manufacturing & Quality. Assets: dieline drawings, sample photographs. Missing: tooling policy (Q-23), sample turnaround (not displayed), CAD tools, test details (Q-21, Q-22). Status: launch-critical.

| Section | Plan |
|---|---|
| **C1 Header** | H1 "Custom corrugated packaging"; one sentence naming the confirmed inputs |
| **C2 Process** | The six steps of H3 expanded, each with what you provide and what you receive. No durations |
| **C3 What you can send us** | Drawings or dielines, CAD files, a physical sample, a specification sheet, or a conversation, with a one-line note on each |
| **C4 What you receive** | Dieline, 3D mock-up, physical sample, test report, packaging recommendation, packaging concept for export. Each item appears only if the client confirms it is routinely supplied |
| **C5 Testing support** | The named practices (gated), described in plain language |
| **C6 Tooling** | Dies and printing plates; ownership and storage policy (gated by Q-23) |
| **C7 Questions** | Six answers: what to send, internal versus external dimensions, how a quote is priced (qualitatively), who owns tooling, whether you can start from a product alone, how to send a drawing. No lead times or MOQ |
| **C8 Quote band** | As H9 with "Send us your drawing" |

### 6.6 Manufacturing and Quality — `/manufacturing-and-quality`

**Brief:** objective: let a sceptical procurement manager verify the plant. Audience: procurement, QA. Intent: "corrugated box manufacturing process". Message: one plant, what is made here, how it is checked. CTA: Request a quote; "Request a plant visit" if Q-43 confirms. Links: Custom Packaging, certificates. Assets: plant photographs, machinery list, certificates, sample test report. Missing: nearly all evidence (Q-03, Q-04, Q-07, Q-21). Status: launch-critical; sections degrade (§1.2).

| Section | Plan |
|---|---|
| **M1 Header** | H1 "Manufacturing and quality"; location line |
| **M2 Plant overview** | TitleBlock: location (confirmed), plants (1), operating since (2014). Area, capacity, team size, machinery brands appear **only** if the client releases them (Q-12 to Q-14) |
| **M3 Capability matrix** | Rows: board making (if confirmed), printing, die cutting (flatbed, rotary), slotting, creasing, stitching, gluing and pasting, lamination, moisture-resistant and waterproof treatment, varnish and coating, allied products. Columns: made at our plant · arranged with partners. Varnish and coating are listed under partners (confirmed) |
| **M4 Process flow** | A flow built only from confirmed steps; no invented stages |
| **M5 Quality** | The named practices (incoming paper inspection, bursting strength, box compression, edge crush, moisture, dimensional, print quality, final inspection, batch traceability, in-house lab), traceability statement, "customers audit and approve our plant" |
| **M6 Certificates and ratings** | Crisp-rectangle cards: ISO 9001:2015 (certificate seen), EcoVadis with year (scorecard seen). Nothing else |
| **M7 Sustainability (collapsing)** | General, verified statements only (recyclable products, recycled paper, reduced-weight options). No percentages; no FSC or PEFC; no WRAP |
| **M8 Photographs** | Strip, gated |
| **M9 Quote band** | As H9 |

### 6.7 About — `/about`

**Brief:** objective: say who is behind the plant and show the Group. Audience: procurement, partners. Message: operating since 2014, one plant, part of the Atharva Group. CTA: Contact. Links: Contact, Manufacturing. Assets: logo lockup, Group mark. Missing: Group facts (Q-26), founders (Q-27), story (Q-28). Status: launch-critical (short).

| Section | Plan |
|---|---|
| **A1 Header** | H1 "About Atharva Corrugations" |
| **A2 Company** | Three short paragraphs from confirmed facts only |
| **A3 Atharva Group** | Prominent: statement, Group office (F-08), approved Group description; sister-company list only after Q-26 |
| **A4 Founders** | Names as approved (Q-27); no invented quotations or biographies |
| **A5 Milestones** | 2014 operations started; 2025 in-house tape; 2026 plant expansion (gated). Revenue milestones never |
| **A6 Locations** | Plant and Group office with "Open in Maps" links |
| **A7 Contact band** | Contact link and phone |

No vision, mission or values section: the client supplied none, and none will be written for them.

### 6.8 Contact — `/contact`

**Brief:** objective: give every route to a person. Audience: all. Message: how to reach us and when. CTA: Request a quote, WhatsApp. Assets: map link. Missing: routing confirmations (Q-29), careers (Q-30). Status: launch-critical.

| Section | Plan |
|---|---|
| **K1 Header** | H1 "Contact"; four routes: quote, WhatsApp, call, email |
| **K2 General enquiry + details** | Short form (name, company, email, phone, message) beside phones, emails, hours, plant address, Group office; reply expectations: WhatsApp during business hours, form and email within 2 working days |
| **K3 Map** | A link to the map (no embedded third-party map at launch: privacy and performance), with the address text |
| **K4 Careers** | HR email and phone as supplied; "no open positions listed" is never invented; a standalone page only when openings exist |

### 6.9 Request a Quote — `/request-quote`

Full specification in §7. Page layout: H1 "Request a quote"; one line stating the 2-working-day reply and the WhatsApp alternative; form (about 7/12 width); sidebar (about 5/12): "What we need", the internal-dimensions diagram, "Have a drawing? Send it on WhatsApp or reply to our confirmation email", phone and hours. On mobile the sidebar follows the form; a "What we need" disclosure sits above it.

### 6.10 Legal and system pages

| Page | Plan |
|---|---|
| **Privacy policy** | Client's policy if supplied; otherwise a draft written from the data actually collected, sent for the client's counsel. Plain-language notice at the point of collection links to it (E-08) |
| **404** | Branded, with links to Products, Request a Quote, Contact |
| **Sitemap, robots** | Generated; `noindex` on 404 and any internal preview |

---

## 7. Enquiry experience (first CTA to submitted enquiry)

### 7.1 Entry points and prefill

| From | Goes to | Prefill |
|---|---|---|
| Header, hero, quote bands | `/request-quote` | none |
| Family page | `/request-quote?family=die-cut-boxes` | packaging type |
| Format block | `…?family=…&format=rotary-die-cut` | packaging type and format |
| Custom Packaging | `…?type=custom` | enquiry type "custom" |
| "Request a sample" | `…?type=sample` | enquiry type "sample" |
| "Not sure which fits" | `…?family=help` | "Not sure, help me choose" |
| WhatsApp (anywhere) | WhatsApp with a pre-filled message | page or product and source token |

### 7.2 Form fields

Single page, three groups. Required fields are few; specifications are optional but encouraged.

| Group | Field | Type | Req. | Rules and help |
|---|---|---|---|---|
| **A. Requirement** | Enquiry type | Radio: Quote / Product enquiry / Sample request | Yes | Default Quote |
| | Packaging type | Select: the five families, "Not sure, help me choose" | Yes | Prefilled from URL |
| | What are you packing? | Text, 10–300 chars | Yes | "For example: compressor housing, about 40 kg" |
| | Product weight (kg) | Number | No | Helps choose board strength |
| | Quantity per order | Number, plus repeat: One-time / Monthly / Ongoing | Yes | "Add another quantity" (up to three) so buyers can compare price breaks |
| | Required-by date | Date | No | "The date you need it in hand" |
| **B. Specification** | Internal size L × W × H (mm) | Three numbers | No | Diagram; "I will send a drawing or sample instead" toggle |
| | Board preference | Select: Not sure, plus only verified ply options | No | |
| | Printing | None / 1 colour / 2 to 4 colours / Need advice | No | |
| | Special needs | Checkboxes: Moisture resistance, Export shipment, Stacking or pallet load, Die-cut shape, Inserts or partitions, Other | No | |
| | Delivery location | City and state | Yes | Sets expectations; no pin code required |
| **C. Contact** | Name, Company, Email, Phone | Text, text, email, tel | Yes | Phone: "This number is on WhatsApp" checkbox |
| | Designation, Industry | Text, select | No | Industry list from F-45 |
| | Notes | Textarea | No | |
| | Privacy notice | Text line with link | n/a | See Technical §7.5 |
| | Honeypot | Hidden | n/a | Must be empty |

### 7.3 Categories and routing

| Type | Recipient | Subject line | Reply time shown |
|---|---|---|---|
| Quote, product, sample | `sales@` primary, named contact in copy (Strategy SD-08, Q-29) | `RFQ [reference] · [Company] · [Family]` | 2 working days |
| General (Contact form) | General address | `Enquiry [reference] · [Company]` | 2 working days |
| Career | `hr@`, via email link not a form at launch | — | not specified |

### 7.4 Validation and abuse prevention

Client-side and server-side with the same schema. Email format; phone 10 digits with optional +91 or 0, or international with +; quantity a positive integer; dimensions positive numbers within sensible limits; message length limits. Honeypot, minimum-time check, Cloudflare Turnstile (free) if abuse appears. No HTML in free text; header injection prevented (Technical §7).

### 7.5 States

| State | Behaviour |
|---|---|
| Idle | Form visible; submit enabled |
| Field error | Inline message beside the field, plus an error summary at the top that receives focus; labels never replaced by placeholders |
| Submitting | Button shows a spinner and "Sending…"; inputs disabled; double-submit prevented |
| **Success** | Form replaced by a confirmation: reference number, a plain summary of what was sent, the 2-working-day reply, "Have a drawing? WhatsApp it with this reference", and a link to WhatsApp pre-filled with the reference |
| **Error** | Message: "We could not send your enquiry. Your details are still on this page. Try again, or WhatsApp us or call [number]." The form keeps all input; WhatsApp and phone links shown; error logged |
| Slow network | Timeout after about 15 seconds → error state |

### 7.6 Confirmation and WhatsApp handoff

- **Reference** such as `ACQ-261012-K7F2`, created server-side.
- **Auto-reply email** to the customer: reference, a copy of what was sent, the reply time, how to send drawings (reply with attachments), hours. Reply-to is the sales mailbox.
- **WhatsApp message template:** "Hello Atharva Corrugations, I would like a quote for [family or page]. Ref: [reference or source token]." The source token (for example `WEB-DIECUT`) tells sales which page produced the chat.

### 7.7 Mobile usability

`type="email"`, `type="tel"`, `inputmode="numeric"` for dimensions and quantity, correct `autocomplete` values, labels above fields, 44 px minimum touch targets, groups collapsible only for the optional specification block, the floating WhatsApp control kept clear of the submit button, no horizontal scroll at 360 px.

### 7.8 Accessibility

Visible labels; errors associated via `aria-describedby`; a polite live region announces success; focus moves to the error summary or the confirmation; required fields marked in text, not colour alone; works with keyboard only.

### 7.9 Events

`rfq_start`, `rfq_field_group_complete` (optional), `rfq_submit_success`, `rfq_submit_error`, `whatsapp_click` (location), `phone_click`, `email_click`, `product_cta_click` (family). Technical §10.

---

## 8. Pages considered and deferred or not recommended

| Page | Decision | Trigger to reconsider |
|---|---|---|
| Export markets / "global" | **Not recommended** | Client answers Q-11 with named, approved export evidence |
| Impact metrics section | **Not recommended** | At least four verified, non-sensitive numbers exist |
| Case studies | Deferred | Two approved, specific, permissioned examples |
| Gallery (standalone) | Deferred | 20+ approved photographs; client requests it |
| Sustainability (standalone) | **Not recommended** | Three evidenced commitments (FSC/PEFC chain-of-custody certificate, recycled-content basis, EcoVadis scorecard) |
| Innovation or R&D | **Not recommended** | Real R&D activity documented |
| Standalone allied-product pages (angle corners, honeycomb, paper cores, tape) | Deferred | Each passes the MCB with photographs and specification |
| Packaging specification guide | Deferred | Client technical reviewer available; produces long-tail search value and reduces back-and-forth |
| Insights or blog | **Not recommended** | A confirmed content pipeline of at least four articles |
| Standalone Careers | Deferred | Open positions exist |
| Group companies page | Deferred | Canonical list and approvals (Q-26) |
| Language versions (Hindi, Marathi) | Deferred | Client request and a review route (Q-41) |

# CORRUGATIONS_SOURCE_AUDIT.md
**Atharva Corrugations Pvt. Ltd. — Website Planning · Document 1 of 7**
Version 1.0 · 12 October 2026 · Status: for owner review (no design or code has started)

---

## 0. How to read this audit

**Purpose.** Establish what is actually known about Atharva Corrugations, how reliable each fact is, where sources disagree, and what the existing Atharva Polymers documents do and do not settle. Every later document (strategy, sitemap, design, content, technical, roadmap) builds on this one.

**Source IDs**

| ID | Source |
|---|---|
| S1 | `ATHARVA_CORRUGATIONS_INFO.md` v1, 12 Oct 2026 (client Form B dated 9 Oct 2026 + follow-up answers). The brief calls it "Atharva corrugations info · MD". Primary source for company facts. |
| S2 | Atharva Polymers project documents uploaded to this Project (inventory in §1). Source of shared design/engineering standards only. |
| S3 | Other Atharva Polymers project material that is **not** among the uploaded files (as-built decisions). Treated as unverified until uploaded. |
| E-xx | External web observations made on 12 Oct 2026 (§5). Never publishable on their own. |

**Status labels** (the brief's classification, applied to every fact)

| Label | Meaning | Publication rule |
|---|---|---|
| CONFIRMED | Stated by the client in S1 | May be used |
| VERIFY | Stated by the client; the supporting document/file has not arrived | Build with it; remove at deployment unless evidence arrives |
| EXTERNAL | Found outside client material | Use only to sharpen questions; never publish without client confirmation |
| MISSING | Needed, not provided | Placeholder in build; question in the Content document |
| CONFLICT | Sources disagree | Working resolution stated; client must settle |
| RESTRICTED | Confidential, financial, or not approved for public use (S1 "[HOLD]" where permission was withheld or unanswered) | Never published |

---

## 1. Documents inspected

### 1.1 Inventory and role

| Document(s) | Role in this project | Currency |
|---|---|---|
| `ATHARVA_CORRUGATIONS_INFO.md` | Corrugations facts (S1) | Current (v1) |
| `IMPLEMENTATION_MASTER_PLAN.md` v2.0, `IMPLEMENTATION_MASTER_PLAN_APPENDIX.md` (§6B, §16–23) | Polymers system rules, build spec, QA, workflow. Declares itself the single planning document that supersedes earlier ones | Authoritative for system rules |
| `01 Foundation System`, `02 Navbar`, `03 Hero`, `04 Company Introduction`, `05 Why Atharva`, `06 Impact Metrics` | Per-section build specs (format to emulate in the Corrugations build specs) | Authoritative per section, subject to P-03 |
| `HOMEPAGE_MASTER_BRIEF.md`, `dev_progress.md` | Homepage digest; build log | Brief current; log stale (P-11) |
| `VISUAL_DIRECTION` v1.0, `DESIGN_SPECIMEN` v1.0, `DESIGN_SYSTEM.md`, `MOTION_SYSTEM` v2.0, `COMPONENT_LIBRARY` v2.0, `CONTENT_STRATEGY` v2.0, `PROJECT_CONTEXT` v2.0 | Creative foundations and principles | Current, with the contradictions listed in §2 |
| `CLAUDE_PROJECT_INSTRUCTIONS`, `DEVELOPMENT_ROADMAP`, `UI_AUDIT`, `CLIENT_DISCOVERY_REPORT.md`, `_CLIENT_INSIGHTS.md`, `CLIENT_REALITY.md` | Early planning and client discovery for Polymers | Partly superseded (P-02, P-09) |

### 1.2 Hygiene findings

- **Eight zero-byte `.md` shells** sit beside the real files: `CLAUDE_PROJECT_INSTRUCTIONS.md`, `CLIENT_INSIGHTS.md`, `COMPONENT_LIBRARY.md`, `CONTENT_STRATEGY.md`, `DEVELOPMENT_ROADMAP.md`, `MOTION_SYSTEM.md`, `PROJECT_CONTEXT.md`, `UI_AUDIT.md`. The content lives in the extension-less copies of the same names. Any tool or collaborator that opens the `.md` name gets an empty file. **Recommendation:** delete the shells or replace them with the content.
- **Currency gap (S3).** The uploaded Polymers set describes the build at roughly "Session 2". Other project material records later decisions that the uploaded files do not contain: the homepage reported complete and approved; a navbar that is permanently white (matched to the logo) with a mega menu configured in `src/lib/navigation.ts`; and an About page blueprint (`ABOUT_PAGE_BLUEPRINT.md`). These affect the shared shell the Corrugations site would inherit. **Dependency:** upload the as-built versions (or the repo) before shared tokens and navigation are frozen (Roadmap gate G1).
- **Not inspected:** the Polymers code repository. Nothing in this plan states a Polymers dependency version as fact.

---

## 2. Which Polymers direction is current

Resolution rule used: (1) an explicit **LOCKED** decision in `IMPLEMENTATION_MASTER_PLAN` §2 wins; (2) otherwise the later or more specific document wins; (3) as-built decisions (S3) override documents once confirmed; (4) where evidence is insufficient the conflict is flagged, not resolved.

| ID | Topic | What the documents say | Current direction used here | Relevance to Corrugations |
|---|---|---|---|---|
| P-01 | Authority | Master Plan v2.0 claims to supersede all prior documents; section files and Homepage Brief came alongside | Master Plan + Appendix for system rules; section files for section behaviour where they agree | Format and rules reused |
| P-02 | Reference sites | Early docs cite BASF, Dow, LTIMindtree, Fortune-500 sites and Apple/Stripe/Linear motion. `VISUAL_DIRECTION`, `MOTION_SYSTEM`, Master Plan §15 reject tech/SaaS references and name Covestro, Arkema, LANXESS, Schunk, Plansee | Later set | Principle kept (honest scale, precision); the named sites were chosen for chemicals/polymers and are **not** the Corrugations peer set |
| P-03 | Navbar behaviour | `02 Navbar`, Master Plan §5: transparent over hero, solid white after 80 px scroll. S3: as-built navbar is permanently white with a mega menu | As-built (S3), **pending confirmation** | Decides whether the Corrugations hero can sit under a transparent bar (Design D-04) |
| P-04 | Footer texture | Master Plan §2.4/§5 and `01 Foundation`: no noise on footer. Master Plan §14 checklist and `DESIGN_SPECIMEN` Part Four: footer gets noise. `DESIGN_SPECIMEN` Parts Two/Six: no noise | LOCKED §2.4 wins: **no footer noise** | Do not copy the checklist line |
| P-05 | Industries grid on mobile | Master Plan §5.7 code: `grid-cols-1 sm:grid-cols-2`. §16 and Homepage Brief: 2×2 kept on mobile | §16 + Brief | Not reused (Corrugations industries layout differs) |
| P-06 | Hero split | 55/45 (Brief), 58/42 (Specimen), `w-[58%]` + `w-[45%]` (Plan) | Specimen: content column fixed, photo adapts | Reused as a principle only |
| P-07 | Metric labels | "4 Markets" vs "4+ Countries"; "19 Years" vs "19+ Years" | Master Plan forms | Lesson: one source of truth per number (Technical plan §4.3) |
| P-08 | Homepage section list | Five different lists (10, 10, 10, 13, 10 sections) across Instructions, Roadmap, Specimen, Plan, Brief | `dev_progress.md` ten-section list is the build list; Plan's 13 is the extended list | Corrugations gets its own list (Sitemap §6.1) |
| P-09 | Effort estimate | Roadmap: 3–5 weeks solo focused. Plan: 10–14 weeks focused, while its own day-by-day sequence sums to ~38 working days | Plan, treated as a range | Roadmap uses ranges, labelled estimates |
| P-10 | Primary nav items | `COMPONENT_LIBRARY` six items incl. Home; Plan five without Home; `02 Navbar` six incl. Home | Plan (Home via logo) | Corrugations nav decided independently |
| P-11 | `dev_progress.md` | Header says Hero done and 9 remaining; table marks Hero, Intro, Why Atharva complete; handoff says build Company Intro next | Treat as stale | A Corrugations progress log is created at build start (Roadmap §3) |
| P-12 | Contrast claims | Master Plan §12 lists verified ratios but omits two failing pairs: **white on #25D366 = 1.98:1** (WhatsApp buttons) and **slate-500 on slate-900 = 3.75:1** (11 px hero trust labels). Stated ratios also differ slightly from computed (slate-500/white 4.76 not 4.6; white/blue-600 5.17 not 4.6; slate-400/slate-900 6.96 not 5.9) | Computed values (Design §5) | Corrugations avoids both pairs; backport suggested for Polymers |
| P-13 | Framework version | "Next.js 14+" with no pin | See E-09: 14 is out of support; 15 ends support 21 Oct 2026; 16 is current | Technical plan §2 |
| P-14 | Category description | Uploaded docs call Polymers a "polymer manufacturing" company (PP-compound keywords). Other project material describes precision injection-moulded components | Unresolved | Another reason **no Polymers business content, keyword or number is reused** |

---

## 3. Fact matrix — Atharva Corrugations

Columns: field · available information · source · status · website implication. "Q-xx" refers to the client question list in `CORRUGATIONS_CONTENT_AND_ASSET_REQUIREMENTS.md`.

### A. Identity and group

| ID | Field | Available information | Source | Status | Website implication |
|---|---|---|---|---|---|
| F-01 | Legal name | "Atharva Corrugations Pvt. Ltd." (form: "Pvt Ltd."); registry: ATHARVA CORRUGATIONS PRIVATE LIMITED | S1 §1; E-03 | VERIFY | Display "Atharva Corrugations Pvt. Ltd."; legal-name line only after certificate check (Q-10) |
| F-02 | Business type | Manufacturer, B2B; "manufacture and supply" | S1 §1 | CONFIRMED | "Manufacturer" is safe; add per-product in-house/supplied flag (C-07) |
| F-03 | Operating since | 2014 (client decision) | S1 §1 | CONFIRMED, see C-05 | "Operating since 2014". Never "established" or "incorporated" in 2014 |
| F-04 | Plants | 1, Ranjangaon | S1 | CONFIRMED | "One manufacturing plant" |
| F-05 | Plant address | Gat No. 544/542, Dhok Sangavi, Ranjangaon MIDC, Ranjangaon, Pune, Maharashtra 412220 (external records: 542/544) | S1; E-02, E-03 | CONFIRMED, order variance C-04 | Footer, Contact, schema, map |
| F-06 | Registered office | Form: same as plant. Registry-derived: H.No. 1316, At Post Ranjangaon Ganpati, Tal. Shirur, Pune 412210 | S1; E-03 | CONFLICT (C-03) | No address may be labelled "Registered office" until verified |
| F-07 | Atharva Group | Part of Atharva Group; client wants it mentioned prominently | S1 §1 | CONFIRMED | Header lockup, footer panel, About section; claims limited to supplied facts (C-18) |
| F-08 | Group office | Office no. 215, Tower 2, WTC (opp. EON Free Zone), Kharadi, Pune 411014, belonging to Atharva Corporate Management Pvt. Ltd.; approved for display as group office | S1 §1 | CONFIRMED | Footer "Group office"; keep one shared constant across Group sites |
| F-09 | Founders | Mansing Nanasaheb Pachundkar; Sanjay Kumar Harishchandra Mache; publication allowed | S1 §1 (names consistent with E-03, E-04) | VERIFY (spelling, C-16) | About page: names only, no quotations or biographies without approval |
| F-10 | Website / domain | "Existing website", no address; "No" to owning the domain; staff email already on atharvacorrugations.com | S1 §1; E-01 | CONFLICT (C-02) | **Launch blocker** |
| F-11 | Online profiles | None given. IndiaMART and TradeIndia listings exist | S1; E-02 | MISSING / EXTERNAL | No social or marketplace links on the site; clean-up in Phase E |

### B. Contact and routing

| ID | Field | Information | Source | Status | Implication |
|---|---|---|---|---|---|
| F-12 | Phones | Main 9960378111; Sales 7720099628; WhatsApp 9960378111 (checked in business hours) | S1 §3 | CONFIRMED | Click-to-call, WhatsApp link (`91…` format) |
| F-13 | Emails | sales@atharvacorrugations.com; saket.ithape@atharvacorrugations.com (chosen as public general address); hr@atharvacorrugations.com; careers phone 7720099645 | S1 §3 | CONFIRMED | Display as instructed; see C-13, C-14 |
| F-14 | Hours | Mon–Sat 9 am–6 pm; closed Sundays and national holidays | S1 §3 | CONFIRMED | Contact page, footer, auto-reply |
| F-15 | Map link | `maps.app.goo.gl/52zgy1Ph6ZA4HyK6A` | S1 §3 | VERIFY | Confirm the pin is the plant |
| F-16 | Reply time | 2 working days (quote, product/technical, sample) | S1 §3 | CONFIRMED | Stated on the quote page; WhatsApp expectation set separately (C-19) |
| F-17 | Older landline | 020-24489414 appears in public records | E-02 | EXTERNAL | Ask whether it is live (Q-38); not displayed |

### C. Products, specifications and processes

| ID | Field | Information | Source | Status | Implication |
|---|---|---|---|---|---|
| F-18 | Formats made | RSC/HRSC, die-cut, telescopic/full-overlap, sheets/pads/partitions, layer pads, inserts/dividers, heavy-duty, export boxes, corrugated rolls | S1 §4.1 | CONFIRMED (formats); specs VERIFY | Defines product families; "HRSC" must be expanded (Q-17) |
| F-19 | Specialisations ticked | industrial, heavy-duty, export, food and consumer, e-commerce, automotive, fragile, moisture-resistant | S1 §4.1 | VERIFY | Each needs a spec or example before it becomes a claim. No food-safety or pharma-compliance wording |
| F-20 | Ply | 3, 5, 7, 9 | S1 §4.2 | VERIFY | "3 to 9 ply" only after verification; construction of 9-ply to confirm (C-09) |
| F-21 | Flutes | A, B, C, BC; also BCB, CA, AA, AAA, ACA ("combination terms to be confirmed") | S1 §4.2 | VERIFY | Plain-language flute guide; no E/F-flute claims |
| F-22 | Paper types | kraft, virgin, recycled, duplex, white-top, semi-chemical, water-repellent | S1 §4.2 | VERIFY | Listed as options once confirmed |
| F-23 | GSM range | 120 to 440 | S1 §4.2 | VERIFY | Spec panel |
| F-24 | Max reel width | 2200 mm | S1 §4.2 | VERIFY | Spec panel; confirm whether this is corrugator or paper-reel width |
| F-25 | Box size range | Not provided | S1 §4.2 | MISSING | No size-range claim; the quote form collects sizes |
| F-26 | Strength data | Client will send; none published until received | S1 §4.2 | MISSING | No BCT/ECT/burst values anywhere |
| F-27 | Product table | RSC/HRSC 3 & 5 ply → white goods, FMCG, electronics, food and beverage. Die-cut → fruits and vegetables, engineering goods, sanitary ware, e-commerce. Heavy-duty → export, automotive, engineering parts. Paper core assemblies → centrifugal compressor packaging. Allied: angle corners, core pipes, honeycomb, wooden pallets, polybags, paper pulp trays. BOPP tape (in-house since 2025) | S1 §4.3 | CONFIRMED (first three rows); VERIFY (rest) | Drives family pages and the industry mapping |
| F-28 | Top-five products | Not provided | S1 §4.3 | MISSING | Provisional order in S1; confirm (Q-08) |
| F-29 | Processes | Flatbed and rotary die cutting, slotting, creasing, stitching, gluing/pasting, lamination; moisture-resistant and waterproof treatment (own plant); **varnish/coating outsourced**; printing flexo / offset-printed lamination / screen, up to 4 colours | S1 §4.4 | VERIFY; outsourcing of varnish CONFIRMED | Capability matrix must separate "made at our plant" from "arranged with partners". Corrugating (board making) is **not** in the list (C-08) |
| F-30 | Design support | In-house packaging design; inputs accepted (drawings, dielines, CAD, physical samples, spec sheets, verbal); structural design, dieline/CAD, sample/prototype, tooling (dies, plates), testing support, development from a physical product; outputs: dieline, 3D mock-up, physical sample, test report, recommendation, export packaging concept | S1 §4.5 | CONFIRMED | Basis of the Custom Packaging page |
| F-31 | MOQ | Client prefers not to display | S1 §4.5 | RESTRICTED | No MOQ anywhere |
| F-32 | Sample lead time | Not given | S1 §4.5 | MISSING | No lead-time claims |

### D. Facility, capacity, team

| ID | Field | Information | Source | Status | Implication |
|---|---|---|---|---|---|
| F-33 | Facility area | "Over 100,000 sq ft" ticked; exact figure promised, never given | S1 §5 | MISSING / RESTRICTED | Omit (Q-12) |
| F-34 | Capacity | "2500 Tons", no period or basis | S1 §5 | RESTRICTED | Omit (Q-13). Period and basis change the meaning by an order of magnitude |
| F-35 | Team size | "51 to 100" ticked; no permission to display; follow-up unanswered | S1 §5 | RESTRICTED | Omit (Q-14) |
| F-36 | Machinery list and brands | Not received; brands only if client agrees | S1 §5 | MISSING | Blocks the capability matrix |
| F-37 | Board-making line (corrugator) | Not stated in S1; implied by ply/flute/GSM/reel-width data and by external records | S1 omission; E-04, E-05 | CONFLICT / EXTERNAL | If confirmed it is the strongest differentiator (Q-04) |

### E. Quality, certification, sustainability

| ID | Field | Information | Source | Status | Implication |
|---|---|---|---|---|---|
| F-38 | Quality practices | Ten ticked: incoming paper inspection (GSM, moisture), bursting strength, box compression, edge crush, moisture, dimensional, print quality, final inspection, batch traceability, in-house lab; dedicated quality team | S1 §6.1 | VERIFY | Name the practices, not standards, until QA documents arrive |
| F-39 | Customer audits | Customers audit or approve the plant; may be mentioned without naming customers | S1 §6.1 | CONFIRMED | Allowed as an unnamed statement |
| F-40 | ISO 9001:2015 | Issuer "TUV", valid to 01-09-2028, certificate no. 99 100 24495 | S1 §6.2 | VERIFY | Publish only after the certificate is seen; confirm the issuing entity and that the scope covers the products shown (Q-03) |
| F-41 | WRAP | "In process" | S1 §6.2 | RESTRICTED | Never shown as held |
| F-42 | EcoVadis Bronze | Typed under "other" | S1 §6.2 | VERIFY | A rating, not a certification; show with year once the scorecard arrives |
| F-43 | FSC / PEFC | Not held as a certification, yet "FSC or PEFC certified material" ticked as a sustainability statement | S1 §6.2–6.3 | CONFLICT (C-06) | No claim |
| F-44 | Sustainability statements | Recyclable products, recycled paper, reduced packaging weight options | S1 §6.3 | VERIFY | General wording only, no percentages |

### F. Industries, customers, recognition

| ID | Field | Information | Source | Status | Implication |
|---|---|---|---|---|---|
| F-45 | Industries (12) | automotive and auto components; FMCG; food and beverage; pharma and healthcare; e-commerce and retail; electrical and electronics; industrial and engineering; agriculture and produce; appliances; textiles; chemicals; export packaging | S1 §7 | CONFIRMED | "Also serving" list |
| F-46 | Homepage top four | white goods, engineering goods, FMCG, pharmaceuticals | S1 §7 | CONFIRMED, see C-11 | Homepage industries block |
| F-47 | Customer logos | "Yes" to display; no files or list received | S1 §7 | VERIFY | None until file and written permission exist |
| F-48 | Case studies | To come later | S1 §7 | MISSING | No case-study pages |
| F-49 | Haier recognition | "Consistent Quality and Service Provider"; client says verified | S1 §7 | VERIFY | Needs the letter and permission to name Haier |
| F-50 | Audience | automotive OEMs/suppliers, industrial manufacturers, FMCG, food, pharma, e-commerce sellers, exporters | S1 §2 | CONFIRMED | Persona set in Strategy §3 |
| F-51 | Market focus | Pan India | S1 §9 | CONFIRMED | No international wording |

### G. History, exports, goals

| ID | Field | Information | Source | Status | Implication |
|---|---|---|---|---|---|
| F-52 | Milestones | 2014 operations started; 2025 in-house BOPP tape; 2026 expansion incl. angle corner, honeycomb, paper core | S1 §8 | CONFIRMED (2014); VERIFY (2025, 2026) | Short timeline, gated |
| F-53 | Revenue milestones | "5 Cr per month" (2019), "10 Cr per month" target (2026) | S1 §8 | RESTRICTED | Never published, never implied |
| F-54 | Export status | "No" to exporting, while listing export boxes, "packaging concept for export", exporters as customers | S1 §3, §4, §9 | CONFLICT (C-01) | No export section, country list or "global" wording |
| F-55 | IEC | Held (per S1 narrative) | S1 §9 | VERIFY | An IEC is also required for imports; it is not evidence of exports (E-05) |
| F-56 | Goals | Quotation requests; win OEM customers; build credibility | S1 §10 | CONFIRMED | Strategy §5 |
| F-57 | CTAs | WhatsApp, and Request Quote / enquiry form | S1 §3, §10 | CONFIRMED | Both always reachable |
| F-58 | Floating WhatsApp | Proposed for consistency with Group sites | S1 §10 | VERIFY | Confirm (Q-29) |
| F-59 | Enquiry types | quote, product, sample, career, general | S1 §3 | CONFIRMED | Enquiry spec in Sitemap §7 |

### H. Brand, assets, legal

| ID | Field | Information | Source | Status | Implication |
|---|---|---|---|---|---|
| F-60 | Design direction | Premium industrial, modern engineering, technical | S1 §11 | CONFIRMED | Design doc |
| F-61 | Logo, brand colours, guideline | "Keep existing"; none received | S1 §11 | MISSING | Accent colour is a token, set from the logo (Design §5) |
| F-62 | References / dislikes | None given | S1 §11 | MISSING | Design proposals carry rationale instead |
| F-63 | Photos and files | None received; client: "work around with what we have" | S1 §17 | MISSING | Build with placeholders; gate at deployment |
| F-64 | GSTIN | 27AALCA5293R1ZR; "Show" ticked | S1 §13 | VERIFY. Format valid and check character verifies (formal check only, computed 12 Oct); suffix matches the marketplace listing (E-02) | Footer after GST certificate is seen |
| F-65 | CIN | U74900PN2013PTC146924; "Show" ticked on the CIN row | S1 §13 | VERIFY. Structure valid; matches registry data (E-03) | Footer after reconfirmation. Compatible with "operating since 2014" |
| F-66 | Privacy policy | Exists; not received | S1 §13 | MISSING | Blocks the forms (E-08) |

---

## 4. Conflicts and inconsistencies register

Severity: **Blocker** (stops launch) · **High** (changes positioning or legal accuracy) · **Medium** · **Low**.

| ID | Sources in disagreement | Evidence | Sev. | Working resolution until the client answers | Q |
|---|---|---|---|---|---|
| C-01 | S1 "No" to exporting vs export boxes, export concept, exporters as audience, IEC | E-05: public trade records show the company as an **importer** (fluting paper, corrugator spares). That fully explains the IEC with no exports | Medium | No export section, no countries, no "global/worldwide". "Export packaging" appears only as a product type | Q-11 |
| C-02 | S1 "existing website", domain not owned vs company email on the domain | E-01: the domain currently shows a hosting provider's "Coming Soon" placeholder; records list it as the company website and email domain. So there is **no existing content or search equity to preserve**, but the registrant, DNS host and mail host are unknown. Changing DNS blindly could break company email | **Blocker** | Do not touch DNS until registrant, DNS host and MX records are inventoried | Q-01, Q-02 |
| C-03 | S1 registered office = plant vs registry-derived records | E-03: registered office H.No. 1316, Ranjangaon Ganpati, PIN 412210; plant listed as an establishment, PIN 412220 | High | No "Registered office" label anywhere; footer says "Plant" and "Group office" | Q-10 |
| C-04 | S1 "Gat No. 544/542" vs external "542/544" | E-02, E-03 | Low | Confirm order; one canonical address string for site, GST, maps, listings | Q-10 |
| C-05 | S1 founding "2014" vs MCA incorporation 15 Apr 2013 (E-03) vs rating report "incorporated in 2014" (E-04) vs TradeIndia "established 2011" (E-02) vs IndiaMART "Group since 2008" | Public sources disagree with each other | Medium | Client's decision stands: "Operating since 2014". Wording avoids "established/incorporated". Listings corrected after launch | Q-28 |
| C-06 | FSC/PEFC ticked as sustainability statement vs not held as certification | S1 §6.2 vs §6.3 | High | No FSC/PEFC wording | Q-15 |
| C-07 | "All products made in our own plant" vs outsourced varnish/coating, and unusually broad range (wooden pallets, polybags, pulp trays, tape, honeycomb, angle corners, paper cores) | S1 §4.3–4.4 | High | Every product carries a `sourcing` flag (`made-at-plant` / `supplied`). Only verified `made-at-plant` items use "we manufacture". Wooden pallets for export would also need ISPM-15 treatment evidence | Q-04, Q-05 |
| C-08 | Corrugator: ply/flute/GSM/reel-width data imply in-house board making; S1 process list omits corrugating | E-04: a 2019/2020 rating report describes manufacture of corrugated sheets and boxes with a flexo printing unit. E-05: imports of fluting paper and corrugator spare parts | High | Treated as a hypothesis. If confirmed ("we make our own board") it becomes the lead differentiator over converters who buy board | Q-04 |
| C-09 | "9 ply" stated; flute combinations listed reach three-flute (7-ply) builds only; no E/F flute although e-commerce and FMCG are ticked | S1 §4.2. Some Indian converters do publish 9-ply and beyond | Medium | Ask for the layer construction behind each ply count. Spec tables show only confirmed constructions | Q-18 |
| C-10 | Capacity "2500 Tons" (no basis), area ">100,000 sq ft" (no figure), team "51–100" (no permission) | S1 §5. E-07: a much smaller Pune-area competitor publishes capacity, floor area and machinery | High (commercial) | Omit all three. The trust story is thinner than a smaller rival's until answered | Q-12, Q-13, Q-14 |
| C-11 | Top-four industries exclude automotive while goals stress OEMs and automotive is ticked, heavy-duty lists automotive. Pharma is top-four with no pharma-specific evidence (no GMP or food-safety certificates) | S1 §2, §4.3, §7 | Medium | Homepage follows the client's four. Automotive appears via heavy-duty packaging and on the Industries page. No pharma/food compliance claims | Q-25 |
| C-12 | All 18 strengths ticked, no top five, no evidence | S1 §14 | Medium | Use the five provisional pillars in S1 §14, each tied to a verifiable fact | Q-25 |
| C-13 | Personal email shown publicly for general enquiries | S1 §3 | Low | Client decision stands. Recommend a role alias; spam and continuity risk noted | Q-29 |
| C-14 | Quotes routed to a named person while `sales@` exists | S1 §3 | Low | Recommend `sales@` as primary recipient with the named person in copy | Q-29 |
| C-15 | External listings misdescribe the business and attribute Group customers to this company | E-02: IndiaMART lists box-making-machine maintenance services; its About text names industrial customers served **through Atharva Polymers**; TradeIndia calls the company a trader of box-making machines | High | Those customers are **not** Corrugations customers: never carried over. Strings Godrej, Larsen, Minda, Varroc, "polymer", "injection", and every Polymers metric are on the build's banned-string list (Technical §13) | Q-37 |
| C-16 | Founder spelling: "Mansing" (S1, E-03, E-04) vs "Mansingh" in other project material; "Sanjay Kumar" (S1) vs "Sanjaykumar" (registry) | | Low | One canonical spelling from the client, applied across Group sites | Q-27 |
| C-17 | Legal-name wording ("Pvt Ltd." vs "Pvt. Ltd."); CIN and GST "Show" ticked in unusual rows | S1 §1, §13 | Low | Show after reconfirmation; copy the exact wording from the certificate | Q-10 |
| C-18 | Group presence "prominent", but no company list, descriptions or approvals; other project material names verticals not on the intake list (e.g. logistics); a marketplace profile mentions another entity | S1 §1; E-02 | Medium | Group is shown as a name and the Group office only. No sister-company list or cross-links until approved | Q-26 |
| C-19 | WhatsApp "checked during business hours" vs 2-working-day reply promise | S1 §3 | Low | Set expectations separately for chat and form | Q-29 |
| C-20 | Founders and directors: registry records list additional directors | E-03 | Low | Client approved only two names; nobody else is named | — |

---

## 5. External observations (all dated 12 Oct 2026, all require validation)

| ID | Observation | Source | Use and restriction |
|---|---|---|---|
| E-01 | `atharvacorrugations.com` serves a generic hosting "Coming Soon" page. No site content, no preserved search equity | http://www.atharvacorrugations.com | Confirms no migration content. Hosting and DNS control unknown |
| E-02 | IndiaMART and TradeIndia profiles: listed as manufacturer; GST suffix `1ZR` matches S1; product and category noise; Group customers attributed to this company; "established" years differ; Gat order 542/544; older landline | indiamart.com/atharvacorrugations/ and /aboutus.html; tradeindia.com/atharva-corrugations-private-limited-33857335/ | Do not copy. Plan corrections post-launch |
| E-03 | Registry-derived aggregators and an LEI record: incorporation 15 Apr 2013, status active, registered office H.No. 1316 Ranjangaon Ganpati (412210), plant listed as establishment (412220), two founders plus other directors, domain and a finance mailbox | zaubacorp.com, leikart.com, falconebiz.com | Validate against the incorporation certificate and MCA master data. Do not publish personal data |
| E-04 | A public credit-rating report (2019, updated 2020) describes the business as manufacturing corrugated sheets and boxes with a flexo printing unit at the Ranjangaon plant; names the two promoters; says "incorporated in 2014" | crisil.com rating document | **Business description only.** Its financial content is out of scope and must not be used |
| E-05 | Public trade-data listings show the company importing fluting paper and corrugator spare parts | importgenius.com listing | Supports C-01 and C-08. Commercially sensitive; never published |
| E-06 | Ranjangaon MIDC (PIN 412220) hosts large appliance, automotive, FMCG and engineering plants; Haier and Whirlpool-type appliance makers appear in public lists | housing.com, ESR park pages, Wikipedia, MPCB list | Market context for the white-goods/engineering emphasis. **Not** customer claims |
| E-07 | Competitor and buyer-expectation research | Summarised in Strategy §7 | Patterns only |
| E-08 | DPDP Rules notified 13–14 Nov 2025; notice, consent, security-safeguard and breach-reporting obligations phase in about 18 months later (around 14 May 2027) | legal-practice summaries | The forms and privacy notice should be built to that standard now; counsel to confirm |
| E-09 | Next.js 14 reached end of life 26 Oct 2025; 15 ends 21 Oct 2026; 16 is Active LTS | nextjs.org/support-policy and tracker sites | Corrugations starts on 16 |
| E-10 | Vercel Hobby plan is for non-commercial personal use only; Pro is $20 per user per month | vercel.com/docs/limits/fair-use-guidelines | Hosting decision (Technical §12) |

---

## 6. Publication gate

### 6.1 Never publish (RESTRICTED or unverified)

Revenue or sales milestones · capacity figure · facility area figure · team size · WRAP status · FSC/PEFC · any export claim or country · customer names and logos · the Haier recognition · any credit-rating or financial information · additional directors' names · the older landline · any "Registered office" label · MOQ · lead times · test values · "ISO certified" before the certificate is checked · "EcoVadis" before the scorecard is checked · any wording copied from Polymers or marketplace listings.

### 6.2 Publish only with evidence in hand

| Claim | Evidence required |
|---|---|
| ISO 9001:2015 | Certificate (issuer entity, scope, validity) |
| EcoVadis rating | Scorecard with date |
| Each "we manufacture" product | Machinery list or photo of production |
| Board range (3–9 ply, GSM, reel width) | Spec sheet or corrugator specification |
| Test practices | QA document; sample test report |
| Haier recognition | Letter plus written permission |
| Customer logo | File plus written permission |
| Milestones 2025, 2026 | Dated confirmation |

The Technical plan turns this table into an automated pre-deploy check (claims registry).

---

## 7. Missing-information index

Maps to the question list (priority P0 blocks launch, P1 affects quality, P2 optional). Full wording is in the Content document §11.

- **P0:** domain and DNS (Q-01, Q-02); ISO certificate (Q-03); machinery list and corrugator (Q-04); in-house versus supplied (Q-05); logo, brand colours, Group lockup (Q-06); photographs (Q-07); catalogue and top products (Q-08); privacy policy (Q-09); legal identity wording, registered office, Gat order (Q-10); export status (Q-11); facility area, capacity, team size permissions (Q-12 to Q-14); EcoVadis, WRAP, FSC (Q-15); Haier and logo permissions (Q-16).
- **P1:** HRSC meaning; board construction; box size range; printing detail; test methods; design-support detail; tooling policy; supply and logistics; industry applications; Group facts; founders; company story; routing; plant visits; careers.
- **P2:** geography, search phrases, sustainability evidence, profiles, marketplace listing control, awards, brochures, language, buyer-required documents.

---

## 8. Limits of this audit

- External observations come from public pages read on one day; marketplace and aggregator data is often stale or wrong and is used only to prepare questions.
- Registry, rating and trade-data records were read for business scope and identifiers only. Financial content was deliberately excluded.
- No Polymers source code or live site was inspected; as-built Polymers behaviour (S3) is recorded but unverified.
- GSTIN and CIN checks are formal (structure and check character). They do not prove ownership.
- Technical statements about corrugated board (ply, flutes) are domain knowledge used to frame questions; they are not claims about this company.

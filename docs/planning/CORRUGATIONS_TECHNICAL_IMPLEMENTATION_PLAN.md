# CORRUGATIONS_TECHNICAL_IMPLEMENTATION_PLAN.md
**Atharva Corrugations Pvt. Ltd. — Website Planning · Document 6 of 7**
Version 1.0 · 12 October 2026 · Status: for owner review (no code has been written)
Depends on: Sitemap (routes, enquiry spec), Design (tokens, components), Audit (E-08 to E-10).

**Evidence note.** The Polymers repository was not inspected (Audit §1.2). Versions and components below follow the Polymers documents; every dependency version must be checked against the Polymers lockfile and the framework release notes at scaffold time. External facts (E-09, E-10) were read on 12 Oct 2026.

---

## 1. Principles

1. **Inherit, don't invent.** Same stack and conventions as Polymers unless there is a stated reason.
2. **Lean and cheap.** No CMS, database or paid service without a business case. Recurring costs are listed in §12.3.
3. **Evidence is code.** Claims are typed data with a verification status; a build step blocks unverified claims from production.
4. **Server-first.** Pages are static server components; only interactive pieces are client components.
5. **Accessible and fast by construction**, then tested.
6. **Independence.** No assumed shared repository, hosting account, domain, CMS or email account across Atharva sites.

---

## 2. Stack and versions

| Concern | Polymers standard | Corrugations decision | Reason |
|---|---|---|---|
| Framework | Next.js "14+", App Router | **Next.js 16** (Active LTS, E-09). Scaffold fresh with the current `create-next-app` | 14 is out of support; 15 ends support 21 Oct 2026. Polymers code samples target older APIs |
| Language | TypeScript 5+ | TypeScript, `strict` | Shared |
| React | per Next | The version Next 16 requires | |
| Styling | Tailwind CSS 3, `tailwind.config.ts` | **Tailwind 3.4.x** for component portability; the family may later move to v4 (TD-02) | Polymers components assume v3 |
| Animation | Framer Motion 11+ | Same package; use `LazyMotion` with `domAnimation` and `m` components | Cuts payload (measure with the bundle analyser) |
| Icons | Lucide React | Same; import individually | Few icons needed |
| Forms | react-hook-form + zod | Same | Shared schema client and server |
| Email | Resend | Same (TD-04) | Free tier suits expected volume; verify current limits |
| Spam control | Honeypot | Honeypot + minimum-time check + Cloudflare Turnstile (free) | The quote form is the primary conversion |
| Analytics | GA4 | GA4 + Search Console (TD-06) | Free |
| Hosting | Vercel | Vercel **Pro** (TD-03) | Hobby is non-commercial (E-10) |
| Images | `next/image` | Same; AVIF and WebP | Shared |
| Testing | manual checklists | Playwright, axe, Lighthouse CI, Vitest for registry and schema tests | All free; automates the gates |
| Utilities | `clsx`, `tailwind-merge` | Same | |

**Version policy.** Exact versions pinned in `package.json` plus a lockfile; Renovate or Dependabot weekly; `npm audit` in CI. Next.js 16 changes to account for at scaffold time (confirm in the release notes): request APIs such as `params` are asynchronous, so dynamic routes like `[family]` must `await params`; Turbopack is the default bundler; `middleware` is being renamed to `proxy`. The Polymers samples (for example `app/products/[slug]/page.tsx`) predate these.

---

## 3. Repository and sharing options

| Option | Description | Pros | Cons |
|---|---|---|---|
| **A. Separate repository per company** | Corrugations is its own repo; the foundation layer is copied at a tagged Polymers commit | Independent deploys and approvals; no cross-site breakage; simplest ownership | Drift; fixes applied twice |
| **B. Monorepo** | One workspace (pnpm or Turborepo) with `ui`, `tokens`, `group` packages and one app per company | One source for shared code; consistent upgrades | Refactors the Polymers repo while it is mid-build; extra tooling |
| **C. One multi-tenant app** | A single Next app serving all domains | One deploy | Coupling, large blast radius, per-site claim gates become awkward. **Not recommended** |

**Recommendation (TD-01): A now, designed for B.** Keep tokens in CSS variables; keep shared components free of company data; keep Group constants in an isolated `src/group/` module. **Extraction trigger:** when a third Atharva site starts, or any shared fix has to be applied twice, extract `ui`, `tokens` and `group` into packages. No shared hosting account, domain or CMS is assumed.

---

## 4. Architecture and data

### 4.1 Structure

```
src/
  app/            layout, page, products/[family], industries, custom-packaging,
                  manufacturing-and-quality, about, contact, request-quote,
                  privacy-policy, api/rfq, api/contact, sitemap.ts, robots.ts, not-found
  components/     ui/ (Button, SectionHeader, TitleBlock, Gated…)  sections/  layout/
                  forms/  illustration/ (DielineSvg + static SVGs)
  data/           claims.ts  company.ts  products.ts  industries.ts  process.ts  navigation.ts
  group/          group.ts   (Group name, Group office, approved company list, founders)
  lib/            animations.ts  seo.ts  whatsapp.ts  rfq-schema.ts  email.ts  analytics.ts  utils.ts
scripts/          check-claims.ts  check-banned-strings.ts  contrast.mjs
tests/            e2e/  unit/
```

Navigation lives in `data/navigation.ts`, separate from content, as in Polymers.

### 4.2 Data model (essentials)

```ts
type ClaimStatus = 'confirmed' | 'verify' | 'missing' | 'restricted'

interface Claim<T> {
  id: string                // 'F-23' — the Audit fact ID
  value: T
  status: ClaimStatus
  evidence?: string         // file name or note
  verifiedOn?: string       // ISO date
  verifiedBy?: string
  expiresOn?: string        // ISO date for time-limited claims (certificate validity, annual ratings)
}

interface Format {
  slug: string
  name: string
  family: FamilySlug
  sourcing: Claim<'made-at-plant' | 'partner' | 'supplied'>
  applications: Claim<string[]>
  board?: { ply?: Claim<number[]>; flutes?: Claim<string[]>; gsm?: Claim<[number, number]>;
            reelWidthMm?: Claim<number>; paper?: Claim<string[]> }
  printing?: Claim<{ methods: string[]; maxColours?: number }>
  treatments?: Claim<string[]>
  photos?: string[]         // P- shot IDs
}
```

Families, formats, industries and process steps are typed arrays. **No CMS at launch** (consistent with Polymers). Reconsider when there are more than about 30 products, or non-developers must edit content weekly.

### 4.3 Single source of truth and the claims gate

- **One registry.** `claims.ts` holds every fact, keyed by Audit ID. Components read values through the registry or the `<Gated claim="F-23">` wrapper. **No number or capability is typed into a component.** (The TGI lesson: one page quoting two tonnages, Strategy §7.)
- **Modes.**
  - *Development:* unverified claims render with a visible outline and a tooltip showing ID and status.
  - *Preview/staging:* unverified claims render, with a banner "N unverified claims" so the client can review.
  - *Production (`LAUNCH=true`):* only `confirmed` claims render. `verify`, `missing` and `restricted` render nothing.
- **`check-claims.ts`** (CI, mandatory before production deploy) fails if: a rendered page references a non-confirmed claim; a `confirmed` claim lacks `evidence` and `verifiedOn`; a group declares a minimum count (hero strip ≥3 cells; trust block either ≥1 card or omitted) and is under it; or any placeholder string (`⚠`, `AWAITING`, `lorem`, `TODO`) is present. It prints a report: claim, status, pages used.
- **Trust-floor script** counts confirmed signals on the homepage (Strategy §6) and reports; the go/no-go is a human decision.
- **Group constants.** `src/group/group.ts` follows the same schema, so Group claims (office, founders, company list) carry statuses too.

### 4.4 Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (the `www` form) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919960378111` format |
| `RFQ_TO`, `RFQ_CC`, `GENERAL_TO`, `ARCHIVE_BCC` | Routing and the archive mailbox (Q-29, TD-05) |
| `RESEND_API_KEY`, `MAIL_FROM` | Email |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Spam control |
| `NEXT_PUBLIC_GA_ID` | Analytics |
| `LAUNCH` | `true` in production only; activates the claims gate |

Every value is set per project; **never copy values from the Polymers project**.

---

## 5. Design tokens

CSS variables on `:root` (Design §5.2), mapped into the Tailwind theme with the alpha-value pattern, for example `colors: { accent: 'rgb(var(--accent) / <alpha-value>)' }`. Changing `--accent`, `--accent-hover` and `--accent-on-dark` re-themes the site (Design D-01). `scripts/contrast.mjs` reads the tokens and asserts the pairs in Design §5.3 (ratios and minimums); CI fails if a token change breaks a pair. Component code uses semantic classes (`text-body`, `bg-ink`), not hex values.

---

## 6. SEO

- **Metadata:** `generateMetadata` per route from the Sitemap §4.2 table; canonical on every page; `lang="en-IN"`.
- **Sitemap and robots:** `app/sitemap.ts` lists launched routes only (folded family pages are excluded); `robots.ts` allows all in production; staging returns `noindex` by header and is access-protected.
- **Open Graph:** one default 1200×630 image, per-family images later.
- **Structured data (minimal and truthful):** `Organization` (name, URL, logo, plant address, contact point with phones and email, opening hours; `parentOrganization` only when the Group entity is approved; `sameAs` when profiles exist; **no** `foundingDate`, to avoid the 2013/2014 inconsistency, C-05); `WebSite`; `BreadcrumbList`. No `Product` markup (no price, review or offer data, so no eligible result), no `FAQPage` (FAQ rich results are no longer shown for most sites), **never** review or rating markup.
- **Content mechanics:** one H1; logical headings; descriptive link text; image alt describes what is visible; image file names meaningful; drawings carry captions.
- **Redirects:** none needed (no content on the old domain, E-01); keep a `redirects` array in `next.config` for future slug changes.
- **Local presence (client actions):** Google Business Profile for the plant, address consistency across the site, IndiaMART and TradeIndia (Audit C-04, C-15), Search Console and Bing Webmaster verification by DNS TXT.
- **Not planned:** programmatic location pages (thin content).

---

## 7. Forms and enquiry backend

### 7.1 Flow
Client validation (zod) → `POST /api/rfq` (JSON) → server validation with the **same** schema → honeypot and minimum-time check → Turnstile verification → reference creation → send the team email and the customer auto-reply → respond `{ ok, reference }` → success state. Any failure returns a typed error that the client maps to the error state (Sitemap §7.5).

### 7.2 Schema (shared)
Fields as in Sitemap §7.2. Rules: names and company 2–120 characters; email format; phone normalised (spaces, hyphens, brackets removed) and accepted as an Indian mobile (10 digits, optional `+91` or `0`, starting 6–9) or an international `+` number of 8–15 digits; quantities positive integers (up to three); dimensions positive numbers within sensible limits; free text length-limited; the `family` and `format` values restricted to known slugs.

### 7.3 Route handler
Node runtime; function region near India (Mumbai, `bom1`) for latency; request-size limit small (text only); JSON only. Reject on schema failure with field errors; never echo raw input into HTML without escaping.

### 7.4 Email
- Sender on the client's domain with SPF and DKIM through the provider; DMARC policy set to monitor first. **This depends on domain control (Q-01).**
- Team email: structured table of fields, source page, UTM values, reference; `Reply-To` set to the customer.
- Auto-reply: Sitemap §7.6 and Content §10.3; `Reply-To` is the sales mailbox so drawings come back as attachments.
- **Redundancy (TD-05):** BCC a client-owned archive mailbox so a provider failure never loses a lead.
- Strip carriage returns and line feeds from any value used in a header or subject.

### 7.5 Privacy notice at the point of collection
A short plain-language line beside the submit button: who we are, why we ask (to respond to the enquiry), what we collect, how long we keep it (period set by the client's counsel, Q-09), how to ask for deletion, and a link to the privacy policy. The DPDP Rules were notified in November 2025 with the main obligations phasing in around May 2027 (E-08); the form is built to that standard now. **Counsel to confirm** the exact obligations, any consent checkbox, and cross-border processing by the email and hosting providers.

### 7.6 Abuse prevention
Honeypot field; minimum plausible time-to-submit; Turnstile (free) verified server-side; rate limiting by IP through the platform firewall where available; generic error messages that reveal nothing about the checks.

### 7.7 Reference
`ACQ-YYMMDD-XXXX` with four random base-32 characters; generated server-side; never derived from personal data.

### 7.8 Failure handling and logging
Log reference and outcome only, not payloads. On an email-provider failure, return a 502 with a typed code; the client shows the error state with WhatsApp and phone links. Platform log retention is short, so the archive mailbox is the record. A scheduled synthetic submission (weekly) confirms the path works (Roadmap §8).

### 7.9 Phase 2: file upload (not at launch, SD-07)
If needed: direct-to-storage upload with a signed URL (serverless request bodies are limited, about 4.5 MB at the time of writing; confirm), type allow-list (PDF, JPG, PNG, DXF), 10 MB cap, malware scanning, 90-day retention, and an explicit line in the privacy notice.

---

## 8. Performance

**Budgets (starting proposal; adjust after the first build):** LCP ≤ 2.5 s, CLS < 0.1, INP < 200 ms (p75 mobile, 4G); Lighthouse mobile Performance ≥ 90, Accessibility, SEO and Best Practices ≥ 95; first-load JavaScript on the homepage ≤ 170 KB gzipped; hero SVG ≤ 30 KB.

- **Server components by default;** client components only for navigation, forms, the dropdown and animated wrappers.
- **Fonts:** Inter via `next/font`, Latin subset, only the weights used (300, 400, 500, 600; D-08), `display: swap`.
- **Images:** `next/image` with `sizes`; hero LCP image `priority` (Hero B); AVIF and WebP; source images pre-resized to 2400 px or less; no layout shift (dimensions or `fill` with sized containers).
- **Hero A:** inline SVG, strokes animated with CSS or `m` components; no raster.
- **Motion library:** `LazyMotion` with `domAnimation`.
- **Third parties:** GA loaded after interaction or consent; Turnstile loaded only on form pages; no map embeds; no social widgets.
- **Noise texture:** the SVG-filter overlay used on dark sections can be costly to paint on mid-range Android. Test with 4× CPU throttling and a real device; if it shows, replace it with a pre-rendered 256 px tile.
- **Caching and rendering:** all pages statically generated; route handlers are the only dynamic parts.

---

## 9. Accessibility (implementation)

Target WCAG 2.2 AA (Design §14). Build-time: ESLint with `jsx-a11y`; axe through Playwright on every launched page; manual keyboard-only and screen-reader passes (NVDA, VoiceOver) on Home, a family page and the quote flow. Specific implementations: skip link; landmarks (`header`, `nav`, `main`, `footer`); Products dropdown operable by keyboard with focus return; focus management to the error summary and the success message; `aria-live="polite"` for success; real `<table>` markup with `scope` for the capability matrix and comparison table; `useReducedMotion` plus CSS `prefers-reduced-motion`; targets ≥44 px; the floating WhatsApp control has an accessible name and never overlaps the submit button; dieline SVGs carry `role="img"` with `aria-label` and a longer description.

---

## 10. Analytics and conversion tracking

**Events**

| Event | Trigger | Parameters |
|---|---|---|
| `rfq_start` | First interaction with the quote form | page, family |
| `rfq_submit_success` | Successful response | reference, family, enquiry type (no personal data) |
| `rfq_submit_error` | Failed submit | error code |
| `whatsapp_click` | Any WhatsApp link | location (nav, hero, floating, band, contact), page, token |
| `phone_click`, `email_click` | Tel or mailto taps | location |
| `product_cta_click` | Family quote CTA | family, format |
| `sample_request_start` | Entering with `type=sample` | page |

`rfq_submit_success` and `whatsapp_click` are marked key events. UTM parameters are captured on landing, held for the session and sent as hidden fields. **WhatsApp attribution:** the pre-filled message carries a source token (Sitemap §7.6), mapped as `WEB-HOME`, `WEB-BOXES`, `WEB-DIECUT`, `WEB-HEAVY`, `WEB-SHEETS`, `WEB-PROTECTIVE`, `WEB-CUSTOM`, `WEB-CONTACT`, `WEB-FLOAT`.

**Consent (TD-06).** Recommended: GA4 behind a minimal notice with accept and decline, loaded only after accept, with a privacy-policy link. Trade-off: some measurement is lost. Alternative: a paid cookieless tool, only if the lost data matters. Revisit after 90 days. Search Console is verified by DNS or HTML tag. An optional free Looker Studio report shows the KPIs in Strategy §5.6.

---

## 11. Security and privacy

- **Headers** via `next.config`: `Content-Security-Policy` allowing only self, the analytics host and Turnstile; `Strict-Transport-Security`; `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy` denying unused features; frame-ancestors none.
- **Input and output:** server-side validation; escape all values in email HTML; header-injection protection; no secrets in client bundles (`NEXT_PUBLIC_` only for public values).
- **Dependencies:** pinned versions, lockfile, weekly updates, `npm audit` in CI, review of any new package.
- **Accounts:** the client (or Group) should own the domain registrar, DNS, hosting, email provider and analytics accounts, with the agency granted delegated access. This directly addresses the domain-ownership risk (C-02).
- **Data minimisation:** collect only what the form needs; no IP address or fingerprinting stored; no third-party embeds; fonts self-hosted through `next/font`.
- **Retention and rights:** a named contact for privacy requests (Q-09); retention period from counsel.
- **Providers as processors:** hosting and email providers are listed in the privacy policy; cross-border processing to be confirmed by counsel.
- **Photography:** written consent from every identifiable employee (Content §6.3).
- **Breach plan:** a one-page response procedure (who decides, who is told, what is logged), kept with the client.

---

## 12. Hosting, domain and email

### 12.1 Hosting (TD-03)

| Option | Cost | Notes |
|---|---|---|
| **Vercel Pro** | About $20 per user per month, plus usage (E-10) | Matches the Polymers deployment; one team can host several Group sites |
| Vercel Hobby | Free | **Not allowed:** personal, non-commercial use only |
| Other platforms or a VPS | Varies | Next.js feature support and operations burden must be assessed before choosing |

Recommendation: Vercel Pro, owned by the client or Group, with a project per company.

### 12.2 Domain, DNS and email cut-over (blocks launch, C-02)

1. Identify the registrar account, DNS host and mail host (Q-01).
2. Export every existing DNS record (A, CNAME, MX, SPF, DKIM, DMARC, TXT) and store the copy.
3. Test the build on a staging subdomain or the platform preview URL; staging is access-protected and `noindex`.
4. **Merge** the email provider's SPF include into the single existing SPF record (only one SPF record is valid); add DKIM; set DMARC to monitor.
5. Lower TTLs 24–48 hours before cut-over.
6. Point `www` (canonical) and the apex to the host, leaving **MX records untouched**.
7. Send and receive test emails before and after the change.
8. Verify HTTPS, redirects (apex to `www`), Search Console and the form end to end.
9. Keep the exported records for rollback; keep the old hosting account alive until mail is confirmed independent of it.

### 12.3 Recurring cost register

| Item | Cost | Owner |
|---|---|---|
| Domain renewal | Registrar price | Client |
| Hosting (Vercel Pro) | About $20 per user per month | Client or Group |
| Email provider (Resend) | Free tier expected to suffice; verify | Client |
| Turnstile, GA4, Search Console | Free | Client |
| Uptime monitor | Free tier | Client |
| CMS, database, paid analytics | **None planned** | — |

### 12.4 Environments
Preview per pull request (protected); staging on `develop` (protected, `noindex`); production on `main`. Branch and commit conventions as in Polymers (`feature/*`, `fix/*`, `content/*`; conventional commits). Git is the source of record; the email archive holds enquiries.

---

## 13. Testing and QA

### 13.1 Automated (CI on every pull request)
Type check; ESLint (with `jsx-a11y`); unit tests for the claims registry, form schema, WhatsApp URL builder and token contrast; build; internal link check; Playwright smoke (home, navigation, a family page, quote validation, quote success with a mocked mailer); axe on every launched page; Lighthouse CI on Home, one family page and Quote with the thresholds in §8; `check-banned-strings`; `check-claims` (warning on preview, **blocking on production**).

### 13.2 Manual matrix
Browsers: Chrome, Safari, Firefox, Edge, Chrome on Android, Safari on iOS, Samsung Internet. Widths: 360, 390, 768, 1024, 1440. Keyboard only; NVDA and VoiceOver; 200% and 400% zoom; reduced motion; throttled CPU and network; one real mid-range Android phone.

### 13.3 Claims gate
At gate G6 the report must show zero non-confirmed claims on any launched page, and the trust-floor count (Strategy §6) recorded.

### 13.4 Banned strings (the cross-contamination check)
Fails the build if any of these appears in source, content, metadata, `public/` file names or `package.json`, unless explicitly allow-listed per file with a reason:

- Polymers business terms: `polymer` (as a company or business description), `injection`, `moulding`/`molding`, `Atharva Polymers`, `atharvapolymers`, `Precisely Made`, `Specification Mark`.
- Customers attributed in marketplace text: `Godrej`, `Larsen`, `L&T`, `Minda`, `Varroc`.
- Polymers numbers and phrases: `19+ years`, `19 years`, `20+ clients`, `4+ countries`, `4 markets`, `40 employees`, `2007`, `2008`.
- Marketing superlatives: `world-class`, `industry-leading`, `cutting-edge`, `revolutionary`, `next-generation`, `global presence`.
- Placeholders: `lorem`, `⚠`, `AWAITING`, `TODO`, `FIXME`.

Also confirmed by checklist: the WhatsApp number, email addresses and analytics ID differ from Polymers values.

---

## 14. Shared versus company-specific

| Shared (copy at a tag, or package later) | Company-specific |
|---|---|
| Token structure, `cn()`, `animations.ts` | Colour values, illustration set, dieline generator |
| `SectionHeader` (with `mark` prop), `Button`, `FadeOnScroll`, form field components | `FamilyIndexRow`, `TitleBlock`, `CapabilityMatrix`, hero |
| **`Gated` and the claims registry, `check-claims`, `check-banned-strings`, `contrast.mjs`** | Data files, copy, photographs |
| `whatsapp.ts`, `seo.ts` patterns, CI configuration | Domain, emails, analytics IDs, schema content, routes |
| Group constants schema | Group values per approval |

The claims registry and banned-string check are worth backporting to Polymers and the other sister sites.

---

## 15. Technical risks and open decisions

| ID | Risk or unknown | Action |
|---|---|---|
| TR-1 | Polymers repo not inspected; its real versions and components may differ from the documents | Upload or share the repo before scaffold (Roadmap G1) |
| TR-2 | Polymers samples use older Next.js APIs | Scaffold fresh on Next 16; port components with a compatibility pass |
| TR-3 | Tailwind 3 versus 4 | Stay on 3 for portability; family decision TD-02 |
| TR-4 | Email domain verification depends on DNS access | Q-01; staging uses a test sender until resolved |
| TR-5 | Hobby hosting is non-commercial | Pro plan, client-owned account |
| TR-6 | Noise texture paint cost on mid-range phones | Test; replace with a tile if needed |
| TR-7 | Parametric dieline errors would embarrass a packaging company | Client QA review of every drawing (SD-10) |
| TR-8 | DPDP obligations and cross-border processing | Counsel review of notice and policy |
| TR-9 | CSP can block Turnstile or GA if misconfigured | Test on staging with the production CSP |
| TR-10 | Deliverability of transactional email to corporate inboxes | SPF, DKIM, DMARC aligned; test with the client's mail provider |

| Decision | Recommendation |
|---|---|
| TD-01 Repo strategy | A now, designed for B; extraction trigger at the third site |
| TD-02 Tailwind major version | Stay on 3 for Corrugations; decide Group migration separately |
| TD-03 Hosting plan | Vercel Pro in a client or Group account |
| TD-04 Email provider | Resend, subject to Q-01 |
| TD-05 Lead redundancy | BCC archive mailbox, weekly synthetic test |
| TD-06 Analytics consent | GA4 behind a minimal notice; revisit at 90 days |

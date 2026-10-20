# QA and launch checklist (Roadmap §7, gate G6)

Status at 2026-10-20. **Auto** = enforced in CI (`.github/workflows/ci.yml`). **Done** = checked locally once. **Open** = needs a person, a device, an account or the client.

## Claims and content

| Item | Status | How |
|---|---|---|
| `check-claims` passes in production mode; report archived | Auto | `npm run check:claims:launch`, run by `build:launch` |
| `check-banned-strings` passes; allow-list reviewed | Auto | `npm run check:banned`. One entry: a security comment in `src/lib/email.ts` |
| Trust-floor count recorded; reduced-homepage decision | **Open: owner at G6** | Reported by `check:claims`. **2 of 4 today** |
| ISO certificate, EcoVadis, GST and CIN checked against documents; one address string everywhere | **Open: client documents** (Q-03, Q-10, Q-15) | Claims stay VERIFY until then, and are hidden in production |
| No Polymers number, phrase, keyword or customer | Auto | Banned strings, plus e2e text sweep on every page |
| Every drawing reviewed by the client's technical reviewer; captioned "Illustration" | **Open: SD-10 reviewer** | RSC and full-overlap dielines, dimensions diagram; captions done |
| General technical copy reviewed (format descriptions, flute guide, industry considerations) | **Open: SD-10 reviewer** | Gated on claim F-18-copy; hidden in production |
| Photographs have consent and no customer branding | n/a | No photographs yet |

## Functionality

| Item | Status | How |
|---|---|---|
| Quote form end to end: team email, archive copy, auto-reply, reference, WhatsApp handoff | Auto (mocked mail) / **Open: real mail** | e2e and unit tests; a real send needs `RESEND_API_KEY` and a verified domain (Q-01) |
| Deliverability to Gmail, Outlook and the client's own mail; not in spam | **Open** | After SPF, DKIM and DMARC are set on the client's domain |
| Prefill from every entry point (Sitemap §7.1) | Auto | e2e: family, format, sample, help, custom |
| WhatsApp links open with the correct message and source token | Auto | Unit tests and e2e |
| Contact form end to end | Auto (mocked mail) | e2e |
| Weekly synthetic quote request | Ready | `scripts/synthetic-rfq.ts` plus `.github/workflows/synthetic.yml` (set the `SITE_URL` variable once live) |

## Performance (Technical §8)

| Item | Status | Result |
|---|---|---|
| Lighthouse mobile, launch build, DevTools throttling, median of 3 | Auto | `/`, `/products`, `/request-quote`, `/contact`: Performance 99–100, Accessibility, Best Practices and SEO 100, LCP 1.5–1.6 s, CLS ≤ 0.016 |
| Lighthouse simulated throttling (for reference) | Done | LCP 2.0–2.8 s on some pages: a simulation artefact (unthrottled LCP 136 ms; no hydration or font cause found) |
| First-load JS ≤ 170 KB (home and content pages), ≤ 180 KB (form pages) | Auto | `npm run check:bundle`: home 160 KB, content pages 155 KB, contact 169 KB, quote 173 KB |
| Hero SVG ≤ 30 KB | Auto | 2.6 KB |
| Noise texture on a real mid-range Android | **Open: device** | Lighthouse's 4× CPU throttle shows TBT ≤ 40 ms; a real device is still required |

## Browsers and access (Technical §13.2)

| Item | Status | How |
|---|---|---|
| Chrome (desktop) | Auto | Full e2e suite |
| Safari engine (WebKit desktop, iPhone 13 size) | Auto | Cross-browser e2e set: pages, quote, products, security, hero |
| Firefox | Auto in CI | Runs on Linux; Playwright's Firefox cannot start on the development Mac (macOS 27) |
| Edge, Samsung Internet, real iOS Safari, real Chrome on Android | **Open: devices** | Manual pass at 360, 390, 768, 1024, 1440 |
| No horizontal scroll at 360/390/768/1024/1280/1440 | Auto | e2e |
| axe: no serious or critical issues | Auto | Every page at 390 and 1440 |
| Keyboard only | Auto (key paths) / **Open: full pass** | e2e covers dropdown, menu, forms; a person should do a full pass |
| NVDA (Windows) and VoiceOver (macOS, iOS) | **Open** | Home, a family page, the quote flow |
| 200% and 400% zoom; reduced motion | **Open** | Manual |

## Infrastructure and security

| Item | Status | How |
|---|---|---|
| Security headers: CSP, HSTS, nosniff, referrer, permissions, no framing | Auto | e2e checks headers, and that no page reports a CSP violation (GA build included) |
| `npm audit` on production dependencies | Auto | 0 vulnerabilities. 5 high remain in dev-only lint tooling (no safe fix) |
| Staging protected and `noindex` | Auto (noindex) / **Open: protection** | Header, meta and robots done; password protection is a Vercel setting |
| HTTPS, apex → www redirect | **Open** | Vercel domain settings at cut-over |
| DNS records exported; TTL lowered; MX untouched; mail tested before and after; rollback ready | **Open: domain access** (Q-01) | `docs/LAUNCH_RUNBOOK.md` |
| Search Console and Bing verified; sitemap submitted; uptime monitor; synthetic test scheduled | **Open** | After cut-over |
| Rate limiting on `/api/*` | **Open: Vercel firewall** | Runbook step 3 |

## Compliance

| Item | Status | How |
|---|---|---|
| Privacy policy approved by counsel and published (F-66) | **Open: counsel** (Q-09) | Draft at `/privacy-policy` (preview only). The build blocks publishing while "Counsel to confirm" notes remain |
| Forms online in production | Waits for the item above | Both forms, and their APIs, are offline in production until F-66 |
| Analytics consent matches the policy | Auto | Consent e2e on a GA build. Set `NEXT_PUBLIC_GA_ID` only after the policy is live |

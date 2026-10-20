# Atharva Corrugations — Development Progress

Keep this file under 200 lines (Roadmap Phase C). Newest entry first.

## Status

| Milestone | Roadmap stage | Status |
|---|---|---|
| M1 Foundation | C1 | **Done 2026-10-20, awaiting owner review** |
| M2 Shell (navbar, footer, floating WhatsApp, 404) | C2 | Next |
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
- The Crease Mark draws on load, not on entering the viewport. The in-view trigger comes with the motion layer (M2).
- The noise texture is not added yet (paint-cost test first, Technical §8).
- No favicon until the logo arrives (Q-06).

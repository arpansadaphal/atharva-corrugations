/**
 * Performance budgets that Lighthouse cannot measure cleanly (Technical §8),
 * checked against the built HTML:
 * - first-load JavaScript per page (budgets below), gzipped: the scripts the page's
 *   HTML loads, excluding `noModule` polyfills (modern browsers never fetch
 *   them) and route code prefetched after load (Lighthouse's resource
 *   summary counts that too, which is why it is not used for this budget);
 * - the hero dieline SVG ≤ 30 KB.
 *
 * Usage: npm run build && npm run check:bundle
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const ROOT = new URL('..', import.meta.url).pathname
const APP = join(ROOT, '.next/server/app')
/**
 * Technical §8 sets 170 KB for the homepage; we hold every content page to
 * it. The two form pages also need react-hook-form and the form itself
 * (≈ 18 KB); validation (zod) is already deferred to first focus, so they
 * get 180 KB.
 */
const KB = 1024
const BUDGETS: Record<string, number> = { contact: 180 * KB, 'request-quote': 180 * KB }
const DEFAULT_BUDGET = 170 * KB
const HERO_SVG_BUDGET = 30 * KB
const PAGES = ['index', 'products', 'industries', 'custom-packaging', 'manufacturing-and-quality', 'about', 'contact', 'request-quote']

let failed = false
const rows = PAGES.map((page) => {
  const budget = BUDGETS[page] ?? DEFAULT_BUDGET
  const html = readFileSync(join(APP, `${page}.html`), 'utf8')
  const scripts = [...html.matchAll(/<script([^>]*)src="(\/_next\/static\/chunks\/[^"]+\.js)"([^>]*)>/g)]
    .filter(([, before, , after]) => !/noModule/i.test(before + after))
    .map(([, , src]) => src)
  const unique = [...new Set(scripts)]
  const bytes = unique.reduce((sum, src) => sum + gzipSync(readFileSync(join(ROOT, '.next', src.replace('/_next/', '')))).length, 0)
  const ok = bytes <= budget
  if (!ok) failed = true
  return {
    page,
    files: unique.length,
    'first-load JS (gzip)': `${(bytes / KB).toFixed(1)} KB`,
    budget: `${budget / KB} KB`,
    result: ok ? 'pass' : 'FAIL',
  }
})
console.table(rows)

const home = readFileSync(join(APP, 'index.html'), 'utf8')
const heroSvg = /<svg[^>]*class="[^"]*dieline-animate[\s\S]*?<\/svg>/.exec(home)?.[0] ?? ''
const svgOk = heroSvg.length > 0 && heroSvg.length <= HERO_SVG_BUDGET
if (!svgOk) failed = true
console.log(`Hero SVG: ${(heroSvg.length / 1024).toFixed(1)} KB (budget 30 KB) ${svgOk ? 'pass' : 'FAIL'}`)

if (failed) {
  console.error('\n✗ Performance budget exceeded.')
  process.exit(1)
}
console.log('\n✓ Bundle budgets met.')

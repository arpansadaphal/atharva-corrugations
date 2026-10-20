/**
 * Asserts the Design §5.3 contrast pairs against the live tokens in
 * src/app/globals.css (Technical plan §5). Exits 1 if any pair falls below
 * its minimum, so a token change (for example a new accent, D-01) cannot
 * silently break accessibility.
 *
 * Usage: npm run check:contrast
 */
import { readFileSync } from 'node:fs'
import { CONTRAST_PAIRS, contrastRatio, parseTokens } from '../src/lib/contrast'

const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8')
const tokens = parseTokens(css)

let failures = 0
const rows = CONTRAST_PAIRS.map((p) => {
  const fg = tokens[p.fg]
  const bg = tokens[p.bg]
  if (!fg || !bg) {
    failures++
    return { pair: `${p.fg} on ${p.bg}`, ratio: 'missing token', min: p.min, documented: p.documented, result: 'FAIL', use: p.use }
  }
  const ratio = contrastRatio(fg, bg)
  const pass = ratio >= p.min
  if (!pass) failures++
  const drift = Math.abs(ratio - p.documented) > 0.02 ? ' (differs from Design §5.3)' : ''
  return {
    pair: `${p.fg} on ${p.bg}`,
    ratio: ratio.toFixed(2),
    min: p.min,
    documented: p.documented,
    result: (pass ? 'pass' : 'FAIL') + drift,
    use: p.use,
  }
})

console.table(rows)

if (failures > 0) {
  console.error(`\n✗ ${failures} contrast pair(s) below minimum.`)
  process.exit(1)
}
console.log(`\n✓ All ${rows.length} contrast pairs meet their minimums.`)

/**
 * Claims gate (Technical plan §4.3, §13.3). Warns on preview builds and
 * blocks production (LAUNCH=true): run it before every production deploy.
 *
 * Fails when:
 * - a confirmed claim lacks evidence or verifiedOn, or has expired
 * - source references an unknown claim ID
 * - a file outside the gate reads the registry object directly
 * - a client component imports the gate (it cannot see LAUNCH)
 * - a minimum-count group (hero strip ≥ 3) is under its minimum (production)
 * - a placeholder string is present in src/
 *
 * Usage: npm run check:claims   ·   npm run check:claims:launch
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import {
  checkGroups,
  checkRegistry,
  findClaimRefs,
  clientReadsGate,
  isKnownClaim,
  readsRegistryDirectly,
  summary,
  trustFloor,
  type Problem,
} from './lib/claims-check'
import { claims } from '../src/data/claims'
import { isPublishable } from '../src/lib/claims'

const ROOT = new URL('..', import.meta.url).pathname
const production = process.env.LAUNCH === 'true'
const today = new Date()

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const problems: Problem[] = [...checkRegistry(today), ...checkGroups(production)]
const privacyPublished = isPublishable(claims['F-66'], today)
const usage = new Map<string, Set<string>>()

for (const path of walk(join(ROOT, 'src')).filter((p) => /\.(ts|tsx)$/.test(p))) {
  const file = relative(ROOT, path)
  const source = readFileSync(path, 'utf8')

  // definition files mention IDs by design; report usage in pages and components
  if (!/^src\/(data|group|types|lib)\//.test(file)) {
    for (const id of findClaimRefs(source)) {
      if (!isKnownClaim(id)) problems.push({ level: 'error', message: `${file}: unknown claim "${id}"` })
      usage.set(id, (usage.get(id) ?? new Set()).add(file))
    }
  }
  if (readsRegistryDirectly(file, source)) {
    problems.push({ level: 'error', message: `${file}: reads the claims registry directly; use <Gated> or gatedValue()` })
  }
  if (clientReadsGate(source)) {
    problems.push({ level: 'error', message: `${file}: client component imports the claims gate; resolve on the server` })
  }
  for (const marker of ['⚠', 'AWAITING', 'lorem', 'TODO']) {
    if (source.includes(marker)) problems.push({ level: 'error', message: `${file}: placeholder "${marker}"` })
  }
  // The draft privacy policy may not go live with open counsel points
  if (privacyPublished && source.includes('<CounselNote')) {
    problems.push({ level: 'error', message: `${file}: privacy policy is marked published (F-66) but still has counsel notes` })
  }
}

console.log(`Claims report — ${production ? 'PRODUCTION (blocking)' : 'preview (warnings only)'}\n`)
console.table(summary(today).map((r) => ({ ...r, usedIn: [...(usage.get(r.id) ?? [])].join(', ') || '—' })))

const trust = trustFloor(today)
console.log(`\nTrust floor (Strategy §6): ${trust.count} of ${trust.floor} verified homepage signals`)
console.table(trust.rows)
if (!trust.met) {
  console.warn(`! Below the trust floor: launch the reduced homepage or delay (owner decision at G6).`)
}

const errors = problems.filter((p) => p.level === 'error')
for (const p of problems) console[p.level === 'error' ? 'error' : 'warn'](`${p.level === 'error' ? '✗' : '!'} ${p.message}`)

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} claims error(s).`)
  process.exit(1)
}
console.log(`\n✓ Claims gate passed${problems.length ? ` with ${problems.length} warning(s)` : ''}.`)

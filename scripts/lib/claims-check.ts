import { claimGroups, claims } from '../../src/data/claims'
import { group } from '../../src/group/group'
import { isExpired, isPublishable, renderableIds, statusOf } from '../../src/lib/claims'
import type { Claim } from '../../src/types/claims'

/**
 * The checks behind scripts/check-claims.ts (Technical plan §4.3), kept
 * pure so they can be unit-tested.
 */

export interface Problem {
  level: 'error' | 'warning'
  message: string
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const CLAIM_REF = /['"`]((?:F|G)-[0-9A-Za-z]+)['"`]/g
/** Only these files may read the registry object directly; everything else goes through the gate. */
export const REGISTRY_READERS = ['src/lib/claims.ts', 'src/components/ui/Gated.tsx', 'src/components/ui/TitleBlock.tsx']

export function checkRegistry(today: Date): Problem[] {
  const problems: Problem[] = []
  const entries: [string, Claim<unknown>][] = [...Object.entries(claims), ...Object.entries(group)]
  for (const [key, c] of entries) {
    if (key !== c.id) problems.push({ level: 'error', message: `${key}: key does not match id "${c.id}"` })
    for (const field of ['verifiedOn', 'expiresOn'] as const) {
      const v = c[field]
      if (v && !ISO_DATE.test(v)) problems.push({ level: 'error', message: `${c.id}: ${field} "${v}" is not an ISO date` })
    }
    if (statusOf(c) === 'confirmed') {
      if (!c.evidence) problems.push({ level: 'error', message: `${c.id}: confirmed without evidence` })
      if (!c.verifiedOn) problems.push({ level: 'error', message: `${c.id}: confirmed without verifiedOn` })
      if (isExpired(c, today)) problems.push({ level: 'error', message: `${c.id}: expired on ${c.expiresOn}` })
    }
  }
  return problems
}

export function checkGroups(production: boolean): Problem[] {
  return Object.entries(claimGroups).flatMap(([name, g]) => {
    const n = renderableIds(g.ids, 'production').length
    if (n >= g.min) return []
    return [
      {
        level: production ? 'error' : 'warning',
        message: `group "${name}" (${g.description}) has ${n} confirmed claim(s); needs ${g.min}`,
      } satisfies Problem,
    ]
  })
}

/** Claim IDs referenced in a source file. */
export function findClaimRefs(source: string): string[] {
  return [...source.matchAll(CLAIM_REF)].map((m) => m[1])
}

/** Direct value imports of the registry outside the allowed readers. */
export function readsRegistryDirectly(file: string, source: string): boolean {
  if (REGISTRY_READERS.includes(file) || file === 'src/data/claims.ts') return false
  const imports = [...source.matchAll(/import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"]@\/data\/claims['"]/g)]
  return imports.some(
    ([, typeOnly, names]) =>
      !typeOnly &&
      names
        .split(',')
        .map((n) => n.trim())
        .some((n) => n === 'claims' || n.startsWith('claims ')),
  )
}

/**
 * Client components must not evaluate the gate: LAUNCH is not exposed to the
 * browser, so the client would disagree with the server. Resolve claims in a
 * server component and pass plain values down.
 */
export function clientReadsGate(source: string): boolean {
  const isClient = /^\s*['"]use client['"]/.test(source)
  return isClient && /from\s+['"]@\/(lib\/claims|data\/claims|group\/group)['"]/.test(source)
}

export function isKnownClaim(id: string): boolean {
  return id in claims || id in group
}

export function summary(today: Date) {
  return [...Object.values(claims), ...Object.values(group)].map((c: Claim<unknown>) => ({
    id: c.id,
    title: c.title,
    label: c.label,
    status: statusOf(c),
    launches: isPublishable(c, today) ? 'yes' : 'no',
  }))
}

import { familyEvidence } from '@/data/family-evidence'
import type { NavLink } from '@/data/navigation'
import { families, type Family } from '@/data/products'
import type { ClaimsMode } from '@/types/claims'
import { getClaim, getClaimsMode, isRenderable } from './claims'

/**
 * Minimum content bar (Strategy SD-01, Sitemap §1.1): a family gets its own
 * page only with ≥1 verified format, ≥2 verified applications, ≥4 verified
 * spec fields and ≥2 real photographs or our own drawings. Otherwise it is
 * a section of the products hub. Evaluated per mode, so pages appear by
 * themselves as evidence is confirmed.
 */

export const MCB = { formats: 1, applications: 2, specs: 4, visuals: 2 } as const

export interface McbResult {
  formats: number
  applications: string[]
  specs: number
  visuals: number
  passes: boolean
}

export function applicationsFor(f: Family, mode: ClaimsMode = getClaimsMode()): string[] {
  const a = familyEvidence[f.slug].applications
  if (!a) return []
  const c = getClaim(a.claim as Parameters<typeof getClaim>[0])
  return isRenderable(c, mode) ? a.read(c.value as never) : []
}

export function evaluateMcb(f: Family, mode: ClaimsMode = getClaimsMode()): McbResult {
  const ev = familyEvidence[f.slug]
  const formatsOk = isRenderable(getClaim(f.formatsClaim), mode)
  const formats = formatsOk ? f.formats.length : 0
  const applications = applicationsFor(f, mode)
  const specs = ev.specs.filter((s) => isRenderable(getClaim(s.claim), mode)).length
  const drawings = formatsOk ? f.formats.filter((x) => x.drawing).length : 0
  const visuals = drawings + ev.photos.length
  const passes =
    formats >= MCB.formats && applications.length >= MCB.applications && specs >= MCB.specs && visuals >= MCB.visuals
  return { formats, applications, specs, visuals, passes }
}

/** Folded families link to their section on the hub, never to a missing page */
export function familyHref(f: Family, mode: ClaimsMode = getClaimsMode()): string {
  return evaluateMcb(f, mode).passes ? `/products/${f.slug}` : `/products#${f.slug}`
}

/** The five families plus "All products", for the navbar and footer */
export function productLinks(mode: ClaimsMode = getClaimsMode()): NavLink[] {
  return [...families.map((f) => ({ label: f.name, href: familyHref(f, mode) })), { label: 'All products', href: '/products' }]
}

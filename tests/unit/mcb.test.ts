import { describe, expect, it } from 'vitest'
import { families, familyBySlug } from '@/data/products'
import { MCB, evaluateMcb, familyHref } from '@/lib/mcb'

describe('minimum content bar (SD-01)', () => {
  it('uses the thresholds from Sitemap §1.1', () => {
    expect(MCB).toEqual({ formats: 1, applications: 2, specs: 4, visuals: 2 })
  })

  it('in production today no family passes, so all fold into the hub', () => {
    for (const f of families) {
      expect(evaluateMcb(f, 'production').passes, f.slug).toBe(false)
      expect(familyHref(f, 'production')).toBe(`/products#${f.slug}`)
    }
  })

  it('corrugated boxes passes in preview: formats, four applications, five spec fields, two drawings', () => {
    const r = evaluateMcb(familyBySlug('corrugated-boxes')!, 'preview')
    expect(r).toMatchObject({ formats: 3, specs: 5, visuals: 2, passes: true })
    expect(r.applications).toEqual(['White goods', 'FMCG', 'Electronics', 'Food and beverage'])
  })

  it('in production corrugated boxes keeps only the confirmed ply field', () => {
    const r = evaluateMcb(familyBySlug('corrugated-boxes')!, 'production')
    expect(r.specs).toBe(1)
    expect(r.applications).toHaveLength(4)
  })

  it('families without drawings or photographs fold even in preview', () => {
    for (const slug of ['die-cut-boxes', 'heavy-duty-and-export-packaging', 'sheets-pads-and-inserts', 'protective-and-allied-packaging']) {
      expect(evaluateMcb(familyBySlug(slug)!, 'preview').passes, slug).toBe(false)
    }
  })

  it('sheets, pads and inserts has no applications (Q-25)', () => {
    expect(evaluateMcb(familyBySlug('sheets-pads-and-inserts')!, 'preview').applications).toEqual([])
  })
})

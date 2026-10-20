import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CONTRAST_PAIRS, contrastRatio, parseTokens } from '@/lib/contrast'
import { formatPhone, telHref } from '@/lib/format'
import { findBanned } from '../../scripts/lib/banned'
import { findClaimRefs, readsRegistryDirectly } from '../../scripts/lib/claims-check'

describe('contrast', () => {
  it('reproduces the Design §5.3 reference ratios', () => {
    expect(contrastRatio('#0F172A', '#FFFFFF')).toBeCloseTo(17.85, 2)
    expect(contrastRatio('#FFFFFF', '#25D366')).toBeCloseTo(1.98, 2)
    expect(contrastRatio('#64748B', '#0F172A')).toBeCloseTo(3.75, 2)
  })

  it('every documented pair passes against the live tokens', () => {
    const tokens = parseTokens(readFileSync('src/app/globals.css', 'utf8'))
    for (const p of CONTRAST_PAIRS) {
      expect(tokens[p.fg], p.fg).toBeDefined()
      expect(contrastRatio(tokens[p.fg], tokens[p.bg]), p.use).toBeGreaterThanOrEqual(p.min)
    }
  })

  it('a deliberately broken accent fails', () => {
    const tokens = parseTokens(':root {\n  --accent: #7dd3fc;\n  --paper-0: #ffffff;\n}')
    expect(contrastRatio(tokens['--accent'], tokens['--paper-0'])).toBeLessThan(4.5)
  })
})

describe('banned strings', () => {
  const planted = ['world', 'class'].join('-')

  it('catches a planted superlative', () => {
    expect(findBanned(`We are ${planted}.`, 'x.tsx').map((h) => h.term)).toEqual(['world-class'])
  })
  it('catches Group cross-contamination', () => {
    const text = ['Atharva', 'Polymers'].join(' ')
    expect(findBanned(text, 'x.tsx').map((h) => h.term)).toContain('Atharva Polymers')
  })
  it('does not flag years inside other numbers', () => {
    expect(findBanned('M120.2008 L3 2014', 'x.svg')).toEqual([])
  })
})

describe('claims check helpers', () => {
  it('finds claim references in source', () => {
    expect(findClaimRefs(`<Gated claim="F-23">… cell('F-03', …) group['G-name']`)).toEqual(['F-23', 'F-03', 'G-name'])
  })
  it('flags direct registry reads outside the gate, not type imports', () => {
    expect(readsRegistryDirectly('src/app/page.tsx', "import { claims } from '@/data/claims'")).toBe(true)
    expect(readsRegistryDirectly('src/app/page.tsx', "import type { ClaimId } from '@/data/claims'")).toBe(false)
    expect(readsRegistryDirectly('src/components/ui/Gated.tsx', "import { claims } from '@/data/claims'")).toBe(false)
  })
})

describe('format', () => {
  it('formats phones per Content §10.2', () => {
    expect(formatPhone('9960378111')).toBe('+91 99603 78111')
    expect(telHref('99603 78111')).toBe('tel:+919960378111')
  })
})

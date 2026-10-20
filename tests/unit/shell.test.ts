import { describe, expect, it } from 'vitest'
import { primaryNav } from '@/data/navigation'
import { families, familyBySlug } from '@/data/products'
import { familyHref, productLinks } from '@/lib/mcb'
import { FLOATING_TOKEN, contextForPath, whatsappMessage, whatsappUrl } from '@/lib/whatsapp'
import { clientReadsGate } from '../../scripts/lib/claims-check'

describe('navigation', () => {
  it('lists the six primary links in Sitemap §3 order, Home via the logo', () => {
    expect(primaryNav.map((l) => l.label)).toEqual([
      'Products',
      'Industries',
      'Custom Packaging',
      'Manufacturing & Quality',
      'About',
      'Contact',
    ])
  })
  it('lists five families plus All products', () => {
    const links = productLinks('preview')
    expect(links).toHaveLength(6)
    expect(links.at(-1)).toEqual({ label: 'All products', href: '/products' })
  })
  it('points folded families at the hub anchor, others at their page', () => {
    expect(familyHref(familyBySlug('sheets-pads-and-inserts')!, 'preview')).toBe('/products#sheets-pads-and-inserts')
    expect(familyHref(familyBySlug('corrugated-boxes')!, 'preview')).toBe('/products/corrugated-boxes')
    expect(familyHref(familyBySlug('corrugated-boxes')!, 'production')).toBe('/products#corrugated-boxes')
  })
  it('gives every family a unique WhatsApp token', () => {
    expect(new Set(families.map((f) => f.token)).size).toBe(families.length)
  })
})

describe('whatsapp', () => {
  it('maps pages and families to source tokens', () => {
    expect(contextForPath('/').token).toBe('WEB-HOME')
    expect(contextForPath('/products/die-cut-boxes/')).toEqual({ token: 'WEB-DIECUT', subject: 'die-cut boxes' })
    expect(contextForPath('/contact').token).toBe('WEB-CONTACT')
    expect(contextForPath('/somewhere-new').token).toBe('WEB-OTHER')
  })
  it('uses the Content §10.3 template', () => {
    expect(whatsappMessage({ token: FLOATING_TOKEN, subject: 'die-cut boxes' })).toBe(
      'Hello Atharva Corrugations, I would like a quote for die-cut boxes. Ref: WEB-FLOAT.',
    )
  })
  it('builds a wa.me link with the 91 prefix and an encoded message', () => {
    const url = new URL(whatsappUrl('99603 78111', { token: 'WEB-HOME', subject: 'corrugated packaging' }))
    expect(url.origin + url.pathname).toBe('https://wa.me/919960378111')
    expect(url.searchParams.get('text')).toContain('Ref: WEB-HOME.')
  })
})

describe('client gate rule', () => {
  it('flags client components that import the gate', () => {
    expect(clientReadsGate("'use client'\nimport { gatedValue } from '@/lib/claims'")).toBe(true)
    expect(clientReadsGate("import { gatedValue } from '@/lib/claims'")).toBe(false)
    expect(clientReadsGate("'use client'\nimport { cn } from '@/lib/utils'")).toBe(false)
  })
})

import { afterEach, describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { whatsappToken } from '@/lib/analytics'
import { breadcrumbSchema, jsonLd, organizationSchema, websiteSchema } from '@/lib/schema'

afterEach(() => {
  process.env.LAUNCH = ''
})

describe('sitemap (launched routes only)', () => {
  it('in production: the nine core pages, no folded families, no privacy draft, no specimen', () => {
    process.env.LAUNCH = 'true'
    const urls = sitemap().map((e) => e.url)
    expect(urls).toContain('https://www.atharvacorrugations.com')
    expect(urls).toContain('https://www.atharvacorrugations.com/request-quote')
    expect(urls.some((u) => u.includes('/products/'))).toBe(false)
    expect(urls.some((u) => /privacy|specimen/.test(u))).toBe(false)
    expect(urls).toHaveLength(8)
  })

  it('in preview: the family that passes the bar and the draft policy appear', () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls).toContain('https://www.atharvacorrugations.com/products/corrugated-boxes')
    expect(urls).toContain('https://www.atharvacorrugations.com/privacy-policy')
  })
})

describe('robots', () => {
  it('production allows crawling and points at the sitemap; preview blocks everything', () => {
    process.env.LAUNCH = 'true'
    expect(robots()).toMatchObject({ rules: { allow: '/' }, sitemap: 'https://www.atharvacorrugations.com/sitemap.xml' })
    process.env.LAUNCH = ''
    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } })
  })
})

describe('structured data', () => {
  it('organisation: confirmed address and contact point; no logo, founding date or parent', () => {
    process.env.LAUNCH = 'true'
    const org = organizationSchema() as Record<string, unknown>
    expect(org).toMatchObject({
      '@type': 'Organization',
      address: { postalCode: '412220', addressCountry: 'IN' },
      contactPoint: { telephone: '+91-9960378111', email: 'sales@atharvacorrugations.com' },
    })
    for (const absent of ['logo', 'foundingDate', 'parentOrganization', 'sameAs', 'aggregateRating']) expect(org).not.toHaveProperty(absent)
  })

  it('breadcrumbs carry absolute URLs; the current page has no link', () => {
    const b = breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Corrugated boxes' }])
    expect(b.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.atharvacorrugations.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.atharvacorrugations.com/products' },
      { '@type': 'ListItem', position: 3, name: 'Corrugated boxes' },
    ])
    expect(websiteSchema().url).toBe('https://www.atharvacorrugations.com')
  })

  it('escapes "<" so a value cannot close the script tag', () => {
    expect(jsonLd({ name: '</script><b>' })).toBe('{"name":"\\u003c/script>\\u003cb>"}')
  })
})

describe('analytics helpers', () => {
  it('reads the source token from a WhatsApp link', () => {
    const href = `https://wa.me/919960378111?text=${encodeURIComponent('Hello Atharva Corrugations, I would like a quote for die-cut boxes. Ref: WEB-DIECUT.')}`
    expect(whatsappToken(href)).toBe('WEB-DIECUT')
    expect(whatsappToken('tel:+919960378111')).toBeUndefined()
  })
})

import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import ReviewPage from '@/app/review/page'
import { approvals, claimLocations } from '@/data/claim-locations'
import { allClaims, getClaim, isPublishable, reviewAttrs, statusOf } from '@/lib/claims'

const ROUTES = ['/', '/products', '/products/corrugated-boxes', '/industries', '/custom-packaging', '/manufacturing-and-quality', '/about', '/contact', '/request-quote', '/privacy-policy']
const open = allClaims().filter((c) => !isPublishable(c) && statusOf(c) !== 'restricted')

afterEach(() => {
  process.env.LAUNCH = ''
})

describe('review checklist data', () => {
  it('lists a location (or an explicit "not shown yet") for every unconfirmed claim', () => {
    const missing = open.filter((c) => !(c.id in claimLocations)).map((c) => c.id)
    expect(missing).toEqual([])
  })

  it('points only at real routes', () => {
    const hrefs = [...Object.values(claimLocations).flat(), ...approvals.flatMap((a) => a.links)].map((l) => l.href)
    for (const href of hrefs) expect(ROUTES, href).toContain(href.split('#')[0] || '/')
  })

  it('holds no facts: every key is an existing claim', () => {
    const ids = new Set(allClaims().map((c) => c.id))
    for (const id of Object.keys(claimLocations)) expect(ids.has(id), id).toBe(true)
  })
})

describe('review markers', () => {
  it('mark unconfirmed claims in preview and development only', () => {
    expect(reviewAttrs(getClaim('F-23'), 'preview')).toEqual({ 'data-review-claim': 'F-23' })
    expect(reviewAttrs(getClaim('F-23'), 'development')).toEqual({ 'data-review-claim': 'F-23' })
    expect(reviewAttrs(getClaim('F-23'), 'production')).toEqual({})
    expect(reviewAttrs(getClaim('F-03'), 'preview')).toEqual({})
  })
})

describe('/review page', () => {
  it('lists every unconfirmed fact in preview', () => {
    const html = renderToStaticMarkup(<ReviewPage />)
    for (const c of open) expect(html, c.id).toContain(`id="claim-${c.id}"`)
    expect(html).toContain('Technical drawings')
  })

  it('does not exist in production', () => {
    process.env.LAUNCH = 'true'
    expect(() => renderToStaticMarkup(<ReviewPage />)).toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/)
  })
})

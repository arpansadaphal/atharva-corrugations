import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import Home from '@/app/page'
import { claims } from '@/data/claims'
import type { Claim } from '@/types/claims'

/** Section surfaces in order, with the footer (always dark) appended */
function surfaces(html: string) {
  return [...html.matchAll(/<section(?: id="[^"]*")? data-surface="(dark|light)"/g)].map((m) => m[1]).concat('dark')
}

/** Sitemap §6.1: never more than two dark or three light sections in a row */
function rhythmHolds(seq: string[]) {
  let run = 1
  for (let i = 1; i < seq.length; i++) {
    run = seq[i] === seq[i - 1] ? run + 1 : 1
    if ((seq[i] === 'dark' && run > 2) || (seq[i] === 'light' && run > 3)) return false
  }
  return true
}

const render = (launch: boolean) => {
  process.env.LAUNCH = launch ? 'true' : ''
  return renderToStaticMarkup(<Home />)
}

const iso = claims['F-40'] as Claim<unknown>
const isoOriginal = { ...iso }

afterEach(() => {
  process.env.LAUNCH = ''
  Object.assign(iso, isoOriginal)
  delete iso.evidence
  delete iso.verifiedOn
})

describe('homepage in three claim states (Roadmap §5.1)', () => {
  it('all claims (preview): every evidence-backed section renders and the rhythm holds', () => {
    const html = render(false)
    expect(html).toContain('3 to 9 ply')
    expect(html).toContain('Certificates and ratings')
    expect(html).toContain('Converting')
    expect(surfaces(html)).toEqual(['dark', 'light', 'light', 'light', 'dark', 'light', 'light', 'dark', 'dark'])
    expect(rhythmHolds(surfaces(html))).toBe(true)
  })

  it('only confirmed claims (production today): reduced homepage, no unverified text, rhythm holds', () => {
    const html = render(true)
    for (const unverified of ['3 to 9 ply', 'GSM', 'ISO 9001', 'EcoVadis', 'Converting', 'Paper core', 'Open in Maps']) {
      expect(html, unverified).not.toContain(unverified)
    }
    expect(html).not.toContain('Certificates and ratings')
    expect(html).toContain('Operating since')
    expect(html).toContain('Our customers audit and approve our plant.')
    expect(rhythmHolds(surfaces(html))).toBe(true)
    // the hero strip keeps its minimum of three confirmed cells
    expect((html.match(/<dt/g) ?? []).length).toBeGreaterThanOrEqual(3)
  })

  it('some claims (ISO certificate verified): the trust row appears with the ISO card only', () => {
    Object.assign(iso, { label: 'CONFIRMED', evidence: 'test certificate', verifiedOn: '2026-10-20' })
    const html = render(true)
    expect(html).toContain('Certificates and ratings')
    expect(html).toContain('ISO 9001:2015')
    expect(html).not.toContain('EcoVadis')
    expect(rhythmHolds(surfaces(html))).toBe(true)
  })

  it('has exactly one H1', () => {
    expect((render(false).match(/<h1/g) ?? []).length).toBe(1)
    expect((render(true).match(/<h1/g) ?? []).length).toBe(1)
  })
})

describe('rhythm rule', () => {
  it('rejects three dark or four light in a row', () => {
    expect(rhythmHolds(['dark', 'dark', 'dark'])).toBe(false)
    expect(rhythmHolds(['light', 'light', 'light', 'light'])).toBe(false)
    expect(rhythmHolds(['dark', 'light', 'light', 'light', 'dark', 'dark'])).toBe(true)
  })
})

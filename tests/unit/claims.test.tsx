import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Gated } from '@/components/ui/Gated'
import { TitleBlock, cell } from '@/components/ui/TitleBlock'
import { claims } from '@/data/claims'
import { gatedValue, getClaimsMode, isExpired, isPublishable, isRenderable, statusOf } from '@/lib/claims'
import { checkRegistry } from '../../scripts/lib/claims-check'
import type { Claim } from '@/types/claims'

const base: Claim<string> = { id: 'T-1', title: 'Test', value: 'x', label: 'VERIFY' }

describe('status mapping (Audit labels → render status)', () => {
  it.each([
    ['CONFIRMED', 'confirmed'],
    ['VERIFY', 'verify'],
    ['CONFLICT', 'verify'],
    ['MISSING', 'missing'],
    ['EXTERNAL', 'restricted'],
    ['RESTRICTED', 'restricted'],
  ] as const)('%s → %s', (label, status) => {
    expect(statusOf({ label })).toBe(status)
  })
})

describe('mode', () => {
  it('LAUNCH=true is production regardless of NODE_ENV', () => {
    expect(getClaimsMode({ LAUNCH: 'true', NODE_ENV: 'development' } as NodeJS.ProcessEnv)).toBe('production')
  })
  it('next dev is development; any other build is preview', () => {
    expect(getClaimsMode({ NODE_ENV: 'development' } as NodeJS.ProcessEnv)).toBe('development')
    expect(getClaimsMode({ NODE_ENV: 'production' } as NodeJS.ProcessEnv)).toBe('preview')
  })
})

describe('isRenderable', () => {
  const confirmed: Claim<string> = { ...base, label: 'CONFIRMED', evidence: 'doc', verifiedOn: '2026-10-12' }

  it('production renders confirmed claims only', () => {
    expect(isRenderable(confirmed, 'production')).toBe(true)
    expect(isRenderable(base, 'production')).toBe(false)
  })
  it('preview and development render unverified but never restricted claims', () => {
    expect(isRenderable(base, 'preview')).toBe(true)
    expect(isRenderable(base, 'development')).toBe(true)
    expect(isRenderable({ ...base, label: 'RESTRICTED' }, 'preview')).toBe(false)
    expect(isRenderable({ ...base, label: 'EXTERNAL' }, 'development')).toBe(false)
  })
  it('an expired confirmed claim does not launch', () => {
    const expired = { ...confirmed, expiresOn: '2020-01-01' }
    const asOf = new Date('2026-10-20')
    expect(isExpired(expired, asOf)).toBe(true)
    expect(isPublishable(expired, asOf)).toBe(false)
    expect(isPublishable(confirmed, asOf)).toBe(true)
  })
})

describe('registry', () => {
  it('passes its own integrity checks', () => {
    expect(checkRegistry(new Date('2026-10-20')).filter((p) => p.level === 'error')).toEqual([])
  })
  it('stores no restricted facts', () => {
    expect(Object.values(claims).filter((c) => statusOf(c) === 'restricted')).toEqual([])
  })
  it('gatedValue hides unverified values in production', () => {
    expect(gatedValue('F-03', 'production')).toBe(2014)
    expect(gatedValue('F-23', 'production')).toBeUndefined()
    expect(gatedValue('F-23', 'preview')).toEqual([120, 440])
  })
})

describe('<Gated>', () => {
  const html = (mode: 'development' | 'preview' | 'production', id: 'F-03' | 'F-40') =>
    renderToStaticMarkup(
      <Gated claim={id} mode={mode}>
        <b>content</b>
      </Gated>,
    )

  it('renders nothing for an unverified claim in production', () => {
    expect(html('production', 'F-40')).toBe('')
  })
  it('renders confirmed claims without a wrapper in every mode', () => {
    for (const mode of ['development', 'preview', 'production'] as const) expect(html(mode, 'F-03')).toBe('<b>content</b>')
  })
  it('marks unverified claims for the client review in preview and development, never in production', () => {
    for (const mode of ['development', 'preview'] as const) {
      const out = html(mode, 'F-40')
      // a single element carries the marker itself: no wrapper, valid lists and tables
      expect(out).toBe('<b data-review-claim="F-40" data-claim-status="verify">content</b>')
    }
    const wrapped = renderToStaticMarkup(
      <Gated claim="F-40" mode="preview">
        <b>a</b>
        <b>b</b>
      </Gated>,
    )
    expect(wrapped).toContain('class="contents"') // several children: layout-neutral wrapper
    expect(html('production', 'F-40')).toBe('')
    expect(html('preview', 'F-03')).toBe('<b>content</b>') // confirmed: no marker
  })
  it('passes the typed value to a render function', () => {
    const out = renderToStaticMarkup(
      <Gated claim="F-03" mode="production">
        {(year) => <span>since {year}</span>}
      </Gated>,
    )
    expect(out).toBe('<span>since 2014</span>')
  })
})

describe('<TitleBlock>', () => {
  const cells = [
    cell('F-03', 'Operating since', (y) => y),
    cell('F-04', 'Plant', (n) => n),
    cell('F-07', 'Group', () => 'Atharva Group'),
    cell('F-20', 'Board', (p) => p.join('/')),
    cell('F-40', 'Certified', (c) => c.standard),
  ]
  const count = (out: string) => (out.match(/<dt/g) ?? []).length

  it('shows confirmed cells only in production', () => {
    expect(count(renderToStaticMarkup(<TitleBlock cells={cells} mode="production" />))).toBe(3)
  })
  it('caps at four cells', () => {
    expect(count(renderToStaticMarkup(<TitleBlock cells={cells} mode="preview" />))).toBe(4)
  })
  it('renders nothing below its minimum', () => {
    expect(renderToStaticMarkup(<TitleBlock cells={cells.slice(3)} min={1} mode="production" />)).toBe('')
  })
})

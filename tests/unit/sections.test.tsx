import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { rscDieline } from '@/components/illustration/dieline'
import { ManufacturingQuality, capabilityGroups } from '@/components/sections/ManufacturingQuality'

describe('RSC dieline', () => {
  const d = rscDieline({ length: 400, width: 300, height: 200, glueFlap: 35 })

  it('lays out glue flap then L, W, L, W panels with W/2 flaps', () => {
    expect(d.x).toEqual([0, 35, 435, 735, 1135, 1435])
    expect(d.y).toEqual([0, 150, 350, 500])
    expect(d.width).toBe(1435)
    expect(d.height).toBe(500)
  })

  it('has one outline and six slot cuts, two flap creases and four panel creases', () => {
    expect(d.cuts).toHaveLength(7)
    expect(d.creases).toHaveLength(6)
  })

  it('rejects impossible boxes', () => {
    expect(() => rscDieline({ length: 0, width: 300, height: 200 })).toThrow()
  })
})

describe('manufacturing and quality', () => {
  it('groups capabilities by stage, with varnish and coating marked as partner work', () => {
    const groups = capabilityGroups('preview')
    expect(groups.map((g) => g.title)).toEqual(['Converting', 'Printing and finishing', 'Protection', 'Quality checks'])
    expect(groups[1].items).toContain('Varnish and coating, through partners')
  })
  it('drops unverified groups at launch and leaves the confirmed statement', () => {
    expect(capabilityGroups('production')).toEqual([])
    const html = renderToStaticMarkup(<ManufacturingQuality mode="production" />)
    expect(html).toContain('Our customers audit and approve our plant.')
    expect(html).not.toContain('ISO 9001')
    expect(html).not.toContain('Converting')
  })
})

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { rscDieline, slottedDieline } from '@/components/illustration/dieline'
import { ManufacturingQuality, capabilityGroups } from '@/components/sections/ManufacturingQuality'

describe('RSC dieline', () => {
  const d = rscDieline({ length: 400, width: 300, height: 200, glueFlap: 35 })

  it('lays out glue flap then L, W, L, W panels with W/2 flaps', () => {
    expect(d.x).toEqual([0, 35, 435, 735, 1135, 1435])
    expect(d.y).toEqual([0, 150, 350, 500])
    expect(d.width).toBe(1435)
    expect(d.height).toBe(500)
  })

  it('cuts eight flaps, the glue flap and the end edge; creases two folds and four panel lines', () => {
    expect(d.cuts).toHaveLength(10)
    expect(d.creases).toHaveLength(6)
  })

  it('full overlap makes the outer flaps W deep and the inner flaps W/2', () => {
    const fol = slottedDieline({ length: 400, width: 300, height: 200, glueFlap: 35, style: 'fol' })
    expect(fol.y).toEqual([0, 300, 500, 800])
    expect(fol.cuts[0]).toBe('M35 300 V0 H435 V300') // outer flap on the first L panel
    expect(fol.cuts[2]).toBe('M435 300 V150 H735 V300') // inner flap on the W panel
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

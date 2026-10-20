import { describe, expect, it, vi } from 'vitest'
import { contactAutoReply, contactTeamEmail } from '@/lib/email'
import { handleContact } from '@/lib/contact-handler'
import { REFERENCE_PATTERN } from '@/lib/reference'
import { rfqConfig } from '@/lib/rfq-config'
import { contactSchema } from '@/lib/rfq-schema'

const config = rfqConfig('preview', {})
const valid = {
  name: 'Asha Rao',
  company: 'Example Engineering',
  email: 'asha@example.com',
  phone: '98765 43210',
  message: 'We need packaging for compressors.',
}
const deps = (send = vi.fn().mockResolvedValue(undefined)) => ({ config, production: false, send, verify: vi.fn().mockResolvedValue(true) })

describe('general enquiry', () => {
  it('routes to the general address with an ACG reference, then auto-replies', async () => {
    const d = deps()
    const r = await handleContact({ data: valid, elapsedMs: 5000 }, d)
    expect(r.status).toBe(200)
    if (r.status !== 200) return
    expect(REFERENCE_PATTERN.test(r.body.reference)).toBe(true)
    expect(r.body.reference.startsWith('ACG-')).toBe(true)
    const [team] = d.send.mock.calls[0]
    expect(team.to).toEqual(['saket.ithape@atharvacorrugations.com'])
    expect(team.replyTo).toBe('asha@example.com')
    expect(team.subject).toMatch(/^Enquiry ACG-\d{6}-\w{4} · Example Engineering$/)
    expect(d.send.mock.calls[1][0].to).toEqual(['asha@example.com'])
  })

  it('shares the quote form screening: honeypot, speed, offline', async () => {
    expect((await handleContact({ data: valid, elapsedMs: 5000, website: 'x' }, deps())).status).toBe(422)
    expect((await handleContact({ data: valid, elapsedMs: 100 }, deps())).status).toBe(422)
    expect((await handleContact({ data: valid, elapsedMs: 5000 }, { ...deps(), config: rfqConfig('production', {}) })).status).toBe(503)
  })

  it('returns field errors, and a 502 on mail failure', async () => {
    const bad = await handleContact({ data: { ...valid, message: 'short' }, elapsedMs: 5000 }, deps())
    expect(bad).toMatchObject({ status: 400, body: { fields: { message: 'Your message needs at least 10 characters' } } })
    const down = await handleContact({ data: valid, elapsedMs: 5000 }, deps(vi.fn().mockRejectedValue(new Error('x'))))
    expect(down.status).toBe(502)
  })

  it('escapes values in email HTML', () => {
    const d = contactSchema.parse({ ...valid, company: 'A & B' })
    const ctx = { reference: 'ACG-261020-AAAA', replyPromise: '2 working days' }
    expect(contactTeamEmail(d, ctx).html).toContain('A &amp; B')
    expect(contactAutoReply(d, ctx).text).toContain('We reply within 2 working days.')
  })
})

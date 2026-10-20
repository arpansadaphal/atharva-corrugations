import { describe, expect, it, vi } from 'vitest'
import { autoReply, escapeHtml, headerSafe, summaryRows, teamEmail } from '@/lib/email'
import { REFERENCE_PATTERN, makeReference } from '@/lib/reference'
import { rfqConfig } from '@/lib/rfq-config'
import { handleRfq } from '@/lib/rfq-handler'
import { isValidPhone, makeRfqSchema, type RfqData } from '@/lib/rfq-schema'

const preview = rfqConfig('preview', {})
const schema = makeRfqSchema({ boardValues: preview.boardValues, industries: preview.industries })

const valid = {
  enquiryType: 'quote',
  family: 'die-cut-boxes',
  packing: 'Compressor housing, about 40 kg',
  quantities: [{ qty: '500' }],
  repeat: 'monthly',
  name: 'Asha Rao',
  company: 'Example Engineering',
  email: 'asha@example.com',
  phone: '98765 43210',
}

describe('schema', () => {
  it('accepts a minimal valid request and coerces numbers', () => {
    const r = schema.safeParse(valid)
    expect(r.success).toBe(true)
    expect(r.data?.quantities[0].qty).toBe(500)
  })

  it('requires the core fields', () => {
    const r = schema.safeParse({})
    const paths = r.error!.issues.map((i) => i.path.join('.'))
    expect(paths).toEqual(expect.arrayContaining(['enquiryType', 'family', 'packing', 'repeat', 'name', 'company', 'email', 'phone']))
  })

  it('validates phones per Technical §7.2', () => {
    expect(isValidPhone('98765 43210')).toBe(true)
    expect(isValidPhone('+91-98765-43210')).toBe(true)
    expect(isValidPhone('09876543210')).toBe(true)
    expect(isValidPhone('+44 20 7946 0958')).toBe(true)
    expect(isValidPhone('12345 67890')).toBe(false)
    expect(isValidPhone('98765')).toBe(false)
  })

  it('rejects markup in free text', () => {
    expect(schema.safeParse({ ...valid, packing: '<script>alert(1)</script> boxes' }).success).toBe(false)
  })

  it('wants all three dimensions or none, unless a drawing is coming', () => {
    expect(schema.safeParse({ ...valid, lengthMm: '400' }).success).toBe(false)
    expect(schema.safeParse({ ...valid, lengthMm: '400', widthMm: '300', heightMm: '200' }).success).toBe(true)
    expect(schema.safeParse({ ...valid, lengthMm: '400', sendDrawingInstead: true }).success).toBe(true)
    expect(schema.safeParse({ ...valid, lengthMm: '4', widthMm: '300', heightMm: '200' }).success).toBe(false)
  })

  it('allows at most three quantities, each a positive whole number', () => {
    expect(schema.safeParse({ ...valid, quantities: [{ qty: '1' }, { qty: '2' }, { qty: '3' }, { qty: '4' }] }).success).toBe(false)
    expect(schema.safeParse({ ...valid, quantities: [{ qty: '2.5' }] }).success).toBe(false)
    expect(schema.safeParse({ ...valid, quantities: [{ qty: '0' }] }).success).toBe(false)
  })

  it('accepts only board options the page offered', () => {
    expect(schema.safeParse({ ...valid, board: '5-ply' }).success).toBe(true)
    const launch = rfqConfig('production', {})
    const launchSchema = makeRfqSchema({ boardValues: launch.boardValues, industries: launch.industries })
    expect(launchSchema.safeParse({ ...valid, board: '5-ply' }).success).toBe(false)
    expect(launchSchema.safeParse({ ...valid, board: 'not-sure' }).success).toBe(true)
  })

  it('keeps delivery location optional while the owner decides (F-3)', () => {
    expect(schema.safeParse({ ...valid, deliveryLocation: '' }).success).toBe(true)
  })
})

describe('config through the claims gate', () => {
  it('offers unverified ply options in preview only', () => {
    expect(preview.boardOptions.map((o) => o.label)).toEqual(['Not sure', '3 ply', '5 ply', '7 ply', '9 ply'])
    expect(rfqConfig('production', {}).boardOptions.map((o) => o.label)).toEqual(['Not sure'])
  })
  it('keeps the form offline in production until the privacy policy is published', () => {
    expect(preview.formEnabled).toBe(true)
    expect(rfqConfig('production', {}).formEnabled).toBe(false)
  })
  it('routes to sales@ with the named contact in copy, overridable by env', () => {
    expect(preview.routing.to).toEqual(['sales@atharvacorrugations.com'])
    expect(preview.routing.cc).toEqual(['saket.ithape@atharvacorrugations.com'])
    expect(rfqConfig('preview', { RFQ_TO: 'a@x.in,b@x.in' }).routing.to).toEqual(['a@x.in', 'b@x.in'])
  })
})

describe('reference', () => {
  it('is ACQ-YYMMDD-XXXX in India time', () => {
    // 20:00 UTC on 20 Oct is already 21 Oct in India
    const ref = makeReference(new Date('2026-10-20T20:00:00Z'), new Uint8Array([0, 1, 31, 32]))
    expect(ref).toBe('ACQ-261021-01Z0')
    expect(REFERENCE_PATTERN.test(makeReference(new Date()))).toBe(true)
  })
})

describe('emails', () => {
  const data = schema.parse({ ...valid, company: 'Evil\r\nBcc: x@y.z', notes: 'Fragile & heavy "parts"' }) as RfqData
  const ctx = { reference: 'ACQ-261020-AB12', replyPromise: '2 working days' }

  it('escapes HTML and strips header line breaks', () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#39;')
    expect(headerSafe('a\r\nBcc: b')).toBe('a Bcc: b')
    const team = teamEmail(data, ctx)
    expect(team.subject).not.toMatch(/[\r\n]/)
    expect(team.subject).toBe('RFQ ACQ-261020-AB12 · Evil Bcc: x@y.z · Die-cut boxes')
    expect(team.html).toContain('Fragile &amp; heavy &quot;parts&quot;')
  })

  it('auto-reply carries the reference, reply time and drawing instructions', () => {
    const mail = autoReply(data, { ...ctx, whatsappDisplay: '+91 99603 78111' })
    expect(mail.subject).toBe('We received your enquiry ACQ-261020-AB12 · Atharva Corrugations')
    expect(mail.text).toContain('We reply within 2 working days.')
    expect(mail.text).toContain('message us on WhatsApp at +91 99603 78111')
  })

  it('summary leaves out empty fields', () => {
    const labels = summaryRows(data).map(([k]) => k)
    expect(labels).toContain('Quantity')
    expect(labels).not.toContain('Board')
  })
})

describe('handler', () => {
  const envelope = (over: Record<string, unknown> = {}) => ({ data: valid, website: '', elapsedMs: 8000, ...over })
  const deps = (send = vi.fn().mockResolvedValue(undefined)) => ({
    config: preview,
    production: false,
    now: new Date('2026-10-20T06:00:00Z'),
    send,
    verify: vi.fn().mockResolvedValue(true),
  })

  it('sends the team email then the auto-reply and returns a reference', async () => {
    const d = deps()
    const r = await handleRfq(envelope(), d)
    expect(r.status).toBe(200)
    expect(r.body).toMatchObject({ ok: true })
    expect(d.send).toHaveBeenCalledTimes(2)
    const [team] = d.send.mock.calls[0]
    expect(team.to).toEqual(['sales@atharvacorrugations.com'])
    expect(team.replyTo).toBe('asha@example.com')
    const [reply] = d.send.mock.calls[1]
    expect(reply.to).toEqual(['asha@example.com'])
    expect(reply.replyTo).toBe('sales@atharvacorrugations.com')
  })

  it('rejects a filled honeypot or a too-fast submission without saying why', async () => {
    for (const over of [{ website: 'http://spam' }, { elapsedMs: 500 }]) {
      const d = deps()
      const r = await handleRfq(envelope(over), d)
      expect(r).toEqual({ status: 422, body: { ok: false, code: 'REJECTED' } })
      expect(d.send).not.toHaveBeenCalled()
    }
  })

  it('returns field errors for invalid data', async () => {
    const r = await handleRfq(envelope({ data: { ...valid, email: 'nope' } }), deps())
    expect(r.status).toBe(400)
    expect(r.body).toMatchObject({ code: 'INVALID', fields: { email: 'Enter a valid email address' } })
  })

  it('returns 502 when the team email fails, so the customer sees the error state', async () => {
    const r = await handleRfq(envelope(), deps(vi.fn().mockRejectedValue(new Error('down'))))
    expect(r).toEqual({ status: 502, body: { ok: false, code: 'MAIL_FAILED' } })
  })

  it('still succeeds when only the auto-reply fails (the lead is safe)', async () => {
    const send = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('bounce'))
    const r = await handleRfq(envelope(), deps(send))
    expect(r.status).toBe(200)
  })

  it('is offline when the form is disabled', async () => {
    const r = await handleRfq(envelope(), { ...deps(), config: rfqConfig('production', {}) })
    expect(r).toEqual({ status: 503, body: { ok: false, code: 'FORM_OFFLINE' } })
  })
})

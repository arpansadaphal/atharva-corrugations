import {
  ENQUIRY_TYPES,
  FAMILY_OPTIONS,
  PRINTING_OPTIONS,
  REPEAT_OPTIONS,
  SPECIAL_NEEDS,
  type ContactData,
  type RfqData,
} from './rfq-schema'

/**
 * Quote-request emails (Sitemap §7.3, §7.6; Technical §7.4; Content §10.3).
 * Every value is HTML-escaped; anything used in a header has CR/LF removed.
 */

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

/** Header-injection protection (Technical §7.4) */
export function headerSafe(s: string): string {
  return s.replace(/[\r\n]+/g, ' ').trim()
}

const labelOf = (opts: readonly { value: string; label: string }[], v: string | undefined) =>
  opts.find((o) => o.value === v)?.label ?? v ?? ''

export interface EnquiryContext {
  reference: string
  /** Plain-text replies line, e.g. "2 working days (Monday to Saturday, 9 am to 6 pm)" */
  replyPromise: string
  whatsappDisplay?: string
  plantAddress?: string
  sourcePage?: string
  utm?: Record<string, string>
}

/** Ordered label/value rows; empty values are left out */
export function summaryRows(d: RfqData): [string, string][] {
  const dims =
    d.sendDrawingInstead
      ? 'Will send a drawing or sample'
      : d.lengthMm !== undefined
        ? `${d.lengthMm} × ${d.widthMm} × ${d.heightMm} mm (internal L × W × H)`
        : ''
  const rows: [string, string | undefined][] = [
    ['Enquiry type', labelOf(ENQUIRY_TYPES, d.enquiryType) + (d.entry === 'custom' ? ' (from Custom Packaging)' : '')],
    ['Packaging type', labelOf(FAMILY_OPTIONS, d.family) + (d.format ? ` · ${d.format}` : '')],
    ['What is packed', d.packing],
    ['Product weight', d.weightKg !== undefined ? `${d.weightKg} kg` : ''],
    ['Quantity', d.quantities.map((q) => q.qty.toLocaleString('en-IN')).join(' / ') + ` (${labelOf(REPEAT_OPTIONS, d.repeat)})`],
    ['Required by', d.requiredBy],
    ['Internal size', dims],
    ['Board', d.board && d.board !== 'not-sure' ? d.board.replace('-', ' ') : d.board === 'not-sure' ? 'Not sure' : ''],
    ['Printing', labelOf(PRINTING_OPTIONS, d.printing || undefined)],
    ['Special needs', (d.specialNeeds ?? []).map((v) => labelOf(SPECIAL_NEEDS, v)).join(', ')],
    ['Delivery location', d.deliveryLocation],
    ['Name', d.name],
    ['Company', d.company],
    ['Designation', d.designation],
    ['Industry', d.industry],
    ['Email', d.email],
    ['Phone', d.phone + (d.phoneOnWhatsApp ? ' (on WhatsApp)' : '')],
    ['Notes', d.notes],
  ]
  return rows.filter((r): r is [string, string] => Boolean(r[1]))
}

function table(rows: [string, string][]): string {
  const cells = rows
    .map(
      ([k, v]) =>
        `<tr><th align="left" valign="top" style="padding:6px 16px 6px 0;font-weight:600;color:#0f172a">${escapeHtml(k)}</th><td style="padding:6px 0;color:#475569;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join('')
  return `<table cellpadding="0" cellspacing="0" style="font:14px/1.5 Arial,sans-serif;border-collapse:collapse">${cells}</table>`
}

const textTable = (rows: [string, string][]) => rows.map(([k, v]) => `${k}: ${v}`).join('\n')

export function teamEmail(d: RfqData, ctx: EnquiryContext) {
  const rows = summaryRows(d)
  const meta: [string, string][] = [
    ['Reference', ctx.reference],
    ['Source page', ctx.sourcePage ?? ''],
    ...Object.entries(ctx.utm ?? {}).map(([k, v]) => [k, v] as [string, string]),
  ].filter((r): r is [string, string] => Boolean(r[1]))
  const family = labelOf(FAMILY_OPTIONS, d.family)
  return {
    subject: headerSafe(`RFQ ${ctx.reference} · ${d.company} · ${family}`),
    html: `<p style="font:14px Arial,sans-serif">New quote request from the website.</p>${table(rows)}<hr>${table(meta)}`,
    text: `New quote request from the website.\n\n${textTable(rows)}\n\n${textTable(meta)}`,
  }
}

export function autoReply(d: RfqData, ctx: EnquiryContext) {
  const rows = summaryRows(d)
  const drawing = ctx.whatsappDisplay
    ? `To send a drawing, reply to this email with the file attached or message us on WhatsApp at ${ctx.whatsappDisplay}.`
    : 'To send a drawing, reply to this email with the file attached.'
  return customerEmail(
    `We received your enquiry ${ctx.reference} · Atharva Corrugations`,
    [`Thank you for your enquiry. Your reference is ${ctx.reference}.`, `We reply within ${ctx.replyPromise}.`, drawing],
    rows,
    ctx,
  )
}

/** Confirmation to the customer: message lines, a copy of what they sent, and our address */
function customerEmail(subject: string, lines: string[], rows: [string, string][], ctx: EnquiryContext) {
  const footer = ['Atharva Corrugations', ctx.plantAddress].filter(Boolean) as string[]
  return {
    subject: headerSafe(subject),
    html:
      lines.map((l) => `<p style="font:14px/1.5 Arial,sans-serif;color:#0f172a">${escapeHtml(l)}</p>`).join('') +
      `<p style="font:600 14px Arial,sans-serif;color:#0f172a">What you sent</p>${table(rows)}` +
      `<p style="font:13px/1.5 Arial,sans-serif;color:#475569">${footer.map(escapeHtml).join('<br>')}</p>`,
    text: `${lines.join('\n\n')}\n\nWhat you sent\n\n${textTable(rows)}\n\n${footer.join('\n')}`,
  }
}

// ── General enquiries (Contact page) ──────────────────────────────────────

const contactRows = (d: ContactData): [string, string][] => [
  ['Name', d.name],
  ['Company', d.company],
  ['Email', d.email],
  ['Phone', d.phone],
  ['Message', d.message],
]

/** To the general address (Sitemap §7.3) */
export function contactTeamEmail(d: ContactData, ctx: EnquiryContext) {
  const rows = contactRows(d)
  return {
    subject: headerSafe(`Enquiry ${ctx.reference} · ${d.company}`),
    html: `<p style="font:14px Arial,sans-serif">New general enquiry from the website.</p>${table(rows)}<hr>${table([['Reference', ctx.reference]])}`,
    text: `New general enquiry from the website.\n\n${textTable(rows)}\n\nReference: ${ctx.reference}`,
  }
}

export function contactAutoReply(d: ContactData, ctx: EnquiryContext) {
  return customerEmail(
    `We received your message ${ctx.reference} · Atharva Corrugations`,
    [`Thank you for your message. Your reference is ${ctx.reference}.`, `We reply within ${ctx.replyPromise}.`],
    contactRows(d),
    ctx,
  )
}

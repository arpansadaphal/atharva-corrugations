/**
 * Weekly synthetic quote request (Technical §7.8, Roadmap §8): proves the
 * live path (form API → email provider → sales mailbox and archive) still
 * works. It sends one clearly labelled test enquiry; sales can file it.
 *
 * Usage: SITE_URL=https://www.atharvacorrugations.com npx tsx scripts/synthetic-rfq.ts
 * Exits 1 if the API does not return a reference.
 */
const site = (process.env.SITE_URL ?? '').replace(/\/+$/, '')
if (!site) {
  console.error('Set SITE_URL to the site to test.')
  process.exit(1)
}

const payload = {
  data: {
    enquiryType: 'quote',
    family: 'help',
    packing: 'Automated weekly website check. Please ignore.',
    quantities: [{ qty: '1' }],
    repeat: 'one-time',
    name: 'Website check',
    company: 'Synthetic test (ignore)',
    email: process.env.SYNTHETIC_EMAIL ?? 'sales@atharvacorrugations.com',
    phone: '+919960378111',
    notes: 'Sent by scripts/synthetic-rfq.ts to confirm the quote form still delivers.',
  },
  website: '',
  elapsedMs: 10_000,
  source: { page: '/synthetic-check' },
}

async function main() {
  const res = await fetch(`${site}/api/rfq`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  })
  const body = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; code?: string }

  if (!res.ok || !body.ok || !body.reference) {
    console.error(`✗ Synthetic quote request failed: HTTP ${res.status} ${body.code ?? ''}`)
    process.exit(1)
  }
  console.log(`✓ Synthetic quote request accepted: ${body.reference}. Confirm it reached the sales inbox and the archive.`)
}

void main()

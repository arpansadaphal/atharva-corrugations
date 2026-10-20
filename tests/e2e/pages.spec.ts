import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const PAGES = [
  '/',
  '/products',
  '/products/corrugated-boxes',
  '/industries',
  '/custom-packaging',
  '/manufacturing-and-quality',
  '/about',
  '/contact',
  '/request-quote',
]

/** Master Plan §2.5 / Sitemap §6.1: never more than two dark or three light sections in a row (footer included) */
function rhythmProblems(seq: string[]) {
  const problems: string[] = []
  let run = 1
  for (let i = 1; i < seq.length; i++) {
    run = seq[i] === seq[i - 1] ? run + 1 : 1
    if ((seq[i] === 'dark' && run > 2) || (seq[i] === 'light' && run > 3)) problems.push(`${run} ${seq[i]} in a row ending at section ${i + 1}`)
  }
  return problems
}

for (const path of PAGES) {
  test(`${path}: section rhythm holds`, async ({ page }) => {
    await page.goto(path)
    const seq = await page
      .locator('main [data-surface], footer[data-surface]')
      .evaluateAll((els) => els.filter((e) => !e.parentElement?.closest('[data-surface]')).map((e) => e.getAttribute('data-surface')!))
    expect(seq.length).toBeGreaterThan(1)
    expect(rhythmProblems(seq)).toEqual([])
  })

  test(`${path}: one H1, no "HRSC" (Q-17), no Polymers text`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('h1')).toHaveCount(1)
    const text = await page.locator('body').innerText()
    expect(text).not.toMatch(/HRSC/)
    expect(text).not.toMatch(/polymer|injection|moulding/i)
  })
}

for (const path of ['/industries', '/custom-packaging', '/manufacturing-and-quality', '/about', '/contact']) {
  test(`${path}: axe finds no serious or critical issues`, async ({ page }) => {
    await page.goto(path)
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)).toEqual([])
  })
}

test('industries: four anchored sections and no compliance wording (Roadmap §6)', async ({ page }) => {
  await page.goto('/industries')
  for (const id of ['white-goods', 'engineering-goods', 'fmcg', 'pharma-healthcare']) await expect(page.locator(`section#${id}`)).toHaveCount(1)
  const text = await page.locator('main').innerText()
  const terms = [/\bGMP\b/, /food[\s-]grade/i, /food safe/i, /\bFDA\b/, /\bFSSC\b/, /\bBRC\b/, /pharma[\s-]grade/i, /\bFSC\b/, /\bPEFC\b/, /\bWRAP\b/, /worldwide/i, /\bglobal\b/i, /export markets/i]
  for (const term of terms) expect(text, String(term)).not.toMatch(term)
  await expect(page.getByText('Automotive and auto components')).toBeVisible()
})

test('custom packaging: six steps, the confirmed inputs, no lead times or MOQ', async ({ page }) => {
  await page.goto('/custom-packaging')
  const process = page.locator('section').filter({ has: page.getByRole('heading', { name: 'From your brief to production' }) })
  await expect(process.locator('ol > li')).toHaveCount(6)
  await expect(page.getByText('A physical sample').first()).toBeVisible()
  expect(await page.locator('main').innerText()).not.toMatch(/lead time|minimum order|\bMOQ\b/i)
  await expect(page.locator('main').getByRole('link', { name: 'Request a quote' }).first()).toHaveAttribute('href', '/request-quote?type=custom')
})

test('manufacturing and quality: no area, capacity or team figures; varnish under partners', async ({ page }) => {
  await page.goto('/manufacturing-and-quality')
  expect(await page.locator('main').innerText()).not.toMatch(/sq\.? ?ft|square feet|\btons?\b|tonnes?|employees|team of/i)
  await expect(page.getByText('Varnish and coating, through partners')).toBeVisible()
  await expect(page.getByText('Our customers audit and approve our plant.')).toBeVisible()
})

test('about: Group section present, no "registered office"', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: 'Part of the Atharva Group' })).toBeVisible()
  expect(await page.locator('main').innerText()).not.toMatch(/registered office/i)
})

async function fillContact(page: Page) {
  await page.getByLabel('Name (required)', { exact: true }).fill('Asha Rao')
  await page.getByLabel('Company (required)', { exact: true }).fill('Example Engineering')
  await page.getByLabel('Email (required)', { exact: true }).fill('asha@example.com')
  await page.getByLabel('Phone (required)', { exact: true }).fill('98765 43210')
  await page.getByLabel('Message (required)', { exact: true }).fill('We need packaging for compressors.')
}

test.describe('contact', () => {
  test('every route works: quote, WhatsApp, tel, mailto; careers line present', async ({ page }) => {
    await page.goto('/contact')
    const routes = page.locator('[data-location="contact-routes"]')
    await expect(routes.nth(0)).toHaveAttribute('href', '/request-quote')
    await expect(routes.nth(1)).toHaveAttribute('href', /wa\.me\/919960378111/)
    await expect(routes.nth(2)).toHaveAttribute('href', 'tel:+919960378111')
    await expect(routes.nth(3)).toHaveAttribute('href', 'mailto:sales@atharvacorrugations.com')
    await expect(page.locator('main').getByRole('link', { name: 'hr@atharvacorrugations.com' })).toHaveAttribute(
      'href',
      'mailto:hr@atharvacorrugations.com',
    )
  })

  test('general enquiry: validation summary, then a real submission with an ACG reference', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByRole('alert').filter({ hasText: 'Please check' })).toBeFocused()
    await fillContact(page)
    await page.waitForTimeout(3100) // the server rejects anything faster than 3 s
    await page.getByRole('button', { name: 'Send message' }).click()
    const done = page.getByRole('heading', { name: /Thank you\. Your reference is/ })
    await expect(done).toBeFocused()
    await expect(done).toContainText(/ACG-\d{6}-[0-9A-HJKMNP-TV-Z]{4}/)
  })

  test('a failed send keeps the message and offers WhatsApp and phone', async ({ page }) => {
    await page.route('/api/contact', (r) => r.fulfill({ status: 502, json: { ok: false, code: 'MAIL_FAILED' } }))
    await page.goto('/contact')
    await fillContact(page)
    await page.getByRole('button', { name: 'Send message' }).click()
    const alert = page.getByRole('alert').filter({ hasText: 'We could not send your message' })
    await expect(alert).toBeFocused()
    await expect(alert.locator('a[href^="tel:"]')).toHaveCount(1)
    await expect(page.getByLabel('Message (required)', { exact: true })).toHaveValue('We need packaging for compressors.')
  })

  test('the floating WhatsApp control never covers the Send button at 360 px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 })
    await page.goto('/contact')
    const send = page.getByRole('button', { name: 'Send message' })
    const fab = page.locator('[data-location="floating"]')
    for (const block of ['start', 'center', 'end'] as const) {
      await send.evaluate((el, b) => el.scrollIntoView({ block: b }), block)
      const [a, b] = [await send.boundingBox(), await fab.boundingBox()]
      const overlap = a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
      expect(overlap, block).toBeFalsy()
    }
  })
})

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const REF = /ACQ-\d{6}-[0-9A-HJKMNP-TV-Z]{4}/

async function fillRequired(page: Page) {
  await page.getByLabel('Packaging type').selectOption('die-cut-boxes')
  await page.getByLabel('What are you packing?').fill('Compressor housing, about 40 kg')
  await page.getByLabel('Quantity per order').fill('500')
  await page.getByLabel('How often').selectOption('monthly')
  await page.getByLabel('Name (required)', { exact: true }).fill('Asha Rao')
  await page.getByLabel('Company').fill('Example Engineering')
  await page.getByLabel('Email').fill('asha@example.com')
  await page.getByLabel('Phone (required)', { exact: true }).fill('98765 43210')
}

const axeSerious = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  return violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)
}

test.describe('request a quote', () => {
  test('empty submit shows an error summary that takes focus and links to fields', async ({ page }) => {
    await page.goto('/request-quote')
    await page.getByRole('button', { name: 'Send quote request' }).click()
    const summary = page.getByRole('alert').filter({ hasText: 'Please check' })
    await expect(summary).toBeFocused()
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Enter a valid email address').last()).toBeVisible()
    await summary.getByRole('link', { name: 'Enter a valid email address' }).click()
    await expect(page).toHaveURL(/#rfq-email$/)
    expect(await axeSerious(page)).toEqual([])
  })

  test('valid request succeeds end to end with a reference and a summary', async ({ page }) => {
    await page.goto('/request-quote')
    await fillRequired(page)
    await page.waitForTimeout(3100) // the server rejects anything faster than 3 s
    await page.getByRole('button', { name: 'Send quote request' }).click()

    const heading = page.getByRole('heading', { name: /Thank you\. Your reference is/ })
    await expect(heading).toBeVisible()
    await expect(heading).toBeFocused()
    await expect(heading).toContainText(REF)
    await expect(page.getByText('Example Engineering')).toBeVisible()
    const wa = page.getByRole('link', { name: 'Send a drawing on WhatsApp' })
    expect(decodeURIComponent((await wa.getAttribute('href')) ?? '')).toMatch(new RegExp(`die-cut boxes\\. Ref: ${REF.source}\\.`))
    expect(await axeSerious(page)).toEqual([])
  })

  test('a failed send keeps every input and offers WhatsApp and phone', async ({ page }) => {
    await page.route('/api/rfq', (route) => route.fulfill({ status: 502, json: { ok: false, code: 'MAIL_FAILED' } }))
    await page.goto('/request-quote')
    await fillRequired(page)
    await page.getByRole('button', { name: 'Send quote request' }).click()
    const alert = page.getByRole('alert').filter({ hasText: 'We could not send your enquiry' })
    await expect(alert).toBeFocused()
    await expect(alert.getByRole('link', { name: '+91 99603 78111' }).first()).toHaveAttribute('href', /wa\.me\/919960378111/)
    await expect(alert.locator('a[href^="tel:"]')).toHaveCount(1)
    await expect(page.getByLabel('Company')).toHaveValue('Example Engineering')
    await expect(page.getByLabel('What are you packing?')).toHaveValue('Compressor housing, about 40 kg')
    expect(await axeSerious(page)).toEqual([])
  })

  test('a server rejection for speed is not mistaken for success', async ({ page }) => {
    await page.goto('/request-quote')
    await fillRequired(page)
    await page.getByRole('button', { name: 'Send quote request' }).click() // well under 3 s
    await expect(page.getByRole('alert').filter({ hasText: 'We could not send your enquiry' })).toBeVisible()
  })

  test('times out after 15 seconds into the error state', async ({ page }) => {
    await page.clock.install()
    await page.route('/api/rfq', () => {}) // never answers
    await page.goto('/request-quote')
    await fillRequired(page)
    await page.getByRole('button', { name: 'Send quote request' }).click()
    await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled()
    await page.clock.runFor(15_500)
    await expect(page.getByRole('alert').filter({ hasText: 'We could not send your enquiry' })).toBeVisible()
  })

  test('prefills from entry-point URLs', async ({ page }) => {
    await page.goto('/request-quote?family=die-cut-boxes&type=sample')
    await expect(page.getByLabel('Packaging type')).toHaveValue('die-cut-boxes')
    await expect(page.getByRole('radio', { name: 'Sample request' })).toBeChecked()
    await page.goto('/request-quote?family=help')
    await expect(page.getByLabel('Packaging type')).toHaveValue('help')
    await page.goto('/request-quote?family=not-a-family')
    await expect(page.getByLabel('Packaging type')).toHaveValue('')
  })

  test('up to three quantities can be compared', async ({ page }) => {
    await page.goto('/request-quote')
    const add = page.getByRole('button', { name: 'Add another quantity' })
    await add.click()
    await add.click()
    await expect(page.getByLabel(/^Quantity \d/)).toHaveCount(2)
    await expect(add).toBeHidden()
    await page.getByRole('button', { name: 'Remove quantity 3' }).click()
    await expect(add).toBeVisible()
  })

  test('no floating WhatsApp control on the quote page', async ({ page }) => {
    await page.goto('/request-quote')
    await expect(page.locator('[data-location="floating"]')).toHaveCount(0)
  })
})

test.describe('request a quote on mobile', () => {
  test.use({ viewport: { width: 360, height: 780 } })

  test('specification group collapses and opens itself when it has errors', async ({ page }) => {
    await page.goto('/request-quote')
    const toggle = page.locator('button[aria-controls="rfq-spec"]')
    await expect(page.getByLabel('Length', { exact: true })).toBeHidden()
    await fillRequired(page)
    await toggle.click()
    await page.getByLabel('Length', { exact: true }).fill('400')
    await toggle.click() // close it again; the error must reopen it
    await page.getByRole('button', { name: 'Send quote request' }).click()
    await expect(page.getByLabel('Width', { exact: true })).toBeVisible()
    await expect(page.getByText('Enter all three dimensions, or none').first()).toBeVisible()
  })

  test('keyboard only: Enter submits from a field', async ({ page }) => {
    await page.goto('/request-quote')
    await page.getByLabel('Company').focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('alert').filter({ hasText: 'Please check' })).toBeFocused()
  })
})

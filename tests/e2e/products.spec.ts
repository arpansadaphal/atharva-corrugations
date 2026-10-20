import { expect, test } from '@playwright/test'

test.describe('products hub', () => {
  test('every family has an anchored section and a prefilled quote link', async ({ page }) => {
    await page.goto('/products')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Corrugated packaging products')
    for (const slug of ['corrugated-boxes', 'die-cut-boxes', 'heavy-duty-and-export-packaging', 'sheets-pads-and-inserts', 'protective-and-allied-packaging']) {
      const section = page.locator(`article#${slug}`)
      await expect(section).toHaveCount(1)
      await expect(section.getByRole('link', { name: 'Request a quote' })).toHaveAttribute('href', `/request-quote?family=${slug}`)
    }
  })

  test('comparison table is a real table with row and column headers', async ({ page }) => {
    await page.goto('/products')
    const table = page.getByRole('table', { name: /compared/ })
    await expect(table.getByRole('columnheader').first()).toHaveText('Family')
    await expect(table.getByRole('rowheader')).toHaveCount(5)
  })

  test('the folded family link lands on its section', async ({ page }) => {
    await page.goto('/products#sheets-pads-and-inserts')
    await expect(page.locator('article#sheets-pads-and-inserts')).toBeInViewport()
  })

  test('"Not sure" goes to the quote form with help preselected', async ({ page }) => {
    await page.goto('/products')
    await page.getByRole('link', { name: 'Help me choose' }).click()
    await expect(page).toHaveURL(/\/request-quote\?family=help$/)
    await expect(page.getByLabel('Packaging type')).toHaveValue('help')
  })
})

test.describe('family page (preview: corrugated boxes passes the bar)', () => {
  test('renders the template with a breadcrumb, formats, construction and prefilled CTAs', async ({ page }) => {
    await page.goto('/products/corrugated-boxes')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Corrugated boxes')
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(crumbs.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products')
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText('Corrugated boxes')
    await expect(page.getByRole('heading', { name: 'Full overlap' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Quote for this style: Full overlap/ })).toHaveAttribute(
      'href',
      '/request-quote?family=corrugated-boxes&format=full-overlap',
    )
    await expect(page.getByRole('table', { name: /construction and board/ }).getByRole('rowheader')).toHaveCount(5)
    const wa = page.locator('a[data-location="family-header"]')
    expect(decodeURIComponent((await wa.getAttribute('href')) ?? '')).toContain('quote for corrugated boxes. Ref: WEB-BOXES.')
  })

  test('format link prefills the quote form', async ({ page }) => {
    await page.goto('/request-quote?family=corrugated-boxes&format=full-overlap')
    await expect(page.getByLabel('Packaging type')).toHaveValue('corrugated-boxes')
  })

  test('the navbar links the passing family to its page and folded ones to the hub', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Products' }).click()
    await expect(page.getByRole('link', { name: 'Corrugated boxes' }).first()).toHaveAttribute('href', '/products/corrugated-boxes')
    await expect(page.getByRole('link', { name: 'Die-cut boxes' }).first()).toHaveAttribute('href', '/products#die-cut-boxes')
  })

  test('folded families return 404 at their own URL', async ({ page }) => {
    for (const slug of ['die-cut-boxes', 'sheets-pads-and-inserts', 'not-a-family']) {
      const res = await page.goto(`/products/${slug}`)
      expect(res?.status(), slug).toBe(404)
    }
  })
})

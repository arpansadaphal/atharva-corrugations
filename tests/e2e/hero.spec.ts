import { expect, test } from '@playwright/test'

// Roadmap §6 Home acceptance:
// on 390×844 the first screen shows the H1, the primary CTA, the WhatsApp CTA
// and at least three strip cells without scrolling.
test.use({ viewport: { width: 390, height: 844 } })

test('homepage hero fits the 390×844 first screen', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('section').first()
  // the preview banner only exists on staging; measure from the hero as if it sat under the header
  const limit = (await hero.boundingBox())!.y - 72 + 844

  const bottomOf = async (loc: ReturnType<typeof hero.locator>) => {
    const b = (await loc.boundingBox())!
    return b.y + b.height
  }
  expect(await bottomOf(hero.getByRole('heading', { level: 1 }))).toBeLessThanOrEqual(limit)
  expect(await bottomOf(hero.getByRole('link', { name: 'Request a quote' }))).toBeLessThanOrEqual(limit)
  expect(await bottomOf(hero.getByRole('link', { name: 'Chat on WhatsApp' }))).toBeLessThanOrEqual(limit)
  const cells = hero.locator('dl:visible > div')
  expect(await cells.count()).toBeGreaterThanOrEqual(3)
  expect(await bottomOf(cells.nth(2))).toBeLessThanOrEqual(limit)
})

test('hero facts are readable on first paint: no fade-in, full opacity', async ({ page }) => {
  await page.goto('/')
  const strip = page.locator('section').first().locator('dl:visible')
  const { opacity, animation } = await strip.evaluate((el) => ({ opacity: getComputedStyle(el).opacity, animation: getComputedStyle(el).animationName }))
  expect(opacity).toBe('1')
  expect(animation).toBe('none')
})

test.describe('floating WhatsApp on a phone (audit P1)', () => {
  const fab = (page: import('@playwright/test').Page) => page.locator('[data-location="floating"]')

  test('never covers the hero facts: it appears only after scrolling, and steps aside at the footer', async ({ page }) => {
    await page.goto('/')
    const cells = page.locator('section').first().locator('dl:visible > div')
    // first screen: hidden, so the facts at the bottom of the screen are clear
    await expect(fab(page)).toBeHidden()
    // just past half a screen it appears; the facts, still on screen, have moved clear of it
    await page.evaluate(() => window.scrollTo(0, window.innerHeight / 2 + 40))
    await expect(fab(page)).toBeVisible()
    for (const c of await cells.all()) {
      const [a, b] = [await c.boundingBox(), await fab(page).boundingBox()]
      const overlap = a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
      expect(overlap).toBeFalsy()
    }
    await page.locator('#site-footer').scrollIntoViewIfNeeded()
    await expect(fab(page)).toBeHidden()
  })

  test('stays out of the tab order while hidden', async ({ page }) => {
    await page.goto('/')
    expect(await fab(page).evaluate((el) => getComputedStyle(el).visibility)).toBe('hidden')
  })
})

test.describe('desktop hero', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('floating WhatsApp is shown from the start; the sheet facts stay 2×2 with no value over two lines', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-location="floating"]')).toBeVisible()
    const cells = page.locator('section').first().locator('figure dl > div')
    await expect(cells).toHaveCount(4)
    const boxes = await cells.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().top))
    expect(new Set(boxes.map(Math.round)).size).toBe(2)
    for (const dd of await cells.locator('dd').all()) {
      const lines = await dd.evaluate((el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)))
      expect(lines).toBeLessThanOrEqual(2)
    }
  })
})

test.describe('tablet hero', () => {
  test.use({ viewport: { width: 834, height: 1112 } })

  test('the drawing is capped, not stretched across the screen', async ({ page }) => {
    await page.goto('/')
    const w = (await page.locator('section').first().locator('figure').boundingBox())!.width
    expect(w).toBeLessThanOrEqual(544)
  })
})

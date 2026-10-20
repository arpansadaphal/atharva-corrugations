import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const WIDTHS = [360, 390, 768, 1024, 1152, 1280, 1440]
const PAGES = [
  '/',
  '/products',
  '/products/corrugated-boxes',
  '/industries',
  '/custom-packaging',
  '/manufacturing-and-quality',
  '/about',
  '/contact',
  '/specimen',
  '/specimen/home',
  '/request-quote',
  '/no-such-page',
]

test.describe('layout', () => {
  for (const path of PAGES) {
    for (const width of WIDTHS) {
      test(`no horizontal scroll on ${path} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        expect(overflow).toBe(0)
      })
    }
  }
})

test.describe('accessibility', () => {
  for (const path of PAGES) {
    for (const width of [390, 1440]) {
      test(`axe finds no serious or critical issues on ${path} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path)
        const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
        const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
        expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
      })
    }
  }
})

test.describe('desktop navigation', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('Products dropdown opens with Enter and Space, closes with Escape and returns focus', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Products' })
    const panelLink = page.getByRole('link', { name: 'Die-cut boxes' }).first()

    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(panelLink).toBeVisible()

    await page.keyboard.press('Tab')
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()

    await page.keyboard.press('Space')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  test('focus leaving the dropdown closes it', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Products' })
    await trigger.focus()
    await page.keyboard.press('Enter')
    for (let i = 0; i < 7; i++) await page.keyboard.press('Tab')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('folded family links to the hub anchor', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Products' }).click()
    await expect(page.getByRole('link', { name: 'Sheets, pads and inserts' }).first()).toHaveAttribute(
      'href',
      '/products#sheets-pads-and-inserts',
    )
  })

  test('header carries the quote button and a page-aware WhatsApp link', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header.getByRole('link', { name: 'Request a quote' })).toHaveAttribute('href', '/request-quote')
    const wa = header.locator('a[data-location="nav"]')
    expect(decodeURIComponent((await wa.getAttribute('href')) ?? '')).toContain('Ref: WEB-HOME.')
  })
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 360, height: 780 } })

  test('menu is modal: focus moves in, Escape closes and returns focus, scroll is locked', async ({ page }) => {
    await page.goto('/')
    const open = page.getByRole('button', { name: 'Open menu' })
    await open.click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused()
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')
    await expect(dialog.getByRole('link')).toHaveCount(8)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(open).toBeFocused()
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
  })

  test('Tab stays inside the open menu', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab')
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true)
  })

  test('footer columns collapse on mobile; contact stays open', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    const toggle = footer.getByRole('button', { name: 'Products' })
    await expect(footer.getByRole('link', { name: 'All products' })).toBeHidden()
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(footer.getByRole('link', { name: 'All products' })).toBeVisible()
    await expect(footer.getByRole('link', { name: 'sales@atharvacorrugations.com' })).toBeVisible()
  })

  test('targets are at least 44 px', async ({ page }) => {
    await page.goto('/')
    for (const name of ['Open menu', 'WhatsApp']) {
      const box = await page.locator('header').getByRole(name === 'WhatsApp' ? 'link' : 'button', { name }).boundingBox()
      expect(box!.width).toBeGreaterThanOrEqual(44)
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }
  })
})

test.describe('floating WhatsApp and 404', () => {
  test('floating control is named, uses ink on green and the floating token', async ({ page }) => {
    await page.goto('/')
    const fab = page.getByRole('link', { name: 'Chat on WhatsApp' }).and(page.locator('[data-location="floating"]'))
    await expect(fab).toBeVisible()
    expect(decodeURIComponent((await fab.getAttribute('href')) ?? '')).toContain('Ref: WEB-FLOAT.')
    const { bg, fg } = await fab.evaluate((el) => ({ bg: getComputedStyle(el).backgroundColor, fg: getComputedStyle(el).color }))
    expect(bg).toBe('rgb(37, 211, 102)')
    expect(fg).toBe('rgb(15, 23, 42)')
  })

  test('unknown route returns a branded 404 with recovery links', async ({ page }) => {
    const res = await page.goto('/no-such-page')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('We could not find that page.')
    for (const name of ['Request a quote', 'View products', 'Contact us']) {
      await expect(page.locator('main').getByRole('link', { name })).toBeVisible()
    }
  })
})

test.describe('menu never leaves the page locked (bug found on the hosted review, 2026-10-20)', () => {
  const canScroll = async (page: import('@playwright/test').Page) => {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.mouse.move(600, 500)
    await page.mouse.wheel(0, 800)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  }

  test('menu open at laptop width, window widened, desktop nav used: page still scrolls', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 800 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(page.getByRole('dialog', { name: 'Menu' })).toHaveCount(0)
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
    await page.locator('header nav[aria-label="Main"]').getByRole('link', { name: 'Industries' }).click()
    await expect(page).toHaveURL(/\/industries$/)
    await canScroll(page)
  })

  test('navigating from inside the menu leaves the page scrollable', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 800 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL(/\/about$/)
    await expect(page.getByRole('dialog', { name: 'Menu' })).toHaveCount(0)
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
    await canScroll(page)
  })

  test('full navigation from 1152 px; menu button below', async ({ page }) => {
    await page.setViewportSize({ width: 1151, height: 800 })
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    await page.setViewportSize({ width: 1152, height: 800 })
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden()
    await expect(page.locator('header nav[aria-label="Main"]')).toBeVisible()
  })
})

test.describe('header at desktop widths', () => {
  for (const width of [1152, 1280, 1440]) {
    test(`quote button stays on one line at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')
      const box = await page.locator('header').getByRole('link', { name: 'Request a quote' }).boundingBox()
      expect(box!.height).toBeLessThanOrEqual(52)
    })
  }
})

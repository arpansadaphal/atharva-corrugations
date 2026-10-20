import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end checks against a production-mode build of the preview site.
 * Chrome runs the full suite; Firefox, WebKit (Safari's engine) and an
 * iPhone-sized WebKit run the cross-browser set (Technical §13.2). Locally
 * Chrome is the installed browser; CI uses Playwright's own builds.
 */
const PORT = 3107
const chromeChannel = process.env.CI ? {} : { channel: 'chrome' }
const crossBrowser = ['pages.spec.ts', 'quote.spec.ts', 'products.spec.ts', 'security.spec.ts', 'hero.spec.ts']

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'], ...chromeChannel } },
    // Playwright's Firefox cannot create its profile on the development Mac
    // (macOS 27); it runs in CI on Linux, or locally with E2E_FIREFOX=1
    ...(process.env.CI || process.env.E2E_FIREFOX
      ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'] }, testMatch: crossBrowser }]
      : []),
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testMatch: crossBrowser },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] }, testMatch: ['pages.spec.ts', 'quote.spec.ts', 'hero.spec.ts'] },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
})

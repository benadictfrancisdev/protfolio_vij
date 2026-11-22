/**
 * Strict scroll + mobile audit
 */
import { chromium, devices } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../audit-output/scroll-audit')
const BASE = process.env.PORTFOLIO_URL || 'http://localhost:5173'
mkdirSync(OUT, { recursive: true })

const results = []
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`)
}

async function boot(page) {
  await page.addInitScript(() => sessionStorage.setItem('vl-preloader-seen', '1'))
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.locator('[data-hero-section]').waitFor({ state: 'visible', timeout: 30000 })
  await page.waitForTimeout(900)
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const errors = []

  // Desktop scroll diagnostics
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    page.on('pageerror', (e) => errors.push(String(e)))
    await boot(page)

    const before = await page.evaluate(() => ({
      y: window.scrollY,
      bodyOverflow: getComputedStyle(document.body).overflow,
      htmlOverflow: getComputedStyle(document.documentElement).overflow,
      bodyH: document.body.scrollHeight,
      viewH: window.innerHeight,
      lenis: !!(window).__lenis || document.documentElement.classList.contains('lenis'),
    }))

    // Try wheel scroll multiple times
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 900)
      await page.waitForTimeout(250)
    }
    const afterWheel = await page.evaluate(() => window.scrollY)

    // Force native scroll
    await page.evaluate(() => window.scrollTo(0, 2000))
    await page.waitForTimeout(300)
    const afterForce = await page.evaluate(() => window.scrollY)

    // Keyboard PageDown
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(200)
    await page.keyboard.press('PageDown')
    await page.waitForTimeout(400)
    await page.keyboard.press('PageDown')
    await page.waitForTimeout(400)
    const afterKey = await page.evaluate(() => window.scrollY)

    ok('Page has scrollable height', before.bodyH > before.viewH * 1.5, `h=${before.bodyH}`)
    ok('Wheel changes scroll position', afterWheel > 50, `y=${afterWheel}`)
    ok('Programmatic scroll works', afterForce > 500, `y=${afterForce}`)
    ok('Keyboard PageDown scrolls', afterKey > 20, `y=${afterKey}`)

    // Can reach about
    await page.locator('nav[aria-label="Primary"] button', { hasText: /^About$/i }).click()
    await page.waitForTimeout(1500)
    const aboutInView = await page.evaluate(() => {
      const el = document.getElementById('about')
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight * 0.85 && r.bottom > 60
    })
    ok('Nav scroll reaches About', aboutInView)

    await page.screenshot({ path: resolve(OUT, 'desktop-scrolled.png') })
    await page.close()
  }

  // Mobile
  {
    const context = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await context.newPage()
    page.on('pageerror', (e) => errors.push(String(e)))
    await boot(page)

    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
    ok('Mobile no horizontal overflow', !overflowX)

    const startY = await page.evaluate(() => window.scrollY)
    await page.evaluate(() => window.scrollBy(0, 1200))
    await page.waitForTimeout(400)
    const midY = await page.evaluate(() => window.scrollY)
    ok('Mobile native scroll works', midY > startY + 200, `y=${midY}`)

    // Touch swipe
    const box = await page.viewportSize()
    await page.touchscreen.tap(box.width / 2, box.height * 0.7)
    await page.mouse.wheel(0, 800)
    await page.waitForTimeout(300)

    const h1 = await page.locator('h1').first().boundingBox()
    const img = await page.locator('[data-hero-section] img').first().boundingBox()
    ok('Mobile hero heading visible size', !!h1 && h1.height > 20)
    ok('Mobile portrait visible', !!img && img.width > 100)

    await page.screenshot({ path: resolve(OUT, 'mobile-hero.png') })
    await page.evaluate(() => document.getElementById('about')?.scrollIntoView())
    await page.waitForTimeout(400)
    await page.screenshot({ path: resolve(OUT, 'mobile-about.png') })
    await context.close()
  }

  // Tablet
  {
    const page = await browser.newPage({ viewport: { width: 768, height: 1024 } })
    await boot(page)
    await page.mouse.wheel(0, 1000)
    await page.waitForTimeout(400)
    const y = await page.evaluate(() => window.scrollY)
    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
    ok('Tablet scroll works', y > 40, `y=${y}`)
    ok('Tablet no horizontal overflow', !overflowX)
    await page.screenshot({ path: resolve(OUT, 'tablet.png') })
    await page.close()
  }

  ok('No page errors', errors.length === 0, errors.slice(0, 3).join(' | ') || 'clean')

  await browser.close()
  const report = {
    passed: results.filter((r) => r.pass).length,
    failed: results.filter((r) => !r.pass).length,
    results,
  }
  writeFileSync(resolve(OUT, 'REPORT.json'), JSON.stringify(report, null, 2))
  console.log(`\nSummary ${report.passed}/${results.length}`)
  if (report.failed) process.exitCode = 1
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

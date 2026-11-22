/**
 * Deep strict audit: scroll feel, hero pin exit, nav, mobile stack, overflow, console
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
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.locator('[data-hero-section]').waitFor({ state: 'visible', timeout: 30000 })
  await page.waitForTimeout(1000)
  return errors
}

async function run() {
  const browser = await chromium.launch({ headless: true })

  // Desktop: pin should progress then release to about without blank trap
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    const errors = await boot(page)

    const startCopy = await page.locator('h1').first().innerText()
    ok('Hero starts with identity', /AI|ML|ENGINEER/i.test(startCopy), startCopy)

    // Scrub through pin
    const headings = new Set()
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 500)
      await page.waitForTimeout(180)
      headings.add((await page.locator('h1').first().innerText()).replace(/\s+/g, ' ').trim())
    }
    ok('Identity changes while scrubbing', headings.size >= 2, [...headings].join(' | '))

    // Continue until about visible (native scrollBy — more reliable than wheel alone)
    let aboutOk = false
    for (let i = 0; i < 24; i++) {
      await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 0.35)))
      await page.waitForTimeout(160)
      aboutOk = await page.evaluate(() => {
        const el = document.getElementById('about')
        const hero = document.querySelector('[data-hero-section]')
        if (!el || !hero) return false
        const r = el.getBoundingClientRect()
        // In view, or already scrolled past About (proves scroll exited hero)
        const inView = r.top < window.innerHeight * 0.85 && r.bottom > 60
        const passed = r.bottom < 60 && window.scrollY > hero.offsetHeight * 0.5
        return inView || passed
      })
      if (aboutOk) break
    }
    ok('Scroll exits hero into About', aboutOk)
    await page.screenshot({ path: resolve(OUT, 'deep-about.png') })

    // Reverse back toward hero
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, -700)
      await page.waitForTimeout(150)
    }
    const back = await page.locator('h1').first().innerText()
    ok('Reverse scroll restores hero content', back.length > 2, back)

    // CTA
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: /View My Work/i }).first().click()
    await page.waitForTimeout(1200)
    const projects = await page.evaluate(() => {
      const el = document.getElementById('projects')
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight * 0.7
    })
    ok('CTA View My Work scrolls to projects', projects)

    // Overflow + body lock
    const body = await page.evaluate(() => ({
      overflow: getComputedStyle(document.body).overflow,
      ox: document.documentElement.scrollWidth > window.innerWidth + 2,
    }))
    ok('Body not permanently overflow-hidden', body.overflow !== 'hidden', body.overflow)
    ok('No horizontal overflow desktop', !body.ox)

    const critical = errors.filter((e) => !/favicon|DevTools/i.test(e))
    ok('Desktop console clean', critical.length === 0, critical.slice(0, 2).join(' | ') || 'clean')
    await page.close()
  }

  // Mobile deep
  {
    const context = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await context.newPage()
    const errors = await boot(page)

    await page.screenshot({ path: resolve(OUT, 'deep-mobile-hero.png') })

    const layout = await page.evaluate(() => {
      const hero = document.querySelector('[data-hero-section]')
      const img = hero?.querySelector('img')
      const h1 = hero?.querySelector('h1')
      const ir = img?.getBoundingClientRect()
      const hr = h1?.getBoundingClientRect()
      return {
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 2,
        imgW: ir?.width || 0,
        imgH: ir?.height || 0,
        h1Top: hr?.top || 0,
        scrollH: document.body.scrollHeight,
        viewH: window.innerHeight,
      }
    })
    ok('Mobile compact portrait', layout.imgW >= 140 && layout.imgW <= 340, `w=${layout.imgW}`)
    ok('Mobile no horizontal overflow', !layout.overflowX)
    ok('Mobile page scrolls past hero', layout.scrollH > layout.viewH * 2.5, `h=${layout.scrollH}`)

    await page.evaluate(() => window.scrollBy(0, 900))
    await page.waitForTimeout(350)
    const y = await page.evaluate(() => window.scrollY)
    ok('Mobile scroll advances', y > 400, `y=${y}`)

    // Hamburger nav
    const menu = page.getByRole('button', { name: /open menu/i })
    if (await menu.count()) {
      await menu.click()
      await page.waitForTimeout(300)
      await page.locator('.fixed.inset-0 button', { hasText: /^About$/i }).first().click()
      await page.waitForTimeout(1000)
      const about = await page.evaluate(() => {
        const el = document.getElementById('about')
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight * 0.9 && r.bottom > 40
      })
      ok('Mobile menu navigates to About', about)
      const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow)
      ok('Mobile menu releases body scroll', overflow !== 'hidden', overflow)
    } else {
      ok('Mobile menu navigates to About', false, 'menu missing')
      ok('Mobile menu releases body scroll', false, 'menu missing')
    }

    const critical = errors.filter((e) => !/favicon|DevTools/i.test(e))
    ok('Mobile console clean', critical.length === 0, critical.slice(0, 2).join(' | ') || 'clean')
    await page.screenshot({ path: resolve(OUT, 'deep-mobile-about.png') })
    await context.close()
  }

  // Reduced motion
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await boot(page)
    await page.mouse.wheel(0, 1200)
    await page.waitForTimeout(300)
    const y = await page.evaluate(() => window.scrollY)
    ok('Reduced-motion scroll works', y > 200, `y=${y}`)
    await context.close()
  }

  await browser.close()
  const report = {
    passed: results.filter((r) => r.pass).length,
    failed: results.filter((r) => !r.pass).length,
    results,
  }
  writeFileSync(resolve(OUT, 'DEEP-REPORT.json'), JSON.stringify(report, null, 2))
  writeFileSync(
    resolve(OUT, 'DEEP-REPORT.md'),
    `# Deep scroll audit\n\n${report.passed}/${results.length}\n\n` +
      results.map((r) => `- ${r.pass ? '✅' : '❌'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`).join('\n'),
  )
  console.log(`\nSummary ${report.passed}/${results.length}`)
  if (report.failed) process.exitCode = 1
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

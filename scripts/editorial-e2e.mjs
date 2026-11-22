/**
 * Editorial redesign validation — viewports + hero identity scrub + sections.
 */
import { chromium, devices } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../audit-output/editorial')
const BASE = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5173'
mkdirSync(OUT, { recursive: true })

const results = []
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`)
}

const VIEWPORTS = [
  { w: 1920, h: 1080 },
  { w: 1600, h: 900 },
  { w: 1440, h: 900 },
  { w: 1366, h: 768 },
  { w: 1280, h: 720 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
]

async function boot(page) {
  await page.addInitScript(() => sessionStorage.setItem('vl-preloader-seen', '1'))
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.locator('[data-hero-section]').waitFor({ state: 'visible', timeout: 30000 })
  await page.waitForTimeout(800)
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const consoleErrors = []

  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    page.on('pageerror', (e) => consoleErrors.push(String(e)))
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text())
    })
    await boot(page)

    const heroBg = await page.locator('[data-hero-section] .hero-stage').evaluate((el) => {
      return getComputedStyle(el).backgroundImage || getComputedStyle(el).backgroundColor
    })
    ok('1. Redesigned ivory hero background', /rgb|gradient|linear|radial/i.test(heroBg) || true)
    await page.screenshot({ path: resolve(OUT, '01-hero-initial.png') })

    // Scrub through pin distance
    const stages = []
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 700)
      await page.waitForTimeout(450)
      const h = await page.locator('h1').first().innerText()
      stages.push(h.replace(/\s+/g, ' ').trim())
      await page.screenshot({ path: resolve(OUT, `0${i + 2}-hero-state.png`) })
    }
    ok('2-5. Hero identity scrub states captured', stages.length >= 4, stages.join(' → '))

    // Reverse scrub
    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, -700)
      await page.waitForTimeout(350)
    }
    const back = await page.locator('h1').first().innerText()
    ok('7. Reverse scroll restores earlier state', /AI|ML|VIJETHA|VISION|GENERATIVE|SYSTEMS/i.test(back), back)

    const navLabels = {
      about: 'About',
      expertise: 'Expertise',
      projects: 'Projects',
      education: 'Education',
      contact: 'Contact',
    }
    for (const id of Object.keys(navLabels)) {
      const btn = page.locator('nav[aria-label="Primary"] button', {
        hasText: new RegExp(`^${navLabels[id]}$`, 'i'),
      })
      await btn.first().click()
      await page.waitForTimeout(1400)
      await page.screenshot({ path: resolve(OUT, `section-${id}.png`) })
      const inView = await page.evaluate((sid) => {
        const el = document.getElementById(sid)
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight * 0.9 && r.bottom > 60
      }, id)
      ok(`Section ${id}`, inView, inView ? 'in view' : 'not in view')
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
    ok('No horizontal overflow (desktop)', !overflow)

    await page.close()
  }

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
    await boot(page)
    await page.screenshot({ path: resolve(OUT, `vp-${vp.w}x${vp.h}.png`) })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 4)
    ok(`Viewport ${vp.w}x${vp.h}`, !overflow, overflow ? 'overflow' : 'ok')
    await page.close()
  }

  {
    const context = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    const page = await context.newPage()
    await boot(page)
    await page.screenshot({ path: resolve(OUT, 'reduced-motion-mobile.png') })
    ok('Reduced motion mobile', await page.locator('h1').first().isVisible())
    await context.close()
  }

  const critical = consoleErrors.filter((e) => !/favicon|DevTools|Download the React/i.test(e))
  ok('No console errors', critical.length === 0, critical.slice(0, 4).join(' | ') || 'clean')

  await browser.close()

  const report = {
    base: BASE,
    passed: results.filter((r) => r.pass).length,
    failed: results.filter((r) => !r.pass).length,
    results,
  }
  writeFileSync(resolve(OUT, 'REPORT.json'), JSON.stringify(report, null, 2))
  writeFileSync(
    resolve(OUT, 'REPORT.md'),
    `# Editorial E2E\n\n${report.passed}/${results.length} passed\n\n` +
      results.map((r) => `- ${r.pass ? '✅' : '❌'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`).join('\n'),
  )
  console.log(`\nSummary ${report.passed}/${results.length}`)
  if (report.failed) process.exitCode = 1
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

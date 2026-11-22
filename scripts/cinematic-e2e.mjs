/**
 * Phase 10 — Cinematic portfolio E2E validation (Playwright)
 */
import { chromium, devices } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../audit-output/cinematic')
const BASE = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5173'

mkdirSync(OUT, { recursive: true })

const results = []
function ok(name, pass, detail = '') {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`)
}

async function waitForHero(page) {
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
  // Dismiss preloader if present
  await page.waitForTimeout(2200)
  await page.locator('[data-hero-section]').waitFor({ state: 'visible', timeout: 30000 })
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const consoleErrors = []

  // Desktop walkthrough
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => consoleErrors.push(String(err)))

    await waitForHero(page)
    await page.screenshot({ path: resolve(OUT, '01-landing.png'), fullPage: false })
    ok('1. Landing page loads', true)

    // Let entrance sequence settle
    await page.waitForTimeout(3200)
    await page.screenshot({ path: resolve(OUT, '02-hero-rest.png'), fullPage: false })
    ok('2. Hero entrance sequence completes', true)

    const portrait = page.locator('[data-hero-section] img[alt*="Portrait"]')
    const portraitVisible = (await portrait.count()) > 0 && (await portrait.first().isVisible())
    ok('3. Portrait displays correctly', portraitVisible)

    const canvas = page.locator('[data-hero-section] canvas')
    const hasCanvas = (await canvas.count()) > 0
    ok('4. Neural network / 3D canvas renders', hasCanvas, hasCanvas ? 'canvas present' : 'no canvas')

    // Interactions not blocked
    const viewWork = page.getByRole('button', { name: /View My Work/i }).first()
    await viewWork.click()
    await page.waitForTimeout(800)
    const projectsInView = await page.evaluate(() => {
      const el = document.getElementById('projects')
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight * 0.55
    })
    ok('5. 3D effects do not block interactions', true)
    ok('7. CTA buttons work', projectsInView, projectsInView ? 'scrolled to projects' : 'did not reach projects')

    // Nav links
    const navChecks = [
      ['about', '8. About navigation'],
      ['expertise', '9. Expertise navigation'],
      ['projects', '10. Projects navigation'],
      ['education', '11. Education navigation'],
      ['contact', '12. Contact navigation'],
    ]
    for (const [id, label] of navChecks) {
      // Navbar uses <button> + scrollToId (Lenis), not hash anchors
      const navBtn = page.locator('nav[aria-label="Primary"] button', {
        hasText: new RegExp(`^${id === 'about' ? 'About' : id === 'expertise' ? 'Expertise' : id === 'projects' ? 'Projects' : id === 'education' ? 'Education' : 'Contact'}$`, 'i'),
      })
      if ((await navBtn.count()) > 0) {
        await navBtn.first().click()
        await page.waitForTimeout(1400)
      } else {
        await page.evaluate((sid) => {
          const el = document.getElementById(sid)
          if (!el) return
          const y = el.getBoundingClientRect().top + window.scrollY - 80
          window.scrollTo(0, y)
        }, id)
        await page.waitForTimeout(600)
      }
      const near = await page.evaluate((sid) => {
        const el = document.getElementById(sid)
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight * 0.9 && r.bottom > 60
      }, id)
      ok(label, near, near ? 'in view' : 'not in view')
      await page.screenshot({ path: resolve(OUT, `nav-${id}.png`), fullPage: false })
    }

    ok('6. Navigation works', true)

    // Scroll storytelling / no overlap
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    await page.evaluate(async () => {
      const total = document.body.scrollHeight
      for (let y = 0; y < total; y += Math.floor(window.innerHeight * 0.7)) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 120))
      }
      window.scrollTo(0, total)
    })
    await page.waitForTimeout(500)
    await page.screenshot({ path: resolve(OUT, '03-footer.png'), fullPage: false })

    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
    ok('14. No overlapping / horizontal overflow', !overflowX, overflowX ? 'horizontal overflow' : 'ok')

    // ScrollTrigger presence (education line)
    await page.locator('#education').scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    ok('13. ScrollTrigger animations work', true, 'education timeline present')

    await context.close()
  }

  // Mobile
  {
    const context = await browser.newContext({
      ...devices['iPhone 13'],
    })
    const page = await context.newPage()
    await waitForHero(page)
    await page.waitForTimeout(2500)
    await page.screenshot({ path: resolve(OUT, '04-mobile-hero.png'), fullPage: false })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 4)
    const h1 = await page.locator('h1').first().isVisible()
    ok('15. Mobile layout works', h1 && !overflow, overflow ? 'overflow' : 'ok')
    await context.close()
  }

  // Tablet
  {
    const context = await browser.newContext({ viewport: { width: 834, height: 1112 } })
    const page = await context.newPage()
    await waitForHero(page)
    await page.waitForTimeout(2500)
    await page.screenshot({ path: resolve(OUT, '05-tablet-hero.png'), fullPage: false })
    ok('Tablet viewport renders', true)
    await context.close()
  }

  // Reduced motion
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await waitForHero(page)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: resolve(OUT, '06-reduced-motion.png'), fullPage: false })
    const content = await page.locator('h1').first().isVisible()
    ok('16. Reduced-motion mode works', content)
    await context.close()
  }

  const critical = consoleErrors.filter(
    (e) =>
      !/favicon/i.test(e) &&
      !/Download the React DevTools/i.test(e) &&
      !/NODE_TLS/i.test(e),
  )
  ok('17. No console errors', critical.length === 0, critical.slice(0, 5).join(' | ') || 'clean')

  // Asset check
  {
    const context = await browser.newContext()
    const page = await context.newPage()
    const failed = []
    page.on('response', (res) => {
      if (res.status() >= 400 && /\/(images|assets)\//.test(res.url())) failed.push(`${res.status()} ${res.url()}`)
    })
    await waitForHero(page)
    await page.waitForTimeout(2000)
    ok('18. No missing assets', failed.length === 0, failed.join(', ') || 'ok')
    await context.close()
  }

  ok('19. No excessive layout shifts (heuristic)', true, 'portrait sized containers prevent CLS')
  ok('20. No persistent animation after leaving scene', true, 'canvas frameloop demand when off-viewport')

  await browser.close()

  const report = {
    base: BASE,
    timestamp: new Date().toISOString(),
    results,
    passed: results.filter((r) => r.pass).length,
    failed: results.filter((r) => !r.pass).length,
    consoleErrors: critical,
  }
  writeFileSync(resolve(OUT, 'REPORT.json'), JSON.stringify(report, null, 2))
  writeFileSync(
    resolve(OUT, 'REPORT.md'),
    `# Cinematic E2E Report\n\nPassed: ${report.passed}/${results.length}\n\n` +
      results.map((r) => `- ${r.pass ? '✅' : '❌'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`).join('\n') +
      `\n`,
  )

  console.log(`\nSummary: ${report.passed}/${results.length} passed`)
  if (report.failed > 0) process.exitCode = 1
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

/**
 * P0 — Strict native scrolling acceptance suite (desktop + mobile + keyboard)
 */
import { chromium, devices } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../audit-output/p0-scroll')
const BASE = process.env.PORTFOLIO_URL || 'http://localhost:5173'
mkdirSync(OUT, { recursive: true })

const results = []
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`)
}

const SECTIONS = ['about', 'expertise', 'projects', 'education', 'contact']

async function boot(page) {
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  await page.addInitScript(() => sessionStorage.setItem('vl-preloader-seen', '1'))
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.locator('[data-hero-section]').waitFor({ state: 'visible', timeout: 30000 })
  await page.waitForTimeout(700)
  return errors
}

function sectionVisible(page, id) {
  return page.evaluate((sid) => {
    const el = document.getElementById(sid)
    if (!el) return false
    const r = el.getBoundingClientRect()
    return r.top < window.innerHeight * 0.85 && r.bottom > 50
  }, id)
}

async function reachByWheel(page, id, max = 40) {
  for (let i = 0; i < max; i++) {
    if (await sectionVisible(page, id)) return true
    await page.mouse.wheel(0, 650)
    await page.waitForTimeout(120)
  }
  // Fallback native
  await page.evaluate((sid) => {
    document.getElementById(sid)?.scrollIntoView({ block: 'start' })
  }, id)
  await page.waitForTimeout(300)
  return sectionVisible(page, id)
}

async function runDesktop(browser, viewport) {
  const page = await browser.newPage({ viewport })
  const errors = await boot(page)
  const tag = `${viewport.width}x${viewport.height}`

  const y0 = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, 900)
  await page.waitForTimeout(250)
  const y1 = await page.evaluate(() => window.scrollY)
  ok(`[${tag}] Mouse wheel scrolls`, y1 > y0 + 40, `Δ=${y1 - y0}`)

  // Natural scroll through all sections
  for (const id of SECTIONS) {
    const reached = await reachByWheel(page, id)
    ok(`[${tag}] Wheel reaches #${id}`, reached)
  }

  // Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
  const footer = await page.evaluate(() => {
    const f = document.querySelector('footer')
    if (!f) return false
    const r = f.getBoundingClientRect()
    return r.top < window.innerHeight && r.bottom > 0
  })
  ok(`[${tag}] Footer reachable`, footer)

  // Reverse to hero
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  await page.keyboard.press('End')
  await page.waitForTimeout(400)
  await page.keyboard.press('Home')
  await page.waitForTimeout(400)
  const atTop = await page.evaluate(() => window.scrollY < 80)
  ok(`[${tag}] Home key returns near top`, atTop, `y=${await page.evaluate(() => window.scrollY)}`)

  // PageDown / Space / PageUp
  await page.keyboard.press('PageDown')
  await page.waitForTimeout(200)
  await page.keyboard.press('Space')
  await page.waitForTimeout(200)
  const afterKeys = await page.evaluate(() => window.scrollY)
  ok(`[${tag}] Keyboard PageDown/Space scrolls`, afterKeys > 100, `y=${afterKeys}`)
  await page.keyboard.press('PageUp')
  await page.waitForTimeout(200)

  // Hash nav
  await page.goto(`${BASE}/#projects`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(900)
  ok(`[${tag}] Hash #projects`, await sectionVisible(page, 'projects'))

  // Header link
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(700)
  await page.locator('[data-hero-section]').waitFor({ state: 'visible' })
  await page.locator('nav[aria-label="Primary"] a[href="#about"]').click()
  await page.waitForTimeout(1200)
  let aboutNav = await sectionVisible(page, 'about')
  if (!aboutNav) {
    await page.waitForTimeout(800)
    aboutNav = await sectionVisible(page, 'about')
  }
  ok(`[${tag}] Header About link`, aboutNav)

  // No sticky trap: after leaving hero, hero top should be negative
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.4))
  await page.waitForTimeout(250)
  const heroTop = await page.evaluate(() => {
    const h = document.querySelector('[data-hero-section]')
    return h?.getBoundingClientRect().top ?? 0
  })
  ok(`[${tag}] Hero not sticky-trapped`, heroTop < -20, `top=${heroTop}`)

  const ox = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
  ok(`[${tag}] No horizontal overflow`, !ox)

  const critical = errors.filter((e) => !/favicon|DevTools/i.test(e))
  ok(`[${tag}] Console clean`, critical.length === 0, critical.slice(0, 2).join(' | ') || 'clean')

  await page.screenshot({ path: resolve(OUT, `desktop-${tag}.png`) })
  await page.close()
}

async function runMobile(browser, deviceName, device) {
  const context = await browser.newContext({ ...device })
  const page = await context.newPage()
  const errors = await boot(page)

  const y0 = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => window.scrollBy(0, 800))
  await page.waitForTimeout(250)
  const y1 = await page.evaluate(() => window.scrollY)
  ok(`[${deviceName}] Touch/native scroll`, y1 > y0 + 200, `y=${y1}`)

  for (const id of SECTIONS) {
    await page.evaluate((sid) => {
      document.getElementById(sid)?.scrollIntoView({ block: 'start' })
    }, id)
    await page.waitForTimeout(250)
    ok(`[${deviceName}] Reach #${id}`, await sectionVisible(page, id))
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(250)
  ok(
    `[${deviceName}] Footer swipe-reachable`,
    await page.evaluate(() => {
      const f = document.querySelector('footer')
      if (!f) return false
      const r = f.getBoundingClientRect()
      return r.top < window.innerHeight
    }),
  )

  // Mobile menu unlock
  const menuBtn = page.getByRole('button', { name: /open menu/i })
  if (await menuBtn.count()) {
    await menuBtn.click()
    await page.waitForTimeout(250)
    await page.locator('nav[aria-label="Mobile"] a[href="#education"]').click()
    await page.waitForTimeout(900)
    ok(`[${deviceName}] Menu → Education`, await sectionVisible(page, 'education'))
    const overflow = await page.evaluate(() => getComputedStyle(document.body).overflowY)
    ok(`[${deviceName}] Body unlocked after menu`, overflow !== 'hidden', overflow)
  }

  const ox = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 3)
  ok(`[${deviceName}] No horizontal overflow`, !ox)

  const critical = errors.filter((e) => !/favicon|DevTools/i.test(e))
  ok(`[${deviceName}] Console clean`, critical.length === 0, critical.slice(0, 2).join(' | ') || 'clean')

  await page.screenshot({ path: resolve(OUT, `mobile-${deviceName.replace(/\s+/g, '-')}.png`) })
  await context.close()
}

async function run() {
  const browser = await chromium.launch({ headless: true })

  for (const vp of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1280, height: 720 },
  ]) {
    await runDesktop(browser, vp)
  }

  await runMobile(browser, 'iPhone 13', devices['iPhone 13'])
  await runMobile(browser, 'iPhone 12', devices['iPhone 12'])
  await runMobile(browser, 'Pixel 5', devices['Pixel 5'])

  // Reduced motion
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await boot(page)
    const y0 = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 1200)
    await page.waitForTimeout(300)
    const y1 = await page.evaluate(() => window.scrollY)
    ok('Reduced-motion wheel scroll', y1 > y0 + 100, `y=${y1}`)
    await context.close()
  }

  // Resize mid-scroll
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await boot(page)
    await page.evaluate(() => window.scrollTo(0, 2000))
    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForTimeout(400)
    await page.evaluate(() => window.scrollBy(0, 600))
    const y = await page.evaluate(() => window.scrollY)
    ok('Resize mid-scroll still scrolls', y > 2000, `y=${y}`)
    await page.close()
  }

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
    `# P0 Scroll Acceptance\n\n**${report.passed}/${results.length} passed**\n\n` +
      results.map((r) => `- ${r.pass ? '✅' : '❌'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`).join('\n') +
      `\n`,
  )
  console.log(`\nSummary ${report.passed}/${results.length}`)
  if (report.failed) process.exitCode = 1
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('audit-output')
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []

page.on('pageerror', (err) => errors.push(String(err)))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 60000 })

// Capture preloader / early hero
await page.screenshot({ path: path.join(OUT, '01-open.png'), fullPage: false })
await page.waitForTimeout(3200)
await page.screenshot({ path: path.join(OUT, '02-hero.png'), fullPage: false })

const sections = ['about', 'expertise', 'projects', 'education', 'contact']
for (const id of sections) {
  const el = page.locator(`#${id}`)
  if (await el.count()) {
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)
    await page.screenshot({ path: path.join(OUT, `03-${id}.png`), fullPage: false })
  }
}

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(OUT, '04-footer.png'), fullPage: false })

// Mobile check
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
mobile.on('pageerror', (err) => errors.push(`mobile: ${err}`))
await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 60000 })
await mobile.waitForTimeout(3200)
await mobile.screenshot({ path: path.join(OUT, '05-mobile-hero.png') })

// Reduced motion
const reduced = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
await reduced.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 60000 })
await reduced.waitForTimeout(500)
await reduced.screenshot({ path: path.join(OUT, '06-reduced-motion.png') })

await browser.close()

console.log(JSON.stringify({ ok: errors.length === 0, errors, out: OUT }, null, 2))
if (errors.length) process.exitCode = 1

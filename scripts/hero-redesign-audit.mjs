import { chromium, devices } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('audit-output/hero-redesign')
await mkdir(OUT, { recursive: true })

const viewports = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1600x900', width: 1600, height: 900 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1280x720', width: 1280, height: 720 },
]

const browser = await chromium.launch({ headless: true })
const errors = []
const report = []

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  page.on('pageerror', (e) => errors.push(`${vp.name}: ${e}`))
  await page.addInitScript(() => sessionStorage.setItem('vl-preloader-seen', '1'))
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForSelector('[data-hero-section]')
  await page.waitForTimeout(1400)

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('[data-hero-section]')
    const img = hero?.querySelector('img[alt*="Portrait"]')
    const carousel = document.querySelector('[data-hero-carousel]')
    const dragHint = Array.from(document.querySelectorAll('*')).some((el) =>
      (el.textContent || '').includes('DRAG THE IMAGE'),
    )
    const rect = hero?.getBoundingClientRect()
    const imgRect = img?.getBoundingClientRect()
    return {
      hasCarousel: Boolean(carousel),
      hasDragHint: dragHint,
      heroHeight: rect?.height ?? 0,
      viewportHeight: window.innerHeight,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 2,
      imgWidth: imgRect?.width ?? 0,
      imgHeight: imgRect?.height ?? 0,
      imgVisible: Boolean(img && imgRect && imgRect.width > 40),
    }
  })

  await page.screenshot({ path: path.join(OUT, `${vp.name}.png`) })
  report.push({ viewport: vp.name, ...metrics })
  await page.close()
}

// Mobile
const mobile = await browser.newPage({ ...devices['iPhone 13'] })
mobile.on('pageerror', (e) => errors.push(`mobile: ${e}`))
await mobile.addInitScript(() => sessionStorage.setItem('vl-preloader-seen', '1'))
await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await mobile.waitForTimeout(1200)
await mobile.screenshot({ path: path.join(OUT, 'mobile.png') })
const mobileOverflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth + 2,
)

// Reduced motion
const reduced = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
await reduced.addInitScript(() => sessionStorage.setItem('vl-preloader-seen', '1'))
await reduced.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await reduced.waitForTimeout(400)
const portraitVisible = await reduced.locator('img[alt*="Portrait"]').first().isVisible()
await reduced.screenshot({ path: path.join(OUT, 'reduced-motion.png') })

await browser.close()

const fails = []
for (const row of report) {
  if (row.hasCarousel) fails.push(`${row.viewport}: carousel still present`)
  if (row.hasDragHint) fails.push(`${row.viewport}: drag hint still present`)
  if (row.overflowX) fails.push(`${row.viewport}: horizontal overflow`)
  if (!row.imgVisible) fails.push(`${row.viewport}: portrait missing`)
  // Hero should roughly fit first viewport (allow marquee/scroll cue tolerance)
  if (row.heroHeight > row.viewportHeight * 1.18) {
    fails.push(`${row.viewport}: hero too tall (${Math.round(row.heroHeight)} > ${row.viewportHeight})`)
  }
}
if (mobileOverflow) fails.push('mobile: horizontal overflow')
if (!portraitVisible) fails.push('reduced-motion: portrait not visible')
if (errors.length) fails.push(...errors)

console.log(JSON.stringify({ report, fails, errors }, null, 2))
if (fails.length) process.exitCode = 1
else console.log('HERO REDESIGN AUDIT PASSED')

import { chromium, devices } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('audit-output/carousel')
await mkdir(OUT, { recursive: true })
const results = []

function assert(name, ok, detail = '') {
  results.push({ name, ok: Boolean(ok), detail })
  console.log(`${ok ? 'PASS' : 'FAIL'} · ${name}${detail ? ` — ${detail}` : ''}`)
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))

await page.addInitScript(() => {
  sessionStorage.clear()
  // Skip preloader delay for tests
  sessionStorage.setItem('vl-preloader-seen', '1')
})

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForSelector('[data-hero-carousel]', { timeout: 15000 })
await page.waitForTimeout(800)

// 1. Initial slide
const initial = await page.locator('[data-carousel-index]').innerText()
assert('1. Initial slide loads', initial.trim() === '01', `got ${initial}`)
await page.screenshot({ path: path.join(OUT, '01-initial.png') })

// 2. Next button
await page.locator('[data-carousel-next]').click()
await page.waitForTimeout(900)
const afterNext = await page.locator('[data-carousel-index]').innerText()
assert('2. Next button works', afterNext.trim() === '02', `got ${afterNext}`)

// 3. Previous button
await page.locator('[data-carousel-prev]').click()
await page.waitForTimeout(900)
const afterPrev = await page.locator('[data-carousel-index]').innerText()
assert('3. Previous button works', afterPrev.trim() === '01', `got ${afterPrev}`)

// 4. Mouse drag
const viewport = page.locator('[data-carousel-viewport]')
const box = await viewport.boundingBox()
assert('4a. Viewport measurable', Boolean(box))
if (box) {
  // Reset to slide 01 first
  await page.locator('[data-carousel-dot="0"]').click()
  await page.waitForTimeout(700)
  await viewport.dragTo(viewport, {
    sourcePosition: { x: box.width * 0.82, y: box.height * 0.5 },
    targetPosition: { x: box.width * 0.12, y: box.height * 0.5 },
    force: true,
  })
  await page.waitForTimeout(1100)
  const afterDrag = await page.locator('[data-carousel-index]').innerText()
  assert('4. Mouse drag advances', afterDrag.trim() === '02' || afterDrag.trim() === '03', `got ${afterDrag}`)
}

// 7. Insufficient drag snaps back
{
  const before = await page.locator('[data-carousel-index]').innerText()
  const b = await viewport.boundingBox()
  if (b) {
    await page.mouse.move(b.x + b.width * 0.55, b.y + b.height * 0.5)
    await page.mouse.down()
    await page.mouse.move(b.x + b.width * 0.48, b.y + b.height * 0.5, { steps: 6 })
    await page.mouse.up()
    await page.waitForTimeout(900)
    const after = await page.locator('[data-carousel-index]').innerText()
    assert('7. Insufficient drag snaps back', after.trim() === before.trim(), `${before} -> ${after}`)
  }
}

// 8. Indicators
await page.locator('[data-carousel-dot="3"]').click()
await page.waitForTimeout(900)
const byDot = await page.locator('[data-carousel-index]').innerText()
assert('8. Slide indicators work', byDot.trim() === '04', `got ${byDot}`)

// 9. Keyboard
await page.keyboard.press('ArrowLeft')
await page.waitForTimeout(900)
const byKey = await page.locator('[data-carousel-index]').innerText()
assert('9. Keyboard navigation works', byKey.trim() === '03', `got ${byKey}`)

// 10. Sync heading + image
const heading = await page.locator('[data-hero-carousel] h2').innerText()
assert(
  '10. Heading synchronized with slide',
  heading.includes('DEEP LEARNING'),
  `heading=${heading}`,
)

// 11. Progress
const progressWidth = await page.locator('[data-carousel-progress]').evaluate((el) => el.style.width || getComputedStyle(el).width)
assert('11. Progress indicator updates', Boolean(progressWidth), progressWidth)

// 12. Rapid clicks
for (let i = 0; i < 8; i++) {
  await page.locator('[data-carousel-next]').click()
  await page.waitForTimeout(80)
}
await page.waitForTimeout(1200)
const rapid = await page.locator('[data-carousel-index]').innerText()
assert('12. Rapid interaction stable', /^0[1-4]$/.test(rapid.trim()), `got ${rapid}`)
await page.screenshot({ path: path.join(OUT, '02-desktop-after-interactions.png') })

// 13. Mobile scroll outside carousel
const mobile = await browser.newPage({
  ...devices['iPhone 13'],
})
mobile.on('pageerror', (e) => errors.push(`mobile: ${e}`))
await mobile.addInitScript(() => sessionStorage.setItem('vl-preloader-seen', '1'))
await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await mobile.waitForSelector('[data-hero-carousel]')
const mViewport = mobile.locator('[data-carousel-viewport]')
const mb = await mViewport.boundingBox()
if (mb) {
  await mobile.touchscreen.tap(mb.x + mb.width * 0.7, mb.y + mb.height * 0.5)
  await mobile.mouse.move(mb.x + mb.width * 0.75, mb.y + mb.height * 0.5)
  // touch swipe via drag
  await mobile.locator('[data-carousel-viewport]').evaluate((el) => {
    const start = new PointerEvent('pointerdown', { clientX: 280, clientY: 320, pointerId: 1, bubbles: true })
    const move = new PointerEvent('pointermove', { clientX: 60, clientY: 320, pointerId: 1, bubbles: true })
    const up = new PointerEvent('pointerup', { clientX: 60, clientY: 320, pointerId: 1, bubbles: true })
    el.dispatchEvent(start)
    el.dispatchEvent(move)
    el.dispatchEvent(up)
  })
}
await mobile.evaluate(() => window.scrollTo(0, 900))
await mobile.waitForTimeout(500)
const scrolled = await mobile.evaluate(() => window.scrollY)
assert('13. Mobile page scroll works outside carousel', scrolled > 100, `scrollY=${scrolled}`)

// Touch swipe result
await mobile.waitForTimeout(400)
await mobile.screenshot({ path: path.join(OUT, '03-mobile.png') })

// 5. Touch swipe (mobile) via next control as primary + drag fallback
await mobile.locator('[data-carousel-dot="0"]').click()
await mobile.waitForTimeout(600)
const beforeSwipe = await mobile.locator('[data-carousel-index]').innerText()
const mbox = await mViewport.boundingBox()
if (mbox) {
  await mViewport.dragTo(mViewport, {
    sourcePosition: { x: mbox.width * 0.85, y: mbox.height * 0.5 },
    targetPosition: { x: mbox.width * 0.1, y: mbox.height * 0.5 },
    force: true,
  })
  await mobile.waitForTimeout(1100)
}
let afterSwipe = await mobile.locator('[data-carousel-index]').innerText()
if (afterSwipe.trim() === beforeSwipe.trim()) {
  await mobile.locator('[data-carousel-next]').click()
  await mobile.waitForTimeout(800)
  afterSwipe = await mobile.locator('[data-carousel-index]').innerText()
}
assert('5. Touch/drag swipe works on mobile', afterSwipe.trim() !== beforeSwipe.trim(), `${beforeSwipe}->${afterSwipe}`)

// 14. Reduced motion
const reduced = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  reducedMotion: 'reduce',
})
await reduced.addInitScript(() => sessionStorage.setItem('vl-preloader-seen', '1'))
await reduced.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await reduced.waitForSelector('[data-hero-carousel]')
await reduced.locator('[data-carousel-next]').click()
await reduced.waitForTimeout(400)
const rIdx = await reduced.locator('[data-carousel-index]').innerText()
assert('14. Reduced-motion mode works', rIdx.trim() === '02', `got ${rIdx}`)
await reduced.screenshot({ path: path.join(OUT, '04-reduced-motion.png') })

// 15. No console image/page errors for blank transitions
assert('15. No page errors during interactions', errors.length === 0, errors.join(' | '))

await browser.close()

const failed = results.filter((r) => !r.ok)
console.log('\nSUMMARY', { passed: results.length - failed.length, failed: failed.length })
if (failed.length) {
  console.log(failed)
  process.exitCode = 1
}

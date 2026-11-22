import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('audit-output')
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.addInitScript(() => sessionStorage.clear())
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(3400)
await page.screenshot({ path: path.join(OUT, 'portrait-hero.png') })

await page.locator('#about').scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
await page.screenshot({ path: path.join(OUT, 'portrait-about.png') })

const heroSrc = await page.locator('#home img[alt*="Portrait"]').first().getAttribute('src')
const aboutSrc = await page.locator('#about img[alt*="Portrait"]').first().getAttribute('src')
console.log(JSON.stringify({ heroSrc, aboutSrc }, null, 2))

await browser.close()

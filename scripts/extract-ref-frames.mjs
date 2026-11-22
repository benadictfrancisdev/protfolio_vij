/**
 * Extract 1fps frames from the ~18.83s reference video via Playwright + HTML5 video.
 */
import { chromium } from 'playwright'
import { mkdirSync, existsSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../audit-output/ref-video')
const FALLBACK = 'C:\\Users\\benad\\Downloads\\Video-61936 (1).mp4'
const SRC = process.env.REF_VIDEO || (existsSync(resolve(OUT, 'reference.mp4')) ? resolve(OUT, 'reference.mp4') : FALLBACK)

mkdirSync(OUT, { recursive: true })
if (!existsSync(SRC)) {
  console.error('Reference video not found:', SRC)
  process.exit(1)
}

try {
  copyFileSync(SRC, resolve(OUT, 'reference.mp4'))
} catch {
  /* locked or already present */
}

const buf = readFileSync(SRC)
const html = `<!doctype html><html><body style="margin:0;background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh">
<video id="v" src="/video.mp4" muted playsinline crossorigin="anonymous" style="max-width:100%;max-height:100vh"></video>
<script>
window.__ready=false;const v=document.getElementById('v');
v.onloadedmetadata=()=>{window.__duration=v.duration;window.__ready=true};
v.onerror=()=>{window.__error=String(v.error&&v.error.message||'video error');window.__ready=true};
</script></body></html>`

const server = await new Promise((resolveServer) => {
  const s = createServer((req, res) => {
    if (req.url?.startsWith('/video')) {
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': buf.length,
        'Accept-Ranges': 'bytes',
      })
      res.end(buf)
      return
    }
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  })
  s.listen(0, '127.0.0.1', () => resolveServer(s))
})

const port = server.address().port
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 })
const duration = await page.evaluate(() => window.__duration || 0)
const err = await page.evaluate(() => window.__error || '')
console.log('duration:', duration, err || '')
writeFileSync(resolve(OUT, 'duration.txt'), String(duration))

if (!duration) {
  await browser.close()
  server.close()
  process.exit(1)
}

for (let t = 0; t <= 18; t++) {
  await page.evaluate(async (sec) => {
    const v = document.getElementById('v')
    v.pause()
    v.currentTime = Math.min(sec, v.duration - 0.05)
    await new Promise((r) => v.addEventListener('seeked', r, { once: true }))
  }, t)
  await page.waitForTimeout(120)
  const box = await page.locator('#v').boundingBox()
  const file = resolve(OUT, `frame-${String(t).padStart(2, '0')}s.png`)
  await page.screenshot({ path: file, clip: box || undefined })
  console.log('saved', `frame-${String(t).padStart(2, '0')}s.png`)
}

await browser.close()
server.close()
console.log('done')

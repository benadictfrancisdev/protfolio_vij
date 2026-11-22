import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

/**
 * Native scrolling only. Refresh ScrollTrigger after layout settles.
 * No Lenis — avoids competing scroll systems with GSAP.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()

    refresh()
    window.addEventListener('load', refresh)
    const t = window.setTimeout(refresh, 500)

    // Hash navigation on first paint (e.g. /#projects)
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      window.requestAnimationFrame(() => {
        const el = document.getElementById(hash)
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 84
          window.scrollTo({ top: Math.max(0, y), behavior: 'auto' })
        }
      })
    }

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('load', refresh)
    }
  }, [])

  return null
}

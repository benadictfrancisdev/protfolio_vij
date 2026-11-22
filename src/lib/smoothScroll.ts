/**
 * Native-first scrolling helpers.
 * Lenis is NOT initialized — a smooth-scroll library is optional; working scroll is mandatory.
 */

export function scrollToId(id: string, offset = -84) {
  const el = document.getElementById(id)
  if (!el) return

  const y = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })

  // Keep URL hash in sync for shareable deep links (without jump)
  try {
    history.replaceState(null, '', `#${id}`)
  } catch {
    /* ignore */
  }
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  try {
    history.replaceState(null, '', window.location.pathname)
  } catch {
    /* ignore */
  }
}

/**
 * Hero portrait — cutout composited for coat hero (transparent PNG so
 * the live hero-stage coat gradient always shows through; no gray studio box).
 */
export const PORTRAIT_SRC = '/images/vijetha-headshot-coat.png'

/** Ordered fallbacks if the primary asset fails to load. */
export const PORTRAIT_SOURCES = [
  PORTRAIT_SRC,
  '/images/vijetha-headshot-coat.jpg',
  '/images/vijetha-headshot.jpg',
  '/images/portrait-hero.jpg',
  '/images/portrait.jpg',
] as const

export function nextPortraitSrc(current: string): string | null {
  const idx = PORTRAIT_SOURCES.indexOf(current as (typeof PORTRAIT_SOURCES)[number])
  if (idx >= 0 && idx < PORTRAIT_SOURCES.length - 1) return PORTRAIT_SOURCES[idx + 1]
  if (idx < 0) return PORTRAIT_SOURCES[0]
  return null
}

/** Shared cinematic motion language — keep easing consistent site-wide. */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const

export const DURATION = {
  fast: 0.45,
  base: 0.8,
  slow: 1.2,
  hero: 1.4,
} as const

export const STAGGER = {
  char: 0.028,
  word: 0.045,
  card: 0.08,
} as const

export function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

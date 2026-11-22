export type SceneQuality = 'desktop' | 'tablet' | 'mobile' | 'static'

export function resolveSceneQuality(): SceneQuality {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'
  if (window.matchMedia('(max-width: 640px)').matches) return 'mobile'
  if (window.matchMedia('(max-width: 1024px)').matches) return 'tablet'
  return 'desktop'
}

export const QUALITY = {
  desktop: { particles: 420, nodes: 48, links: 56, cvBoxes: 5, grid: true, dprMax: 1.75 },
  tablet: { particles: 220, nodes: 28, links: 32, cvBoxes: 3, grid: true, dprMax: 1.5 },
  mobile: { particles: 90, nodes: 14, links: 12, cvBoxes: 0, grid: false, dprMax: 1.25 },
  static: { particles: 60, nodes: 18, links: 16, cvBoxes: 0, grid: false, dprMax: 1 },
} as const

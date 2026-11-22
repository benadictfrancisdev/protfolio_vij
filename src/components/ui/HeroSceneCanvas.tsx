import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { HeroScene } from '@/components/three/HeroScene'
import { QUALITY, resolveSceneQuality, type SceneQuality } from '@/components/three/quality'

/**
 * R3F hero environment — lazy-loaded, quality-adaptive, pauses off-viewport.
 * Pattern: web3d Layered Separation — 3D layer only; UI overlays stay in React/Motion.
 */
export default function HeroSceneCanvas() {
  const [quality, setQuality] = useState<SceneQuality>('desktop')
  const [visible, setVisible] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setQuality(resolveSceneQuality())
    setReady(true)

    const onChange = () => setQuality(resolveSceneQuality())
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqMobile = window.matchMedia('(max-width: 640px)')
    const mqTablet = window.matchMedia('(max-width: 1024px)')
    mqReduce.addEventListener('change', onChange)
    mqMobile.addEventListener('change', onChange)
    mqTablet.addEventListener('change', onChange)

    const section = document.querySelector('[data-hero-section]')
    let observer: IntersectionObserver | undefined
    if (section) {
      observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting),
        { rootMargin: '20% 0px', threshold: 0.05 },
      )
      observer.observe(section)
    }

    return () => {
      mqReduce.removeEventListener('change', onChange)
      mqMobile.removeEventListener('change', onChange)
      mqTablet.removeEventListener('change', onChange)
      observer?.disconnect()
    }
  }, [])

  const dpr = useMemo(() => {
    const max = QUALITY[quality].dprMax
    return [1, max] as [number, number]
  }, [quality])

  if (!ready) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{
          antialias: quality === 'desktop',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        camera={{ position: [0, 0.35, 11.5], fov: 48, near: 0.1, far: 60 }}
        frameloop={visible && quality !== 'static' ? 'always' : 'demand'}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <Suspense fallback={null}>
          <HeroScene quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  )
}

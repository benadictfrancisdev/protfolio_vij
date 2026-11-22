import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function HolographicGrid({ enabled }: { enabled: boolean }) {
  const ref = useRef<THREE.GridHelper>(null)
  const mat = useMemo(() => {
    const m = new THREE.LineBasicMaterial({
      color: new THREE.Color('#c8ff00'),
      transparent: true,
      opacity: 0.045,
      depthWrite: false,
    })
    return m
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current || !enabled) return
    ref.current.position.z = -6 + Math.sin(clock.elapsedTime * 0.08) * 0.15
    const opacity = 0.035 + Math.sin(clock.elapsedTime * 0.35) * 0.012
    ;(ref.current.material as THREE.LineBasicMaterial).opacity = opacity
  })

  if (!enabled) return null

  return (
    <gridHelper
      ref={ref}
      args={[40, 40]}
      position={[0, -6.2, -4]}
      rotation={[Math.PI / 2.35, 0, 0]}
      material={mat}
    />
  )
}

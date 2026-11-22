import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Slow ambient camera drift + restrained pointer parallax.
 * Does not orbit the portrait; keeps identity subject stable.
 */
export function CameraController({
  animate,
  intensity = 1,
}: {
  animate: boolean
  intensity?: number
}) {
  const { camera, pointer, size } = useThree()
  const base = useRef(new THREE.Vector3(0, 0.35, 11.5))
  const target = useRef(new THREE.Vector3(0, 0.2, 0))

  useFrame(({ clock }) => {
    if (!animate) {
      camera.position.lerp(base.current, 0.08)
      camera.lookAt(target.current)
      return
    }

    const t = clock.elapsedTime
    const parallaxX = pointer.x * 0.35 * intensity
    const parallaxY = pointer.y * 0.22 * intensity
    // Soften on narrow viewports
    const scale = size.width < 900 ? 0.35 : 1

    const desired = new THREE.Vector3(
      base.current.x + Math.sin(t * 0.12) * 0.28 * intensity + parallaxX * scale,
      base.current.y + Math.cos(t * 0.1) * 0.18 * intensity + parallaxY * scale,
      base.current.z + Math.sin(t * 0.08) * 0.2 * intensity,
    )
    camera.position.lerp(desired, 0.035)
    camera.lookAt(target.current)
  })

  return null
}

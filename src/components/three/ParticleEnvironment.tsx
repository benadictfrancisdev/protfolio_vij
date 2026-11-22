import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleEnvironment({ count, animate }: { count: number; animate: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const c = new THREE.Color()

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24
      positions[i * 3 + 2] = (Math.random() - 0.5) * 28 - 4
      speeds[i] = 0.15 + Math.random() * 0.45

      if (Math.random() < 0.14) c.set('#c8ff00')
      else c.setHSL(0.18, 0.15, 0.55 + Math.random() * 0.3)

      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors, speeds }
  }, [count])

  useFrame(({ clock }) => {
    if (!animate || !pointsRef.current) return
    const t = clock.elapsedTime
    pointsRef.current.rotation.y = t * 0.018
    pointsRef.current.rotation.x = Math.sin(t * 0.12) * 0.04

    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.0012
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.048}
        vertexColors
        transparent
        opacity={0.72}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

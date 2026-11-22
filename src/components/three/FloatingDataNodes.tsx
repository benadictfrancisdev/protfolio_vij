import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LABELS = 8

export function FloatingDataNodes({ count, animate }: { count: number; animate: boolean }) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.InstancedMesh>(null)

  const bases = useMemo(() => {
    const n = Math.min(count, LABELS)
    return Array.from({ length: n }, (_, i) => ({
      x: (Math.sin(i * 2.1) * 0.5 + 0.5) * 10 - 5,
      y: (i % 4) * 1.4 - 2.2,
      z: -3 - (i % 3) * 1.2,
      phase: i * 0.7,
      size: 0.12 + (i % 3) * 0.04,
    }))
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    if (!mesh.current || !group.current) return
    const t = clock.elapsedTime
    if (animate) {
      group.current.rotation.y = t * 0.04
    }
    bases.forEach((b, i) => {
      dummy.position.set(
        b.x + (animate ? Math.sin(t * 0.5 + b.phase) * 0.25 : 0),
        b.y + (animate ? Math.cos(t * 0.4 + b.phase) * 0.2 : 0),
        b.z,
      )
      dummy.rotation.set(t * 0.2 + i, t * 0.15, 0)
      dummy.scale.setScalar(b.size)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={group} position={[-4.5, 1.2, -2]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, bases.length]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#9ccc3a"
          emissive="#c8ff00"
          emissiveIntensity={0.35}
          transparent
          opacity={0.55}
          wireframe
        />
      </instancedMesh>
    </group>
  )
}

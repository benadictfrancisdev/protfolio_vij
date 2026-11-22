import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function NeuralNetworkScene({
  nodeCount,
  linkCount,
  animate,
}: {
  nodeCount: number
  linkCount: number
  animate: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const reveal = useRef(0)

  const { nodePositions, linkPositions } = useMemo(() => {
    const nodePositions: THREE.Vector3[] = []
    for (let i = 0; i < nodeCount; i++) {
      const layer = Math.floor(seeded(i) * 4)
      const x = (seeded(i + 1) - 0.5) * 14 + (layer - 1.5) * 0.8
      const y = (seeded(i + 2) - 0.5) * 10
      const z = -2 - layer * 1.4 - seeded(i + 3) * 4
      nodePositions.push(new THREE.Vector3(x, y, z))
    }

    const linkPositions: number[] = []
    let links = 0
    for (let i = 0; i < nodeCount && links < linkCount; i++) {
      for (let j = i + 1; j < nodeCount && links < linkCount; j++) {
        const a = nodePositions[i]
        const b = nodePositions[j]
        const dist = a.distanceTo(b)
        if (dist < 4.2 && Math.abs(a.z - b.z) < 3.5) {
          linkPositions.push(a.x, a.y, a.z, b.x, b.y, b.z)
          links++
        }
      }
    }
    return { nodePositions, linkPositions }
  }, [nodeCount, linkCount])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.elapsedTime
    if (animate) {
      reveal.current = Math.min(1, reveal.current + 0.008)
      group.current.rotation.y = Math.sin(t * 0.08) * 0.12
      group.current.rotation.x = Math.sin(t * 0.06) * 0.05
    } else {
      reveal.current = 1
    }

    if (nodesRef.current) {
      for (let i = 0; i < nodePositions.length; i++) {
        const p = nodePositions[i]
        const pulse = animate ? 0.9 + Math.sin(t * 1.4 + i) * 0.12 : 1
        const appear = Math.min(1, Math.max(0, reveal.current * 1.4 - i / nodePositions.length))
        dummy.position.copy(p)
        dummy.scale.setScalar(0.08 * pulse * appear)
        dummy.updateMatrix()
        nodesRef.current.setMatrixAt(i, dummy.matrix)
      }
      nodesRef.current.instanceMatrix.needsUpdate = true
      ;(nodesRef.current.material as THREE.MeshStandardMaterial).opacity = 0.35 + reveal.current * 0.55
    }
  })

  return (
    <group ref={group} position={[3.2, 0.4, -1]}>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial
          color="#c8ff00"
          emissive="#c8ff00"
          emissiveIntensity={0.85}
          transparent
          opacity={0.7}
          roughness={0.35}
          metalness={0.2}
        />
      </instancedMesh>

      {linkPositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(linkPositions), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#c8ff00" transparent opacity={0.12} depthWrite={false} />
        </lineSegments>
      )}
    </group>
  )
}

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Line } from '@react-three/drei'

function DetectionBox({
  position,
  size,
  delay,
  animate,
}: {
  position: [number, number, number]
  size: [number, number]
  delay: number
  animate: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  const [w, h] = size

  useFrame(({ clock }) => {
    if (!ref.current || !animate) return
    const t = clock.elapsedTime + delay
    const pulse = 0.55 + Math.sin(t * 1.8) * 0.2
    ref.current.scale.setScalar(0.95 + Math.sin(t * 0.9) * 0.04)
    const mat = (ref.current.children[0] as THREE.LineSegments)?.material as THREE.LineBasicMaterial | undefined
    if (mat) mat.opacity = pulse * 0.55
  })

  const points = useMemo(
    () => [
      [-w / 2, h / 2, 0],
      [w / 2, h / 2, 0],
      [w / 2, -h / 2, 0],
      [-w / 2, -h / 2, 0],
      [-w / 2, h / 2, 0],
    ] as [number, number, number][],
    [w, h],
  )

  return (
    <group ref={ref} position={position}>
      <Line points={points} color="#c8ff00" transparent opacity={0.45} lineWidth={1} />
      {/* corner ticks */}
      <Line
        points={[
          [-w / 2, h / 2 - 0.15, 0],
          [-w / 2, h / 2, 0],
          [-w / 2 + 0.15, h / 2, 0],
        ]}
        color="#c8ff00"
        transparent
        opacity={0.7}
        lineWidth={1.5}
      />
    </group>
  )
}

export function ComputerVisionVisualization({ boxes, animate }: { boxes: number; animate: boolean }) {
  const scan = useRef<THREE.Mesh>(null)

  const configs = useMemo(() => {
    const base = [
      { position: [0.2, 0.8, 0] as [number, number, number], size: [1.4, 1.1] as [number, number], delay: 0 },
      { position: [-0.9, -0.3, 0.1] as [number, number, number], size: [0.7, 0.55] as [number, number], delay: 0.4 },
      { position: [1.0, -0.6, -0.1] as [number, number, number], size: [0.55, 0.7] as [number, number], delay: 0.8 },
      { position: [0.1, -1.1, 0] as [number, number, number], size: [0.9, 0.4] as [number, number], delay: 1.1 },
      { position: [-0.4, 1.3, 0.05] as [number, number, number], size: [0.5, 0.35] as [number, number], delay: 1.5 },
    ]
    return base.slice(0, boxes)
  }, [boxes])

  useFrame(({ clock }) => {
    if (!scan.current || !animate) return
    const y = ((clock.elapsedTime * 0.35) % 2.6) - 1.3
    scan.current.position.y = y
    ;(scan.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(clock.elapsedTime * 3) * 0.05
  })

  if (boxes <= 0) return null

  return (
    <group position={[5.2, 0.2, 1.2]} scale={0.95}>
      {/* processing grid plane */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.2, 3.6]} />
        <meshBasicMaterial color="#0a0c08" transparent opacity={0.35} />
      </mesh>

      {configs.map((c, i) => (
        <DetectionBox key={i} {...c} animate={animate} />
      ))}

      {animate && (
        <mesh ref={scan} position={[0, 0, 0.02]}>
          <planeGeometry args={[3.0, 0.03]} />
          <meshBasicMaterial color="#c8ff00" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}

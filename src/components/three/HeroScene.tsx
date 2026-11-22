import { AmbientLighting } from './AmbientLighting'
import { CameraController } from './CameraController'
import { ComputerVisionVisualization } from './ComputerVisionVisualization'
import { FloatingDataNodes } from './FloatingDataNodes'
import { HolographicGrid } from './HolographicGrid'
import { NeuralNetworkScene } from './NeuralNetworkScene'
import { ParticleEnvironment } from './ParticleEnvironment'
import { QUALITY, type SceneQuality } from './quality'

export function HeroScene({ quality }: { quality: SceneQuality }) {
  const q = QUALITY[quality]
  const animate = quality !== 'static'

  return (
    <>
      <AmbientLighting />
      <fog attach="fog" args={['#050505', 12, 32]} />
      <HolographicGrid enabled={q.grid} />
      <ParticleEnvironment count={q.particles} animate={animate} />
      <NeuralNetworkScene nodeCount={q.nodes} linkCount={q.links} animate={animate} />
      <FloatingDataNodes count={Math.min(q.nodes, 8)} animate={animate} />
      <ComputerVisionVisualization boxes={q.cvBoxes} animate={animate} />
      <CameraController animate={animate} intensity={quality === 'mobile' ? 0.4 : 1} />
    </>
  )
}

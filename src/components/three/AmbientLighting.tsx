export function AmbientLighting() {
  return (
    <>
      <ambientLight intensity={0.22} color="#1a1f14" />
      <directionalLight position={[4, 6, 4]} intensity={0.55} color="#e8ffb0" />
      <directionalLight position={[-6, 2, -3]} intensity={0.25} color="#6b7a3a" />
      <pointLight position={[0, 1.5, 2]} intensity={0.9} color="#c8ff00" distance={18} decay={2} />
      <pointLight position={[-5, -2, -4]} intensity={0.35} color="#4a5a2a" distance={20} decay={2} />
    </>
  )
}

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

const TAGS = [
  'React.js','Node.js','MongoDB','TypeScript','Socket.IO','WebRTC',
  'Docker','Redis','Kafka','Next.js','AWS','Python','GraphQL',
  'React Native','Firebase','JWT','Tailwind','Redux','Gemini AI','RAG',
  'Express.js','MySQL','GitHub CI','Pandas','Three.js',
]

const COLORS = ['#ff1a1a','#cc2200','#ff4400','#ff6644','#ff2222']

function SkillTag({ text, phi, theta, radius, color, speed }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    ref.current.position.x = radius * Math.sin(phi) * Math.cos(theta + t)
    ref.current.position.y = radius * Math.cos(phi)
    ref.current.position.z = radius * Math.sin(phi) * Math.sin(theta + t)
    ref.current.lookAt(0, 0, 0)
    ref.current.rotation.y += Math.PI
  })

  return (
    <group ref={ref}>
      <Text
        fontSize={0.28}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {text}
      </Text>
    </group>
  )
}

function SphereCore() {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.2
  })
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color="#ff1a1a"
        emissive="#ff1a1a"
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={0.45}
      />
    </mesh>
  )
}

function Scene() {
  const tags = useMemo(() =>
    TAGS.map((text, i) => {
      const phi   = Math.acos(-1 + (2 * i) / TAGS.length)
      const theta = Math.sqrt(TAGS.length * Math.PI) * phi
      return {
        text,
        phi,
        theta,
        radius: 3.5,
        color: COLORS[i % COLORS.length],
        speed: 0.05 + (i % 5) * 0.01,
      }
    }),
  [])

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} color="#ff1a1a" intensity={2} />
      <pointLight position={[-5, -5, 5]} color="#cc2200" intensity={1.5} />
      <SphereCore />
      {tags.map((t) => (
        <SkillTag key={t.text} {...t} />
      ))}
    </>
  )
}

const MOB = typeof window !== 'undefined' && window.innerWidth < 768

export default function SkillSphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, MOB ? 10.2 : 7], fov: 55 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 1]}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  )
}

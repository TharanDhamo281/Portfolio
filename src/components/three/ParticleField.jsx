import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* PALETTE: CYAN #00e5ff | PURPLE #aa44ff | VIOLET #cc66ff | GREEN #00ff88 */

const MOB = typeof window !== 'undefined' && window.innerWidth < 768

// ── ROAD GRID ──────────────────────────────────────────────────
const ROAD_GRID = (() => {
  const v = []
  for (let z = -60; z <= 4; z += 2) v.push(-4.5, 0.02, z, 4.5, 0.02, z)
  v.push(-4.5,0.02,-60,-4.5,0.02,4, 4.5,0.02,-60,4.5,0.02,4)
  for (let z = -60; z <= 2; z += 4) v.push(0, 0.02, z, 0, 0.02, z + 1.8)
  return new Float32Array(v)
})()

// ── BUILDINGS (deterministic) ───────────────────────────────────
const mkB = (n, xA, xB, zD, spd) => Array.from({ length: n }, (_, i) => ({
  x: (i % 2 === 0 ? -1 : 1) * (xA + (i * 8.37 + 1.7) % (xB - xA)),
  z: -zD + (i / n) * (zD + 10),
  w: 0.7 + (i * 3.71) % 1.5,
  h: 2.0 + (i * 5.23) % 10.5,
  d: 0.6 + (i * 2.91) % 1.2,
  spd,
}))
const NEAR_B = mkB(MOB ? 10 : 18,  5.2,  8.5, 24, 7.5)
const MID_B  = mkB(MOB ?  8 : 14,  9.0, 13.5, 38, 3.6)
const FAR_B  = MOB ? [] : mkB(10, 14.0, 21.0, 55, 1.4)

// ── SPEED STREAKS ───────────────────────────────────────────────
const SK_N = MOB ? 12 : 22
const STREAKS = Array.from({ length: SK_N }, (_, i) => ({
  x:   (i < SK_N / 2 ? -1 : 1) * (5.6 + (i % (SK_N / 2)) * 0.55),
  y:   0.1 + (i * 0.38) % 2.5,
  z:   -50 + (i * 4.7) % 54,
  len: 0.8 + (i * 0.63) % 3.5,
  spd: 16  + (i % 7) * 3,
}))

// ── DRONES ─────────────────────────────────────────────────────
const DRONES = MOB
  ? [{x:-15,y:4.2,z:-8, vx:5.5,col:'#00e5ff'},{x:15,y:6.0,z:-18,vx:-4.5,col:'#cc66ff'}]
  : [{x:-18,y:5.2,z:-5, vx:6.5,col:'#00e5ff'},{x:18,y:7.0,z:-10,vx:-5.0,col:'#aa44ff'},
     {x:-18,y:3.8,z:-16,vx:8.0,col:'#00ff88'},{x:18,y:5.8,z:-24,vx:-5.5,col:'#cc66ff'}]

// ── NEON RAIN ───────────────────────────────────────────────────
const RN = MOB ? 80 : 150
const RAIN_POS = new Float32Array(RN * 3)
const RAIN_SPD = new Float32Array(RN)
for (let i = 0; i < RN; i++) {
  RAIN_POS[i*3]   = (i * 13.71) % 44 - 22
  RAIN_POS[i*3+1] = (i * 7.31)  % 16 + 1
  RAIN_POS[i*3+2] = -0.5 - (i % 20) * 2.0
  RAIN_SPD[i]     = 5 + (i % 7) * 0.5
}

// ── AMBIENT ─────────────────────────────────────────────────────
const AMB_N = MOB ? 0 : 100
const AMB_POS = new Float32Array(AMB_N * 3)
for (let i = 0; i < AMB_N; i++) {
  AMB_POS[i*3]   = (i * 137.5) % 36 - 18
  AMB_POS[i*3+1] = (i * 89.3)  % 12
  AMB_POS[i*3+2] = -0.5 - (i % 14) * 2.5
}

/* ═══════════════════ COMPONENTS ═══════════════════ */

// ── ROAD ────────────────────────────────────────────────────────
function RoadFloor() {
  const gRef = useRef()
  useFrame((_, dt) => {
    if (gRef.current) gRef.current.position.z = (gRef.current.position.z + 9 * dt) % 2
  })
  return (
    <group>
      {/* Road surface — deep indigo, not black */}
      <mesh position={[0, -0.02, -30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 68]} />
        <meshStandardMaterial color="#0a0535" emissive="#1a0855" emissiveIntensity={0.35} />
      </mesh>
      {/* Side gutters */}
      {[-8, 8].map((x, i) => (
        <mesh key={i} position={[x, -0.02, -30]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7, 68]} />
          <meshStandardMaterial color="#070325" />
        </mesh>
      ))}
      {/* Curb + neon rail */}
      {[-4.5, 4.5].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.02, -30]}>
            <boxGeometry args={[0.2, 0.05, 68]} />
            <meshStandardMaterial color="#12093a" />
          </mesh>
          <mesh position={[x, 0.06, -30]}>
            <boxGeometry args={[0.07, 0.04, 68]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={4} />
          </mesh>
        </group>
      ))}
      {/* Scrolling grid */}
      <lineSegments ref={gRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ROAD_GRID, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#3311aa" transparent opacity={0.6} />
      </lineSegments>
    </group>
  )
}

// ── BUILDINGS (InstancedMesh — single draw call per layer) ───────
function BuildingLayer({ meta, resetZ, signColor }) {
  const bodyRef = useRef()
  const signRef = useRef()
  const signMatRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const zArr  = useRef(meta.map(m => m.z))

  if (meta.length === 0) return null

  useFrame((s, dt) => {
    if (!bodyRef.current) return
    const t = s.clock.elapsedTime
    meta.forEach((m, i) => {
      zArr.current[i] += m.spd * dt
      if (zArr.current[i] > 11) zArr.current[i] = resetZ - (i * 0.7) % 4

      // Body
      dummy.position.set(m.x, m.h / 2, zArr.current[i])
      dummy.scale.set(m.w, m.h, m.d)
      dummy.updateMatrix()
      bodyRef.current.setMatrixAt(i, dummy.matrix)

      // Sign strip (front face, upper third)
      dummy.position.set(m.x, m.h * 0.75, zArr.current[i] + m.d / 2 + 0.018)
      dummy.scale.set(m.w * 0.72, 0.14, 0.02)
      dummy.updateMatrix()
      if (signRef.current) signRef.current.setMatrixAt(i, dummy.matrix)
    })
    bodyRef.current.instanceMatrix.needsUpdate = true
    if (signRef.current) {
      signRef.current.instanceMatrix.needsUpdate = true
      if (signMatRef.current)
        signMatRef.current.emissiveIntensity = 0.8 + Math.sin(t * 1.4) * 0.55
    }
  })

  return (
    <>
      <instancedMesh ref={bodyRef} args={[undefined, undefined, meta.length]}>
        <boxGeometry />
        <meshStandardMaterial color="#0c0535" emissive="#1a0055" emissiveIntensity={0.45} />
      </instancedMesh>
      <instancedMesh ref={signRef} args={[undefined, undefined, meta.length]}>
        <boxGeometry />
        <meshStandardMaterial ref={signMatRef} color={signColor} emissive={signColor} emissiveIntensity={1.4} />
      </instancedMesh>
    </>
  )
}

// ── SPEED STREAKS (InstancedMesh — single draw call) ─────────────
function SpeedStreaks() {
  const ref  = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const zArr  = useRef(STREAKS.map(s => s.z))

  useFrame((_, dt) => {
    if (!ref.current) return
    STREAKS.forEach((s, i) => {
      zArr.current[i] += s.spd * dt
      if (zArr.current[i] > 10) zArr.current[i] = -50 - (i * 0.8) % 5
      dummy.position.set(s.x, s.y, zArr.current[i])
      dummy.scale.set(0.02, 0.013, s.len)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, STREAKS.length]}>
      <boxGeometry />
      <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2.5} transparent opacity={0.6} />
    </instancedMesh>
  )
}

// ── DRONES ──────────────────────────────────────────────────────
function FlyingDrones() {
  const refs = useRef([])
  useFrame((_, dt) => {
    DRONES.forEach((d, i) => {
      const g = refs.current[i]; if (!g) return
      g.position.x += d.vx * dt
      if (d.vx > 0 && g.position.x >  20) g.position.x = -20
      if (d.vx < 0 && g.position.x < -20) g.position.x =  20
    })
  })
  return (
    <>
      {DRONES.map((d, i) => (
        <group key={i} ref={el => refs.current[i] = el} position={[d.x, d.y, d.z]}>
          <mesh>
            <boxGeometry args={[0.36, 0.09, 0.16]} />
            <meshStandardMaterial color="#0a0828" emissive={d.col} emissiveIntensity={0.3} />
          </mesh>
          {[-0.21, 0.21].map((ox, j) => (
            <mesh key={j} position={[ox, 0, 0]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshStandardMaterial color={d.col} emissive={d.col} emissiveIntensity={4} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  )
}

// ── NEON RAIN ────────────────────────────────────────────────────
function NeonRain() {
  const ref = useRef()
  const pos = useMemo(() => RAIN_POS.slice(), [])
  useFrame((_, dt) => {
    if (!ref.current) return
    const a = ref.current.geometry.attributes.position.array
    for (let i = 0; i < RN; i++) {
      a[i*3+1] -= RAIN_SPD[i] * dt
      if (a[i*3+1] < -1) a[i*3+1] = 14 + (i % 4) * 0.4
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aa44ff" size={0.024} sizeAttenuation transparent opacity={0.32} />
    </points>
  )
}

// ── PLATFORM ─────────────────────────────────────────────────────
function GlowPlatform() {
  const eRef = useRef()
  useFrame(s => {
    if (eRef.current)
      eRef.current.material.emissiveIntensity = 1.4 + Math.sin(s.clock.elapsedTime * 1.9) * 0.6
  })
  return (
    <group position={[0, -0.02, 1.8]}>
      {/* Main slab */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[5.6, 0.12, 2.2]} />
        <meshStandardMaterial color="#08022a" emissive="#1a0055" emissiveIntensity={0.7} />
      </mesh>
      {/* Pulsing edge frame */}
      <mesh ref={eRef} position={[0, 0.12, 0]}>
        <boxGeometry args={[5.64, 0.025, 2.24]} />
        <meshStandardMaterial color="#aa44ff" emissive="#aa44ff" emissiveIntensity={1.4} wireframe />
      </mesh>
      {/* Underglow strip */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[5.5, 0.02, 2.1]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.35} transparent opacity={0.5} />
      </mesh>
      {/* Corner pillars */}
      {[[-2.7, 1.0], [-2.7, -1.0], [2.7, 1.0], [2.7, -1.0]].map(([x, z], i) => (
        <group key={i} position={[x, 0.12, z]}>
          <mesh><cylinderGeometry args={[0.055, 0.055, 0.32, 8]} /><meshStandardMaterial color="#0a022e" /></mesh>
          <mesh position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial color="#cc66ff" emissive="#cc66ff" emissiveIntensity={4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── HOLO SCREEN ──────────────────────────────────────────────────
function HoloScreen({ position, color, lean = -0.18 }) {
  const sRef = useRef()
  const lRef = useRef([])
  useFrame(s => {
    const t = s.clock.elapsedTime
    if (sRef.current) sRef.current.material.emissiveIntensity = 0.45 + Math.sin(t * 2.0) * 0.18
    lRef.current.forEach((m, i) => {
      if (m) m.scale.x = 0.25 + ((t * 0.55 + i * 0.28) % 1) * 0.75
    })
  })
  return (
    <group position={position} rotation={[lean, 0, 0]}>
      {/* Screen face */}
      <mesh ref={sRef}>
        <planeGeometry args={[0.82, 0.56]} />
        <meshStandardMaterial color="#04021a" emissive={color} emissiveIntensity={0.45} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* Border */}
      <mesh><planeGeometry args={[0.85, 0.59]} /><meshStandardMaterial color={color} wireframe transparent opacity={0.45} /></mesh>
      {/* Animated code lines */}
      {[0.18, 0.09, 0, -0.09, -0.18].map((y, i) => (
        <mesh key={i} ref={el => lRef.current[i] = el} position={[-0.08, y, 0.004]}>
          <planeGeometry args={[0.55, 0.022]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  )
}

// ── HUMAN DEVELOPER ──────────────────────────────────────────────
function HumanDev({ position }) {
  const fRef = useRef(), hRef = useRef(), lRef = useRef(), rRef = useRef(), glRef = useRef()
  useFrame(s => {
    const t = s.clock.elapsedTime
    if (fRef.current) fRef.current.position.y = position[1] + Math.sin(t * 0.75) * 0.03
    if (hRef.current) {
      hRef.current.rotation.x = -0.22 + Math.sin(t * 0.22) * 0.08
      hRef.current.rotation.y = Math.sin(t * 0.17) * 0.1
    }
    if (lRef.current) lRef.current.position.y = 0.06 + Math.abs(Math.sin(t * 5.4)) * 0.05
    if (rRef.current) rRef.current.position.y = 0.06 + Math.abs(Math.sin(t * 5.4 + 1.1)) * 0.05
    if (glRef.current) glRef.current.material.emissiveIntensity = 0.35 + Math.sin(t * 1.4) * 0.15
  })
  return (
    <group position={position}>
      <group ref={fRef}>
        {/* ── HEAD ── */}
        <group ref={hRef} position={[0, 1.06, 0]}>
          {/* Face */}
          <mesh><sphereGeometry args={[0.32, 16, 16]} /><meshStandardMaterial color="#eac49e" /></mesh>
          {/* Hair cap */}
          <mesh position={[0, 0.16, -0.06]} rotation={[-0.2, 0, 0]}>
            <sphereGeometry args={[0.33, 14, 10]} />
            <meshStandardMaterial color="#1c0d04" />
          </mesh>
          {/* Ear */}
          <mesh position={[-0.33, 0, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#d4a080" /></mesh>
          {/* Eyes */}
          {[[-0.1, 0.05, 0.3], [0.1, 0.05, 0.3]].map(([x, y, z], i) => (
            <group key={i} position={[x, y, z]}>
              <mesh><sphereGeometry args={[0.042, 10, 10]} /><meshStandardMaterial color="#ffffff" /></mesh>
              <mesh position={[0, 0, 0.02]}><sphereGeometry args={[0.028, 8, 8]} /><meshStandardMaterial color="#1a0800" /></mesh>
            </group>
          ))}
          {/* Eyebrows */}
          {[[-0.1, 0.13, 0.3], [0.1, 0.13, 0.3]].map(([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]} rotation={[0, 0, i === 0 ? 0.15 : -0.15]}>
              <boxGeometry args={[0.1, 0.018, 0.01]} /><meshStandardMaterial color="#1a0800" />
            </mesh>
          ))}
          {/* Smile */}
          <mesh position={[0, -0.1, 0.3]}><torusGeometry args={[0.055, 0.011, 6, 12, Math.PI * 0.55]} /><meshStandardMaterial color="#c07050" /></mesh>
        </group>

        {/* ── NECK ── */}
        <mesh position={[0, 0.68, 0]}><cylinderGeometry args={[0.088, 0.1, 0.26, 10]} /><meshStandardMaterial color="#d4a080" /></mesh>

        {/* ── BODY / HOODIE ── */}
        <group position={[0, 0.14, 0]}>
          <mesh ref={glRef}><cylinderGeometry args={[0.34, 0.3, 0.88, 14]} /><meshStandardMaterial color="#1a2860" emissive="#0a1840" emissiveIntensity={0.35} /></mesh>
          {/* Hoodie pocket */}
          <mesh position={[0, -0.2, 0.28]}><boxGeometry args={[0.3, 0.16, 0.05]} /><meshStandardMaterial color="#131e4a" /></mesh>
          {/* Logo glow */}
          <mesh position={[0, 0.2, 0.3]}><circleGeometry args={[0.055, 10]} /><meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2} /></mesh>
          {/* Collar */}
          <mesh position={[0, 0.44, 0.15]} rotation={[0.35, 0, 0]}><boxGeometry args={[0.28, 0.09, 0.06]} /><meshStandardMaterial color="#0e1630" /></mesh>
        </group>

        {/* ── LEFT ARM (reaches toward screen) ── */}
        <mesh position={[-0.38, 0.22, 0.2]} rotation={[0.55, 0, 0.32]}>
          <cylinderGeometry args={[0.095, 0.082, 0.62, 10]} /><meshStandardMaterial color="#1a2860" />
        </mesh>
        <mesh position={[-0.42, -0.05, 0.5]} rotation={[1.0, 0, 0.1]}>
          <cylinderGeometry args={[0.074, 0.066, 0.48, 10]} /><meshStandardMaterial color="#d4a080" />
        </mesh>
        <mesh ref={lRef} position={[-0.38, 0.06, 0.76]}>
          <boxGeometry args={[0.12, 0.052, 0.16]} /><meshStandardMaterial color="#d4a080" />
        </mesh>

        {/* ── RIGHT ARM ── */}
        <mesh position={[0.38, 0.22, 0.2]} rotation={[0.55, 0, -0.32]}>
          <cylinderGeometry args={[0.095, 0.082, 0.62, 10]} /><meshStandardMaterial color="#1a2860" />
        </mesh>
        <mesh position={[0.42, -0.05, 0.5]} rotation={[1.0, 0, -0.1]}>
          <cylinderGeometry args={[0.074, 0.066, 0.48, 10]} /><meshStandardMaterial color="#d4a080" />
        </mesh>
        <mesh ref={rRef} position={[0.38, 0.06, 0.76]}>
          <boxGeometry args={[0.12, 0.052, 0.16]} /><meshStandardMaterial color="#d4a080" />
        </mesh>

        {/* ── LOWER BODY ── */}
        <mesh position={[0, -0.36, 0.05]}><boxGeometry args={[0.52, 0.36, 0.32]} /><meshStandardMaterial color="#101830" /></mesh>
      </group>
    </group>
  )
}

// ── AI ROBOT ─────────────────────────────────────────────────────
function AIRobot({ position, mouseNorm }) {
  const fRef = useRef(), hRef = useRef(), eyLRef = useRef(), eyRRef = useRef()
  const aRef = useRef(), antRef = useRef(), rctRef = useRef(), r1Ref = useRef(), r2Ref = useRef()
  useFrame(s => {
    const t = s.clock.elapsedTime
    if (fRef.current)   fRef.current.position.y   = position[1] + Math.sin(t * 0.7 + 1) * 0.04
    if (hRef.current) {
      hRef.current.rotation.y = -0.2 + mouseNorm.x * -0.14 + Math.sin(t * 0.5) * 0.12
      hRef.current.rotation.x = -0.1 + Math.sin(t * 0.38) * 0.06
    }
    if (aRef.current)   aRef.current.rotation.z   = -0.4 + Math.sin(t * 1.1) * 0.25
    const p = (Math.sin(t * 3) + 1) * 0.5
    if (eyLRef.current) eyLRef.current.material.emissiveIntensity = 2 + p * 3
    if (eyRRef.current) eyRRef.current.material.emissiveIntensity = 2 + p * 3
    if (antRef.current) antRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 6) * 2
    if (rctRef.current) rctRef.current.rotation.z += 0.025
    if (r1Ref.current)  r1Ref.current.rotation.z  += 0.016
    if (r2Ref.current)  r2Ref.current.rotation.z  -= 0.013
  })
  return (
    <group position={position}>
      <group ref={fRef}>
        {/* ── ORBIT RINGS (large, prominent) ── */}
        <mesh ref={r1Ref} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.016, 6, 64]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2.8} transparent opacity={0.8} />
        </mesh>
        <mesh ref={r2Ref} position={[0, 0.2, 0]} rotation={[Math.PI / 3.2, 0, 0]}>
          <torusGeometry args={[0.9, 0.012, 6, 50]} />
          <meshStandardMaterial color="#aa44ff" emissive="#aa44ff" emissiveIntensity={2.5} transparent opacity={0.7} />
        </mesh>

        {/* ── HEAD (large box with T-visor) ── */}
        <group ref={hRef} position={[0, 1.06, 0]}>
          {/* Head shell */}
          <mesh><boxGeometry args={[0.68, 0.6, 0.56]} /><meshStandardMaterial color="#06061e" emissive="#22006a" emissiveIntensity={0.55} /></mesh>
          {/* Cyan wireframe overlay */}
          <mesh><boxGeometry args={[0.71, 0.63, 0.59]} /><meshStandardMaterial color="#00e5ff" wireframe transparent opacity={0.18} /></mesh>
          {/* T-VISOR band */}
          <mesh position={[0, 0.06, 0.285]}>
            <boxGeometry args={[0.62, 0.17, 0.018]} />
            <meshStandardMaterial color="#001122" emissive="#001133" emissiveIntensity={1.8} />
          </mesh>
          {/* Left eye glow */}
          <mesh ref={eyLRef} position={[-0.16, 0.06, 0.292]}>
            <boxGeometry args={[0.16, 0.1, 0.018]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2.5} />
          </mesh>
          {/* Right eye glow */}
          <mesh ref={eyRRef} position={[0.16, 0.06, 0.292]}>
            <boxGeometry args={[0.16, 0.1, 0.018]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2.5} />
          </mesh>
          {/* Eye separator (nose bridge) */}
          <mesh position={[0, 0.06, 0.294]}><boxGeometry args={[0.03, 0.1, 0.018]} /><meshStandardMaterial color="#001122" /></mesh>
          {/* Mouth grid */}
          {[-0.13, 0, 0.13].map((x, i) => (
            <mesh key={i} position={[x, -0.18, 0.29]}>
              <boxGeometry args={[0.08, 0.034, 0.015]} />
              <meshStandardMaterial color="#aa44ff" emissive="#aa44ff" emissiveIntensity={1.4} />
            </mesh>
          ))}
          {/* Side panels */}
          {[-0.345, 0.345].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <boxGeometry args={[0.018, 0.52, 0.48]} />
              <meshStandardMaterial color="#0a0a2e" emissive="#2200aa" emissiveIntensity={0.9} />
            </mesh>
          ))}
          {/* Antenna */}
          <mesh position={[0, 0.44, 0]}><cylinderGeometry args={[0.018, 0.018, 0.44, 8]} /><meshStandardMaterial color="#1a103a" /></mesh>
          <mesh ref={antRef} position={[0, 0.68, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color="#cc66ff" emissive="#cc66ff" emissiveIntensity={3.5} />
          </mesh>
        </group>

        {/* ── NECK ── */}
        <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.11, 0.135, 0.28, 10]} /><meshStandardMaterial color="#06061e" emissive="#110033" emissiveIntensity={0.3} /></mesh>

        {/* ── TORSO ── */}
        <group position={[0, 0.1, 0]}>
          <mesh><boxGeometry args={[0.78, 0.82, 0.5]} /><meshStandardMaterial color="#06061e" emissive="#0d0035" emissiveIntensity={0.4} /></mesh>
          <mesh><boxGeometry args={[0.81, 0.85, 0.53]} /><meshStandardMaterial color="#6622cc" wireframe transparent opacity={0.13} /></mesh>
          {/* Chest display */}
          <mesh position={[0, 0.14, 0.256]}><boxGeometry args={[0.48, 0.34, 0.015]} /><meshStandardMaterial color="#080022" emissive="#330066" emissiveIntensity={1.2} /></mesh>
          {/* Status dots */}
          {[['#aa44ff', -0.15], ['#00ff88', 0], ['#00e5ff', 0.15]].map(([c, x], i) => (
            <mesh key={i} position={[x, 0.27, 0.262]}>
              <circleGeometry args={[0.038, 10]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.5} />
            </mesh>
          ))}
          {/* Arc reactor ring */}
          <mesh ref={rctRef} position={[0, -0.06, 0.258]}>
            <torusGeometry args={[0.1, 0.014, 8, 30]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3.5} />
          </mesh>
          {/* Arc reactor core */}
          <mesh position={[0, -0.06, 0.252]}>
            <circleGeometry args={[0.075, 12]} />
            <meshStandardMaterial color="#0a0033" emissive="#6600ff" emissiveIntensity={2.2} />
          </mesh>
          {/* Side vents */}
          {[-0.4, 0.4].map((x, i) => (
            <mesh key={i} position={[x, -0.12, 0]}>
              <boxGeometry args={[0.018, 0.4, 0.45]} />
              <meshStandardMaterial color="#0a0a2e" emissive="#330088" emissiveIntensity={0.8} />
            </mesh>
          ))}
        </group>

        {/* ── LEFT ARM ── */}
        <mesh position={[-0.5, 0.15, 0.15]} rotation={[0.5, 0, 0.28]}>
          <boxGeometry args={[0.16, 0.52, 0.17]} /><meshStandardMaterial color="#06061e" />
        </mesh>
        <mesh position={[-0.54, -0.12, 0.42]} rotation={[0.92, 0, 0.07]}>
          <boxGeometry args={[0.14, 0.4, 0.15]} /><meshStandardMaterial color="#06061e" />
        </mesh>
        <mesh position={[-0.52, -0.22, 0.68]}>
          <boxGeometry args={[0.15, 0.062, 0.16]} /><meshStandardMaterial color="#08083a" emissive="#00e5ff" emissiveIntensity={0.7} />
        </mesh>

        {/* ── RIGHT ARM (gesture) ── */}
        <group ref={aRef} position={[0.5, 0.2, 0]}>
          <mesh><boxGeometry args={[0.16, 0.52, 0.17]} /><meshStandardMaterial color="#06061e" /></mesh>
          <mesh position={[0.14, -0.28, 0.14]} rotation={[0.3, 0, -0.2]}>
            <boxGeometry args={[0.14, 0.4, 0.15]} /><meshStandardMaterial color="#06061e" />
          </mesh>
          <mesh position={[0.26, -0.44, 0.28]}>
            <boxGeometry args={[0.14, 0.07, 0.14]} /><meshStandardMaterial color="#08083a" emissive="#aa44ff" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* ── LOWER BODY ── */}
        <mesh position={[0, -0.34, 0.05]}>
          <boxGeometry args={[0.7, 0.38, 0.44]} /><meshStandardMaterial color="#04040c" />
        </mesh>
      </group>
    </group>
  )
}

// ── HOLOGRAM PANEL ───────────────────────────────────────────────
function HologramPanel({ position, color, rotY = 0, sc = 1 }) {
  const gRef = useRef(), sRef = useRef(), r1 = useRef(), r2 = useRef()
  useFrame(s => {
    const t = s.clock.elapsedTime
    if (gRef.current) gRef.current.rotation.y = rotY + Math.sin(t * 0.3 + position[0]) * 0.08
    if (sRef.current) sRef.current.material.opacity = 0.42 + Math.sin(t * 1.2 + position[0]) * 0.15
    if (r1.current)   r1.current.rotation.z += 0.018
    if (r2.current)   r2.current.rotation.z -= 0.013
  })
  const w = 0.88 * sc, h = 0.6 * sc
  return (
    <group ref={gRef} position={position}>
      <mesh ref={sRef}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <planeGeometry args={[w + 0.04, h + 0.04]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.35} />
      </mesh>
      {[0.19, 0.08, -0.03, -0.12, -0.21].map((y, i) => (
        <mesh key={i} position={[-0.03, y * sc, 0.003]}>
          <planeGeometry args={[(0.13 + (i * 0.047) % 0.36) * sc, 0.02 * sc]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} transparent opacity={0.7} />
        </mesh>
      ))}
      <mesh ref={r1} position={[w * 0.36, h * 0.33, 0]}>
        <torusGeometry args={[0.062 * sc, 0.008 * sc, 6, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
      </mesh>
      <mesh ref={r2} position={[w * 0.36, h * 0.33, 0]}>
        <torusGeometry args={[0.04 * sc, 0.005 * sc, 6, 14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

// ── DATA STREAM ──────────────────────────────────────────────────
function DataStream({ from, to, color, count = 16 }) {
  const pRef = useRef()
  const offRef = useRef(null), spdRef = useRef(null)
  const init = useMemo(() => {
    const o = new Float32Array(count), s = new Float32Array(count), p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      o[i] = i / count; s[i] = 0.12 + (i % 7) * 0.038
      const t = o[i]
      p[i*3] = from[0]+(to[0]-from[0])*t; p[i*3+1] = from[1]+(to[1]-from[1])*t; p[i*3+2] = from[2]+(to[2]-from[2])*t
    }
    offRef.current = o; spdRef.current = s; return p
  }, [])
  useFrame((_, dt) => {
    if (!pRef.current || !offRef.current) return
    const pos = pRef.current.geometry.attributes.position.array
    const o = offRef.current, s = spdRef.current
    for (let i = 0; i < count; i++) {
      o[i] = (o[i] + dt * s[i]) % 1
      const t = o[i]
      pos[i*3]   = from[0]+(to[0]-from[0])*t
      pos[i*3+1] = from[1]+(to[1]-from[1])*t + Math.sin(t * Math.PI * 2.4) * 0.18
      pos[i*3+2] = from[2]+(to[2]-from[2])*t
    }
    pRef.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={pRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[init, 3]} /></bufferGeometry>
      <pointsMaterial color={color} size={0.055} sizeAttenuation transparent opacity={0.9} />
    </points>
  )
}

// ── AMBIENT ──────────────────────────────────────────────────────
function AmbientParticles({ mouseNorm }) {
  const ref = useRef()
  useFrame(s => {
    if (!ref.current) return
    ref.current.rotation.y  = s.clock.elapsedTime * 0.01
    ref.current.position.x  = mouseNorm.x * -0.28
  })
  if (AMB_N === 0) return null
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[AMB_POS, 3]} /></bufferGeometry>
      <pointsMaterial color="#5500aa" size={0.04} sizeAttenuation transparent opacity={0.5} />
    </points>
  )
}

/* ═══════════════════ SCENE ═══════════════════ */
function Scene({ mouseNorm }) {
  return (
    <>
      <fog attach="fog" args={['#06021a', 20, 68]} />

      <ambientLight intensity={0.09} />
      {/* Sky/city atmosphere */}
      <pointLight position={[0, 8, -10]}    color="#330088" intensity={4} />
      <pointLight position={[-7, 4, -5]}    color="#0044aa" intensity={3} />
      <pointLight position={[7, 4, -5]}     color="#550099" intensity={3} />
      {/* Road underglow */}
      <pointLight position={[0, 0.2, 0]}    color="#00e5ff" intensity={3.5} distance={7} />
      {/* Character key lights — warm overhead + cool fill */}
      <pointLight position={[0, 4.5, 5.5]}  color="#ffb060" intensity={10}  distance={9} />
      <pointLight position={[-2.5, 2.5, 5]} color="#aa66ff" intensity={7}   distance={7} />
      <pointLight position={[ 2.5, 2.5, 5]} color="#00ccff" intensity={7}   distance={7} />
      {/* Platform glow */}
      <pointLight position={[0, 0.5, 2.5]}  color="#aa44ff" intensity={4}   distance={5} />

      {/* ── SCROLLING CITY ── */}
      <RoadFloor />
      <BuildingLayer meta={NEAR_B} resetZ={-24} signColor="#aa44ff" />
      <BuildingLayer meta={MID_B}  resetZ={-38} signColor="#00e5ff" />
      <BuildingLayer meta={FAR_B}  resetZ={-55} signColor="#00ff88" />

      <SpeedStreaks />
      <FlyingDrones />
      <NeonRain />

      {/* ── PLATFORM + CHARACTERS ── */}
      <GlowPlatform />
      <HumanDev position={[-1.1,  0.18, 1.8]} />
      <AIRobot   position={[ 1.2,  0.18, 1.8]} mouseNorm={mouseNorm} />

      {/* Holo screens in front of each character */}
      <HoloScreen position={[-1.1, 1.52, 2.95]} color="#00ff88" />
      <HoloScreen position={[ 1.2, 1.52, 2.95]} color="#00e5ff" />

      {/* ── HOLOGRAM PANELS ── */}
      <HologramPanel position={[-3.2, 2.4, -1.0]} color="#00ff88" rotY={ 0.38} sc={1.5} />
      <HologramPanel position={[ 3.2, 2.4, -1.0]} color="#00e5ff" rotY={-0.38} sc={1.5} />
      {!MOB && <HologramPanel position={[0, 4.0, -2.2]} color="#aa44ff" rotY={0} sc={1.8} />}

      {/* ── DATA STREAMS ── */}
      <DataStream from={[-0.7, 1.0, 2.0]} to={[0.8, 1.0, 2.0]}   color="#00e5ff" count={14} />
      <DataStream from={[-1.1, 1.2, 1.8]} to={[-3.2, 2.3, -1.0]} color="#aa44ff" count={12} />
      {!MOB && <DataStream from={[1.2, 1.2, 1.8]} to={[3.2, 2.3, -1.0]} color="#00aaff" count={12} />}

      <AmbientParticles mouseNorm={mouseNorm} />
    </>
  )
}

/* ═══════════════════ EXPORT ═══════════════════ */
export default function ParticleField({ mouseNorm = { x: 0, y: 0 } }) {
  return (
    <Canvas
      camera={{ 
        position: MOB ? [0, 5.2, 11.2] : [0, 4, 9.5], 
        fov: MOB ? 75 : 62 
      }}
      gl={{ antialias: !MOB, alpha: true, powerPreference: 'high-performance' }}
      dpr={MOB ? 1 : [1, 1.5]}
      onCreated={({ camera }) => camera.lookAt(0, MOB ? 1.6 : 1, -4)}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene mouseNorm={mouseNorm} />
    </Canvas>
  )
}

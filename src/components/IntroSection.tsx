import { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Shimmer + Proximity‑color text ─── */

const INTRO_LINES = [
  'A Data Scientist & GenAI Engineer',
  'crafting intelligent AI products.',
  '',
  'Scalable pipelines, LLM solutions,',
  'experimentation, and MLOps',
  '',
  'combining technical precision',
  'with product thinking to ship',
  'AI that drives real impact.',
]

function ShimmerText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [isTextHovered, setIsTextHovered] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  let globalCharIndex = 0

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-1"
      onMouseEnter={() => setIsTextHovered(true)}
      onMouseLeave={() => setIsTextHovered(false)}
    >
      {INTRO_LINES.map((line, lineIdx) => {
        if (line === '') {
          globalCharIndex++
          return <div key={lineIdx} className="h-4 sm:h-6" />
        }

        const chars = line.split('')
        return (
          <p key={lineIdx} className="text-2xl font-light leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            {chars.map((char, charIdx) => {
              const idx = globalCharIndex++
              return (
                <ShimmerChar
                  key={`${lineIdx}-${charIdx}`}
                  char={char}
                  index={idx}
                  mousePos={mousePos}
                  isTextHovered={isTextHovered}
                />
              )
            })}
          </p>
        )
      })}
    </div>
  )
}

function ShimmerChar({
  char,
  index,
  mousePos,
  isTextHovered,
}: {
  char: string
  index: number
  mousePos: { x: number; y: number }
  isTextHovered: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [proximity, setProximity] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = mousePos.x - cx
    const dy = mousePos.y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const radius = 100
    setProximity(dist < radius ? 1 - dist / radius : 0)
  }, [mousePos])

  const hoverColor = `rgb(${167 + proximity * 30}, ${139 + proximity * 50}, ${250})`
  const isNearCursor = proximity > 0

  return (
    <span
      ref={ref}
      className={`inline-block ${isTextHovered ? 'transition-colors duration-75' : 'char-idle-glow'}`}
      style={{
        color: isTextHovered
          ? (isNearCursor ? hoverColor : 'var(--char-glow-base)')
          : undefined,
        animationDelay: `${index * 40}ms`,
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  )
}

/* ─── Shared mouse ref for canvas (since pointer-events-none blocks state.pointer) ─── */

const sharedMouse = { x: 999, y: 999 }

/* ─── Interactive particles with cursor repel ─── */

const REPEL_RADIUS = 2.5
const REPEL_STRENGTH = 0.08
const RETURN_SPEED = 0.02

function InteractiveParticles({ count, color, size, opacity }: {
  count: number
  color: string
  size: number
  opacity: number
}) {
  const pointsRef = useRef<THREE.Points>(null)

  const { original, current, velocities } = useMemo(() => {
    const orig = new Float32Array(count * 3)
    const cur = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 28
      const y = (Math.random() - 0.5) * 16
      const z = (Math.random() - 0.5) * 8
      orig[i * 3] = x
      orig[i * 3 + 1] = y
      orig[i * 3 + 2] = z
      cur[i * 3] = x
      cur[i * 3 + 1] = y
      cur[i * 3 + 2] = z
    }
    return { original: orig, current: cur, velocities: vel }
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return

    const mx = sharedMouse.x * 14
    const my = sharedMouse.y * 8

    const geo = pointsRef.current.geometry
    const posAttr = geo.getAttribute('position')
    const arr = posAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      const dx = arr[ix] - mx
      const dy = arr[iy] - my
      const dz = arr[iz]
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (dist < REPEL_RADIUS && dist > 0.01) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
        velocities[ix] += (dx / dist) * force
        velocities[iy] += (dy / dist) * force
        velocities[iz] += (dz / dist) * force
      }

      velocities[ix] += (original[ix] - arr[ix]) * RETURN_SPEED
      velocities[iy] += (original[iy] - arr[iy]) * RETURN_SPEED
      velocities[iz] += (original[iz] - arr[iz]) * RETURN_SPEED

      velocities[ix] *= 0.92
      velocities[iy] *= 0.92
      velocities[iz] *= 0.92

      current[ix] = arr[ix] + velocities[ix]
      current[iy] = arr[iy] + velocities[iy]
      current[iz] = arr[iz] + velocities[iz]

      arr[ix] = current[ix]
      arr[iy] = current[iy]
      arr[iz] = current[iz]
    }

    posAttr.needsUpdate = true
  })

  const pointsMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size,
        transparent: true,
        opacity,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    [color, size, opacity],
  )

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(current, 3))
    return geo
  }, [current])

  return <points ref={pointsRef} geometry={geometry} material={pointsMaterial} />
}

/* ─── Full-section background scene ─── */

function BackgroundScene() {
  return (
    <>
      {/* Violet — main layer */}
      <InteractiveParticles count={500} color="#c4b5fd" size={0.03} opacity={0.5} />
      {/* Cyan — secondary layer */}
      <InteractiveParticles count={300} color="#67e8f9" size={0.022} opacity={0.3} />
      {/* White dust */}
      <InteractiveParticles count={200} color="#ffffff" size={0.015} opacity={0.15} />
      {/* Cursor trail removed */}
    </>
  )
}

/* ─── Social Icons ─── */

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const MediumIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/shivamsuchak', icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shivam-suchak', icon: LinkedInIcon },
  { label: 'Medium', href: 'https://medium.com/@datasciencedailyy', icon: MediumIcon },
]

/* ─── Main Export ─── */

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      sharedMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      sharedMouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }
    const handleLeave = () => {
      sharedMouse.x = 999
      sharedMouse.y = 999
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Background layer: particles + faint sphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <BackgroundScene />
          {/* Faint sphere centered behind text */}
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 5, 5]} intensity={0.4} color="#e9d5ff" />
          <pointLight position={[-4, -2, 3]} intensity={0.4} color="#7c3aed" />
          <pointLight position={[4, 2, -2]} intensity={0.3} color="#22d3ee" />
          <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.8} floatingRange={[-0.1, 0.1]}>
            <mesh scale={2.5}>
              <sphereGeometry args={[1, 64, 64]} />
              <MeshDistortMaterial
                color="#a78bfa"
                emissive="#7c3aed"
                emissiveIntensity={0.3}
                roughness={0.2}
                metalness={0.9}
                distort={0.15}
                speed={1}
                transparent
                opacity={0.15}
              />
            </mesh>
          </Float>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>

      {/* Soft radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="h-[500px] w-[500px] rounded-full bg-violet-700/10 blur-[160px]" />
      </div>

      {/* Content: text + social */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-6 sm:gap-16 sm:px-8">
        <motion.div
          className="max-w-5xl text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <ShimmerText />
        </motion.div>

        {/* Social icons */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="bezel flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 hover:border-violet-500/[0.3]"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}
            >
              <link.icon />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─── */

interface Project {
  id: number
  title: string
  company: string
  year: string
  tagline: string
  description: string
  tags: string[]
  color: string
  colorEnd: string
  github?: string
  image?: string
}

interface ProjectSphereProps {
  projects: Project[]
}

/* ─── Constants ─── */

const RADIUS = 800
const SEGMENTS_X = 34
const SEGMENTS_Y = 34
const TILE_RADIUS = 24
const CIRC = RADIUS * Math.PI
const ITEM_W = CIRC / SEGMENTS_X
const ITEM_H = CIRC / SEGMENTS_Y
const ROT_Y_STEP = 360 / SEGMENTS_X
const ROT_X_STEP = 360 / SEGMENTS_Y
const AUTO_SPEED = 0.12 // degrees per frame
const DAMPING = 0.95
const TILE_SIZE = 2 // each tile spans 2 segments

/* ─── Generate tile grid covering the full sphere ─── */

function generateTilePositions(projects: Project[]) {
  const tiles: {
    project: Project
    offsetX: number
    offsetY: number
    sizeX: number
    sizeY: number
    key: string
  }[] = []

  // The reference uses offsets from -37 to +29 in steps of 2 for 34 segments.
  // Each column goes -37, -35, -33, ... +27, +29 = 34 columns.
  // Rows: 5 vertical rows centered around 0, offsets like -4, -2, 0, 2, 4
  const cols = SEGMENTS_X // 34 columns wrapping the full sphere
  const rows = 5
  const startX = -(SEGMENTS_X - 1) // -33 for 34 segments (with +2 steps -> wraps 360)
  const startY = -(rows - 1) // -4

  let idx = 0
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const project = projects[idx % projects.length]
      tiles.push({
        project,
        offsetX: startX + col * TILE_SIZE,
        offsetY: startY + row * TILE_SIZE,
        sizeX: TILE_SIZE,
        sizeY: TILE_SIZE,
        key: `${col}-${row}`,
      })
      idx++
    }
  }

  return tiles
}

/* ─── Sphere Tile ─── */

function SphereTile({
  project,
  offsetX,
  offsetY,
  sizeX,
  sizeY,
  onClick,
}: {
  project: Project
  offsetX: number
  offsetY: number
  sizeX: number
  sizeY: number
  onClick: (project: Project) => void
}) {
  const width = ITEM_W * sizeX
  const height = ITEM_H * sizeY

  const rotY = (ROT_Y_STEP / 2) * (offsetX + (sizeX - 1) / 2)
  const rotX = (ROT_X_STEP / 2) * (offsetY - (sizeY - 1) / 2)

  return (
    <div
      className="absolute"
      style={{
        width,
        height,
        inset: '-999px',
        margin: 'auto',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${RADIUS}px)`,
        transformOrigin: '50% 50%',
      }}
    >
      <div
        className="absolute cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-105"
        role="button"
        tabIndex={0}
        aria-label={project.title}
        onClick={() => onClick(project)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick(project)
        }}
        style={{
          inset: 8,
          borderRadius: TILE_RADIUS,
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
          background: project.image
            ? '#111'
            : `linear-gradient(135deg, ${project.color} 0%, ${project.colorEnd} 100%)`,
        }}
      >
        {/* Screenshot background */}
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            draggable={false}
          />
        )}

        {/* Bottom gradient overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: TILE_RADIUS,
            background: project.image
              ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)'
              : 'none',
          }}
        />

        {/* Title + company at bottom */}
        <div className="relative z-10 flex h-full w-full flex-col justify-end p-3">
          <p className="text-[10px] font-semibold leading-tight text-white sm:text-[11px]">
            {project.title}
          </p>
          <span className="mt-0.5 text-[8px] text-white/60">
            {project.company}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Detail Modal ─── */

function ProjectDetail({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: 'var(--overlay-bg)' }}
        onClick={onClose}
      />

      {/* Card — bezel wrapper (no overflow-hidden so shine shows) */}
      <motion.div
        className="bezel relative z-10 w-full max-w-lg rounded-3xl"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Inner card with overflow-hidden so content clips but bezel shine doesn't */}
        <div className="overflow-hidden rounded-[22px] shadow-2xl" style={{ background: 'var(--modal-bg)' }}>
        {/* Accent bar at top */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${project.color}, ${project.colorEnd})`,
          }}
        />

        {/* Screenshot header */}
        <div className="relative h-48 w-full overflow-hidden sm:h-56">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: `linear-gradient(135deg, ${project.color} 0%, ${project.colorEnd} 100%)`,
              }}
            />
          )}
          {/* Dark gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--modal-bg), color-mix(in srgb, var(--modal-bg) 60%, transparent), transparent)' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Title overlay — centered */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-8 pb-6 text-center">
            <div className="mb-2 flex items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${project.color}25`,
                  color: project.color,
                }}
              >
                {project.year}
              </span>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {project.company}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {project.title}
            </h3>
          </div>
        </div>

        {/* Body — centered with generous padding */}
        <div className="flex flex-col items-center gap-6 px-8 pt-8 pb-10 text-center sm:px-10">
          {/* Tagline */}
          <p
            className="text-sm font-medium leading-relaxed"
            style={{ color: project.color }}
          >
            {project.tagline}
          </p>

          {/* Description */}
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {project.description}
          </p>

          {/* Divider */}
          <div className="h-px w-full" style={{ background: 'var(--border-subtle)' }} />

          {/* Tags */}
          <div className="flex flex-col items-center">
            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
              Tech Stack
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase"
                  style={{
                    backgroundColor: `${project.color}15`,
                    color: project.color,
                    border: `1px solid ${project.color}30`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', paddingTop: '12px', marginBottom: '4px' }}
          >
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-80"
                style={{
                  background: `linear-gradient(135deg, ${project.color}, ${project.colorEnd})`,
                  padding: '10px 20px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            )}
            <button
              onClick={onClose}
              className="rounded-xl text-xs font-medium transition-colors"
              style={{
                padding: '10px 20px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
              }}
            >
              Close
            </button>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Component ─── */

export default function ProjectSphere({ projects }: ProjectSphereProps) {
  const sphereRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef({ x: 2, y: 0 })
  const velocityRef = useRef({ x: 0, y: AUTO_SPEED })
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const isVisibleRef = useRef(false)
  const sectionRef = useRef<HTMLElement>(null)

  const tiles = useMemo(() => generateTilePositions(projects), [projects])

  /* ─── Pause animation when off-screen ─── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* ─── Animation loop ─── */
  const animate = useCallback(() => {
    rafRef.current = requestAnimationFrame(animate)

    if (!sphereRef.current || !isVisibleRef.current) return

    if (!isDragging.current) {
      // Apply velocity with damping
      velocityRef.current.x *= DAMPING
      velocityRef.current.y *= DAMPING

      // Add auto-rotation if velocity is small
      if (Math.abs(velocityRef.current.y) < 0.05) {
        velocityRef.current.y = AUTO_SPEED
      }

      rotationRef.current.x += velocityRef.current.x
      rotationRef.current.y += velocityRef.current.y
    }

    // Clamp vertical rotation
    rotationRef.current.x = Math.max(-30, Math.min(30, rotationRef.current.x))

    sphereRef.current.style.transform = `translateZ(${-RADIUS}px) rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  /* ─── Pointer events ─── */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
    velocityRef.current = { x: 0, y: 0 }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return

    const dx = e.clientX - lastMouse.current.x
    const dy = e.clientY - lastMouse.current.y

    rotationRef.current.y += dx * 0.3
    rotationRef.current.x -= dy * 0.3

    velocityRef.current.x = -dy * 0.15
    velocityRef.current.y = dx * 0.15

    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const handleTileClick = useCallback((project: Project) => {
    setSelectedProject(project)
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative mt-60 flex w-full flex-col items-center overflow-hidden py-20 sm:mt-60 sm:py-32" style={{ contain: 'layout style paint' }}>
      {/* Section header */}
      <motion.div
        className="mb-8 flex flex-col items-center gap-4 text-center sm:mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="text-xs font-medium tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Projects
        </span>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl" style={{ color: 'var(--text-primary)' }}>
          Curated Work
        </h2>
        <p className="max-w-md text-sm" style={{ color: 'var(--text-muted)' }}>
          Drag to explore &middot; Click a tile for details
        </p>
      </motion.div>

      {/* Sphere container */}
      <div
        ref={containerRef}
        className="relative h-[60vh] w-full max-w-6xl select-none overflow-hidden md:h-[80vh]"
        style={{
          touchAction: 'none',
          userSelect: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Stage — perspective container */}
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            perspective: RADIUS * 2,
            perspectiveOrigin: '50% 50%',
          }}
        >
          {/* Sphere — rotating container */}
          <div
            ref={sphereRef}
            className="absolute will-change-transform"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateZ(${-RADIUS}px) rotateX(2deg) rotateY(0deg)`,
            }}
          >
            {tiles.map((tile) => (
              <SphereTile
                key={tile.key}
                project={tile.project}
                offsetX={tile.offsetX}
                offsetY={tile.offsetY}
                sizeX={tile.sizeX}
                sizeY={tile.sizeY}
                onClick={handleTileClick}
              />
            ))}
          </div>
        </div>

        {/* Edge fading overlays */}
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(235,235,235,0) 60%, var(--fade-color) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            maskImage:
              'radial-gradient(rgba(235,235,235,0) 65%, var(--fade-color) 90%)',
            backdropFilter: 'blur(3px)',
          }}
        />
        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[100px]"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--fade-color))',
          }}
        />
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

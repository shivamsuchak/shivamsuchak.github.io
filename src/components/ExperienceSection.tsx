import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

/* ─── Color helpers ─── */

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/* ─── Experience Data ─── */

interface Experience {
  id: string
  role: string
  company: string
  period: string
  location: string
  description: string
  tags: string[]
  bgColor: string
  accentColor: string
  logo: string
  logoFilter?: string
  isWideLogo?: boolean
  isCurrent?: boolean
}

const EXPERIENCES: Experience[] = [
  {
    id: 'cgm',
    role: 'Data Scientist',
    company: 'CompuGroup Medical',
    period: 'Sep 2025 — Present',
    location: 'Berlin, Germany',
    description:
      'Driving data strategy & innovation, developing AI products and generative AI solutions. Leading model evaluation, A/B testing, and experimentation for healthcare technology.',
    tags: ['Data Strategy', 'AI Products', 'Generative AI', 'A/B Testing'],
    bgColor: '#0f1923',
    accentColor: '#3b82f6',
    logo: '/logos/Logo_CompuGroup_Medical.svg.png',
    isCurrent: true,
  },
  {
    id: 'tsystems',
    role: 'AI Research & Development',
    company: 'T-Systems International',
    period: 'Feb 2024 — Sep 2025',
    location: 'Bonn, Germany',
    description:
      'Developed AI-powered autonomous agent systems for B2B process optimization. Implemented intelligent automation in procurement using Azure OpenAI and Google Vertex AI. Researched scalable AI strategies for digital transformation.',
    tags: ['Autonomous Agents', 'Azure OpenAI', 'Vertex AI', 'B2B Automation'],
    bgColor: '#e20074',
    accentColor: '#f472b6',
    logo: '/logos/T-Systems_Logo_2024.svg.png',
    logoFilter: 'brightness(0) invert(1)',
  },
  {
    id: 'bosch',
    role: 'Working Student — Backend Development',
    company: 'Bosch',
    period: 'Jul 2023 — Jan 2024',
    location: 'Stuttgart, Germany',
    description:
      'Worked with cross-functional teams to design efficient backend solutions. Developed and maintained scalable backend services and APIs using Python & C#. Implemented automation frameworks to streamline development and testing.',
    tags: ['Python', 'C#', 'Backend APIs', 'Automation'],
    bgColor: '#1a1a2e',
    accentColor: '#ea3324',
    logo: '/logos/Bosch-logo.svg.png',
    logoFilter: 'brightness(0) invert(1)',
  },
  {
    id: 'uni-mannheim',
    role: 'Research Assistant',
    company: 'University of Mannheim',
    period: 'Jul 2023 — Apr 2024',
    location: 'Mannheim, Germany',
    description:
      'Contributed to design of Python courses alongside professors. Conducted tutorials teaching students Python programming. Responsible for project design and evaluation.',
    tags: ['Python', 'Teaching', 'Research', 'Course Design'],
    bgColor: '#002f6c',
    accentColor: '#60a5fa',
    logo: '/logos/Uni_Mannheim_Siegel.svg.png',
    logoFilter: 'brightness(0) invert(1)',
  },
  {
    id: 'gdsc',
    role: 'Founder & Lead',
    company: 'Google Developer Student Club',
    period: 'Jul 2023 — Present',
    location: 'Mannheim, Germany',
    description:
      'Boosted participant engagement by 140%. Collaborated with marketing and technical teams for impactful initiatives. Facilitated effective communication channels, optimizing workflows and team efficiency.',
    tags: ['Leadership', 'Community', 'Tech Events', 'Collaboration'],
    bgColor: '#f5f5f5',
    accentColor: '#34a853',
    logo: '/logos/developer_student_club_mannheim_cover.jpeg',
    isWideLogo: true,
  },
  {
    id: 'persistent',
    role: 'Software Developer Engineer',
    company: 'Persistent Systems',
    period: 'Jan 2021 — Apr 2023',
    location: 'Pune, India',
    description:
      'Deployed at Cisco — built APIs with Java Spring Boot and Angular. Exceeded delivery deadlines by 40% every sprint. Developed Zero Touch Provisioning APIs using gRPC. Optimised processes reducing development time by 87%. Awarded Individual Award for best in team.',
    tags: ['Java', 'Spring Boot', 'Angular', 'gRPC', 'Cisco'],
    bgColor: '#18181b',
    accentColor: '#f97316',
    logo: '/logos/Persistent_Systems_Logo.svg.png',
    logoFilter: 'brightness(0) invert(1)',
  },
]

/* ─── Rolling Text (char-by-char roll on hover) ─── */

function RollingText({ text, isHovered }: { text: string; isHovered: boolean }) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split('').map((char, i) =>
        char === ' ' ? (
          <span key={i} style={{ width: '0.3em' }} />
        ) : (
          <span
            key={i}
            className="relative inline-flex flex-col overflow-hidden"
            style={{ height: '1em', lineHeight: '1em' }}
          >
            <motion.span
              className="inline-block"
              animate={{ y: isHovered ? '-100%' : '0%' }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.02,
              }}
            >
              {char}
            </motion.span>
            <motion.span
              className="inline-block"
              animate={{ y: isHovered ? '-100%' : '0%' }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.02,
              }}
            >
              {char}
            </motion.span>
          </span>
        ),
      )}
    </span>
  )
}

/* ─── Custom cursor: spinning "VIEW DETAILS" + eye icon ─── */

function ViewDetailsCursor({ isVisible }: { isVisible: boolean }) {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { damping: 25, stiffness: 250 })
  const springY = useSpring(cursorY, { damping: 25, stiffness: 250 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [cursorX, cursorY])

  const text = 'VIEW DETAILS \u00B7 VIEW DETAILS \u00B7 '

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[200]"
      style={{ x: springX, y: springY }}
      animate={{
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        {/* Outer ring with spinning text */}
        <svg
          width="90"
          height="90"
          viewBox="0 0 90 90"
          className="animate-spin-slow"
        >
          <defs>
            <path
              id="circlePath"
              d="M 45,45 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
            />
          </defs>
          <circle cx="45" cy="45" r="44" fill="var(--overlay-bg)" />
          <text
            fill="var(--text-primary)"
            fontSize="9"
            fontWeight="600"
            letterSpacing="2.5"
          >
            <textPath href="#circlePath">{text}</textPath>
          </text>
        </svg>

        {/* Eye icon in center */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    </motion.div>
  )
}

/* ─── Grid Card (Dennis Snellenberg style) ─── */

function ExperienceCard({
  exp,
  index,
  onSelect,
  onHover,
}: {
  exp: Experience
  index: number
  onSelect: (id: string) => void
  onHover: (hovered: boolean) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group"
      style={{ cursor: 'none' }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1,
      }}
      onMouseEnter={() => { setIsHovered(true); onHover(true) }}
      onMouseLeave={() => { setIsHovered(false); onHover(false) }}
      onClick={() => onSelect(exp.id)}
    >
      {/* Image area — bezel wrapper (no overflow-hidden so shine shows) */}
      <div
        className="bezel relative aspect-[16/10] w-full rounded-xl transition-transform duration-500 group-hover:scale-[0.98]"
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-[10px]"
          style={{ backgroundColor: exp.bgColor }}
        >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

        {/* Company logo */}
        <div className="absolute inset-0 flex items-center justify-center p-10 sm:p-14">
          <img
            src={exp.logo}
            alt={exp.company}
            className="max-h-full max-w-[60%] object-contain opacity-80 drop-shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            style={exp.logoFilter ? { filter: exp.logoFilter } : undefined}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                const fallback = document.createElement('span')
                fallback.className =
                  'select-none text-[8rem] font-bold leading-none opacity-[0.08] sm:text-[10rem]'
                fallback.style.color = '#ffffff'
                fallback.textContent = exp.company.charAt(0)
                target.parentElement.appendChild(fallback)
              }
            }}
          />
        </div>

        {/* Current badge */}
        {exp.isCurrent && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-medium text-white/90">
              Current
            </span>
          </div>
        )}

        {/* Hover glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(167,139,250,0.08) 0%, transparent 70%)',
          }}
        />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-2 px-1">
        {/* Tags line */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {exp.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-1.5">
              {i > 0 && <span style={{ color: 'var(--text-faint)' }}>•</span>}
              {tag}
            </span>
          ))}
        </div>

        {/* Company name with rolling text */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-5 w-5 items-center justify-center"
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}
                className="group-hover:!text-[var(--text-primary)]"
              />
            </svg>
          </motion.div>
          <span className="text-lg font-semibold tracking-tight sm:text-xl" style={{ color: 'var(--text-primary)' }}>
            <RollingText text={exp.company} isHovered={isHovered} />
          </span>
        </div>

        {/* Role + period */}
        <div className="flex flex-col gap-0.5 px-8">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{exp.role}</span>
          <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
            {exp.period} · {exp.location}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Full-screen takeover overlay ─── */

function TakeoverOverlay({
  exp,
  onClose,
}: {
  exp: Experience
  onClose: () => void
}) {
  const isLight = luminance(exp.bgColor) > 0.4
  const textColor = isLight ? '#18181b' : '#f5f5f5'
  const subtleColor = isLight ? '#525252' : '#a3a3a3'
  const mutedColor = isLight ? '#737373' : '#737373'

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: exp.bgColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClose}
      />

      {/* Close button */}
      <motion.button
        className="absolute top-8 right-8 z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-200"
        style={{
          borderColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
          color: textColor,
        }}
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{
          backgroundColor: isLight
            ? 'rgba(0,0,0,0.06)'
            : 'rgba(255,255,255,0.08)',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-8 md:flex-row md:items-center md:gap-16 lg:gap-24">
        {/* Left: Logo */}
        <motion.div
          className="mb-10 flex w-full items-center justify-center md:mb-0 md:w-1/2"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <img
            src={exp.logo}
            alt={exp.company}
            className={exp.isWideLogo
              ? 'w-full max-w-[420px] object-contain drop-shadow-2xl'
              : 'h-32 max-w-[280px] object-contain drop-shadow-2xl sm:h-40 md:h-48'
            }
            style={exp.logoFilter ? { filter: exp.logoFilter } : undefined}
          />
        </motion.div>

        {/* Right: Details */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          {/* Company */}
          <motion.h2
            className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            style={{ color: textColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {exp.company}
          </motion.h2>

          {/* Role */}
          <motion.p
            className="mb-4 text-lg font-semibold sm:text-xl"
            style={{ color: exp.accentColor }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {exp.role}
          </motion.p>

          {/* Period + location as info chips */}
          <motion.div
            className="mb-6 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
                color: subtleColor,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {exp.period}
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
                color: subtleColor,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {exp.location}
            </span>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="mb-6 h-px"
            style={{
              backgroundColor: isLight
                ? 'rgba(0,0,0,0.1)'
                : 'rgba(255,255,255,0.1)',
              transformOrigin: 'left',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          />

          {/* Description */}
          <motion.p
            className="mb-8 text-[15px] leading-[1.8] sm:text-base sm:leading-[1.8]"
            style={{ color: subtleColor }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {exp.description}
          </motion.p>

          {/* Tags label */}
          <motion.p
            className="mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: mutedColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            Skills & Focus
          </motion.p>

          {/* Tags — accent-colored with glow */}
          <motion.div
            className="flex flex-wrap gap-2.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {exp.tags.map((tag, i) => (
              <motion.span
                key={tag}
                className="rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
                style={{
                  backgroundColor: `${exp.accentColor}18`,
                  color: exp.accentColor,
                  border: `1px solid ${exp.accentColor}30`,
                  boxShadow: `0 0 12px ${exp.accentColor}10`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.55 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Close hint */}
          <motion.p
            className="mt-10 text-[10px] font-medium tracking-[0.15em] uppercase"
            style={{ color: mutedColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Press ESC or click anywhere to close
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ─── Section Header ─── */

function SectionTitle({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ color: 'var(--text-primary)' }}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block">
          {word.split('').map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className="inline-block"
              initial={{ y: '1em', opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: wi * 0.12 + ci * 0.03,
              }}
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </h2>
  )
}

/* ─── Main Export ─── */

export default function ExperienceSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [anyCardHovered, setAnyCardHovered] = useState(false)
  const selectedExp = EXPERIENCES.find((e) => e.id === selectedId) || null

  return (
    <>
      {/* Custom cursor */}
      <ViewDetailsCursor isVisible={anyCardHovered && !selectedId} />

      <section
        id="experience"
        className="flex w-full flex-col items-center pt-16 pb-24 sm:pt-20 sm:pb-32"
      >
        <div className="w-full max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16">
          {/* Header */}
          <div className="relative flex justify-center" style={{ marginBottom: '8rem' }}>
            {/* Glow orb behind title */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="h-[200px] w-[400px] rounded-full bg-violet-700/15 blur-[120px]" />
            </div>
            <SectionTitle text="Experience" />
          </div>

          {/* 2-column card grid */}
          <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 md:gap-8 lg:gap-10">
            {EXPERIENCES.map((exp, i) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                index={i}
                onSelect={setSelectedId}
                onHover={setAnyCardHovered}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Full-screen takeover */}
      <AnimatePresence>
        {selectedExp && (
          <TakeoverOverlay
            key={selectedExp.id}
            exp={selectedExp}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const INTERESTS = [
  'LLMs & Agents',
  'Applied ML',
  'RAG Systems',
  'Model Optimization',
  'Backend Architecture',
]


/* Gradient-highlighted span helper */
function Hl({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text font-medium text-transparent">
      {children}
    </span>
  )
}

/* Gradient-highlighted link helper */
function HlLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text font-medium text-transparent transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  )
}

/* Shared card animation config */
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      delay: 0.1 + i * 0.08,
    },
  }),
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const crystalRotate = useTransform(scrollYProgress, [0, 1], [0, 180])
  const crystalY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative flex w-full flex-col items-center overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Horizontal divider bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center">
        <div className="h-px w-full max-w-5xl" style={{ background: 'linear-gradient(to right, transparent, var(--border-subtle), transparent)' }} />
      </div>

      {/* Background subtle gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--bg-primary) 50%, transparent), transparent)' }}
      />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Abstract floating crystal shape */}
        <motion.div
          className="relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44"
          style={{ y: crystalY, rotate: crystalRotate }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/10 via-transparent to-pink-500/10 blur-2xl" />
          <div
            className="absolute inset-6 rotate-45 rounded-2xl bg-gradient-to-br from-neutral-800/50 via-neutral-900/80 to-black"
            style={{ boxShadow: '0 0 40px rgba(139,92,246,0.08)' }}
          />
          <div className="absolute inset-10 rotate-45 rounded-xl bg-gradient-to-tr from-violet-900/20 via-neutral-900 to-neutral-950" />
          <div className="absolute inset-14 rotate-45 rounded-lg bg-gradient-to-br from-neutral-800/30 via-neutral-950 to-black" />
          <div className="absolute top-1/4 left-1/3 h-10 w-[2px] rotate-[50deg] bg-gradient-to-b from-violet-400/20 to-transparent blur-[1px]" />
          <div className="absolute top-1/3 right-1/4 h-8 w-[2px] rotate-[-30deg] bg-gradient-to-b from-pink-400/15 to-transparent blur-[1px]" />
          <div className="absolute bottom-1/4 left-1/4 h-6 w-[2px] rotate-[70deg] bg-gradient-to-b from-amber-400/10 to-transparent blur-[1px]" />
          <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]" />
        </motion.div>

        <div style={{ height: '5rem' }} aria-hidden="true" />

        {/* Overline */}
        <motion.span
          className="mb-4 text-xs font-medium tracking-[0.3em] uppercase"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Know About Me
        </motion.span>

        {/* Section header */}
        <motion.h2
          className="text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
        >
          A Little Bit About{' '}
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text italic text-transparent">
            Me
          </span>
        </motion.h2>

        <div className="h-16 w-full sm:h-20" aria-hidden="true" />

        {/* ─── Bento Grid (4-col on lg, explicit placement) ─── */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">

          {/* Card 1 — Intro / Hook (spans 3 of 4 cols on lg) */}
          <motion.div
            className="bezel flex flex-col items-center justify-center rounded-2xl p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.015] hover:shadow-lg sm:col-span-2 lg:col-span-3"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="mb-5 flex items-center gap-2.5 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>
                Bridging Research & Scalable AI
              </span>
            </div>
            <p className="text-[15px] leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
              <Hl>Data Science</Hl> @{' '}
              <HlLink href="https://www.uni-mannheim.de/en/newsroom/forum/edition-2024/focus/study-peers-program/">University of Mannheim</HlLink>.
              I build intelligent systems that bridge the gap between research and production.
              Specializing in <Hl>scalable AI architecture</Hl> and turning high-dimensional
              data into real-world impact.
            </p>
          </motion.div>

          {/* Card 2 — Character / Levi (spans 1 col, 2 rows on lg) */}
          <motion.div
            className="bezel relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.015] hover:shadow-lg sm:min-h-[340px] lg:row-span-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(139,92,246,0.06)_0%,transparent_70%)]" />
            <motion.div
              className="relative z-10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="/Attack On Titan Capitan Levi Background Removed.png"
                alt="Levi Ackerman"
                className="h-[280px] w-auto object-contain drop-shadow-[0_0_24px_rgba(139,92,246,0.12)] sm:h-[320px]"
              />
            </motion.div>
          </motion.div>

          {/* Card 3 — Research */}
          <motion.div
            className="bezel flex flex-col items-center justify-center rounded-2xl p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.015] hover:shadow-lg"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="mb-4 flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>Research</span>
            </div>
            <p className="text-[14px] leading-[1.6] " style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Hi-C Data Analysis</span> — Extracted
              meaningful structures from high-dimensional genomic data using advanced{' '}
              <Hl>ML</Hl>. Focused on rigorous methodology and validating complex
              datasets at scale.
            </p>
          </motion.div>

          {/* Card 4 — Industry */}
          <motion.div
            className="bezel flex flex-col items-center justify-center rounded-2xl p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.015] hover:shadow-lg"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            custom={3}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="mb-4 flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /></svg>
              <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>Industry</span>
            </div>
            <p className="text-[14px] leading-[1.6] " style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Applied ML & Backend</span> — Shipped
              production-grade systems at{' '}
              <HlLink href="https://www.t-systems.com/de/de">T-Systems</HlLink>,{' '}
              <HlLink href="https://www.bosch.de/">Bosch</HlLink>, and{' '}
              <HlLink href="https://www.persistent.com/">Persistent</HlLink>. Expert in building
              scalable architectures and deploying robust AI pipelines.
            </p>
          </motion.div>

          {/* Card 5 — What I Build */}
          <motion.div
            className="bezel flex flex-col items-center justify-center rounded-2xl p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.015] hover:shadow-lg"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            custom={4}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="mb-4 flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-400"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>What I Build</span>
            </div>
            <p className="text-[14px] leading-[1.6] " style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Pipelines & Agents</span> — Architecting{' '}
              <Hl>LLM-powered agents</Hl> and clean backends. I thrive in high-pressure
              hackathons, turning &quot;what if&quot; into a functional prototype overnight.
            </p>
          </motion.div>

          {/* Card 6 — Interests (spans 2 cols on lg) */}
          <motion.div
            className="bezel flex flex-col items-center justify-center rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:scale-[1.015] hover:shadow-lg sm:col-span-2 lg:col-span-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            custom={5}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <span className="mb-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>
              Particularly Interested In
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {INTERESTS.map((item, i) => (
                <motion.span
                  key={item}
                  className="flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[13px] font-medium shadow-[0_0_12px_rgba(139,92,246,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(139,92,246,0.12)]"
                  style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
                    delay: 0.4 + i * 0.06,
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
                  </span>
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Card 7 — Community & Leadership */}
          <motion.div
            className="bezel flex flex-col items-center justify-center rounded-2xl p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.015] hover:shadow-lg sm:col-span-2 lg:col-span-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            custom={6}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="mb-4 flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>Community & Leadership</span>
            </div>
            <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
              Founder of campus{' '}
              <HlLink href="https://gdg.community.dev/gdg-on-campus-university-of-mannheim-mannheim-germany/">developer communities</HlLink>.
              Driven by curiosity, hands-on building, and fostering technical collaboration.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  )
}

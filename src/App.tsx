import { useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTheme } from './context/ThemeContext'
import Navbar from './components/Navbar'
import IntroSection from './components/IntroSection'
import ExperienceSection from './components/ExperienceSection'
import SkillsSection from './components/SkillsSection'
import ProjectSphere from './components/ProjectSphere'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'

const NAME = 'Shivam Suchak'
const RADIUS = 120
const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }
const CURSOR_SPRING = { stiffness: 150, damping: 15, mass: 0.1 }

const PROJECTS = [
  {
    id: 5,
    title: 'WEMA – Würth Electronics Matching Assistant',
    company: 'Hackathon | Würth Electronics',
    year: '2025',
    tagline: 'End-to-end BOM standardization with AI-powered component matching and explainable recommendations',
    description:
      'WEMA standardizes Bills of Materials and intelligently suggests Würth Electronics components as alternatives to competitor parts. Powered by a network of intelligent agents — from standardization to web search — it ensures smooth part-matching, deployed on Azure with integrations for Teams, Slack, and Telegram.',
    tags: ['Azure', 'Python', 'Flask', 'OpenAI', 'Gemini', 'BeautifulSoup', 'N8N'],
    color: '#ef4444',
    colorEnd: '#b91c1c',
    github: 'https://github.com/sreehari59/HackXplore',
    image: '/projects/project-logos/WEMA.png',
  },
  {
    id: 6,
    title: 'Dexter – Smart LLM Selector',
    company: 'Hackathon | KION',
    year: '2024',
    tagline: 'Intelligently routes prompts to the optimal LLM, balancing performance with energy efficiency',
    description:
      'Dexter classifies incoming prompts as "simple" or "complex" and routes them to an energy-efficient or more powerful model respectively. This ensures an optimal trade-off between energy consumption and quality, aligning with KION\'s sustainability goals to reduce carbon emissions.',
    tags: ['Python', 'Flask', 'OpenAI', 'Gemini'],
    color: '#1f2937',
    colorEnd: '#dc2626',
    github: 'https://github.com/sreehari59/kion-challenge-team-2',
    image: '/projects/project-logos/Dexter %E2%80%93 Smart LLM Selector.png',
  },
  {
    id: 7,
    title: 'Symptom Checker AI Chatbot',
    company: 'Datathon | PHOENIX Group',
    year: '2024',
    tagline: 'AI chatbot integrating a disease database with LLMs for intelligent symptom analysis',
    description:
      'Built during a 24-hour STADS Datathon challenge for PHOENIX Group. The chatbot integrates a disease database with LLMs, leveraging ReactJS, Flask, and embedding techniques to provide symptom-based health guidance.',
    tags: ['Python', 'Flask', 'OpenAI', 'ReactJS', 'NLP'],
    color: '#3b82f6',
    colorEnd: '#1d4ed8',
    image: '/projects/project-logos/Symptom Checker AI Chatbot.png',
  },
  {
    id: 8,
    title: 'Hemy Voice Enhancement',
    company: 'Hackathon | Helbling',
    year: '2024',
    tagline: 'Voice enhancement and memory management relay for a conversational agent',
    description:
      'Built a voice enhancement layer for Helbling\'s VoiceBot Hemy with STT focused on the main user, plus memory handling to remember and inject past conversational details for contextual continuity.',
    tags: ['Python', 'OpenAI', 'STT', 'Memory Management'],
    color: '#60a5fa',
    colorEnd: '#2563eb',
    github: 'https://github.com/shivamsuchak/StartHACK25',
    image: '/projects/project-logos/Hackathon Helbling.png',
  },
  {
    id: 9,
    title: 'Vaccination Analytics Dashboard',
    company: 'Datathon | CGM',
    year: '2024',
    tagline: 'Analytical dashboard with AI-driven insights on vaccination rates across German regions',
    description:
      'Built during a 24-hour STADS Datathon for CGM. Features regional data distribution, analytical diagrams by timeframe and region, AI-generated diagram descriptions, and a health-related chatbot — all in a modern Next.js + TypeScript stack.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand'],
    color: '#1e3a5f',
    colorEnd: '#0f172a',
    github: 'https://github.com/shivamsuchak/datathon-CGM',
    image: '/projects/project-logos/Analytic Dashboard.png',
  },
  {
    id: 10,
    title: 'Project Debait',
    company: 'Hackathon | Tech Europe',
    year: '2025',
    tagline: 'Multi-agent debate system with reinforcement learning for prompt optimization',
    description:
      'Two AI agents debate a topic back and forth, then a judge agent decides the winner. A coach agent optimizes the losing agent\'s prompt and the debate repeats, improving via reinforcement learning.',
    tags: ['CrewAI', 'LangChain', 'LangGraph', 'Agno', 'AgentsSDK'],
    color: '#f97316',
    colorEnd: '#c2410c',
    github: 'https://github.com/sreehari59/ProjectDebait',
    image: '/projects/project-logos/Project Debait.png',
  },
  {
    id: 11,
    title: 'Hotel Recommender System',
    company: 'Hackathon | TUMAI',
    year: '2025',
    tagline: 'Natural language hotel recommendations built during the 36-hour CHECK24 Makeathon',
    description:
      'Users describe their ideal stay in free text. AI agents extract preferences, match entities, map to a structured schema, and generate personalized hotel recommendations via an interactive web interface.',
    tags: ['React', 'TypeScript', 'AI Agents', 'NLP'],
    color: '#38bdf8',
    colorEnd: '#0284c7',
    github: 'https://github.com/shivamsuchak/stay24',
    image: '/projects/project-logos/Hotel Recommender System.png',
  },
  {
    id: 12,
    title: 'Simple Search Agent',
    company: 'Qhack | Microsoft',
    year: '2025',
    tagline: 'Minimalist search agent using the Agno framework with Google Search tools',
    description:
      'A lightweight search agent that performs web searches and returns summarized results. Features graceful fallback to mock responses, a simple web interface, and a RESTful API endpoint for integration.',
    tags: ['Python', 'OpenAI', 'Agno', 'Google Search'],
    color: '#22c55e',
    colorEnd: '#15803d',
    github: 'https://github.com/shivamsuchak/q-revised',
    image: '/projects/project-logos/Simple Search Agent with Agno.png',
  },
  {
    id: 13,
    title: 'InfraGuard',
    company: 'Hackathon | T-Systems International',
    year: '2024',
    tagline: 'Infrastructure detection using YOLOv8 on the Mapillary Vistas Dataset',
    description:
      'InfraGuard processes the Mapillary Vistas Dataset to detect bridges and tunnels, trains YOLOv8 models, and provides tools for inference, evaluation, and ONNX deployment. Includes MiDaS depth estimation for object dimension analysis.',
    tags: ['Python', 'YOLOv8', 'CUDA', 'Computer Vision', 'MiDaS'],
    color: '#e879f9',
    colorEnd: '#a21caf',
    github: 'https://github.com/shivamsuchak/Infraguard',
    image: '/projects/project-logos/InfraGuard.png',
  },
  {
    id: 14,
    title: 'DigiHack Crawler',
    company: 'Hackathon',
    year: '2024',
    tagline: 'Webpage clustering and analysis with BERT embeddings and NER',
    description:
      'A web scraping and analysis pipeline that crawls webpages, generates BERT embeddings, applies clustering algorithms, and performs Named Entity Recognition for structured content analysis.',
    tags: ['Python', 'BERT', 'Clustering', 'NER', 'Web Scraping'],
    color: '#a3a3a3',
    colorEnd: '#404040',
    image: '/projects/project-logos/DigiHack-Crawler.png',
  },
  {
    id: 15,
    title: 'Prompt Breeder',
    company: 'University of Mannheim',
    year: '2025',
    tagline: 'Iterative prompt optimization inspired by DeepMind\'s genetic algorithm approach',
    description:
      'A Python-based system that iteratively improves prompt generation for language models using genetic algorithm principles inspired by DeepMind\'s Prompt Breeder research.',
    tags: ['Python', 'OpenAI', 'Prompt Engineering', 'Research'],
    color: '#6366f1',
    colorEnd: '#312e81',
    image: '/projects/project-logos/Prompt Breeder.png',
  },
]

function MagneticChar({ char, index, theme }: { char: string; index: number; theme: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const proximity = useMotionValue(0)
  const springProximity = useSpring(proximity, SPRING)

  const scale = useTransform(springProximity, [0, 1], [1, 1.35])
  const color = useTransform(
    springProximity,
    [0, 1],
    [theme === 'dark' ? 'rgb(250, 250, 250)' : 'rgb(24, 24, 27)', 'rgb(167, 139, 250)']
  )

  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < RADIUS) {
        proximity.set(1 - dist / RADIUS)
      } else {
        proximity.set(0)
      }
    },
    [proximity]
  )

  const handleLeave = useCallback(() => {
    proximity.set(0)
  }, [proximity])

  useEffect(() => {
    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [handleMove, handleLeave])

  if (char === ' ') {
    return <span key={index} className="inline-block w-[0.25em]" />
  }

  return (
    <motion.span
      ref={ref}
      className="inline-block origin-center cursor-pointer"
      style={{ scale, color }}
    >
      {char}
    </motion.span>
  )
}

function App() {
  const { theme } = useTheme()
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, CURSOR_SPRING)
  const springY = useSpring(cursorY, CURSOR_SPRING)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [cursorX, cursorY])

  return (
    <div className="min-h-screen overflow-x-hidden transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Custom cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[999] h-4 w-4 rounded-full bg-white mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Hero */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-12">
        {/* Glow orb */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-[300px] w-[300px] rounded-full bg-violet-700/15 blur-[150px] sm:h-[400px] sm:w-[600px]" />
        </div>

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
          {/* Overline badge */}
          <motion.div
            className="bezel mb-8 flex items-center gap-2.5 rounded-full px-4 py-1.5 backdrop-blur-sm"
            style={{ background: 'var(--bg-card)' }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Available for Work
            </span>
          </motion.div>

          {/* Name */}
          <h1 className="flex flex-wrap justify-center text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
            {NAME.split('').map((char, i) => (
              <MagneticChar key={i} char={char} index={i} theme={theme} />
            ))}
          </h1>

          {/* Tagline with gradient accent */}
          <motion.p
            className="mt-6 w-full max-w-2xl px-2 text-center text-base leading-relaxed sm:text-lg md:text-2xl"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          >
            I don&apos;t just build AI models, I build AI products that drive{' '}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text italic text-transparent">
              intelligent decisions
            </span>
            .
          </motion.p>

          {/* Bento info cards */}
          <div className="relative mt-10 grid w-full max-w-4xl grid-cols-2 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-4">
            {/* Radial glow behind cards */}
            <div aria-hidden="true" className="pointer-events-none absolute -inset-12 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.12)_0%,transparent_70%)]" />
            {[
              { label: 'Status', value: 'Available for Work', dot: true },
              { label: 'Location', value: 'Berlin, Germany', dot: false },
              { label: 'Role', value: 'Building GenAI Products', dot: false },
              { label: 'Education', value: 'M.Sc. Data Science', dot: false },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                className="bezel flex flex-col items-center justify-center rounded-2xl px-4 py-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:px-5 sm:py-8"
                style={{ background: 'var(--bg-card)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.5 + i * 0.1,
                }}
              >
                <span className="mb-2 block text-[10px] font-medium tracking-[0.2em] uppercase sm:text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {card.label}
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold sm:text-base" style={{ color: 'var(--text-primary)' }}>
                  {card.dot && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  )}
                  {card.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ color: 'var(--text-faint)' }}
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* Intro — shimmer text + 3D shape */}
      <IntroSection />

      {/* Professional Journey */}
      <ExperienceSection />

      {/* Skills */}
      <SkillsSection />

      {/* Projects — 3D Sphere */}
      <ProjectSphere projects={PROJECTS} />

      {/* About Me */}
      <AboutSection />

      <div style={{ height: '6rem' }} aria-hidden="true" />

      {/* Footer */}
      <Footer />

    </div>
  )
}

export default App

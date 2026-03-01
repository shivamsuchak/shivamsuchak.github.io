import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

/* ─── Skill data ─── */

interface Skill {
  name: string
  icon: string
  color: string
}

const SKILLS: Skill[][] = [
  // Row 1
  [
    { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB', color: '#3776AB' },
    { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6', color: '#3178C6' },
    { name: 'Java', icon: 'https://cdn.simpleicons.org/openjdk/ED8B00', color: '#ED8B00' },
    { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB', color: '#61DAFB' },
    { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/5FA04E', color: '#5FA04E' },
    { name: 'FastAPI', icon: 'https://cdn.simpleicons.org/fastapi/009688', color: '#009688' },
    { name: 'GraphQL', icon: 'https://cdn.simpleicons.org/graphql/E10098', color: '#E10098' },
  ],
  // Row 2
  [
    { name: 'LangChain', icon: 'https://cdn.simpleicons.org/langchain/65C8CB', color: '#65C8CB' },
    { name: 'OpenAI', icon: 'https://cdn.simpleicons.org/openai/ffffff', color: '#ffffff' },
    { name: 'PyTorch', icon: 'https://cdn.simpleicons.org/pytorch/EE4C2C', color: '#EE4C2C' },
    { name: 'TensorFlow', icon: 'https://cdn.simpleicons.org/tensorflow/FF6F00', color: '#FF6F00' },
    { name: 'Hugging Face', icon: 'https://cdn.simpleicons.org/huggingface/FFD21E', color: '#FFD21E' },
    { name: 'Pandas', icon: 'https://cdn.simpleicons.org/pandas/E70488', color: '#E70488' },
    { name: 'NumPy', icon: 'https://cdn.simpleicons.org/numpy/4DABCF', color: '#4DABCF' },
    { name: 'Scikit-learn', icon: 'https://cdn.simpleicons.org/scikitlearn/F7931E', color: '#F7931E' },
    { name: 'MLflow', icon: 'https://cdn.simpleicons.org/mlflow/0194E2', color: '#0194E2' },
    { name: 'Jupyter', icon: 'https://cdn.simpleicons.org/jupyter/F37626', color: '#F37626' },
    { name: 'Matplotlib', icon: 'https://cdn.simpleicons.org/scipy/8CAAE6', color: '#8CAAE6' },
    { name: 'gRPC', icon: 'https://cdn.simpleicons.org/grpc/244c5a', color: '#244c5a' },
  ],
  // Row 3
  [
    { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED', color: '#2496ED' },
    { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes/326CE5', color: '#326CE5' },
    { name: 'AWS', icon: 'https://cdn.simpleicons.org/amazonwebservices/FF9900', color: '#FF9900' },
    { name: 'Azure', icon: 'https://cdn.simpleicons.org/microsoftazure/0078D4', color: '#0078D4' },
    { name: 'GCP', icon: 'https://cdn.simpleicons.org/googlecloud/4285F4', color: '#4285F4' },
    { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1', color: '#4169E1' },
    { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248', color: '#47A248' },
    { name: 'Git', icon: 'https://cdn.simpleicons.org/git/F05032', color: '#F05032' },
    { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/ffffff', color: '#ffffff' },
    { name: 'Linux', icon: 'https://cdn.simpleicons.org/linux/FCC624', color: '#FCC624' },
    { name: 'Terraform', icon: 'https://cdn.simpleicons.org/terraform/844FBA', color: '#844FBA' },
  ],
]

/* ─── Single skill icon card (scroll-driven, reversible) ─── */

function SkillCard({
  skill,
  rowIndex,
  colIndex,
  progress,
}: {
  skill: Skill
  rowIndex: number
  colIndex: number
  progress: MotionValue<number>
}) {
  // Deterministic scatter offsets per card
  const seed = rowIndex * 12 + colIndex
  const scatterX = ((seed * 7 + 13) % 61) - 30  // -30 to 30
  const scatterY = ((seed * 11 + 7) % 51) - 10   // -10 to 40
  const scatterRotate = ((seed * 5 + 3) % 31) - 15 // -15 to 15

  // Stagger: each row+col has a slightly different activation point
  const stagger = rowIndex * 0.06 + colIndex * 0.008
  const start = 0.15 + stagger
  const end = Math.min(start + 0.25, 0.65)

  // Scroll-driven transforms: scattered → aligned
  const x = useTransform(progress, [start, end], [scatterX * 4, 0])
  const y = useTransform(progress, [start, end], [scatterY * 3 + 80, 0])
  const rotate = useTransform(progress, [start, end], [scatterRotate, 0])
  const scale = useTransform(progress, [start, end], [0.6, 1])
  const opacity = useTransform(progress, [start, start + 0.08], [0, 1])

  return (
    <motion.div
      className="group relative flex flex-col items-center gap-2"
      style={{ x, y, rotate, scale, opacity }}
    >
      <motion.div
        className="bezel flex h-14 w-14 items-center justify-center rounded-2xl backdrop-blur-sm transition-all duration-300 sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]"
        style={{ background: 'var(--skill-card-bg)' }}
        whileHover={{
          scale: 1.15,
          borderColor: `${skill.color}40`,
          boxShadow: `0 0 20px ${skill.color}20`,
          y: -4,
        }}
        transition={{ duration: 0.25 }}
      >
        <img
          src={skill.icon}
          alt={skill.name}
          className="h-6 w-6 object-contain sm:h-7 sm:w-7 md:h-8 md:w-8"
          loading="lazy"
          onError={(e) => {
            const t = e.target as HTMLImageElement
            t.style.display = 'none'
            if (t.parentElement) {
              const fallback = document.createElement('span')
              fallback.className = 'text-xs font-bold'
              fallback.style.color = 'var(--text-muted)'
              fallback.textContent = skill.name.slice(0, 2)
              t.parentElement.appendChild(fallback)
            }
          }}
        />
      </motion.div>

      {/* Tooltip on hover */}
      <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ background: 'var(--tooltip-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
        {skill.name}
      </span>
    </motion.div>
  )
}

/* ─── Main Export ─── */

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax for the abstract shape
  const shapeY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const shapeRotate = useTransform(scrollYProgress, [0, 1], [-5, 5])
  const shapeScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1])

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative flex w-full flex-col items-center overflow-hidden pt-24 pb-40 sm:pt-32 sm:pb-52"
    >
      {/* Background subtle gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent"
      />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Abstract dark shape */}
        <motion.div
          className="relative mb-8 flex h-40 w-40 items-center justify-center sm:mb-10 sm:h-52 sm:w-52"
          style={{ y: shapeY, rotate: shapeRotate, scale: shapeScale }}
        >
          {/* Multi-layered dark orb */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-800/60 via-neutral-900/80 to-black blur-xl" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-neutral-700/30 via-neutral-900 to-black" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-neutral-600/20 via-neutral-900/90 to-black blur-sm" />
          {/* Inner highlight */}
          <div className="absolute top-6 left-8 h-16 w-24 rounded-full bg-neutral-600/15 blur-xl sm:h-20 sm:w-32" />
          <div className="absolute right-6 bottom-10 h-12 w-20 rounded-full bg-neutral-500/10 blur-lg" />
          {/* Glossy streak */}
          <div className="absolute top-1/3 left-1/4 h-1 w-16 rotate-[30deg] rounded-full bg-white/[0.06] blur-[2px] sm:w-20" />
        </motion.div>

        {/* Overline */}
        <motion.p
          className="mb-4 text-[11px] font-semibold tracking-[0.3em] uppercase"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          My Skills
        </motion.p>

        {/* Heading */}
        <motion.h2
          className="mb-20 text-center text-4xl font-bold tracking-tight sm:mb-24 sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span style={{ color: 'var(--text-primary)' }}>The Secret </span>
          <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text italic text-transparent">
            Sauce
          </span>
        </motion.h2>

        {/* Skills grid — 3 rows */}
        <div className="flex w-full flex-col items-center gap-10 sm:gap-12">
          {SKILLS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6"
            >
              {row.map((skill, colIdx) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  rowIndex={rowIdx}
                  colIndex={colIdx}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom abstract dark shape */}
        <motion.div
          className="relative mt-16 flex h-40 w-40 items-center justify-center sm:mt-20 sm:h-52 sm:w-52"
          style={{ y: shapeY, rotate: shapeRotate, scale: shapeScale }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-800/60 via-neutral-900/80 to-black blur-xl" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-neutral-700/30 via-neutral-900 to-black" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-neutral-600/20 via-neutral-900/90 to-black blur-sm" />
          <div className="absolute top-6 left-8 h-16 w-24 rounded-full bg-neutral-600/15 blur-xl sm:h-20 sm:w-32" />
          <div className="absolute right-6 bottom-10 h-12 w-20 rounded-full bg-neutral-500/10 blur-lg" />
          <div className="absolute top-1/3 left-1/4 h-1 w-16 rotate-[30deg] rounded-full bg-white/[0.06] blur-[2px] sm:w-20" />
        </motion.div>
      </div>
    </section>
  )
}

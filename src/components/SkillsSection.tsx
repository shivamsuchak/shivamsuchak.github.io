import { useRef, useState } from 'react'
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
    { name: 'Python', icon: '/icons/python.svg', color: '#3776AB' },
    { name: 'TypeScript', icon: '/icons/typescript.svg', color: '#3178C6' },
    { name: 'Java', icon: '/icons/java.svg', color: '#ED8B00' },
    { name: 'React', icon: '/icons/react.svg', color: '#61DAFB' },
    { name: 'Node.js', icon: '/icons/nodejs.svg', color: '#5FA04E' },
    { name: 'FastAPI', icon: '/icons/fastapi.svg', color: '#009688' },
    { name: 'GraphQL', icon: '/icons/graphql.svg', color: '#E10098' },
  ],
  // Row 2
  [
    { name: 'LangChain', icon: '/icons/langchain.svg', color: '#65C8CB' },
    { name: 'OpenAI', icon: '/icons/openai.svg', color: '#ffffff' },
    { name: 'PyTorch', icon: '/icons/pytorch.svg', color: '#EE4C2C' },
    { name: 'TensorFlow', icon: '/icons/tensorflow.svg', color: '#FF6F00' },
    { name: 'Hugging Face', icon: '/icons/huggingface.svg', color: '#FFD21E' },
    { name: 'Pandas', icon: '/icons/pandas.svg', color: '#E70488' },
    { name: 'NumPy', icon: '/icons/numpy.svg', color: '#4DABCF' },
    { name: 'Scikit-learn', icon: '/icons/scikitlearn.svg', color: '#F7931E' },
    { name: 'MLflow', icon: '/icons/mlflow.svg', color: '#0194E2' },
    { name: 'Jupyter', icon: '/icons/jupyter.svg', color: '#F37626' },
    { name: 'Matplotlib', icon: '/icons/matplotlib.svg', color: '#8CAAE6' },
    { name: 'gRPC', icon: '/icons/grpc.svg', color: '#244c5a' },
  ],
  // Row 3
  [
    { name: 'Docker', icon: '/icons/docker.svg', color: '#2496ED' },
    { name: 'Kubernetes', icon: '/icons/kubernetes.svg', color: '#326CE5' },
    { name: 'AWS', icon: '/icons/aws.svg', color: '#FF9900' },
    { name: 'Azure', icon: '/icons/azure.svg', color: '#0078D4' },
    { name: 'GCP', icon: '/icons/gcp.svg', color: '#4285F4' },
    { name: 'PostgreSQL', icon: '/icons/postgresql.svg', color: '#4169E1' },
    { name: 'MongoDB', icon: '/icons/mongodb.svg', color: '#47A248' },
    { name: 'Git', icon: '/icons/git.svg', color: '#F05032' },
    { name: 'GitHub', icon: '/icons/github.svg', color: '#ffffff' },
    { name: 'Linux', icon: '/icons/linux.svg', color: '#FCC624' },
    { name: 'Terraform', icon: '/icons/terraform.svg', color: '#844FBA' },
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
  const [imgError, setImgError] = useState(false)
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
        {imgError ? (
          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
            {skill.name.slice(0, 2)}
          </span>
        ) : (
          <img
            src={skill.icon}
            alt={skill.name}
            className="h-6 w-6 object-contain sm:h-7 sm:w-7 md:h-8 md:w-8"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
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

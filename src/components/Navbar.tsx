import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: 'Experience',
    href: '#experience',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    label: 'Skills',
    href: '#skills',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    href: '#work',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'About',
    href: '#about',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
  {
    label: 'Blog',
    href: 'https://medium.com/@datasciencedailyy',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
        <path d="M8 7h8M8 11h6" />
      </svg>
    ),
  },
]

function DockItem({
  item,
  active,
  mouseX,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number]
  active: boolean
  mouseX: ReturnType<typeof useMotionValue<number>>
  onClick: () => void
}) {
  const ref = useRef<HTMLAnchorElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return 150
    return val - (rect.left + rect.width / 2)
  })

  const widthSync = useTransform(distance, [-120, 0, 120], [44, 64, 44])
  const width = useSpring(widthSync, { stiffness: 300, damping: 25, mass: 0.5 })

  return (
    <motion.a
      ref={ref}
      href={item.href}
      target={item.href.startsWith('http') ? '_blank' : undefined}
      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="group relative flex flex-col items-center"
      onClick={() => {
        if (!item.href.startsWith('http')) {
          onClick()
        }
      }}
      style={{ width }}
    >
      <motion.div
        className="flex items-center justify-center rounded-xl transition-colors duration-200"
        style={{
          width,
          height: width,
          background: active ? 'rgba(139,92,246,0.2)' : 'var(--bg-card)',
          color: active ? '#c4b5fd' : 'var(--text-muted)',
          boxShadow: active ? '0 10px 15px -3px rgba(139,92,246,0.1)' : 'none',
        }}
      >
        {item.icon}
      </motion.div>

      {/* Label tooltip */}
      <span className="pointer-events-none absolute -top-8 rounded-md px-2 py-1 text-[10px] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ background: 'var(--tooltip-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
        {item.label}
      </span>

      {/* Active dot */}
      {active && (
        <motion.div
          className="mt-1 h-1 w-1 rounded-full bg-violet-400"
          layoutId="dock-dot"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </motion.a>
  )
}

function ThemeToggle({
  mouseX,
  theme,
  onToggle,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>
  theme: string
  onToggle: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return 150
    return val - (rect.left + rect.width / 2)
  })

  const widthSync = useTransform(distance, [-120, 0, 120], [44, 64, 44])
  const width = useSpring(widthSync, { stiffness: 300, damping: 25, mass: 0.5 })

  return (
    <motion.button
      ref={ref}
      className="group relative flex flex-col items-center"
      onClick={onToggle}
      style={{ width }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="flex items-center justify-center rounded-xl transition-colors duration-200"
        style={{
          width,
          height: width,
          background: 'var(--bg-card)',
          color: 'var(--text-muted)',
        }}
      >
        {theme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </motion.div>

      {/* Label tooltip */}
      <span className="pointer-events-none absolute -top-8 rounded-md px-2 py-1 text-[10px] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ background: 'var(--tooltip-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </motion.button>
  )
}

export default function Navbar() {
  const [active, setActive] = useState('Home')
  const mouseX = useMotionValue(Infinity)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const sectionMap: [string, string][] = [
      ['about', 'About'],
      ['work', 'Projects'],
      ['skills', 'Skills'],
      ['experience', 'Experience'],
    ]
    const onScroll = () => {
      for (const [id, label] of sectionMap) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 300) {
          setActive(label)
          return
        }
      }
      setActive('Home')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className="fixed bottom-4 left-1/2 z-[999] flex -translate-x-1/2 items-end gap-2 rounded-2xl border px-3 py-2.5 shadow-2xl backdrop-blur-2xl sm:bottom-6 sm:gap-3 sm:px-4 sm:py-3"
      style={{ background: 'var(--navbar-bg)', borderColor: 'var(--border-subtle)' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {NAV_ITEMS.map((item) => (
        <DockItem
          key={item.label}
          item={item}
          active={active === item.label}
          mouseX={mouseX}
          onClick={() => setActive(item.label)}
        />
      ))}

      {/* Theme toggle */}
      <ThemeToggle mouseX={mouseX} theme={theme} onToggle={toggleTheme} />
    </motion.nav>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Navigation links ─── */
const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Experience', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
]

const RESOURCES = [
  { label: 'Blog', href: 'https://medium.com/@datasciencedailyy', external: true },
  { label: 'Resume', href: '/resume.pdf', external: true },
  { label: 'Publications', href: '#about', external: false },
]

const DISCOVER = [
  { label: 'Tech Stack', href: '#skills', external: false },
  { label: 'Hackathons', href: '#projects', external: false },
  { label: 'Open Source', href: 'https://github.com/shivamsuchak', external: true },
]

/* ─── Social icons (monochrome, glow on hover) ─── */
const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/shivamsuchak',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/shivamsuchak',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Medium',
    href: 'https://medium.com/@datasciencedailyy',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:shivam.suchak@gmail.com',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    ),
  },
]

/* ─── Link column helper ─── */
function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h4 className="text-sm font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h4>
      <ul className="flex flex-col items-center gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-[13px] transition-colors duration-300 ease-in-out"
              style={{ color: 'var(--text-muted)' }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Modal overlay for Privacy / Terms ─── */
function PolicyModal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm"
      style={{ background: 'var(--overlay-bg)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-8 shadow-2xl sm:p-10"
        style={{ background: 'var(--modal-bg)', border: '1px solid var(--border-subtle)' }}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
        <h2 className="mb-6 text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        <div className="flex flex-col gap-4 text-[14px] leading-[1.7]" style={{ color: 'var(--text-secondary)' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Footer() {
  const [modal, setModal] = useState<'privacy' | 'terms' | null>(null)

  return (
    <>
    <AnimatePresence>
      {modal === 'privacy' && (
        <PolicyModal title="Privacy Policy" onClose={() => setModal(null)}>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Effective Date:</span> February 2026
          </p>
          <p>
            This website is a personal portfolio owned and operated by Shivam Suchak.
            Your privacy is important, and this policy outlines what information is
            (and isn&apos;t) collected when you visit.
          </p>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Information Collection</span><br />
            This site does not collect, store, or process any personal data. No cookies,
            analytics trackers, or sign-up forms are used. No data is sold or shared with
            third parties.
          </p>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Hosting & Logs</span><br />
            This site is hosted on a third-party platform which may automatically collect
            basic server access logs (e.g., IP address, browser type, timestamps). These
            logs are managed by the hosting provider and are not accessed or used by me.
          </p>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>External Links</span><br />
            This site contains links to external platforms such as GitHub, LinkedIn, and
            Medium. These platforms have their own privacy policies, and I am not responsible
            for their data practices.
          </p>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Contact</span><br />
            If you have any questions about this policy, reach out at{' '}
            <a href="mailto:shivam.suchak@gmail.com" className="text-violet-400 hover:underline">
              shivam.suchak@gmail.com
            </a>.
          </p>
        </PolicyModal>
      )}

      {modal === 'terms' && (
        <PolicyModal title="Terms of Use" onClose={() => setModal(null)}>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Effective Date:</span> February 2026
          </p>
          <p>
            By accessing this website, you agree to the following terms. If you do not
            agree, please do not use this site.
          </p>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Content Ownership</span><br />
            All content on this website — including text, design, code, and media — is
            the intellectual property of Shivam Suchak unless otherwise stated. You may
            not reproduce, distribute, or use any content without prior written permission.
          </p>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>No Warranties</span><br />
            This website is provided &quot;as is&quot; without any warranties of any kind,
            express or implied. I do not guarantee the accuracy, completeness, or availability
            of any information on this site.
          </p>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>External Links</span><br />
            This site may link to third-party websites. I am not responsible for the
            content or practices of these external sites.
          </p>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Limitation of Liability</span><br />
            I shall not be held liable for any damages arising from the use of or
            inability to use this website.
          </p>
          <p>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Contact</span><br />
            For questions regarding these terms, email{' '}
            <a href="mailto:shivam.suchak@gmail.com" className="text-violet-400 hover:underline">
              shivam.suchak@gmail.com
            </a>.
          </p>
        </PolicyModal>
      )}
    </AnimatePresence>
    <footer className="relative flex w-full flex-col items-center transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex w-full max-w-5xl flex-col items-center px-4 pt-16 pb-8 sm:px-6 md:px-12">

        {/* ─── 5-Column Grid ─── */}
        <motion.div
          className="grid w-full grid-cols-2 justify-items-center gap-10 text-center sm:grid-cols-3 lg:grid-cols-5 lg:gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Col 1 — Quick Navigation */}
          <FooterColumn title="Navigation" links={NAV_LINKS} />

          {/* Col 2 — Connect (social icons) */}
          <div className="flex flex-col items-center gap-4 text-center">
            <h4 className="text-sm font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>
              Connect
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_0_16px_rgba(139,92,246,0.15)]"
                  style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3 — Resources */}
          <FooterColumn title="Resources" links={RESOURCES} />

          {/* Col 4 — Discover */}
          <FooterColumn title="Discover" links={DISCOVER} />

          {/* Col 5 — Contact */}
          <div className="flex flex-col items-center gap-4 text-center">
            <h4 className="text-sm font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>
              Contact
            </h4>
            <div className="flex flex-col items-center gap-2.5">
              <a
                href="mailto:shivam.suchak@gmail.com"
                className="text-[13px] transition-colors duration-300 ease-in-out"
              style={{ color: 'var(--text-muted)' }}
              >
                shivam.suchak@gmail.com
              </a>
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Berlin, Germany</span>
              <a
                href="https://linkedin.com/in/shivamsuchak"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] transition-colors duration-300 ease-in-out"
              style={{ color: 'var(--text-muted)' }}
              >
                linkedin.com/in/shivamsuchak
              </a>
            </div>
          </div>
        </motion.div>

        {/* ─── Bottom Bar ─── */}
        <div className="mt-14 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-[12px]" style={{ color: 'var(--text-faint)' }}>
              &copy; {new Date().getFullYear()} Shivam Suchak &middot; All rights reserved
            </p>
            <p className="text-[12px]" style={{ color: 'var(--text-faint)' }}>
              Last updated: Feb 2026
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setModal('privacy')}
                className="cursor-pointer text-[12px] transition-colors duration-300 ease-in-out"
                style={{ color: 'var(--text-faint)' }}
              >
                Privacy Policy
              </button>
              <span style={{ color: 'var(--text-faint)' }}>|</span>
              <button
                onClick={() => setModal('terms')}
                className="cursor-pointer text-[12px] transition-colors duration-300 ease-in-out"
                style={{ color: 'var(--text-faint)' }}
              >
                Terms
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
    </>
  )
}

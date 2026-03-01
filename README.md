# Shivam Suchak — Personal Portfolio

A modern, interactive portfolio website built with React, Three.js, Framer Motion, and TailwindCSS.

## Features

- **Dark / Light Mode** — Toggle via navbar, persisted in localStorage
- **Magnetic Name** — Cursor-reactive text scaling on the hero name
- **3D Intro Scene** — Interactive particle field with distorted sphere (Three.js + R3F)
- **Shimmer Text** — Proximity-glow text effect on the intro section
- **CSS 3D Project Sphere** — Rotating sphere of project tiles with drag & momentum
- **macOS-style Dock Navbar** — Magnification on hover, scroll-aware active state
- **Bento Grid About** — Card grid with parallax crystal and animated interest pills
- **Experience Takeover** — Full-screen overlay with luminance-adaptive colors
- **Custom Cursor** — Spring-follow cursor with blend mode
- **Bezel Card Effect** — Premium glass-edge borders on all cards
- **Fully Responsive** — Desktop, tablet, and mobile

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Animation | Framer Motion |
| Styling | TailwindCSS v4 |

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx            # macOS dock nav + theme toggle
│   ├── IntroSection.tsx      # Shimmer text + 3D particle scene
│   ├── ExperienceSection.tsx # Experience cards + takeover overlay
│   ├── SkillsSection.tsx     # Skills grid with tooltips
│   ├── ProjectSphere.tsx     # CSS 3D rotating project sphere
│   ├── AboutSection.tsx      # Bento grid about cards
│   └── Footer.tsx            # Footer + policy modals
├── context/
│   └── ThemeContext.tsx       # Dark/light mode context
├── App.tsx                    # Hero section + layout
├── main.tsx                   # Entry point
└── index.css                  # Theme variables + global styles
```

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── ScrollReveal ─────────────────────────────────────────────────────────────
// For elements BELOW the fold — uses Intersection Observer which is reliable
// once the element actually needs to scroll into view.
// Do NOT use this for above-the-fold content.

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  // amount:0 = trigger the moment any pixel is visible
  // No negative margin — negative margins prevent above-fold items firing
  const isInView = useInView(ref, { once: true, amount: 0 })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

// ─── StaggerContainer + StaggerItem ──────────────────────────────────────────
// Same — for below-the-fold lists only.

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0 })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden:  { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] } },
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────
// For ABOVE-THE-FOLD content. Uses a pure CSS animation via a className —
// no JS, no Intersection Observer, no hydration dependency.
// Runs immediately on first paint regardless of network speed or device.

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        animation: `fadeInUp 0.5s ease forwards`,
        animationDelay: `${delay}s`,
        opacity: 0, // initial — overridden by animation
      }}
    >
      {children}
    </div>
  )
}

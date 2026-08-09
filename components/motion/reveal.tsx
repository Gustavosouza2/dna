"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Optional delay (ms) to stagger sequential reveals within a section. */
  delayMs?: number
}

/**
 * Single "use client" boundary for motion on the site (ADR 0002, on
 * framer-motion since ADR 0019). Fade + translateY(16px -> 0) once per
 * element as it enters the viewport, matching design-tokens.json's
 * motion.scrollReveal spec. reducedMotion is handled globally via
 * <MotionConfig reducedMotion="user"> in app/layout.tsx.
 */
export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: delayMs / 1000, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"

/**
 * Thin client boundary so the (server) root layout can still export
 * `metadata` while framer-motion's reduced-motion handling applies
 * site-wide - MotionConfig itself requires a client component.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

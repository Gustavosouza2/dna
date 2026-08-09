import type { ReactNode } from "react"

import { Reveal } from "@/components/motion/reveal"

interface CtaBandProps {
  title: string
  description: string
  children: ReactNode
}

/**
 * Final CTA band on a blue background — was duplicated independently
 * across Home, About and Services (finding from the improvement
 * sweep). `children` is the button area: each page builds its own
 * `<Button>`s (internal links, external WhatsApp, etc. vary too much
 * to be worth typing as props).
 */
export function CtaBand({ title, description, children }: CtaBandProps) {
  return (
    <section className="bg-blue-600 py-20 text-white">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-8">
        <Reveal>
          <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed opacity-90">
            {description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

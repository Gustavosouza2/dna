import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRightIcon, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// TODO: design-tokens.json only defines one brand blue (no distinct
// color per transport mode on the current site) — all three variants
// use the same accent color until we confirm whether air/road/river
// should have different colors. The cva structure is already set up
// for it (ADR 0005), just missing the real per-variant value.
const serviceCardVariants = cva(
  "group flex flex-col gap-3 rounded-lg border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
  {
    variants: {
      variant: {
        air: "[--accent-icon:var(--color-blue-600)]",
        road: "[--accent-icon:var(--color-blue-600)]",
        river: "[--accent-icon:var(--color-blue-600)]",
      },
    },
    defaultVariants: {
      variant: "air",
    },
  }
)

interface ServiceCardProps extends VariantProps<typeof serviceCardVariants> {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  variant,
}: ServiceCardProps) {
  return (
    <Link href={href} className={cn(serviceCardVariants({ variant }))}>
      <Icon className="size-7 text-(--accent-icon)" />
      <h3 className="font-display text-[17px] font-bold text-navy">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-0.5">
        Ver detalhes <ArrowRightIcon className="size-3.5" />
      </span>
    </Link>
  )
}

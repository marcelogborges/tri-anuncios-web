"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/lib/use-is-mobile"

type Props = {
  title: string
  subtitle?: string
  /** When false the section is always expanded, even on mobile. */
  collapsible?: boolean
  className?: string
  children: ReactNode
}

// Collapsible on mobile only — desktop always shows the content expanded.
export const CollapsibleSection = ({ title, subtitle, collapsible = true, className, children }: Props) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const interactive = collapsible && isMobile
  const expanded = !interactive || open

  const heading = (
    <div className="min-w-0">
      <h3 className="font-quicksand text-[18px] font-bold">{title}</h3>
      {subtitle && <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  )

  return (
    <section className={cn("bg-card border rounded-xl shadow-ambient overflow-hidden", className)}>
      {interactive ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer transition-colors hover:bg-secondary/20"
        >
          {heading}
          <ChevronDown
            className={cn("size-5 text-muted-foreground shrink-0 transition-transform duration-200", open && "rotate-180")}
          />
        </button>
      ) : (
        <div className="px-6 py-5 max-[640px]:px-4 max-[640px]:py-3">{heading}</div>
      )}
      {expanded && <div className="border-t">{children}</div>}
    </section>
  )
}

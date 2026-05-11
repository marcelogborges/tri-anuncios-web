"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Props = {
  icon: ReactNode
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

export const CardOption = ({ icon, title, description, selected, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-4 rounded-lg border p-[18px_20px] text-left transition-all",
      selected
        ? "border-primary shadow-[0_0_0_3px_var(--primary-soft)]"
        : "border-border hover:border-primary/50"
    )}
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--primary-soft)] text-primary">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-body-sm font-semibold text-foreground">{title}</p>
      <p className="text-label-caps text-muted-foreground mt-0.5">{description}</p>
    </div>
    <div
      className={cn(
        "h-5 w-5 shrink-0 rounded-full border-2 transition-colors",
        selected ? "border-primary bg-primary" : "border-border bg-background"
      )}
    />
  </button>
)

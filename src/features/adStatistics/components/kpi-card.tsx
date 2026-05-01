import type { ReactNode } from "react"

type KpiCardProps = {
  label: string
  icon: ReactNode
  value: string
  sub: string
}

export const KpiCard = ({ label, icon, value, sub }: KpiCardProps) => {
  return (
    <article className="bg-card border rounded-xl p-5 shadow-ambient">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>
        {label}
      </div>
      <div className="font-quicksand text-[2.25rem] font-bold tracking-tight leading-none mb-1 tabular-nums">
        {value}
      </div>
      <div className="text-[13px] text-muted-foreground">{sub}</div>
    </article>
  )
}

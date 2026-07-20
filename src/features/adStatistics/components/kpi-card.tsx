import type { ReactNode } from "react"
import { HelpCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type KpiCardProps = {
  label: string
  icon: ReactNode
  value: string
  sub: string
  help?: string
}

export const KpiCard = ({ label, icon, value, sub, help }: KpiCardProps) => {
  return (
    <article className="bg-card border rounded-xl p-5 shadow-ambient max-[640px]:p-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 max-[640px]:mb-1.5 max-[640px]:text-[10px] max-[640px]:tracking-wider">
        <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 max-[640px]:hidden">
          {icon}
        </div>
        <span className="min-w-0 truncate">{label}</span>
        {help && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`O que é ${label}?`}
                className="ml-auto shrink-0 text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                <HelpCircle className="size-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 text-[13px] font-normal normal-case tracking-normal leading-relaxed">
              {help}
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="font-quicksand text-[2.25rem] font-bold tracking-tight leading-none mb-1 tabular-nums max-[640px]:text-[1.375rem] max-[640px]:mb-0">
        {value}
      </div>
      <div className="text-[13px] text-muted-foreground max-[640px]:hidden">{sub}</div>
    </article>
  )
}

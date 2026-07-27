import type { ReactNode } from "react"
import { HelpCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type KpiCardProps = {
  label: string
  icon: ReactNode
  value: string
  sub?: string
  help?: string
  /** Denser variant for secondary surfaces (ad detail summary). */
  compact?: boolean
}

export const KpiCard = ({ label, icon, value, sub, help, compact }: KpiCardProps) => {
  return (
    <article
      className={cn(
        "bg-card border rounded-xl shadow-ambient",
        compact ? "p-3" : "p-5 max-[640px]:p-3"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 font-semibold uppercase text-muted-foreground",
          compact
            ? "mb-1 gap-1.5 text-[10px] leading-tight tracking-wide"
            : "mb-3 text-[11px] tracking-widest max-[640px]:mb-1.5 max-[640px]:text-[10px] max-[640px]:tracking-wider"
        )}
      >
        <div
          className={cn(
            "rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0",
            compact ? "size-5 [&_svg]:size-3" : "size-7 max-[640px]:hidden"
          )}
        >
          {icon}
        </div>
        <span className={cn("min-w-0", compact ? "leading-tight" : "truncate")}>{label}</span>
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
      <div
        className={cn(
          "font-quicksand font-bold tracking-tight leading-none tabular-nums",
          compact
            ? "text-[1.375rem]"
            : "text-[2.25rem] mb-1 max-[640px]:text-[1.375rem] max-[640px]:mb-0"
        )}
      >
        {value}
      </div>
      {sub && (
        <div
          className={cn(
            "text-muted-foreground",
            compact ? "mt-0.5 text-[11px] leading-tight" : "text-[13px] max-[640px]:hidden"
          )}
        >
          {sub}
        </div>
      )}
    </article>
  )
}

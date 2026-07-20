"use client"

import type { InsightsVideoMetrics } from "@/api/platform-publication"
import { formatBR } from "../formatters"
import { CollapsibleSection } from "./collapsible-section"

// Ordinal ramp (single hue, dark -> light): funnel order carried by lightness.
const STAGES = [
  { key: "p25", label: "25% assistido", color: "#10b981" },
  { key: "p50", label: "50% assistido", color: "#0f8a61" },
  { key: "p75", label: "75% assistido", color: "#006c49" },
  { key: "p100", label: "100% assistido", color: "#00553a" },
] as const

type Props = { video: InsightsVideoMetrics }

export const VideoRetention = ({ video }: Props) => {
  if (video.plays <= 0) return null

  return (
    <CollapsibleSection
      className="mt-4"
      title="Retenção do vídeo"
      subtitle={`${formatBR(video.plays)} reproduções no período`}
    >
      <div className="p-6 flex flex-col gap-3 max-[640px]:p-3 max-[640px]:gap-2">
        {STAGES.map(({ key, label, color }) => {
          const value = video[key]
          const pct = Math.min(100, Math.round((value / video.plays) * 100))
          return (
            <div key={key} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 max-[480px]:grid-cols-[90px_1fr_auto]">
              <span className="text-[13px] text-muted-foreground">{label}</span>
              <div className="h-5 rounded bg-secondary/40 overflow-hidden">
                <div
                  className="h-full rounded-r"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="text-[13px] font-semibold tabular-nums text-foreground w-24 text-right">
                {formatBR(value)} <span className="text-muted-foreground font-normal">({pct}%)</span>
              </span>
            </div>
          )
        })}
      </div>
    </CollapsibleSection>
  )
}

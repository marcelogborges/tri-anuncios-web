"use client"

import { Cell, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import type { BreakdownRow } from "@/api/platform-publication"
import { formatBR } from "../formatters"

const PLATFORM_META: Record<string, { label: string; color: string }> = {
  facebook: { label: "Facebook", color: "#006c49" },
  instagram: { label: "Instagram", color: "#10b981" },
}

const OTHER = { label: "Outros", color: "#9ca3af" }

type Slice = { key: string; label: string; color: string; impressions: number }

const toSlices = (rows: BreakdownRow[]): Slice[] => {
  const byPlatform = new Map<string, number>()
  for (const row of rows) {
    if (!row.publisher_platform) continue
    const key = PLATFORM_META[row.publisher_platform] ? row.publisher_platform : "other"
    byPlatform.set(key, (byPlatform.get(key) ?? 0) + row.impressions)
  }
  return [...byPlatform.entries()]
    .map(([key, impressions]) => ({ key, impressions, ...(PLATFORM_META[key] ?? OTHER) }))
    .filter((slice) => slice.impressions > 0)
    .sort((a, b) => b.impressions - a.impressions)
}

const chartConfig = {
  impressions: { label: "Impressões" },
} satisfies ChartConfig

type Props = { rows: BreakdownRow[] }

export const BreakdownPlatform = ({ rows }: Props) => {
  const slices = toSlices(rows)
  if (slices.length === 0) return null

  const total = slices.reduce((sum, slice) => sum + slice.impressions, 0)
  const pct = (v: number) => Math.round((v / total) * 100)

  return (
    <div className="flex flex-col items-center gap-4">
      <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-[260px]">
        <PieChart>
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const slice = payload[0].payload as Slice
              return (
                <div className="bg-foreground text-background text-xs font-semibold px-3 py-2 rounded-lg shadow-lift">
                  {slice.label}: {formatBR(slice.impressions)} impressões ({pct(slice.impressions)}%)
                </div>
              )
            }}
          />
          <Pie
            data={slices}
            dataKey="impressions"
            nameKey="label"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            strokeWidth={2}
            stroke="var(--card)"
          >
            {slices.map((slice) => (
              <Cell key={slice.key} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
        {slices.map((slice) => (
          <span key={slice.key} className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <span className="size-2.5 rounded-full inline-block" style={{ background: slice.color }} />
            {slice.label}
            <strong className="text-foreground tabular-nums">{pct(slice.impressions)}%</strong>
          </span>
        ))}
      </div>
    </div>
  )
}

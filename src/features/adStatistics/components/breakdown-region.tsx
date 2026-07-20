"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import type { BreakdownRow } from "@/api/platform-publication"
import { formatBR, formatCompactBR } from "../formatters"

const MAX_REGIONS = 8

type RegionRow = { region: string; impressions: number }

const toRegionRows = (rows: BreakdownRow[]): RegionRow[] => {
  const byRegion = new Map<string, number>()
  for (const row of rows) {
    if (!row.region) continue
    byRegion.set(row.region, (byRegion.get(row.region) ?? 0) + row.impressions)
  }
  return [...byRegion.entries()]
    .map(([region, impressions]) => ({ region, impressions }))
    .filter((row) => row.impressions > 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, MAX_REGIONS)
}

const chartConfig = {
  impressions: { label: "Impressões", color: "#006c49" },
} satisfies ChartConfig

type Props = { rows: BreakdownRow[] }

export const BreakdownRegion = ({ rows }: Props) => {
  const data = toRegionRows(rows)
  if (data.length === 0) return null

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height: data.length * 36 + 16 }}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="region"
          tickLine={false}
          axisLine={false}
          width={120}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip
          cursor={{ fill: "var(--secondary)", opacity: 0.3 }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const row = payload[0].payload as RegionRow
            return (
              <div className="bg-foreground text-background text-xs font-semibold px-3 py-2 rounded-lg shadow-lift">
                {row.region}: {formatBR(row.impressions)} impressões
              </div>
            )
          }}
        />
        <Bar dataKey="impressions" fill="#006c49" radius={[0, 4, 4, 0]} maxBarSize={20}>
          <LabelList
            dataKey="impressions"
            position="right"
            formatter={(v: number) => formatCompactBR(v)}
            className="fill-muted-foreground"
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

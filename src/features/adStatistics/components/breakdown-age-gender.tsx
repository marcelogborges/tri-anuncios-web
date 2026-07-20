"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { BreakdownRow } from "@/api/platform-publication"
import { formatCompactBR } from "../formatters"

const GENDER_SERIES = [
  { key: "female", label: "Feminino", color: "#006c49" },
  { key: "male", label: "Masculino", color: "#10b981" },
  { key: "unknown", label: "Não informado", color: "#9ca3af" },
] as const

const chartConfig = Object.fromEntries(
  GENDER_SERIES.map(({ key, label, color }) => [key, { label, color }])
) satisfies ChartConfig

type AgeRow = { age: string; female: number; male: number; unknown: number }

const toAgeRows = (rows: BreakdownRow[]): AgeRow[] => {
  const byAge = new Map<string, AgeRow>()
  for (const row of rows) {
    if (!row.age) continue
    const entry = byAge.get(row.age) ?? { age: row.age, female: 0, male: 0, unknown: 0 }
    const gender = row.gender === "female" || row.gender === "male" ? row.gender : "unknown"
    entry[gender] += row.impressions
    byAge.set(row.age, entry)
  }
  return [...byAge.values()].sort((a, b) => a.age.localeCompare(b.age))
}

type Props = { rows: BreakdownRow[] }

export const BreakdownAgeGender = ({ rows }: Props) => {
  const data = toAgeRows(rows)
  if (data.length === 0) return null

  const hasUnknown = data.some((d) => d.unknown > 0)
  const series = GENDER_SERIES.filter((s) => s.key !== "unknown" || hasUnknown)

  return (
    <ChartContainer config={chartConfig} className="h-[260px] w-full">
      <BarChart data={data} margin={{ top: 20, right: 8, left: 0, bottom: 0 }} barGap={2}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="age" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v: number) => formatCompactBR(v)}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip cursor={{ fill: "var(--secondary)", opacity: 0.3 }} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map(({ key, color }) => (
          <Bar key={key} dataKey={key} fill={color} radius={[4, 4, 0, 0]} maxBarSize={28}>
            <LabelList
              dataKey={key}
              position="top"
              formatter={(v: number) => (v > 0 ? formatCompactBR(v) : "")}
              className="fill-muted-foreground"
              fontSize={10}
            />
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  )
}

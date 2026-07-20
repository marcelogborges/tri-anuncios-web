"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { DailyInsightsEntry } from "@/api/platform-publication"
import { formatBR, formatBRL, formatCompactBR, formatShortDate } from "../formatters"

type MetricKey = "impressions" | "clicks" | "spend"

const METRICS: { key: MetricKey; label: string; format: (v: number) => string }[] = [
  { key: "impressions", label: "Impressões", format: formatBR },
  { key: "clicks", label: "Cliques", format: formatBR },
  { key: "spend", label: "Investimento", format: formatBRL },
]

const chartConfig = {
  impressions: { label: "Impressões", color: "var(--primary)" },
  clicks: { label: "Cliques", color: "var(--primary)" },
  spend: { label: "Investimento", color: "var(--primary)" },
} satisfies ChartConfig

type Props = { data: DailyInsightsEntry[] }

export const DailyChart = ({ data }: Props) => {
  const [metric, setMetric] = useState<MetricKey>("impressions")
  const activeMetric = METRICS.find((m) => m.key === metric)!

  return (
    <div>
      <div className="inline-flex bg-secondary/50 rounded-full p-1 gap-0.5 mb-4 overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {METRICS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMetric(key)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all shrink-0 select-none",
              metric === key
                ? "bg-primary text-primary-foreground shadow-ambient"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <ChartContainer config={chartConfig} className="h-[240px] w-full">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="dailyMetricGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="0" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={24}
            tickFormatter={formatShortDate}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v: number) => formatCompactBR(v)}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const entry = payload[0].payload as DailyInsightsEntry
              return (
                <div className="bg-foreground text-background text-xs font-semibold px-3 py-2 rounded-lg shadow-lift">
                  <div className="opacity-70 text-[10px] uppercase tracking-widest mb-1">
                    {formatShortDate(entry.date)}
                  </div>
                  <div>
                    {activeMetric.format(entry[metric])} {activeMetric.label.toLowerCase()}
                  </div>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#dailyMetricGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

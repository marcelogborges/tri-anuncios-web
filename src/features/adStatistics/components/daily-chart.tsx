"use client"

import { useRef, useState } from "react"
import type { DailyInsightsEntry } from "@/api/platform-publication"
import { formatBR, formatShortDate } from "../formatters"

const W = 720
const H = 240
const PAD = { l: 48, r: 16, t: 16, b: 32 }
const INNER_W = W - PAD.l - PAD.r
const INNER_H = H - PAD.t - PAD.b
const TOOLTIP_HALF_W = 88

const compactBR = (v: number) => {
  if (v >= 1000) return (v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "k"
  return Math.round(v).toString()
}

const smoothPath = (pts: [number, number][]) => {
  if (pts.length < 2) return `M ${pts[0]?.[0] ?? 0} ${pts[0]?.[1] ?? 0}`
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const cx = (x0 + x1) / 2
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`
  }
  return d
}

type TooltipState = { x: number; y: number; entry: DailyInsightsEntry; containerWidth: number }

const resolveTooltipPosition = (tooltip: TooltipState) => {
  const flipDown = tooltip.y < 70
  const clampedX = Math.max(TOOLTIP_HALF_W, Math.min(tooltip.x, tooltip.containerWidth - TOOLTIP_HALF_W))
  const arrowOffset = tooltip.x - clampedX
  return { flipDown, clampedX, arrowOffset }
}

type Props = { data: DailyInsightsEntry[] }

export const DailyChart = ({ data }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const maxImp = Math.max(...data.map((d) => d.impressions)) * 1.15
  const maxClk = Math.max(...data.map((d) => d.clicks)) * 1.4

  const xPos = (i: number) => PAD.l + (i / Math.max(data.length - 1, 1)) * INNER_W
  const yImp = (v: number) => PAD.t + INNER_H - (v / maxImp) * INNER_H
  const yClk = (v: number) => PAD.t + INNER_H - (v / maxClk) * INNER_H
  const xStep = data.length > 1 ? INNER_W / (data.length - 1) : INNER_W

  const impPts = data.map((d, i) => [xPos(i), yImp(d.impressions)] as [number, number])
  const clkPts = data.map((d, i) => [xPos(i), yClk(d.clicks)] as [number, number])
  const impPath = smoothPath(impPts)
  const clkPath = smoothPath(clkPts)
  const areaPath = `${impPath} L ${xPos(data.length - 1)} ${PAD.t + INNER_H} L ${xPos(0)} ${PAD.t + INNER_H} Z`

  const gridRows = Array.from({ length: 5 }, (_, i) => ({
    y: PAD.t + (INNER_H / 4) * i,
    label: compactBR(maxImp * (1 - i / 4)),
  }))

  const labelStep = Math.max(1, Math.floor(data.length / 7))
  const visibleLabels = data.filter((_, i) => i % labelStep === 0 || i === data.length - 1)

  const handleHover = (i: number) => {
    const svg = svgRef.current
    const wrap = wrapRef.current
    if (!svg || !wrap) return
    const svgRect = svg.getBoundingClientRect()
    const wrapRect = wrap.getBoundingClientRect()
    setTooltip({
      x: svgRect.left - wrapRect.left + (xPos(i) / W) * svgRect.width,
      y: svgRect.top - wrapRect.top + (yImp(data[i].impressions) / H) * svgRect.height,
      entry: data[i],
      containerWidth: wrapRect.width,
    })
  }

  const tooltipPos = tooltip ? resolveTooltipPosition(tooltip) : null

  return (
    <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div ref={wrapRef} className="relative min-w-[520px]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[240px] block"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#006c49" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#006c49" stopOpacity="0" />
            </linearGradient>
          </defs>
          {gridRows.map(({ y, label }, i) => (
            <g key={i}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#edeeef" strokeWidth="1" />
              <text
                x={PAD.l - 8} y={y + 4}
                textAnchor="end" fill="#3c4a42"
                fontSize="10" fontFamily="Plus Jakarta Sans" fontWeight="600"
              >
                {label}
              </text>
            </g>
          ))}
          {visibleLabels.map((d) => (
            <text
              key={d.date}
              x={xPos(data.indexOf(d))} y={H - 10}
              textAnchor="middle" fill="#3c4a42"
              fontSize="10" fontFamily="Plus Jakarta Sans" fontWeight="600"
            >
              {formatShortDate(d.date)}
            </text>
          ))}
          <path d={areaPath} fill="url(#chartGrad)" />
          <path d={impPath} fill="none" stroke="#006c49" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={clkPath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={xPos(i)} cy={yImp(d.impressions)} r="3.5" fill="white" stroke="#006c49" strokeWidth="2" />
              <rect
                x={xPos(i) - xStep / 2} y={PAD.t}
                width={xStep} height={INNER_H}
                fill="transparent"
                style={{ cursor: "crosshair" }}
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          ))}
        </svg>
        {tooltip && tooltipPos && (
          <div
            className="absolute pointer-events-none bg-foreground text-background text-xs font-semibold px-3 py-2 rounded-lg shadow-lift whitespace-nowrap z-10"
            style={{
              left: tooltipPos.clampedX,
              top: tooltip.y,
              transform: tooltipPos.flipDown ? "translate(-50%, 8px)" : "translate(-50%, calc(-100% - 8px))",
            }}
          >
            <div className="opacity-70 text-[10px] uppercase tracking-widest mb-1">
              {formatShortDate(tooltip.entry.date)}
            </div>
            <div>{formatBR(tooltip.entry.impressions)} impressões</div>
            <div>{formatBR(tooltip.entry.clicks)} cliques</div>
            <div
              className={`absolute size-2 rotate-45 ${tooltipPos.flipDown ? "top-[-4px]" : "bottom-[-4px]"}`}
              style={{ left: `calc(50% + ${tooltipPos.arrowOffset}px - 4px)`, background: "var(--foreground)" }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

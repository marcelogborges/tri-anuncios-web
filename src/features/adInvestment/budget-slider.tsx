"use client"

import { BUDGET_TIERS, snapAmount } from "@/features/adInvestment/budget-estimates"

const TRACK_MAX = 999
const SEGMENT = TRACK_MAX / 3

const positionToAmount = (position: number) => {
  const segmentIndex = Math.min(2, Math.floor(position / SEGMENT))
  const tier = BUDGET_TIERS[segmentIndex]
  const ratio = (position - segmentIndex * SEGMENT) / SEGMENT
  return snapAmount(tier.min + ratio * (tier.max - tier.min))
}

const amountToPosition = (amount: number) => {
  const tier = amount < BUDGET_TIERS[1].min ? 0 : amount < BUDGET_TIERS[2].min ? 1 : 2
  const { min, max } = BUDGET_TIERS[tier]
  const bounded = Math.min(Math.max(amount, min), max)
  return tier * SEGMENT + ((bounded - min) / (max - min)) * SEGMENT
}

type Props = {
  value: number
  onChange: (value: number) => void
}

export const BudgetSlider = ({ value, onChange }: Props) => {
  const position = amountToPosition(value)
  const fillPercent = (position / TRACK_MAX) * 100
  return (
    <div>
      <div className="relative h-11">
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-muted" />
        <div
          className="pointer-events-none absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary"
          style={{ width: `${fillPercent}%` }}
        />
        <div className="pointer-events-none absolute left-1/3 top-1/2 z-10 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-card ring-1 ring-border" />
        <div className="pointer-events-none absolute left-2/3 top-1/2 z-10 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-card ring-1 ring-border" />
        <input
          type="range"
          value={position}
          min={0}
          max={TRACK_MAX}
          step={1}
          aria-label="Valor do investimento"
          aria-valuemin={80}
          aria-valuemax={2000}
          aria-valuenow={value}
          aria-valuetext={`${value} reais`}
          onChange={(e) => onChange(positionToAmount(Number(e.target.value)))}
          className="budget-slider-input absolute inset-0 z-20 h-full w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
      <div className="relative mt-1 flex justify-between text-xs text-muted-foreground sm:text-body-sm">
        <span className="tabular-nums"><span className="hidden min-[400px]:inline">R$ </span>80</span>
        <span className="absolute left-1/3 -translate-x-1/2 tabular-nums"><span className="hidden min-[400px]:inline">R$ </span>350</span>
        <span className="absolute left-2/3 -translate-x-1/2 tabular-nums"><span className="hidden min-[400px]:inline">R$ </span>800</span>
        <span className="tabular-nums"><span className="hidden min-[400px]:inline">R$ </span>2.000</span>
      </div>
    </div>
  )
}

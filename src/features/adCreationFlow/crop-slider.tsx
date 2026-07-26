"use client"

type Props = {
  value: number
  min: number
  max: number
  step: number
  label: string
  onChange: (value: number) => void
}

export const Slider = ({ value, min, max, step, label, onChange }: Props) => (
  <div className="flex items-center gap-3">
    <span className="text-label-caps text-muted-foreground">{label}</span>
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
    />
  </div>
)

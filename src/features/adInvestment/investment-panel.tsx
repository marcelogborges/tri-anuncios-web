"use client"

import { useRef, useState } from "react"
import { Check, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import { formatCurrencyBRL } from "@/lib/format"
import { StepHeader } from "@/features/adCreationFlow/step-header"
import { BudgetSlider } from "@/features/adInvestment/budget-slider"
import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_TIERS,
  NUDGE_GAP,
  NUDGES,
  TIER_FEATURES,
  TIER_SUMMARIES,
  clampAmount,
  estimateClicks,
  estimateReach,
  formatCompactPeople,
  snapAmount,
  tierForAmount,
} from "@/features/adInvestment/budget-estimates"

const MIN_SCHEDULE_LEAD_MS = 60 * 60 * 1000
const MAX_SCHEDULE_HORIZON_MS = 90 * 24 * 60 * 60 * 1000
const DEFAULT_AMOUNT_CENTS = 35000

export type InvestmentSubmitData = {
  amountCents: number
  durationDays: number
  scheduledStartAtIso: string | null
}

type Props = {
  initialAmountCents?: number | null
  initialDurationDays?: number | null
  eyebrow?: string
  title?: string
  subtitle?: string
  submitting?: boolean
  externalError?: string | null
  onSubmit: (data: InvestmentSubmitData) => void
}

export const InvestmentPanel = ({
  initialAmountCents,
  initialDurationDays,
  eyebrow = "INVESTIMENTO",
  title = "Quanto você quer investir?",
  subtitle = "Pagamento único: todo o valor vira veiculação do seu anúncio.",
  submitting,
  externalError,
  onSubmit,
}: Props) => {
  const [amount, setAmount] = useState(() =>
    snapAmount((initialAmountCents ?? DEFAULT_AMOUNT_CENTS) / 100)
  )
  const [inputValue, setInputValue] = useState<string | null>(null)
  const [durationDays, setDurationDays] = useState<number | null>(initialDurationDays ?? null)
  const [scheduleMode, setScheduleMode] = useState<"now" | "scheduled">("now")
  const [scheduledStartAt, setScheduledStartAt] = useState<Date | null>(null)
  const [scheduleBounds, setScheduleBounds] = useState<{ min: Date; max: Date } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const tier = tierForAmount(amount)
  const effectiveDuration =
    tier.durations.length > 1 && durationDays && tier.durations.includes(durationDays)
      ? durationDays
      : tier.durations[0]
  const dailyAmount = Math.round(amount / effectiveDuration)
  const reach = estimateReach(amount)
  const clicks = estimateClicks(amount)
  const nudge = NUDGES.find((n) => amount < n.threshold && n.threshold - amount <= NUDGE_GAP)
  const visibleError = error ?? externalError ?? null

  const handleAmountChange = (value: number) => {
    setAmount(value)
    setInputValue(null)
    setError(null)
  }

  const handleInputChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "")
    setInputValue(digits)
    const parsed = Number(digits)
    if (parsed >= BUDGET_MIN && parsed <= BUDGET_MAX) {
      setAmount(parsed)
      setError(null)
    }
  }

  const handleInputBlur = () => {
    const parsed = Number(inputValue ?? amount)
    setAmount(Number.isNaN(parsed) || parsed === 0 ? amount : clampAmount(parsed))
    setInputValue(null)
  }

  const valueCardRef = useRef<HTMLDivElement | null>(null)

  // On mobile the tier cards sit below the fold: changing the amount from a
  // card would be invisible, so scroll the value card back into view.
  const handleTierClick = (index: number) => {
    setAmount(index === 0 ? 150 : BUDGET_TIERS[index].min)
    setInputValue(null)
    setError(null)
    const card = valueCardRef.current
    if (card && card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleSubmit = () => {
    let scheduledStartAtIso: string | null = null
    if (scheduleMode === "scheduled") {
      if (!scheduledStartAt) {
        setError("Informe uma data válida no formato DD/MM/AAAA HH:mm.")
        return
      }
      const now = Date.now()
      if (scheduledStartAt.getTime() < now + MIN_SCHEDULE_LEAD_MS) {
        setError("O início deve ser pelo menos 1 hora no futuro.")
        return
      }
      if (scheduledStartAt.getTime() > now + MAX_SCHEDULE_HORIZON_MS) {
        setError("O início deve ser em até 90 dias.")
        return
      }
      scheduledStartAtIso = scheduledStartAt.toISOString()
    }
    setError(null)
    onSubmit({ amountCents: amount * 100, durationDays: effectiveDuration, scheduledStartAtIso })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8">
      <StepHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div ref={valueCardRef} className="scroll-mt-20 rounded-lg border border-border bg-card p-6">
        <label className="flex cursor-text items-baseline justify-center gap-1">
          <span className="text-title-2 text-muted-foreground">R$</span>
          <input
            type="text"
            inputMode="numeric"
            value={inputValue ?? amount.toLocaleString("pt-BR")}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleInputBlur}
            aria-label="Valor do investimento em reais"
            style={{ width: `${Math.max((inputValue ?? amount.toLocaleString("pt-BR")).length, 2)}ch` }}
            className="border-b-2 border-dashed border-border bg-transparent text-center text-display tabular-nums outline-none transition-colors focus:border-primary"
          />
          <Pencil className="h-4 w-4 shrink-0 self-center text-muted-foreground" />
        </label>
        <div className="mt-4">
          <BudgetSlider value={amount} onChange={handleAmountChange} />
        </div>
        <p
          className={cn(
            "mt-4 min-h-[3.5rem] rounded-lg border px-4 py-2.5 text-xs sm:min-h-10 transition-colors duration-200",
            nudge ? "border-primary/30 bg-[var(--primary-soft)]" : "border-border text-muted-foreground"
          )}
        >
          {nudge ? (
            <>
              Faltam <strong>{formatCurrencyBRL(nudge.threshold - amount)}</strong> para {nudge.feature}.
            </>
          ) : (
            <>
              <strong className="text-foreground">Plano {tier.label}</strong>: {TIER_SUMMARIES[tier.key]}
            </>
          )}
        </p>
        <dl className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-body-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="whitespace-nowrap text-muted-foreground">
              <span className="sm:hidden">Duração</span>
              <span className="hidden sm:inline">Duração da campanha</span>
            </dt>
            {tier.durations.length > 1 ? (
              <dd className="flex gap-1.5">
                {tier.durations.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-1 text-sm font-semibold transition-colors",
                      effectiveDuration === days
                        ? "border-primary bg-[var(--primary-soft)] text-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                    )}
                  >
                    {days} dias
                  </button>
                ))}
              </dd>
            ) : (
              <dd className="whitespace-nowrap text-right font-semibold tabular-nums">{effectiveDuration} dias</dd>
            )}
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="whitespace-nowrap text-muted-foreground">Veiculação diária</dt>
            <dd className="whitespace-nowrap text-right font-semibold tabular-nums">{formatCurrencyBRL(dailyAmount)}/dia</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="whitespace-nowrap text-muted-foreground">Alcance estimado</dt>
            <dd className="whitespace-nowrap text-right font-semibold tabular-nums">
              {formatCompactPeople(reach.low)} – {formatCompactPeople(reach.high)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="whitespace-nowrap text-muted-foreground">Cliques estimados</dt>
            <dd className="whitespace-nowrap text-right font-semibold tabular-nums">
              {formatCompactPeople(clicks.low)} – {formatCompactPeople(clicks.high)}
            </dd>
          </div>
          <p className="text-label-caps normal-case tracking-normal text-muted-foreground">
            Estimativas ilustrativas, variam com público, região e criativo.
          </p>
          <div className="mt-2 flex items-center justify-between gap-4 border-t border-border pt-4">
            <dt className="whitespace-nowrap text-muted-foreground">Início</dt>
            <dd className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setScheduleMode("now")}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1 text-sm font-semibold transition-colors",
                  scheduleMode === "now"
                    ? "border-primary bg-[var(--primary-soft)] text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                )}
              >
                Imediato
              </button>
              <button
                type="button"
                onClick={() => {
                  setScheduleMode("scheduled")
                  setScheduleBounds({
                    min: new Date(Date.now() + MIN_SCHEDULE_LEAD_MS),
                    max: new Date(Date.now() + MAX_SCHEDULE_HORIZON_MS),
                  })
                }}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1 text-sm font-semibold transition-colors",
                  scheduleMode === "scheduled"
                    ? "border-primary bg-[var(--primary-soft)] text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                )}
              >
                Agendar
              </button>
            </dd>
          </div>
        </dl>
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            scheduleMode === "scheduled" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3">
              <div className="w-full max-w-xs">
                <DatePicker
                  withTime
                  value={scheduledStartAt}
                  onChange={setScheduledStartAt}
                  minDate={scheduleBounds?.min}
                  maxDate={scheduleBounds?.max}
                />
              </div>
              <p className="text-label-caps normal-case tracking-normal text-muted-foreground">
                Mínimo de 1 hora no futuro, máximo de 90 dias
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {BUDGET_TIERS.map((t, index) => (
          <button
            key={t.key}
            type="button"
            onClick={() => handleTierClick(index)}
            className={cn(
              "flex flex-col gap-1.5 rounded-lg border p-4 text-left transition-all",
              tier.key === t.key
                ? "border-primary bg-[var(--primary-soft)] ring-1 ring-primary"
                : "border-border bg-card opacity-70 hover:opacity-100"
            )}
          >
            <span className="text-body-sm text-muted-foreground tabular-nums">
              {formatCurrencyBRL(t.min)} – {formatCurrencyBRL(t.max)}
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              {t.label}
              {tier.key === t.key && <Check className="h-4 w-4 text-primary" />}
            </span>
            <span className="text-body-sm text-muted-foreground">{TIER_FEATURES[t.key].duration}</span>
            <span className="mt-1 flex flex-col gap-1">
              {TIER_FEATURES[t.key].features.map((feature) => (
                <span key={feature} className="flex items-start gap-1.5 text-body-sm">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {feature}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
      {visibleError && <p className="mt-3 text-body-sm text-destructive">{visibleError}</p>}
      <div className="mx-auto mt-6 flex w-full max-w-xl flex-col items-center gap-2">
        <Button
          className="w-full rounded-full"
          onClick={handleSubmit}
          disabled={submitting || (scheduleMode === "scheduled" && !scheduledStartAt)}
        >
          {submitting
            ? "Publicando..."
            : scheduleMode === "scheduled"
              ? `Investir ${formatCurrencyBRL(amount)} e agendar`
              : `Investir ${formatCurrencyBRL(amount)} e publicar`}
        </Button>
      </div>
    </div>
  )
}

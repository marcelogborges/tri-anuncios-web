"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { publishAdRequest } from "@/api/ad-request"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import { formatCurrencyBRL } from "@/lib/format"
import { BudgetSlider } from "@/features/adInvestment/budget-slider"
import {
  BUDGET_MAX,
  BUDGET_MIN,
  NUDGE_GAP,
  NUDGES,
  TIER_SUMMARIES,
  clampAmount,
  estimateClicks,
  estimateReach,
  formatCompactPeople,
  tierForAmount,
} from "@/features/adInvestment/budget-estimates"

const MIN_SCHEDULE_LEAD_MS = 60 * 60 * 1000
const MAX_SCHEDULE_HORIZON_MS = 90 * 24 * 60 * 60 * 1000

const chipClass = (active: boolean) =>
  cn(
    "whitespace-nowrap rounded-full border px-3 py-1 text-sm font-semibold transition-colors",
    active
      ? "border-primary bg-[var(--primary-soft)] text-primary"
      : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
  )

type PublishAdModalProps = {
  adRequestId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPublished: () => void
}

export const PublishAdModal = ({
  adRequestId,
  open,
  onOpenChange,
  onPublished,
}: PublishAdModalProps) => {
  const [amount, setAmount] = useState(350)
  const [inputValue, setInputValue] = useState<string | null>(null)
  const [durationDays, setDurationDays] = useState<number | null>(null)
  const [scheduleMode, setScheduleMode] = useState<"now" | "scheduled">("now")
  const [scheduledStartAt, setScheduledStartAt] = useState<Date | null>(null)
  const [scheduleBounds, setScheduleBounds] = useState<{ min: Date; max: Date } | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setAmount(350)
    setInputValue(null)
    setDurationDays(null)
    setScheduleMode("now")
    setScheduledStartAt(null)
    setError(null)
  }, [open])

  const tier = tierForAmount(amount)
  const effectiveDuration =
    tier.durations.length > 1 && durationDays && tier.durations.includes(durationDays)
      ? durationDays
      : tier.durations[0]
  const dailyAmount = Math.round(amount / effectiveDuration)
  const reach = estimateReach(amount)
  const clicks = estimateClicks(amount)
  const nudge = NUDGES.find((n) => amount < n.threshold && n.threshold - amount <= NUDGE_GAP)
  const displayValue = inputValue ?? amount.toLocaleString("pt-BR")

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

  const handlePublish = async () => {
    if (!adRequestId || publishing) return

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

    setPublishing(true)
    setError(null)

    try {
      await publishAdRequest(adRequestId, {
        budget_amount_cents: amount * 100,
        duration_days: effectiveDuration,
        scheduled_start_at: scheduledStartAtIso,
      })
      onPublished()
    } catch {
      setError("Erro ao publicar anúncio. Tente novamente.")
    } finally {
      setPublishing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quanto você quer investir?</DialogTitle>
          <DialogDescription>
            Pagamento único: todo o valor vira veiculação do seu anúncio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <label className="flex cursor-text items-baseline justify-center gap-1">
            <span className="text-title-2 text-muted-foreground">R$</span>
            <input
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleInputBlur}
              aria-label="Valor do investimento em reais"
              style={{ width: `${Math.max(displayValue.length, 2)}ch` }}
              className="border-b-2 border-dashed border-border bg-transparent text-center text-display tabular-nums outline-none transition-colors focus:border-primary"
            />
            <Pencil className="h-4 w-4 shrink-0 self-center text-muted-foreground" />
          </label>
          <BudgetSlider
            value={amount}
            onChange={(value) => {
              setAmount(value)
              setInputValue(null)
              setError(null)
            }}
          />
          <p
            className={cn(
              "min-h-[3.5rem] rounded-lg border px-4 py-2.5 text-xs sm:min-h-10 transition-colors duration-200",
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
          <dl className="flex flex-col gap-2 border-t border-border pt-4 text-body-sm">
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
                      className={chipClass(effectiveDuration === days)}
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
                  className={chipClass(scheduleMode === "now")}
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
                  className={chipClass(scheduleMode === "scheduled")}
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
              <div className="flex flex-col gap-1.5">
                <DatePicker
                  withTime
                  value={scheduledStartAt}
                  onChange={setScheduledStartAt}
                  minDate={scheduleBounds?.min}
                  maxDate={scheduleBounds?.max}
                />
                <p className="text-label-caps normal-case tracking-normal text-muted-foreground">
                  Mínimo de 1 hora no futuro, máximo de 90 dias
                </p>
              </div>
            </div>
          </div>
          {adRequestId != null && (
            <Link
              href={`/anuncios/${adRequestId}/investir`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary hover:bg-[var(--primary-soft)]"
            >
              <span className="min-w-0">
                <span className="block text-body-sm">Ver detalhes dos planos</span>
                <span className="block text-label-caps normal-case tracking-normal text-muted-foreground">
                  Compare Essencial, Impulso e Performance em tela cheia.
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          )}
          {error && <p className="text-body-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
            disabled={publishing}
          >
            Cancelar
          </Button>
          <Button
            className="rounded-full"
            onClick={handlePublish}
            disabled={publishing || (scheduleMode === "scheduled" && !scheduledStartAt)}
          >
            {publishing
              ? "Publicando..."
              : scheduleMode === "scheduled"
                ? `Investir ${formatCurrencyBRL(amount)} e agendar`
                : `Investir ${formatCurrencyBRL(amount)} e publicar`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

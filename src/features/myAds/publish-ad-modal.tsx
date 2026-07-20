"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getAdPackages } from "@/api/ad-package"
import type { AdPackage } from "@/api/ad-package"
import { publishAdRequest } from "@/api/ad-request"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import { formatCurrencyFromCents } from "@/lib/format"

const PROVIDER_LABELS: Record<string, string> = {
  meta: "Meta Ads",
  tiktok_ads: "TikTok Ads",
  google_ads: "Google Ads",
}

const MIN_SCHEDULE_LEAD_MS = 60 * 60 * 1000 // 1 hora
const MAX_SCHEDULE_HORIZON_MS = 90 * 24 * 60 * 60 * 1000 // 90 dias

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
  const [packages, setPackages] = useState<AdPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [scheduleMode, setScheduleMode] = useState<"now" | "scheduled">("now")
  const [scheduledStartAt, setScheduledStartAt] = useState<Date | null>(null)
  const [scheduleBounds, setScheduleBounds] = useState<{ min: Date; max: Date } | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setSelectedId(null)
    setScheduleMode("now")
    setScheduledStartAt(null)
    setScheduleBounds({
      min: new Date(Date.now() + MIN_SCHEDULE_LEAD_MS),
      max: new Date(Date.now() + MAX_SCHEDULE_HORIZON_MS),
    })
    setError(null)
    setLoading(true)

    getAdPackages()
      .then(setPackages)
      .catch(() => setError("Erro ao carregar planos."))
      .finally(() => setLoading(false))
  }, [open])

  const handlePublish = async () => {
    if (!adRequestId || !selectedId || publishing) return

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
      await publishAdRequest(adRequestId, selectedId, scheduledStartAtIso)
      onPublished()
    } catch {
      setError("Erro ao publicar anúncio. Tente novamente.")
    } finally {
      setPublishing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escolha um plano</DialogTitle>
          <DialogDescription>
            Selecione o pacote de anúncio para publicar nas plataformas.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <p className="text-sm text-muted-foreground py-4">Carregando planos...</p>
        )}

        {error && <p className="text-sm text-destructive py-2">{error}</p>}

        {!loading && !error && packages.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">
            Nenhum plano disponível no momento.
          </p>
        )}

        {!loading && packages.length > 0 && (
          <div className="grid gap-3 py-2">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedId(pkg.id)}
                className={cn(
                  "flex flex-col gap-1 rounded-lg border p-4 text-left transition-colors",
                  selectedId === pkg.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-muted-foreground/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{pkg.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {formatCurrencyFromCents(pkg.price_cents)}
                    </span>
                    {selectedId === pkg.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
                {pkg.description && (
                  <p className="text-sm text-muted-foreground">
                    {pkg.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {pkg.duration_days} dias
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  {pkg.platform_providers.map((p) => (
                    <span key={p} className="text-xs text-muted-foreground">
                      {PROVIDER_LABELS[p] ?? p}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && packages.length > 0 && (
          <div className="grid gap-2 py-2">
            <p className="text-sm font-medium">Quando começar?</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScheduleMode("now")}
                className={cn(
                  "flex items-center justify-center rounded-lg border p-3 text-sm whitespace-nowrap transition-colors",
                  scheduleMode === "now"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-muted-foreground/30"
                )}
              >
                Publicar agora
              </button>
              <button
                type="button"
                onClick={() => setScheduleMode("scheduled")}
                className={cn(
                  "flex items-center justify-center rounded-lg border p-3 text-sm whitespace-nowrap transition-colors",
                  scheduleMode === "scheduled"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-muted-foreground/30"
                )}
              >
                Agendar início
              </button>
            </div>
            {scheduleMode === "scheduled" && (
              <div className="grid gap-1">
                <DatePicker
                  withTime
                  value={scheduledStartAt}
                  onChange={setScheduledStartAt}
                  minDate={scheduleBounds?.min}
                  maxDate={scheduleBounds?.max}
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo de 1 hora no futuro, máximo de 90 dias.
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={publishing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePublish}
            disabled={
              !selectedId ||
              publishing ||
              (scheduleMode === "scheduled" && !scheduledStartAt)
            }
          >
            {publishing
              ? "Publicando..."
              : scheduleMode === "scheduled"
                ? "Agendar"
                : "Publicar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

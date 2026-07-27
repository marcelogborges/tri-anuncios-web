"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Check,
  ChevronRight,
  Coins,
  ExternalLink,
  Eye,
  Megaphone,
  MousePointerClick,
  Percent,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { KpiCard } from "@/features/adStatistics/components/kpi-card"
import { PublishAdModal } from "@/features/myAds/publish-ad-modal"
import { cn } from "@/lib/utils"
import { formatCurrencyFromCents } from "@/lib/format"
import type { AdRequestPlatformPublication } from "@/api/ad-request"
import { getPlatformPublicationPreviewLink } from "@/api/platform-publication"
import type { InsightsData } from "@/api/platform-publication"

const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n)

const fmtBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n)

const fmtPercent = (n: number) =>
  `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(n)}%`

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
}

const addDays = (iso: string, days: number) => {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d
}

const daysBetween = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / 86_400_000)

const PUBLISH_BENEFITS = [
  "Anúncio no Facebook e Instagram",
  "Público otimizado automaticamente",
  "Resultados acompanhados aqui",
]

type LiveBlockProps = {
  adRequestId: number
  pub: AdRequestPlatformPublication
  pubIndex: number
  durationDays: number
  budgetCents: number | null
  insights: InsightsData | null
}

export const LivePublicationBlock = ({
  adRequestId,
  pub,
  pubIndex,
  durationDays,
  budgetCents,
  insights,
}: LiveBlockProps) => {
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const startsAt = new Date(pub.created_at)
  const endsAt = addDays(pub.created_at, durationDays)
  const today = new Date()
  const elapsed = Math.min(Math.max(1, daysBetween(startsAt, today) + 1), durationDays)
  const total = Math.max(1, durationDays)
  const progress = Math.min(100, Math.round((elapsed / total) * 100))
  const remaining = Math.max(0, daysBetween(today, endsAt))
  const kpis = [
    {
      label: "Impressões",
      icon: <Eye className="size-3.5" />,
      value: insights ? fmt(insights.impressions) : "—",
    },
    {
      label: "Cliques",
      icon: <MousePointerClick className="size-3.5" />,
      value: insights ? fmt(insights.clicks) : "—",
    },
    {
      label: "Taxa de cliques",
      icon: <Percent className="size-3.5" />,
      value: insights ? fmtPercent(insights.ctr) : "—",
    },
    {
      label: "Custo por clique",
      icon: <Coins className="size-3.5" />,
      value: insights ? fmtBRL(insights.cpc) : "—",
    },
  ]
  const handlePreviewClick = async () => {
    if (previewLoading) return
    setPreviewLoading(true)
    setPreviewError(false)
    try {
      const link = await getPlatformPublicationPreviewLink(adRequestId, pub.id)
      if (link) {
        window.open(link, "_blank", "noopener,noreferrer")
      } else {
        setPreviewError(true)
      }
    } catch {
      setPreviewError(true)
    } finally {
      setPreviewLoading(false)
    }
  }
  return (
    <div className="flex flex-col gap-3.5 rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Publicação ao vivo
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Publicação #{pubIndex} · {fmtDate(pub.created_at)} → {fmtDate(endsAt.toISOString())}
        </span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Investido</p>
        <p className="mt-0.5 font-quicksand text-xl font-bold tabular-nums text-primary sm:text-2xl">
          {insights ? fmtBRL(insights.spend) : "—"}
          {budgetCents != null && (
            <span className="text-sm font-medium text-muted-foreground">
              {" "}de {formatCurrencyFromCents(budgetCents)}
            </span>
          )}
        </p>
        <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>Dia {elapsed} de {total}</span>
          <span>
            {remaining > 0
              ? `Termina em ${remaining} dia${remaining !== 1 ? "s" : ""} · ${fmtDate(endsAt.toISOString())}`
              : "Encerrado"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} compact label={kpi.label} icon={kpi.icon} value={kpi.value} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Link href={`/anuncios/${adRequestId}/estatisticas`}>
          <Button size="sm" className="h-10 w-full rounded-full font-semibold">
            Ver desempenho completo
          </Button>
        </Link>
        <Button
          size="sm"
          variant="outline"
          className="h-10 w-full rounded-full bg-card font-semibold"
          onClick={handlePreviewClick}
          disabled={previewLoading}
        >
          <ExternalLink className="h-4 w-4" />
          {previewLoading ? "Abrindo prévia..." : "Ver no Facebook"}
        </Button>
        {previewError && (
          <p className="text-center text-xs text-muted-foreground">
            Não foi possível carregar a prévia agora. Tente de novo em instantes.
          </p>
        )}
      </div>
    </div>
  )
}

type RepublishCtaProps = {
  adRequestId: number
  hasPreviousPublications: boolean
  onPublished: () => void
}

export const RepublishCtaBlock = ({
  adRequestId,
  hasPreviousPublications,
  onPublished,
}: RepublishCtaProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      {hasPreviousPublications ? (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--primary-soft)]">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="mb-1 font-quicksand text-base font-bold">Publicar novamente</p>
              <p className="text-body-sm font-normal text-muted-foreground">
                Esse criativo já foi veiculado. Você pode publicá-lo de novo com um novo investimento.
              </p>
            </div>
          </div>
          <Button className="self-end rounded-full" onClick={() => setModalOpen(true)}>
            Publicar
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-soft)]">
              <Megaphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-quicksand text-title-2">Pronto para colocar no ar?</p>
              <p className="mt-1 text-body-sm font-normal text-muted-foreground">
                Pagamento único: você escolhe o investimento e a gente cuida da veiculação.
              </p>
            </div>
            <ul className="flex flex-col items-start gap-1.5">
              {PUBLISH_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-body-sm font-normal">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
            <Button className="w-full max-w-xs rounded-full" onClick={() => setModalOpen(true)}>
              Publicar agora
            </Button>
          </div>
        </div>
      )}
      <PublishAdModal
        adRequestId={adRequestId}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onPublished={() => {
          setModalOpen(false)
          onPublished()
        }}
      />
    </>
  )
}

type HistoryBlockProps = {
  adRequestId: number
  publications: AdRequestPlatformPublication[]
  durationDays: number
  packageName: string | null
  activeInsights: InsightsData | null
  activePubId: number | null
}

export const PublicationHistoryBlock = ({
  adRequestId,
  publications,
  durationDays,
  packageName,
  activeInsights,
  activePubId,
}: HistoryBlockProps) => {
  const sorted = [...publications].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="hidden items-center justify-between border-b border-border px-6 py-4 lg:flex">
        <p className="font-quicksand text-base font-bold">Histórico de publicações</p>
        <span className="text-sm font-medium text-muted-foreground">{publications.length}</span>
      </div>
      <div className="divide-y divide-border">
        {sorted.map((pub, i) => {
          const isActive = pub.id === activePubId
          const startsAt = pub.created_at
          const endsAt = addDays(startsAt, durationDays).toISOString()
          const index = i + 1
          const pubInsights = isActive ? activeInsights : null
          return (
            <Link
              key={pub.id}
              href={`/anuncios/${adRequestId}/estatisticas`}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-[var(--primary-soft)] text-primary"
                )}
              >
                {index}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold">
                    {fmtDate(startsAt)} → {fmtDate(endsAt)}
                  </span>
                  {packageName && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-label-caps text-xs">
                      {packageName}
                    </span>
                  )}
                  {isActive && (
                    <span className="text-xs font-semibold text-emerald-600">Em curso</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <span className="font-quicksand font-bold">
                    {pubInsights ? fmt(pubInsights.impressions) : "—"}
                  </span>{" "}
                  impressões ·{" "}
                  <span className="font-quicksand font-bold">
                    {pubInsights ? fmt(pubInsights.clicks) : "—"}
                  </span>{" "}
                  cliques
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { RefreshCw, MousePointerClick, CreditCard, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AdRequest } from "@/api/ad-request"
import type { DailyInsightsEntry, InsightsData, PlatformPublicationInsights } from "@/api/platform-publication"
import { getPlatformPublicationDailyInsights, getPlatformPublicationInsights } from "@/api/platform-publication"
import type { DatePreset } from "./types"
import { DATE_PRESETS, STATUS_CONFIG, PLATFORM_LABELS, PLATFORM_ICONS, ALL_PLATFORMS } from "./constants"
import { formatBR, formatBRL, isEmptyInsights } from "./formatters"
import { Breadcrumb } from "./components/breadcrumb"
import { PulseDot } from "./components/pulse-dot"
import { DailyChart } from "./components/daily-chart"
import { DailyChartEmpty } from "./components/daily-chart-empty"
import { InsightsSkeleton } from "./components/insights-skeleton"
import { InsightsEmptyState } from "./components/insights-empty-state"
import { KpiCard } from "./components/kpi-card"
import { KpiHero } from "./components/kpi-hero"

type Props = { adRequest: AdRequest }

export function AdStatistics({ adRequest }: Props) {
  const [datePreset, setDatePreset] = useState<DatePreset>("last_7d")
  const [insights, setInsights] = useState<PlatformPublicationInsights | null>(null)
  const [dailyInsights, setDailyInsights] = useState<DailyInsightsEntry[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const metaPublication = adRequest.platform_publications.find((p) => p.provider === "meta")
  const statusConfig = STATUS_CONFIG[adRequest.status] ?? { label: adRequest.status, variant: "outline" as const }
  const imageUrl = adRequest.base_ad_creative.feed_image_url ?? adRequest.base_ad_creative.story_image_url

  const loadInsights = async (preset: DatePreset) => {
    if (!metaPublication) return

    setIsLoading(true)
    setError(null)

    try {
      const aggResult = await getPlatformPublicationInsights(adRequest.id, metaPublication.id, preset)
      setInsights(aggResult)
    } catch {
      setError("Não foi possível carregar as estatísticas. Tente novamente.")
    }

    try {
      const dailyResult = await getPlatformPublicationDailyInsights(adRequest.id, metaPublication.id, preset, "2026-03-27")
      setDailyInsights(dailyResult)
    } catch {
      setDailyInsights(null)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadInsights("last_7d")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePresetChange = (preset: DatePreset) => {
    setDatePreset(preset)
    loadInsights(preset)
  }

  const insightsData =
    insights?.data && !isEmptyInsights(insights.data) ? (insights.data as InsightsData) : null

  const publicationsByPlatform = Object.fromEntries(
    adRequest.platform_publications.map((p) => [p.provider, p])
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumb name={adRequest.base_ad_creative.name} />
      <section className="bg-card border rounded-xl p-6 shadow-ambient ad-header-grid max-[480px]:p-4">
        <div
          className={cn(
            "rounded-xl overflow-hidden border bg-secondary/20 shrink-0 self-start [grid-area:thumb]",
            "w-24 h-24 max-[960px]:w-20 max-[960px]:h-20 max-[480px]:w-[60px] max-[480px]:h-[60px]"
          )}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={adRequest.base_ad_creative.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="min-w-0 [grid-area:meta]">
          <h1 className="text-title-2 text-foreground mb-2 max-[480px]:text-[18px] max-[480px]:leading-6 max-[480px]:mb-1.5">
            {adRequest.base_ad_creative.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusConfig.variant} className="flex items-center gap-1.5">
              {adRequest.status === "published" && <PulseDot />}
              {statusConfig.label}
            </Badge>
            {adRequest.ad_package && (
              <span className="hidden sm:inline text-sm text-muted-foreground">
                <strong className="text-foreground">{adRequest.ad_package.name}</strong>
                {" · "}{adRequest.ad_package.duration_days} dias
              </span>
            )}
          </div>
        </div>
        <div className="[grid-area:actions] flex gap-2 max-[960px]:w-full max-[960px]:[&>button]:flex-1">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => loadInsights(datePreset)}
            disabled={isLoading}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-between gap-4 max-[720px]:flex-col max-[720px]:items-stretch max-[720px]:gap-3">
        <div className="inline-flex p-1 bg-secondary rounded-full gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ALL_PLATFORMS.map((platform) => (
            <button
              key={platform}
              disabled={platform !== "meta"}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shrink-0 select-none",
                platform === "meta"
                  ? "bg-card text-foreground shadow-ambient"
                  : "text-secondary-foreground opacity-60 cursor-not-allowed"
              )}
            >
              <img src={PLATFORM_ICONS[platform]} alt="" className="size-4 object-contain" />
              {PLATFORM_LABELS[platform]}
              {platform !== "meta" && (
                <span className="text-[10px] bg-white/70 text-muted-foreground font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full">
                  Em breve
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="inline-flex bg-card border rounded-full p-1 gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DATE_PRESETS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all shrink-0 select-none",
                datePreset === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-destructive/10 border border-destructive/20 p-5 text-center">
          <p className="text-destructive text-sm font-semibold">{error}</p>
        </div>
      )}

      {!metaPublication && !error && (
        <InsightsEmptyState
          title="Sem publicação no Meta"
          description="Este anúncio ainda não possui publicação ativa no Meta Ads."
        />
      )}

      {metaPublication && !error && (
        <div className={cn(isLoading && insights ? "opacity-60 pointer-events-none" : "")}>
          {isLoading && !insights && <InsightsSkeleton />}
          {!isLoading && insights && isEmptyInsights(insights.data) && (
            <InsightsEmptyState
              title="Dados ainda não disponíveis"
              description={
                insights.message ??
                "As estatísticas do seu anúncio estão sendo processadas. Tente novamente em alguns minutos."
              }
            />
          )}
          {insightsData && (
            <>
              <section className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-[480px]:grid-cols-1">
                <KpiHero impressions={insightsData.impressions} />
                <KpiCard
                  label="Cliques"
                  icon={<MousePointerClick className="size-3.5" />}
                  value={formatBR(insightsData.clicks)}
                  sub="no link"
                />
                <KpiCard
                  label="Investimento"
                  icon={<CreditCard className="size-3.5" />}
                  value={formatBRL(insightsData.spend)}
                  sub={
                    adRequest.ad_package
                      ? `de ${formatBRL(adRequest.ad_package.price_cents / 100)} do plano`
                      : "total investido"
                  }
                />
              </section>
              <section className="mt-4 bg-card border rounded-xl shadow-ambient overflow-hidden">
                <div className="px-6 py-5 border-b">
                  <h3 className="font-quicksand text-[18px] font-bold">Evolução diária</h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5">Impressões e cliques por dia</p>
                  <div className="flex gap-4 text-[13px] text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-primary inline-block" />
                      Impressões
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-chart-1 inline-block" />
                      Cliques
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {dailyInsights && dailyInsights.length > 1
                    ? <DailyChart data={dailyInsights} />
                    : <DailyChartEmpty />}
                </div>
              </section>
            </>
          )}
        </div>
      )}

      <h2 className="mt-8 mb-3 text-sm font-bold uppercase tracking-[0.08em] text-muted-foreground">
        Publicações
      </h2>
      <div className="flex flex-col gap-2">
        {ALL_PLATFORMS.map((platform) => (
          <div
            key={platform}
            className={cn(
              "flex items-center gap-4 bg-card border rounded-xl px-4 py-3 shadow-ambient",
              !publicationsByPlatform[platform] && "opacity-60"
            )}
          >
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <img src={PLATFORM_ICONS[platform]} alt={PLATFORM_LABELS[platform]} className="size-5 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px]">{PLATFORM_LABELS[platform]}</div>
              <div className="text-xs text-muted-foreground tabular-nums truncate">
                {publicationsByPlatform[platform] ? `ID ${publicationsByPlatform[platform].id}` : "Integração disponível em breve"}
              </div>
            </div>
            {publicationsByPlatform[platform] ? (
              <Badge variant="secondary" className="flex items-center gap-1.5 shrink-0">
                <PulseDot />
                {statusConfig.label}
              </Badge>
            ) : (
              <Badge variant="outline" className="shrink-0">Em breve</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

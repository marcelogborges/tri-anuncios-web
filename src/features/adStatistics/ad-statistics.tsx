"use client"

import { useEffect, useState } from "react"
import {
  RefreshCw,
  MousePointerClick,
  CreditCard,
  ImageIcon,
  Users,
  Repeat,
  Link2,
  Percent,
  Coins,
  BarChart3,
  CalendarRange,
  ChevronDown,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { formatDayMonth, toIsoDateValue } from "@/lib/format"
import type { AdRequest } from "@/api/ad-request"
import type {
  BreakdownDimension,
  BreakdownRow,
  DailyInsightsEntry,
  InsightsData,
  PlatformPublicationInsights,
} from "@/api/platform-publication"
import {
  getPlatformPublicationBreakdownInsights,
  getPlatformPublicationDailyInsights,
  getPlatformPublicationInsights,
} from "@/api/platform-publication"
import type { DatePreset, PeriodSelection } from "./types"
import { DATE_PRESETS, STATUS_CONFIG, PLATFORM_LABELS, PLATFORM_ICONS, ALL_PLATFORMS } from "./constants"
import { formatBR, formatBRL, formatDecimalBR, formatPercentBR, formatShortDate, isEmptyInsights } from "./formatters"
import { Breadcrumb } from "./components/breadcrumb"
import { PulseDot } from "./components/pulse-dot"
import { DailyChart } from "./components/daily-chart"
import { DailyChartEmpty } from "./components/daily-chart-empty"
import { InsightsSkeleton } from "./components/insights-skeleton"
import { InsightsEmptyState } from "./components/insights-empty-state"
import { KpiCard } from "./components/kpi-card"
import { KpiHero } from "./components/kpi-hero"
import { CollapsibleSection } from "./components/collapsible-section"
import { EngagementSection } from "./components/engagement-section"
import { VideoRetention } from "./components/video-retention"
import { BreakdownAgeGender } from "./components/breakdown-age-gender"
import { BreakdownPlatform } from "./components/breakdown-platform"
import { BreakdownRegion } from "./components/breakdown-region"

type BreakdownState = Partial<Record<BreakdownDimension, BreakdownRow[]>>

const BREAKDOWN_DIMENSIONS: BreakdownDimension[] = ["age_gender", "platform", "region"]

type Props = { adRequest: AdRequest }

export function AdStatistics({ adRequest }: Props) {
  const [period, setPeriod] = useState<PeriodSelection>({ preset: "last_7d" })
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerView, setPickerView] = useState<"presets" | "custom">("presets")
  const [customRange, setCustomRange] = useState<DateRange | undefined>()
  const [insights, setInsights] = useState<PlatformPublicationInsights | null>(null)
  const [dailyInsights, setDailyInsights] = useState<DailyInsightsEntry[] | null>(null)
  const [breakdowns, setBreakdowns] = useState<BreakdownState>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const metaPublication = adRequest.platform_publications.find((p) => p.provider === "meta")
  const statusConfig = STATUS_CONFIG[adRequest.status] ?? { label: adRequest.status, variant: "outline" as const }
  const imageUrl = adRequest.base_ad_creative.feed_image_url ?? adRequest.base_ad_creative.story_image_url

  const loadInsights = async (selection: PeriodSelection) => {
    if (!metaPublication) return

    setIsLoading(true)
    setError(null)

    const preset = selection.preset === "custom" ? undefined : selection.preset
    const range =
      selection.preset === "custom" ? { since: selection.since, until: selection.until } : undefined

    try {
      const aggResult = await getPlatformPublicationInsights(adRequest.id, metaPublication.id, preset, range)
      setInsights(aggResult)
    } catch {
      setError("Não foi possível carregar as estatísticas. Tente novamente.")
    }

    const dailyPeriod = preset === "maximum" ? "month" : "week"
    const [daily, ...breakdownResults] = await Promise.allSettled([
      getPlatformPublicationDailyInsights(
        adRequest.id, metaPublication.id, range ? undefined : dailyPeriod, undefined, range
      ),
      ...BREAKDOWN_DIMENSIONS.map((dimension) =>
        getPlatformPublicationBreakdownInsights(adRequest.id, metaPublication.id, dimension, preset, range)
      ),
    ])

    setDailyInsights(daily.status === "fulfilled" ? (daily.value as DailyInsightsEntry[]) : null)
    setBreakdowns(
      Object.fromEntries(
        BREAKDOWN_DIMENSIONS.map((dimension, i) => {
          const result = breakdownResults[i]
          return [dimension, result.status === "fulfilled" ? (result.value as BreakdownRow[]) : []]
        })
      )
    )

    setIsLoading(false)
  }

  useEffect(() => {
    loadInsights({ preset: "last_7d" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePresetChange = (preset: DatePreset) => {
    setPeriod({ preset })
    loadInsights({ preset })
  }

  const customRangeValid = Boolean(customRange?.from && customRange?.to)

  const handleApplyCustomRange = () => {
    if (!customRange?.from || !customRange?.to) return
    const selection: PeriodSelection = {
      preset: "custom",
      since: toIsoDateValue(customRange.from),
      until: toIsoDateValue(customRange.to),
    }
    setPeriod(selection)
    setPickerOpen(false)
    loadInsights(selection)
  }

  const periodLabel =
    period.preset === "custom"
      ? `${formatShortDate(period.since)} – ${formatShortDate(period.until)}`
      : DATE_PRESETS.find(({ key }) => key === period.preset)?.label ?? ""

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
            onClick={() => loadInsights(period)}
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
        <Popover
          open={pickerOpen}
          onOpenChange={(open) => {
            setPickerOpen(open)
            if (open) setPickerView("presets")
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full h-10 px-4 gap-2 font-semibold text-[13px] shrink-0">
              <CalendarRange className="size-4 text-primary" />
              {periodLabel}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-2">
            {pickerView === "presets" ? (
              <div className="flex min-w-44 flex-col">
                {DATE_PRESETS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setPickerOpen(false)
                      handlePresetChange(key)
                    }}
                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  >
                    {label}
                    {period.preset === key && <Check className="size-4 text-primary" />}
                  </button>
                ))}
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  onClick={() => setPickerView("custom")}
                  className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  Personalizado…
                  {period.preset === "custom" && <Check className="size-4 text-primary" />}
                </button>
              </div>
            ) : (
              <div className="p-1">
                <Calendar
                  mode="range"
                  selected={customRange}
                  onSelect={(range) => setCustomRange(range)}
                  defaultMonth={customRange?.from}
                  disabled={{ after: new Date() }}
                />
                <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="text-body-sm text-muted-foreground">
                    {customRange?.from && customRange?.to
                      ? `${formatDayMonth(customRange.from)} – ${formatDayMonth(customRange.to)}`
                      : customRange?.from
                        ? "Escolha a data final"
                        : "Escolha a data inicial"}
                  </span>
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={!customRangeValid || isLoading}
                    onClick={handleApplyCustomRange}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
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
              <section className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-[640px]:gap-2.5">
                <KpiHero impressions={insightsData.impressions} />
                <KpiCard
                  label="Alcance"
                  icon={<Users className="size-3.5" />}
                  value={formatBR(insightsData.reach)}
                  sub="pessoas únicas"
                />
                <KpiCard
                  label="Frequência"
                  icon={<Repeat className="size-3.5" />}
                  value={formatDecimalBR(insightsData.frequency, 1)}
                  sub="exibições por pessoa"
                />
                <KpiCard
                  label="Cliques"
                  icon={<MousePointerClick className="size-3.5" />}
                  value={formatBR(insightsData.clicks)}
                  sub="total de cliques"
                />
                <KpiCard
                  label="Cliques únicos"
                  icon={<MousePointerClick className="size-3.5" />}
                  value={formatBR(insightsData.unique_clicks)}
                  sub="pessoas que clicaram"
                />
                <KpiCard
                  label="Cliques no link"
                  icon={<Link2 className="size-3.5" />}
                  value={formatBR(insightsData.inline_link_clicks)}
                  sub="para seu site"
                />
                <KpiCard
                  label="CTR"
                  icon={<Percent className="size-3.5" />}
                  value={formatPercentBR(insightsData.ctr)}
                  sub="taxa de cliques"
                  help="Taxa de cliques: de cada 100 pessoas que viram o anúncio, quantas clicaram. Quanto maior, mais o anúncio está chamando atenção."
                />
                <KpiCard
                  label="CPC"
                  icon={<Coins className="size-3.5" />}
                  value={formatBRL(insightsData.cpc)}
                  sub="custo por clique"
                  help="Custo por clique: quanto você pagou, em média, por cada clique no anúncio. Quanto menor, melhor — significa que seu anúncio está atraindo cliques gastando pouco."
                />
                <KpiCard
                  label="Custo por visita"
                  icon={<Link2 className="size-3.5" />}
                  value={formatBRL(insightsData.cost_per_inline_link_click)}
                  sub="cliques para seu site"
                  help="Quanto você pagou, em média, por cada pessoa que clicou no link e visitou seu site ou landing page. É o custo de trazer alguém até você."
                />
                <KpiCard
                  label="CPM"
                  icon={<BarChart3 className="size-3.5" />}
                  value={formatBRL(insightsData.cpm)}
                  sub="custo por mil impressões"
                  help="Custo por mil impressões: quanto custa, em média, mostrar seu anúncio mil vezes. Ajuda a comparar se você está pagando caro ou barato para aparecer."
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
              <CollapsibleSection
                className="mt-4"
                title="Evolução diária"
                subtitle="Métrica por dia no período selecionado"
                collapsible={false}
              >
                <div className="p-6 max-[640px]:p-3">
                  {dailyInsights && dailyInsights.length > 1
                    ? <DailyChart data={dailyInsights} />
                    : <DailyChartEmpty />}
                </div>
              </CollapsibleSection>
              <EngagementSection actions={insightsData.actions ?? {}} />
              {insightsData.video && <VideoRetention video={insightsData.video} />}
              {(breakdowns.age_gender?.length || breakdowns.platform?.length) ? (
                <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
                  {breakdowns.age_gender && breakdowns.age_gender.length > 0 && (
                    <CollapsibleSection
                      title="Público por idade e gênero"
                      subtitle="Impressões por faixa etária"
                    >
                      <div className="p-6 max-[640px]:p-3">
                        <BreakdownAgeGender rows={breakdowns.age_gender} />
                      </div>
                    </CollapsibleSection>
                  )}
                  {breakdowns.platform && breakdowns.platform.length > 0 && (
                    <CollapsibleSection title="Plataformas" subtitle="Onde seu anúncio apareceu">
                      <div className="p-6 max-[640px]:p-3">
                        <BreakdownPlatform rows={breakdowns.platform} />
                      </div>
                    </CollapsibleSection>
                  )}
                </section>
              ) : null}
              {breakdowns.region && breakdowns.region.length > 0 && (
                <CollapsibleSection className="mt-4" title="Regiões" subtitle="Impressões por localização">
                  <div className="p-6 max-[640px]:p-3">
                    <BreakdownRegion rows={breakdowns.region} />
                  </div>
                </CollapsibleSection>
              )}
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

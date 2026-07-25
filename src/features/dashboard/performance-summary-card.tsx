import type { DashboardSummary } from "@/api/dashboard"
import { Skeleton } from "@/components/ui/skeleton"

type PerformanceSummaryCardProps = {
  summary: DashboardSummary | null
  isLoading: boolean
}

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const metricLabels = [
  { key: "impressions", label: "Impressões" },
  { key: "clicks", label: "Cliques" },
  { key: "cpc", label: "Custo por clique" },
  { key: "spend", label: "Investido" },
]

export const PerformanceSummaryCard = ({ summary, isLoading }: PerformanceSummaryCardProps) => {
  if (!isLoading && !summary) return null

  const cpc = summary && summary.clicks > 0 ? summary.spend / summary.clicks : null

  const metricValues: Record<string, string> = summary
    ? {
        impressions: summary.impressions.toLocaleString("pt-BR"),
        clicks: summary.clicks.toLocaleString("pt-BR"),
        cpc: cpc !== null ? formatBRL(cpc) : "—",
        spend: formatBRL(summary.spend),
      }
    : {}

  const metricBlocks = metricLabels.map(metric => (
    <div key={metric.key} className="min-w-0">
      <p className="text-[13px] text-muted-foreground">{metric.label}</p>
      {isLoading ? (
        <Skeleton className="mt-1.5 h-5 w-20" />
      ) : (
        <p className="mt-0.5 truncate font-quicksand text-lg font-bold tabular-nums text-primary">
          {metricValues[metric.key]}
        </p>
      )}
    </div>
  ))

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-ambient">
      <div className="px-6 py-4 max-[480px]:px-4">
        <h2 className="font-quicksand text-[17px] font-semibold text-foreground">
          Desempenho dos anúncios ativos
        </h2>
        {summary ? (
          <p className="text-[13px] text-muted-foreground">
            Últimos 7 dias · {summary.campaigns} campanha{summary.campaigns !== 1 ? "s" : ""} com
            veiculação
          </p>
        ) : (
          <p className="text-[13px] text-muted-foreground">Últimos 7 dias</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 border-t px-6 py-4 sm:grid-cols-4 max-[480px]:px-4">
        {metricBlocks}
      </div>
    </section>
  )
}

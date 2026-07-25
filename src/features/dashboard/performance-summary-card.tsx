import type { DashboardSummary } from "@/api/dashboard"

type PerformanceSummaryCardProps = {
  summary: DashboardSummary
}

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export const PerformanceSummaryCard = ({ summary }: PerformanceSummaryCardProps) => {
  const cpc = summary.clicks > 0 ? summary.spend / summary.clicks : null

  const metrics = [
    {
      key: "impressions",
      label: "Impressões",
      value: summary.impressions.toLocaleString("pt-BR"),
    },
    {
      key: "clicks",
      label: "Cliques",
      value: summary.clicks.toLocaleString("pt-BR"),
    },
    {
      key: "cpc",
      label: "Custo por clique",
      value: cpc !== null ? formatBRL(cpc) : "—",
    },
    {
      key: "spend",
      label: "Investido",
      value: formatBRL(summary.spend),
    },
  ]

  const metricBlocks = metrics.map(metric => (
    <div key={metric.key} className="min-w-0">
      <p className="text-[13px] text-muted-foreground">{metric.label}</p>
      <p className="mt-0.5 truncate font-quicksand text-lg font-bold tabular-nums text-primary">
        {metric.value}
      </p>
    </div>
  ))

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-ambient">
      <div className="px-6 py-4 max-[480px]:px-4">
        <h2 className="font-quicksand text-[17px] font-semibold text-foreground">
          Desempenho dos anúncios ativos
        </h2>
        <p className="text-[13px] text-muted-foreground">
          Últimos 7 dias · {summary.campaigns} campanha{summary.campaigns !== 1 ? "s" : ""} com
          veiculação
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t px-6 py-4 sm:grid-cols-4 max-[480px]:px-4">
        {metricBlocks}
      </div>
    </section>
  )
}

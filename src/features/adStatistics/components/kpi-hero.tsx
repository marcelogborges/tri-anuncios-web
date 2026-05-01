import { Eye } from "lucide-react"
import { formatBR } from "../formatters"

type KpiHeroProps = {
  impressions: number
}

export const KpiHero = ({ impressions }: KpiHeroProps) => {
  return (
    <article className="kpi-hero rounded-xl p-5 col-span-2 max-[480px]:col-span-1 shadow-lift">
      <div className="kpi-hero-label flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest mb-3">
        <div className="kpi-hero-icon size-7 rounded-lg flex items-center justify-center shrink-0">
          <Eye className="size-3.5" />
        </div>
        Impressões
      </div>
      <div className="font-quicksand text-5xl font-bold tracking-tight leading-none mb-1 tabular-nums max-[480px]:text-[2rem]">
        {formatBR(impressions)}
      </div>
      <div className="kpi-hero-sub text-[13px]">total de exibições</div>
    </article>
  )
}

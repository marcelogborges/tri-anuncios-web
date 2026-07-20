import { Eye } from "lucide-react"
import { formatBR } from "../formatters"

type KpiHeroProps = {
  impressions: number
}

export const KpiHero = ({ impressions }: KpiHeroProps) => {
  return (
    <article className="kpi-hero rounded-xl p-5 col-span-2 shadow-lift max-[640px]:p-3">
      <div className="kpi-hero-label flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest mb-3 max-[640px]:mb-1.5 max-[640px]:text-[10px]">
        <div className="kpi-hero-icon size-7 rounded-lg flex items-center justify-center shrink-0 max-[640px]:size-5">
          <Eye className="size-3.5 max-[640px]:size-3" />
        </div>
        Impressões
      </div>
      <div className="font-quicksand text-5xl font-bold tracking-tight leading-none mb-1 tabular-nums max-[640px]:text-[1.75rem] max-[640px]:mb-0">
        {formatBR(impressions)}
      </div>
      <div className="kpi-hero-sub text-[13px] max-[640px]:hidden">total de exibições</div>
    </article>
  )
}

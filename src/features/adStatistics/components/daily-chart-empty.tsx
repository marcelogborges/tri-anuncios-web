import { BarChart3 } from "lucide-react"

export const DailyChartEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
      <BarChart3 className="size-8 mb-2 opacity-30" />
      <p className="text-sm">Dados de evolução não disponíveis</p>
    </div>
  )
}

import type { InsightsData } from "@/api/platform-publication"

export const formatBR = (v: number) =>
  new Intl.NumberFormat("pt-BR").format(Math.round(v))

export const formatBRL = (v: number) =>
  "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatShortDate = (dateStr: string) => {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

export const isEmptyInsights = (
  data: InsightsData | Record<string, never>
): data is Record<string, never> => !data || Object.keys(data).length === 0

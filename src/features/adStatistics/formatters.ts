import type { InsightsData } from "@/api/platform-publication"
import { formatCurrencyBRL } from "@/lib/format"

export const formatBR = (v: number) =>
  new Intl.NumberFormat("pt-BR").format(Math.round(v))

export const formatBRL = formatCurrencyBRL

export const formatCompactBR = (v: number) => {
  if (v >= 1_000_000) return (v / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "M"
  if (v >= 1000) return (v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "k"
  return Math.round(v).toString()
}

export const formatPercentBR = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"

export const formatDecimalBR = (v: number, digits = 2) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })

export const formatShortDate = (dateStr: string) => {
  if (!dateStr) return ""
  const [, month, day] = dateStr.split("-")
  if (!month || !day) return dateStr
  return `${day}/${month}`
}

export const isEmptyInsights = (
  data: InsightsData | Record<string, never>
): data is Record<string, never> => !data || Object.keys(data).length === 0

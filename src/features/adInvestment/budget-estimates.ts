export type BudgetTierKey = "essencial" | "impulso" | "performance"

export type BudgetTier = {
  key: BudgetTierKey
  label: string
  min: number
  max: number
  step: number
  durations: number[]
}

export const BUDGET_MIN = 80
export const BUDGET_MAX = 2000

export const BUDGET_TIERS: BudgetTier[] = [
  { key: "essencial", label: "Essencial", min: 80, max: 350, step: 10, durations: [7] },
  { key: "impulso", label: "Impulso", min: 350, max: 800, step: 25, durations: [14] },
  { key: "performance", label: "Performance", min: 800, max: 2000, step: 50, durations: [14, 30] },
]

export const tierForAmount = (amount: number): BudgetTier => {
  if (amount < BUDGET_TIERS[1].min) return BUDGET_TIERS[0]
  if (amount < BUDGET_TIERS[2].min) return BUDGET_TIERS[1]
  return BUDGET_TIERS[2]
}

export const clampAmount = (amount: number) =>
  Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, Math.round(amount)))

export const snapAmount = (amount: number) => {
  const clamped = clampAmount(amount)
  const tier = tierForAmount(clamped)
  const snapped = tier.min + Math.round((clamped - tier.min) / tier.step) * tier.step
  return clampAmount(Math.min(snapped, tier.max))
}

export const TIER_FEATURES: Record<string, { duration: string; features: string[] }> = {
  essencial: {
    duration: "7 dias de campanha",
    features: [
      "Anúncio no Facebook e Instagram (feed, stories e reels)",
      "Texto e imagem com ajuda da IA",
      "Público otimizado automaticamente",
    ],
  },
  impulso: {
    duration: "14 dias de campanha",
    features: [
      "Tudo do Essencial",
      "3 variações de texto: a Meta mostra a que funciona melhor",
      "Mais tempo no ar para otimizar a entrega",
    ],
  },
  performance: {
    duration: "14 ou 30 dias — você escolhe",
    features: [
      "Tudo do Impulso",
      "Público ampliado com interesses do seu negócio",
      "Acompanhamento da entrega durante a campanha",
    ],
  },
}

export const NUDGE_GAP = 80

export const NUDGES = [
  { threshold: 350, feature: "liberar 3 variações de texto e 14 dias de campanha" },
  { threshold: 800, feature: "liberar público ampliado com interesses" },
]

export const TIER_SUMMARIES: Record<string, string> = {
  essencial: "anúncio no Facebook e Instagram com público otimizado.",
  impulso: "tudo do Essencial + 3 variações de texto e 14 dias.",
  performance: "tudo do Impulso + interesses e acompanhamento da entrega.",
}

export const formatCompactPeople = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`
  }
  return value.toLocaleString("pt-BR")
}

// Estimativas ilustrativas calibradas por CPM/CTR médios de tráfego broad no
// Brasil (Meta Ads). Última calibração: 2026-07 com valores de mercado —
// recalibrar com CPM/CTR observados nos insights das campanhas do Tri assim
// que houver volume (impressions/spend/ctr já vêm da API de estatísticas).
const CPM_LOW_BRL = 12
const CPM_HIGH_BRL = 30
const FREQUENCY = 1.8
const CTR_LOW = 0.009
const CTR_HIGH = 0.018

export type EstimateRange = { low: number; high: number }

const roundEstimate = (value: number) => {
  if (value <= 0) return 0
  const magnitude = 10 ** Math.max(0, Math.floor(Math.log10(value)) - 1)
  return Math.round(value / magnitude) * magnitude
}

export const estimateReach = (amount: number): EstimateRange => {
  const impressionsLow = (amount / CPM_HIGH_BRL) * 1000
  const impressionsHigh = (amount / CPM_LOW_BRL) * 1000
  return {
    low: roundEstimate(impressionsLow / FREQUENCY),
    high: roundEstimate(impressionsHigh / FREQUENCY),
  }
}

export const estimateClicks = (amount: number): EstimateRange => {
  const impressionsLow = (amount / CPM_HIGH_BRL) * 1000
  const impressionsHigh = (amount / CPM_LOW_BRL) * 1000
  return {
    low: roundEstimate(impressionsLow * CTR_LOW),
    high: roundEstimate(impressionsHigh * CTR_HIGH),
  }
}

"use client"

import { InvestmentPanel } from "@/features/adInvestment/investment-panel"
import type { AdInvestmentData } from "@/features/adCreationFlow/use-ad-creation-flow"

type Props = {
  initialValue: AdInvestmentData | null
  submitting?: boolean
  onSubmit: (data: AdInvestmentData & { scheduledStartAtIso: string | null }) => void
}

export const AdInvestmentStep = ({ initialValue, submitting, onSubmit }: Props) => (
  <InvestmentPanel
    eyebrow="PASSO 7 · INVESTIMENTO"
    initialAmountCents={initialValue?.amountCents ?? null}
    initialDurationDays={initialValue?.durationDays ?? null}
    submitting={submitting}
    onSubmit={onSubmit}
  />
)

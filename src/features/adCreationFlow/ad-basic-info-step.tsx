"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StepHeader } from "@/features/adCreationFlow/step-header"

export type AdBasicInfo = {
  name: string
  productService: string
}

type Props = {
  initialValues?: AdBasicInfo | null
  onComplete: (data: AdBasicInfo) => void
  onLiveChange?: (name: string) => void
}

const NAME_SUGGESTIONS = [
  "Promoção de Verão",
  "Lançamento de Produto",
  "Desconto Especial",
  "Novidades da Loja",
]

const PRODUCT_SUGGESTIONS = [
  "Hambúrguer artesanal",
  "Serviços de estética",
  "Consultoria especializada",
  "Produtos naturais",
]

export const AdBasicInfoStep = ({ initialValues, onComplete, onLiveChange }: Props) => {
  const [name, setName] = useState(initialValues?.name ?? "")
  const [productService, setProductService] = useState(initialValues?.productService ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ name, productService })
  }

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-8">
      <StepHeader
        eyebrow="PASSO 1 · BÁSICO"
        title="Sobre o seu anúncio"
        subtitle="Dê um nome para identificar este anúncio e nos conte o que você quer divulgar."
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor="adName" className="text-base font-semibold text-primary">
              Título do anúncio
            </label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {name.length} / 60
            </span>
          </div>
          <Input
            id="adName"
            type="text"
            placeholder="Ex: Promoção de Inverno"
            value={name}
            onChange={(e) => { setName(e.target.value); onLiveChange?.(e.target.value) }}
            className="h-12 text-base rounded-md focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--primary-soft)] focus-visible:border-primary"
            required
          />
          <div className="mt-1 flex flex-wrap gap-1.5">
            {NAME_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setName(s); onLiveChange?.(s) }}
                className="rounded-full border border-dashed border-border-strong bg-muted px-3 py-1 text-label-caps text-muted-foreground transition-colors hover:border-primary hover:bg-[var(--primary-soft)] hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor="productService" className="text-base font-semibold text-primary">
              Produto ou serviço anunciado
            </label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {productService.length} / 60
            </span>
          </div>
          <Input
            id="productService"
            type="text"
            placeholder="Ex: Hambúrguer artesanal, Consultoria"
            value={productService}
            onChange={(e) => setProductService(e.target.value)}
            className="h-12 text-base rounded-md focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--primary-soft)] focus-visible:border-primary"
            required
          />
          <div className="mt-1 flex flex-wrap gap-1.5">
            {PRODUCT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setProductService(s)}
                className="rounded-full border border-dashed border-border-strong bg-muted px-3 py-1 text-label-caps text-muted-foreground transition-colors hover:border-primary hover:bg-[var(--primary-soft)] hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={!name.trim() || !productService.trim()}
        >
          Continuar
        </Button>
      </form>
    </div>
  )
}

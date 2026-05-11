"use client"

import { useState } from "react"
import { Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StepHeader } from "@/features/adCreationFlow/step-header"
import { generateCopy } from "@/api/base-ad-creative"
import type { CopyInputs, GeneratedCopyVariation } from "@/api/base-ad-creative"

type Mode = "manual" | "assisted"

type AssistStatus = "idle" | "loading" | "done" | "error"

type Props = {
  initialValue?: string | null
  onComplete: (message: string) => void
  onLiveChange?: (message: string) => void
  adName?: string
  adProductService?: string
}

const SUGGESTIONS = [
  "Vista seu estilo! Frete grátis para todo o Brasil. Aproveite a promoção.",
  "Agende agora e ganhe desconto especial. Atendimento personalizado para você.",
  "Produto natural, qualidade garantida. Peça já e receba em casa.",
]

const ANGLE_LABELS: Record<GeneratedCopyVariation["angle"], string> = {
  dor: "Dor",
  resultado: "Resultado",
  oferta: "Oferta",
}

const ASSIST_FIELDS: Array<{ key: keyof CopyInputs; label: string; placeholder: string }> = [
  {
    key: "hook",
    label: "O que chama atenção do seu cliente?",
    placeholder: "Ex: Cansado de pagar caro por isso?",
  },
  {
    key: "benefit",
    label: "O que seu produto/serviço resolve?",
    placeholder: "Ex: Economize tempo sem abrir mão da qualidade.",
  },
  {
    key: "proof",
    label: "Por que as pessoas confiam em você?",
    placeholder: "Ex: Mais de 500 clientes, nota 5 no Google.",
  },
  {
    key: "offer",
    label: "Qual é a promoção ou vantagem especial?",
    placeholder: "Ex: Frete grátis, consulta gratuita.",
  },
  {
    key: "cta",
    label: "O que você quer que o cliente faça agora?",
    placeholder: "Ex: Peça um orçamento, Compre agora.",
  },
]

export const AdMessageStep = ({
  initialValue,
  onComplete,
  onLiveChange,
  adName,
  adProductService,
}: Props) => {
  const [mode, setMode] = useState<Mode>("manual")
  const [message, setMessage] = useState(initialValue ?? "")
  const [assistInputs, setAssistInputs] = useState<CopyInputs>({})
  const [variations, setVariations] = useState<GeneratedCopyVariation[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [assistStatus, setAssistStatus] = useState<AssistStatus>("idle")

  const handleMessageChange = (value: string) => {
    setMessage(value)
    onLiveChange?.(value)
  }

  const handleFieldChange = (key: keyof CopyInputs, value: string) => {
    setAssistInputs((prev) => ({ ...prev, [key]: value }))
  }

  const filledCount = Object.values(assistInputs).filter((v) => v && v.trim().length > 0).length

  const canGenerate = filledCount >= 3

  const handleGenerate = async () => {
    setAssistStatus("loading")
    setVariations([])
    setSelectedIndex(null)
    try {
      const result = await generateCopy({
        ...assistInputs,
        name: adName,
        product_service: adProductService,
      })
      setVariations(result)
      setAssistStatus("done")
    } catch {
      setAssistStatus("error")
    }
  }

  const handleSelectVariation = (index: number) => {
    setSelectedIndex(index)
    const text = variations[index].text
    setMessage(text)
    onLiveChange?.(text)
  }

  const handleGenerateAgain = () => {
    setAssistStatus("idle")
    setVariations([])
    setSelectedIndex(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(message)
  }

  const isIdle = assistStatus === "idle" || assistStatus === "error"

  const isLoading = assistStatus === "loading"

  const showVariations = assistStatus === "done" && selectedIndex === null

  const showEditor = selectedIndex !== null

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-8">
      <StepHeader
        eyebrow="PASSO 3 · MENSAGEM"
        title="Qual é a mensagem do seu anúncio?"
        subtitle="Escreva manualmente ou deixe a IA te ajudar a criar um texto de alta conversão."
      />
      <div className="mb-6 flex gap-1 rounded-full bg-muted p-1">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "manual"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Escrever manualmente
        </button>
        <button
          type="button"
          onClick={() => setMode("assisted")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "assisted"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Gerar com auxílio
        </button>
      </div>
      {mode === "manual" && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="adMessage" className="text-base font-semibold text-primary">
                Mensagem principal
              </label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {message.length} / 150
              </span>
            </div>
            <Textarea
              id="adMessage"
              placeholder="Ex: Vista seu estilo! Camisetas e bonés com frete grátis. Aproveite a promoção de inverno."
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              className="min-h-[120px] resize-none rounded-xl focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--primary-soft)] focus-visible:border-primary"
              required
            />
            <div className="mt-1 flex flex-col gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleMessageChange(s)}
                  className="rounded-md border border-dashed border-border-strong bg-muted px-3 py-2 text-left text-label-caps text-muted-foreground transition-colors hover:border-primary hover:bg-[var(--primary-soft)] hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={!message.trim()}>
            Continuar
          </Button>
        </form>
      )}
      {mode === "assisted" && (
        <div className="flex flex-col gap-6">
          {isIdle && (
            <div className="flex flex-col gap-4">
              {ASSIST_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">{label}</label>
                  <Input
                    value={assistInputs[key] ?? ""}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    placeholder={placeholder}
                    className="rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--primary-soft)] focus-visible:border-primary"
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                {filledCount}/5 respondidos — preencha pelo menos 3 para gerar
              </p>
              {assistStatus === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                  <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-sm text-destructive">
                    Não conseguimos gerar sugestões agora.
                  </span>
                  <span className="ml-auto text-sm text-muted-foreground">Tente novamente.</span>
                </div>
              )}
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full rounded-full"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Gerar sugestões
              </Button>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col gap-3">
              <p className="text-center text-sm text-muted-foreground">Gerando sugestões...</p>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl border border-border bg-muted"
                />
              ))}
            </div>
          )}
          {showVariations && (
            <div className="flex flex-col gap-3">
              {variations.map((v, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectVariation(i)}
                  className="cursor-pointer rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {ANGLE_LABELS[v.angle]}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm text-foreground">{v.text}</p>
                  <button
                    type="button"
                    className="mt-2 text-xs text-primary underline hover:no-underline"
                  >
                    Usar este texto
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleGenerateAgain}
                className="text-center text-xs text-muted-foreground underline hover:text-foreground"
              >
                Gerar novamente
              </button>
            </div>
          )}
          {showEditor && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <label className="text-sm font-semibold text-foreground">
                    Edite se quiser ajustar
                  </label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {message.length} / 150
                  </span>
                </div>
                <Textarea
                  value={message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  className="min-h-[120px] resize-none rounded-xl focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--primary-soft)] focus-visible:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateAgain}
                  className="self-start text-xs text-muted-foreground underline hover:text-foreground"
                >
                  Gerar novamente
                </button>
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={!message.trim()}>
                Continuar
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

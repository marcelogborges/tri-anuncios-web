"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import type { AdImageData } from "@/features/adCreationFlow/use-ad-creation-flow"
import { StepHeader } from "@/features/adCreationFlow/step-header"
import { AdImageUpload } from "@/features/adCreationFlow/ad-image-upload"
import { AdImageGenerate } from "@/features/adCreationFlow/ad-image-generate"

type Mode = "upload" | "generate"

type Props = {
  initialValue?: AdImageData | null
  onComplete: (image: AdImageData, feedFile: File | null, storyFile: File | null) => void
  onLiveChange?: (feedUrl: string | null, storyUrl: string | null) => void
  adMessage?: string | null
  adName?: string
  adProductService?: string
}

export const AdImageStep = ({
  initialValue,
  onComplete,
  onLiveChange,
  adMessage,
  adName,
  adProductService,
}: Props) => {
  const [mode, setMode] = useState<Mode>(initialValue?.type === "generated" ? "generate" : "upload")

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-8">
      <StepHeader eyebrow="PASSO 3 · CRIATIVO" title="Escolha a imagem do anúncio" />
      <div className="mb-6 flex gap-1 rounded-full bg-muted p-1">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "upload"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Adicionar imagem pronta
        </button>
        <button
          type="button"
          onClick={() => setMode("generate")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "generate"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Gerar imagem
        </button>
      </div>
      {mode === "upload" ? (
        <AdImageUpload
          initialValue={initialValue}
          onComplete={onComplete}
          onLiveChange={onLiveChange}
        />
      ) : (
        <AdImageGenerate
          initialValue={initialValue}
          onComplete={(image, file) => onComplete(image, file, null)}
          onLiveChange={onLiveChange}
          adMessage={adMessage}
          adName={adName}
          adProductService={adProductService}
        />
      )}
    </div>
  )
}

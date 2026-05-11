"use client"

import { useRef, useState } from "react"
import { ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AdImageData } from "@/features/adCreationFlow/use-ad-creation-flow"
import { generateImage } from "@/api/base-ad-creative"
import type { GenerateImageInputs } from "@/api/base-ad-creative"

type GenerateStatus = "idle" | "loading" | "done" | "error"

type StyleOption = {
  key: "professional" | "vibrant" | "natural"
  name: string
  description: string
}

const STYLE_OPTIONS: StyleOption[] = [
  { key: "professional", name: "Profissional", description: "Fundo limpo, iluminação de estúdio, visual corporativo" },
  { key: "vibrant", name: "Vibrante", description: "Cores vivas, composição dinâmica, energia jovem" },
  { key: "natural", name: "Natural", description: "Luz natural, cenário real, tom autêntico" },
]

const dataUrlToFile = (dataUrl: string, fileName: string): File => {
  const [header, data] = dataUrl.split(",")
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png"
  const bytes = atob(data)
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new File([arr], fileName, { type: mime })
}

type Props = {
  initialValue?: AdImageData | null
  onComplete: (image: AdImageData, file: File) => void
  onLiveChange?: (feedUrl: string | null, storyUrl: string | null) => void
  adMessage?: string | null
  adName?: string
  adProductService?: string
}

export const AdImageGenerate = ({
  initialValue,
  onComplete,
  onLiveChange,
  adMessage,
  adName,
  adProductService,
}: Props) => {
  const productInputRef = useRef<HTMLInputElement>(null)
  const [productFile, setProductFile] = useState<File | null>(null)
  const [productPreviewUrl, setProductPreviewUrl] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<"professional" | "vibrant" | "natural" | null>(null)
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>(
    initialValue?.type === "generated" ? "done" : "idle"
  )
  const [generatedDataUrl, setGeneratedDataUrl] = useState<string | null>(
    initialValue?.type === "generated" ? initialValue.dataUrl : null
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const prevProductUrlRef = useRef<string | null>(null)

  const handleProductFileSelect = (file: File) => {
    if (prevProductUrlRef.current) URL.revokeObjectURL(prevProductUrlRef.current)
    const url = URL.createObjectURL(file)
    prevProductUrlRef.current = url
    setProductFile(file)
    setProductPreviewUrl(url)
  }

  const handleGenerate = async () => {
    if (!productFile || !selectedStyle) return
    setGenerateStatus("loading")
    setErrorMessage(null)
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(",")[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(productFile)
      })
      const inputs: GenerateImageInputs = {
        productImage: base64,
        adText: adMessage ?? "",
        adName: adName ?? "",
        productService: adProductService,
        style: selectedStyle,
      }
      const dataUrl = await generateImage(inputs)
      setGeneratedDataUrl(dataUrl)
      setGenerateStatus("done")
      onLiveChange?.(dataUrl, null)
    } catch {
      setGenerateStatus("error")
      setErrorMessage("Não foi possível gerar a imagem. Tente novamente.")
    }
  }

  const handleRegenerate = () => {
    setGenerateStatus("idle")
    setGeneratedDataUrl(null)
    setErrorMessage(null)
    onLiveChange?.(null, null)
  }

  const handleSubmit = () => {
    if (!generatedDataUrl) return
    const file = dataUrlToFile(generatedDataUrl, "generated-ad-image.png")
    const image: AdImageData = { type: "generated", dataUrl: generatedDataUrl }
    onComplete(image, file)
  }

  if (generateStatus === "loading") {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-52 w-full rounded-lg bg-muted animate-pulse" />
        <div className="h-10 w-full rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  if (generateStatus === "done" && generatedDataUrl) {
    return (
      <div className="flex flex-col gap-4">
        <img
          src={generatedDataUrl}
          alt="Imagem gerada"
          className="w-full rounded-lg object-contain max-h-64"
        />
        <Button className="w-full rounded-full" onClick={handleSubmit}>
          Usar esta imagem
        </Button>
        <div className="text-center">
          <button
            type="button"
            onClick={handleRegenerate}
            className="text-label-caps text-muted-foreground underline hover:text-foreground transition-colors"
          >
            Gerar novamente
          </button>
        </div>
      </div>
    )
  }

  if (generateStatus === "error") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-body-sm text-destructive text-center">{errorMessage}</p>
        <Button className="w-full rounded-full" onClick={handleRegenerate}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-body-sm font-semibold mb-2">Foto do produto</p>
        <div
          onClick={() => !productPreviewUrl && productInputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault()
            const dropped = e.dataTransfer.files?.[0]
            if (dropped && dropped.type.startsWith("image/")) handleProductFileSelect(dropped)
          }}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-4 transition-colors",
            productPreviewUrl
              ? "border-primary bg-[var(--primary-soft)] cursor-default"
              : "cursor-pointer hover:border-primary hover:bg-[var(--primary-soft)]"
          )}
        >
          {productPreviewUrl ? (
            <>
              <img src={productPreviewUrl} alt="Foto do produto" className="max-h-32 w-full rounded-md object-contain" />
              <p className="text-label-caps text-muted-foreground">{productFile?.name}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); if (prevProductUrlRef.current) { URL.revokeObjectURL(prevProductUrlRef.current); prevProductUrlRef.current = null } setProductFile(null); setProductPreviewUrl(null) }}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <>
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <p className="text-body-sm font-semibold">Clique ou arraste a foto do produto</p>
              <p className="text-label-caps text-muted-foreground">PNG ou JPEG</p>
            </>
          )}
        </div>
        <input
          ref={productInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProductFileSelect(f) }}
        />
      </div>
      <div>
        <p className="text-body-sm font-semibold mb-3">Estilo visual</p>
        <div className="grid grid-cols-3 gap-3">
          {STYLE_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSelectedStyle(option.key)}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors",
                selectedStyle === option.key
                  ? "border-primary bg-[var(--primary-soft)]"
                  : "border-border bg-card hover:border-primary hover:bg-[var(--primary-soft)]"
              )}
            >
              <p className="text-body-sm font-semibold">{option.name}</p>
              <p className="text-label-caps text-muted-foreground mt-1">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
      <Button
        className="w-full rounded-full"
        disabled={!productFile || !selectedStyle}
        onClick={handleGenerate}
      >
        Gerar imagem
      </Button>
    </div>
  )
}

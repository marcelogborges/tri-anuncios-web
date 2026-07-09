"use client"

import { useState } from "react"
import { Clapperboard, GalleryHorizontalEnd, ImageIcon, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdImageData } from "@/features/adCreationFlow/use-ad-creation-flow"
import { StepHeader } from "@/features/adCreationFlow/step-header"
import { AdImageUpload } from "@/features/adCreationFlow/ad-image-upload"
import { AdImageGenerate } from "@/features/adCreationFlow/ad-image-generate"
import { AdVideoUpload } from "@/features/adCreationFlow/ad-video-upload"
import type { AdVideoFiles } from "@/features/adCreationFlow/ad-video-upload"
import { AdCarouselUpload } from "@/features/adCreationFlow/ad-carousel-upload"
import type { CarouselFiles } from "@/features/adCreationFlow/ad-carousel-upload"

export type AdMediaKind = "image" | "video" | "carousel"
type ImageMode = "upload" | "generate"

export type AdMediaFiles = {
  feed?: File | null
  story?: File | null
  video?: AdVideoFiles
  carousel?: CarouselFiles
}

export type AdMediaLivePreview = {
  feedUrl?: string | null
  storyUrl?: string | null
  videoUrl?: string | null
  carousel?: Array<{ imageUrl: string; headline?: string }>
}

type Props = {
  initialValue?: AdImageData | null
  onComplete: (media: AdImageData, files: AdMediaFiles) => void
  onLiveChange?: (preview: AdMediaLivePreview) => void
  adMessage?: string | null
  adName?: string
  adProductService?: string
}

const MEDIA_OPTIONS: Array<{ kind: AdMediaKind; label: string; description: string; icon: typeof ImageIcon }> = [
  { kind: "image", label: "Imagem", description: "Uma foto no feed e stories", icon: ImageIcon },
  { kind: "video", label: "Vídeo", description: "MP4, MOV ou WebM", icon: Clapperboard },
  { kind: "carousel", label: "Carrossel", description: "2 a 10 cartões com link", icon: GalleryHorizontalEnd },
]

const kindFromInitial = (initial?: AdImageData | null): AdMediaKind => {
  if (initial?.type === "video") return "video"
  if (initial?.type === "carousel") return "carousel"
  return "image"
}

export const AdMediaStep = ({
  initialValue,
  onComplete,
  onLiveChange,
  adMessage,
  adName,
  adProductService,
}: Props) => {
  const [kind, setKind] = useState<AdMediaKind>(kindFromInitial(initialValue))
  const [imageMode, setImageMode] = useState<ImageMode>(
    initialValue?.type === "generated" ? "generate" : "upload"
  )

  const handleKindChange = (next: AdMediaKind) => {
    setKind(next)
    // clears the side preview so a leftover image/video from another kind never lingers
    onLiveChange?.({})
  }

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-8">
      <StepHeader eyebrow="PASSO 3 · CRIATIVO" title="Escolha a mídia do anúncio" />

      <div className="mb-6 grid grid-cols-3 gap-2">
        {MEDIA_OPTIONS.map(({ kind: optionKind, label, description, icon: Icon }) => {
          const active = kind === optionKind
          return (
            <button
              key={optionKind}
              type="button"
              onClick={() => handleKindChange(optionKind)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-4 text-center transition-colors",
                active
                  ? "border-primary bg-[var(--primary-soft)] text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-body-sm font-semibold">{label}</span>
              <span className="text-label-caps">{description}</span>
            </button>
          )
        })}
      </div>

      {kind === "image" && (
        <>
          <div className="mb-6 flex gap-1 rounded-full bg-muted p-1">
            <button
              type="button"
              onClick={() => setImageMode("upload")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                imageMode === "upload"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Adicionar imagem pronta
            </button>
            <button
              type="button"
              onClick={() => setImageMode("generate")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                imageMode === "generate"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Gerar imagem
            </button>
          </div>
          {imageMode === "upload" ? (
            <AdImageUpload
              initialValue={initialValue}
              onComplete={(media, feedFile, storyFile) => onComplete(media, { feed: feedFile, story: storyFile })}
              onLiveChange={(feedUrl, storyUrl) => onLiveChange?.({ feedUrl, storyUrl })}
            />
          ) : (
            <AdImageGenerate
              initialValue={initialValue}
              onComplete={(media, file) => onComplete(media, { feed: file, story: null })}
              onLiveChange={(feedUrl, storyUrl) => onLiveChange?.({ feedUrl, storyUrl })}
              adMessage={adMessage}
              adName={adName}
              adProductService={adProductService}
            />
          )}
        </>
      )}

      {kind === "video" && (
        <AdVideoUpload
          initialValue={initialValue}
          onComplete={(media, files) => onComplete(media, { video: files })}
          onLiveChange={(videoUrl, thumbUrl) => onLiveChange?.({ videoUrl, feedUrl: thumbUrl })}
        />
      )}

      {kind === "carousel" && (
        <AdCarouselUpload
          initialValue={initialValue}
          onComplete={(media, files) => onComplete(media, { carousel: files })}
          onLiveChange={(cards) => onLiveChange?.({ carousel: cards })}
        />
      )}
    </div>
  )
}

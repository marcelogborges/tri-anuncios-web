"use client"

import { useRef, useState } from "react"
import { Clapperboard, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AdImageData } from "@/features/adCreationFlow/use-ad-creation-flow"
import { ImageSlot } from "@/features/adCreationFlow/image-slot"

const ACCEPTED_VIDEO_TYPES = "video/mp4,video/quicktime,video/webm"
const MAX_VIDEO_BYTES = 500 * 1024 * 1024

export type AdVideoFiles = {
  video: File | null
  thumb: File | null
}

type Props = {
  initialValue?: AdImageData | null
  onComplete: (media: AdImageData, files: AdVideoFiles) => void
  onLiveChange?: (videoUrl: string | null, thumbUrl: string | null) => void
}

export const AdVideoUpload = ({ initialValue, onComplete, onLiveChange }: Props) => {
  const initial = initialValue?.type === "video" ? initialValue : null
  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(initial?.videoPreviewUrl ?? null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState<string | null>(initial?.thumbPreviewUrl ?? null)
  const [videoError, setVideoError] = useState<string | null>(null)

  const prevVideoUrlRef = useRef<string | null>(null)
  const prevThumbUrlRef = useRef<string | null>(null)

  const handleVideoSelect = (file: File) => {
    if (file.size > MAX_VIDEO_BYTES) {
      setVideoError("O vídeo deve ter menos de 500MB.")
      return
    }
    setVideoError(null)
    if (prevVideoUrlRef.current) URL.revokeObjectURL(prevVideoUrlRef.current)
    const url = URL.createObjectURL(file)
    prevVideoUrlRef.current = url
    setVideoFile(file)
    setVideoPreviewUrl(url)
    onLiveChange?.(url, thumbPreviewUrl)
  }

  const handleThumbSelect = (file: File) => {
    if (prevThumbUrlRef.current) URL.revokeObjectURL(prevThumbUrlRef.current)
    const url = URL.createObjectURL(file)
    prevThumbUrlRef.current = url
    setThumbFile(file)
    setThumbPreviewUrl(url)
    onLiveChange?.(videoPreviewUrl, url)
  }

  const handleClearVideo = () => {
    if (prevVideoUrlRef.current) URL.revokeObjectURL(prevVideoUrlRef.current)
    prevVideoUrlRef.current = null
    setVideoFile(null)
    setVideoPreviewUrl(null)
    onLiveChange?.(null, thumbPreviewUrl)
  }

  const handleClearThumb = () => {
    if (prevThumbUrlRef.current) URL.revokeObjectURL(prevThumbUrlRef.current)
    prevThumbUrlRef.current = null
    setThumbFile(null)
    setThumbPreviewUrl(null)
    onLiveChange?.(videoPreviewUrl, null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoPreviewUrl || !thumbPreviewUrl) return
    onComplete(
      {
        type: "video",
        videoFileName: videoFile?.name ?? initial?.videoFileName ?? "",
        videoPreviewUrl,
        thumbFileName: thumbFile?.name ?? initial?.thumbFileName ?? "",
        thumbPreviewUrl,
      },
      { video: videoFile, thumb: thumbFile }
    )
  }

  const canSubmit =
    (videoFile !== null || (initial !== null && videoPreviewUrl !== null)) &&
    (thumbFile !== null || (initial !== null && thumbPreviewUrl !== null))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-body-sm font-semibold">Vídeo</span>
          <span className="text-label-caps text-muted-foreground">MP4, MOV ou WebM · até 500MB</span>
        </div>
        {videoPreviewUrl ? (
          <div className="relative overflow-hidden rounded-lg border border-border bg-black">
            <video
              src={videoPreviewUrl}
              className="mx-auto max-h-64 w-full object-contain"
              controls
              muted
              playsInline
            />
            <button
              type="button"
              onClick={handleClearVideo}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
              aria-label="Remover vídeo"
            >
              <X className="h-4 w-4" />
            </button>
            {videoFile && (
              <p className="border-t border-border bg-card px-3 py-2 text-label-caps text-muted-foreground">
                {videoFile.name}
              </p>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-muted px-6 py-10 text-muted-foreground transition-colors hover:border-primary hover:bg-[var(--primary-soft)]"
          >
            <Clapperboard className="h-7 w-7" />
            <span className="text-body-sm font-semibold">Enviar vídeo</span>
            <span className="text-label-caps">Clique para escolher o arquivo</span>
          </button>
        )}
        {videoError && <p className="text-label-caps text-destructive">{videoError}</p>}
        <input
          ref={videoInputRef}
          type="file"
          accept={ACCEPTED_VIDEO_TYPES}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleVideoSelect(file)
            e.target.value = ""
          }}
        />
      </div>

      <ImageSlot
        label="Capa do vídeo"
        dimensions="imagem exibida antes do play · obrigatória"
        file={thumbFile}
        previewUrl={thumbPreviewUrl}
        inputRef={thumbInputRef}
        onFileSelect={handleThumbSelect}
        onClear={handleClearThumb}
      />

      <Button type="submit" className="w-full rounded-full" disabled={!canSubmit}>
        Continuar
      </Button>
    </form>
  )
}

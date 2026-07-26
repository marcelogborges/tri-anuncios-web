"use client"

import { useRef, useState } from "react"
import { Clapperboard, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AdImageData } from "@/features/adCreationFlow/use-ad-creation-flow"
import { ImageSlot } from "@/features/adCreationFlow/image-slot"
import {
  ImageCropDialog,
  MIN_IMAGE_SIDE,
  cropSizeError,
  maxCropWidth,
  readImageDimensions,
  type CropTarget,
} from "@/features/adCreationFlow/image-crop-dialog"

const ACCEPTED_VIDEO_TYPES = "video/mp4,video/quicktime,video/webm"
const MAX_VIDEO_BYTES = 500 * 1024 * 1024
const STORY_MIN_RATIO = 1.5
const FEED_MIN_RATIO = 0.97
const FEED_MAX_RATIO = 1.83

const THUMB_CROP = { aspect: 1, outputWidth: 1080, outputHeight: 1080, title: "Recorte da capa (1:1)" } as const

export type AdVideoFiles = {
  video: File | null
  thumb: File | null
}

type VideoPlacement = "story" | "feed"

const readVideoDimensions = (file: File): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement("video")
    video.preload = "metadata"
    video.onloadedmetadata = () => {
      const dimensions = { width: video.videoWidth, height: video.videoHeight }
      URL.revokeObjectURL(url)
      resolve(dimensions)
    }
    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("video metadata unavailable"))
    }
    video.src = url
  })

const classifyVideo = (width: number, height: number): VideoPlacement | null => {
  if (width === 0 || height === 0) return null
  if (height / width >= STORY_MIN_RATIO) return "story"
  const ratio = width / height
  if (ratio >= FEED_MIN_RATIO && ratio <= FEED_MAX_RATIO) return "feed"
  return null
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
  const [thumbError, setThumbError] = useState<string | null>(null)
  const [placement, setPlacement] = useState<VideoPlacement | null>(null)
  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null)

  const prevVideoUrlRef = useRef<string | null>(null)
  const prevThumbUrlRef = useRef<string | null>(null)
  const cropSourceUrlRef = useRef<string | null>(null)

  const handleVideoSelect = async (file: File) => {
    if (file.size > MAX_VIDEO_BYTES) {
      setVideoError("O vídeo deve ter menos de 500MB.")
      return
    }
    let nextPlacement: VideoPlacement | null = null
    try {
      const { width, height } = await readVideoDimensions(file)
      nextPlacement = classifyVideo(width, height)
      if (!nextPlacement) {
        setVideoError("Formato não suportado — use vídeo quadrado (1:1), paisagem (16:9) ou vertical (9:16).")
        return
      }
    } catch {
      nextPlacement = null
    }
    setVideoError(null)
    setPlacement(nextPlacement)
    if (prevVideoUrlRef.current) URL.revokeObjectURL(prevVideoUrlRef.current)
    const url = URL.createObjectURL(file)
    prevVideoUrlRef.current = url
    setVideoFile(file)
    setVideoPreviewUrl(url)
    onLiveChange?.(url, thumbPreviewUrl)
  }

  const releaseCropSource = () => {
    if (cropSourceUrlRef.current) URL.revokeObjectURL(cropSourceUrlRef.current)
    cropSourceUrlRef.current = null
  }

  const handleThumbSelect = async (file: File) => {
    setThumbError(null)
    const { width, height } = await readImageDimensions(file)
    if (maxCropWidth(width, height, THUMB_CROP.aspect) < MIN_IMAGE_SIDE) {
      setThumbError(cropSizeError("1:1 da capa", THUMB_CROP.aspect))
      return
    }
    releaseCropSource()
    const sourceUrl = URL.createObjectURL(file)
    cropSourceUrlRef.current = sourceUrl
    setCropTarget({ sourceUrl, fileName: file.name, ...THUMB_CROP })
  }

  const applyCroppedThumb = (file: File) => {
    if (prevThumbUrlRef.current) URL.revokeObjectURL(prevThumbUrlRef.current)
    const url = URL.createObjectURL(file)
    prevThumbUrlRef.current = url
    setThumbFile(file)
    setThumbPreviewUrl(url)
    onLiveChange?.(videoPreviewUrl, url)
    releaseCropSource()
  }

  const handleCropOpenChange = (open: boolean) => {
    if (!open) {
      releaseCropSource()
      setCropTarget(null)
    }
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
        {!videoError && placement && (
          <p className="text-label-caps text-primary">
            {placement === "story" ? "Este vídeo vai veicular em Stories e Reels" : "Este vídeo vai veicular no Feed"}
          </p>
        )}
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
      {thumbError && <p className="text-label-caps text-destructive">{thumbError}</p>}

      <Button type="submit" className="w-full rounded-full" disabled={!canSubmit}>
        Continuar
      </Button>
      <ImageCropDialog target={cropTarget} onOpenChange={handleCropOpenChange} onCropped={applyCroppedThumb} />
    </form>
  )
}

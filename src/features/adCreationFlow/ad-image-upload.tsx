"use client"

import { useRef, useState } from "react"
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

type Props = {
  initialValue?: AdImageData | null
  onComplete: (image: AdImageData, feedFile: File | null, storyFile: File | null) => void
  onLiveChange?: (feedUrl: string | null, storyUrl: string | null) => void
}

type Slot = "feed" | "story"

const SLOT_CROP = {
  feed: { aspect: 1, outputWidth: 1080, outputHeight: 1080, title: "Recorte para o Feed (1:1)" },
  story: { aspect: 9 / 16, outputWidth: 1080, outputHeight: 1920, title: "Recorte para Stories e Reels (9:16)" },
} as const

export const AdImageUpload = ({ initialValue, onComplete, onLiveChange }: Props) => {
  const feedInputRef = useRef<HTMLInputElement>(null)
  const storyInputRef = useRef<HTMLInputElement>(null)
  const [feedFile, setFeedFile] = useState<File | null>(null)
  const [feedPreviewUrl, setFeedPreviewUrl] = useState<string | null>(
    initialValue?.type === "file" ? (initialValue.feedPreviewUrl ?? null) : null
  )
  const [storyFile, setStoryFile] = useState<File | null>(null)
  const [storyPreviewUrl, setStoryPreviewUrl] = useState<string | null>(
    initialValue?.type === "file" ? (initialValue.storyPreviewUrl ?? null) : null
  )
  const [cropSlot, setCropSlot] = useState<Slot | null>(null)
  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const prevFeedUrlRef = useRef<string | null>(null)
  const prevStoryUrlRef = useRef<string | null>(null)
  const cropSourceUrlRef = useRef<string | null>(null)

  const releaseCropSource = () => {
    if (cropSourceUrlRef.current) URL.revokeObjectURL(cropSourceUrlRef.current)
    cropSourceUrlRef.current = null
  }

  const openCrop = async (slot: Slot, file: File) => {
    setSizeError(null)
    const spec = SLOT_CROP[slot]
    const { width, height } = await readImageDimensions(file)
    if (maxCropWidth(width, height, spec.aspect) < MIN_IMAGE_SIDE) {
      setSizeError(cropSizeError(slot === "feed" ? "1:1" : "9:16", spec.aspect))
      return
    }
    releaseCropSource()
    const sourceUrl = URL.createObjectURL(file)
    cropSourceUrlRef.current = sourceUrl
    setCropSlot(slot)
    setCropTarget({ sourceUrl, fileName: file.name, ...spec })
  }

  const applyCropped = (file: File) => {
    const url = URL.createObjectURL(file)
    if (cropSlot === "feed") {
      if (prevFeedUrlRef.current) URL.revokeObjectURL(prevFeedUrlRef.current)
      prevFeedUrlRef.current = url
      setFeedFile(file)
      setFeedPreviewUrl(url)
      onLiveChange?.(url, storyPreviewUrl)
    }
    if (cropSlot === "story") {
      if (prevStoryUrlRef.current) URL.revokeObjectURL(prevStoryUrlRef.current)
      prevStoryUrlRef.current = url
      setStoryFile(file)
      setStoryPreviewUrl(url)
      onLiveChange?.(feedPreviewUrl, url)
    }
    releaseCropSource()
    setCropSlot(null)
  }

  const handleCropOpenChange = (open: boolean) => {
    if (!open) {
      releaseCropSource()
      setCropTarget(null)
      setCropSlot(null)
    }
  }

  const handleClearFeed = () => {
    if (prevFeedUrlRef.current) URL.revokeObjectURL(prevFeedUrlRef.current)
    prevFeedUrlRef.current = null
    setFeedFile(null)
    setFeedPreviewUrl(null)
    onLiveChange?.(null, storyPreviewUrl)
  }

  const handleClearStory = () => {
    if (prevStoryUrlRef.current) URL.revokeObjectURL(prevStoryUrlRef.current)
    prevStoryUrlRef.current = null
    setStoryFile(null)
    setStoryPreviewUrl(null)
    onLiveChange?.(feedPreviewUrl, null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedPreviewUrl && !storyPreviewUrl) return
    const image: AdImageData = {
      type: "file",
      feedFileName: feedFile?.name ?? (feedPreviewUrl ? (initialValue?.type === "file" ? initialValue.feedFileName : undefined) : undefined),
      feedPreviewUrl: feedPreviewUrl ?? undefined,
      storyFileName: storyFile?.name ?? (storyPreviewUrl ? (initialValue?.type === "file" ? initialValue.storyFileName : undefined) : undefined),
      storyPreviewUrl: storyPreviewUrl ?? undefined,
    }
    onComplete(image, feedFile, storyFile)
  }

  const canSubmit = feedPreviewUrl !== null || storyPreviewUrl !== null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <ImageSlot
        label="Feed"
        dimensions="1080 × 1080 px"
        file={feedFile}
        previewUrl={feedPreviewUrl}
        inputRef={feedInputRef}
        onFileSelect={(file) => openCrop("feed", file)}
        onClear={handleClearFeed}
      />
      <ImageSlot
        label="Story / Reels"
        dimensions="1080 × 1920 px"
        file={storyFile}
        previewUrl={storyPreviewUrl}
        inputRef={storyInputRef}
        onFileSelect={(file) => openCrop("story", file)}
        onClear={handleClearStory}
      />
      {sizeError && <p className="text-sm text-destructive">{sizeError}</p>}
      <p className="text-label-caps text-muted-foreground">
        Sem a imagem 1:1 o anúncio não aparece no feed; sem a 9:16, não aparece em Stories e Reels.
      </p>
      <Button type="submit" className="w-full rounded-full" disabled={!canSubmit}>
        Continuar
      </Button>
      <ImageCropDialog target={cropTarget} onOpenChange={handleCropOpenChange} onCropped={applyCropped} />
    </form>
  )
}

"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { AdImageData } from "@/features/adCreationFlow/use-ad-creation-flow"
import { ImageSlot } from "@/features/adCreationFlow/image-slot"

type Props = {
  initialValue?: AdImageData | null
  onComplete: (image: AdImageData, feedFile: File | null, storyFile: File | null) => void
  onLiveChange?: (feedUrl: string | null, storyUrl: string | null) => void
}

export const AdImageUpload = ({ initialValue, onComplete, onLiveChange }: Props) => {
  const feedInputRef = useRef<HTMLInputElement>(null)
  const storyInputRef = useRef<HTMLInputElement>(null)
  const [feedFile, setFeedFile] = useState<File | null>(null)
  const [feedPreviewUrl, setFeedPreviewUrl] = useState<string | null>(
    initialValue?.type === "file" ? initialValue.feedPreviewUrl : null
  )
  const [storyFile, setStoryFile] = useState<File | null>(null)
  const [storyPreviewUrl, setStoryPreviewUrl] = useState<string | null>(
    initialValue?.type === "file" ? (initialValue.storyPreviewUrl ?? null) : null
  )

  const prevFeedUrlRef = useRef<string | null>(null)
  const prevStoryUrlRef = useRef<string | null>(null)

  const handleFeedFileSelect = (file: File) => {
    if (prevFeedUrlRef.current) URL.revokeObjectURL(prevFeedUrlRef.current)
    const url = URL.createObjectURL(file)
    prevFeedUrlRef.current = url
    setFeedFile(file)
    setFeedPreviewUrl(url)
    onLiveChange?.(url, storyPreviewUrl)
  }

  const handleStoryFileSelect = (file: File) => {
    if (prevStoryUrlRef.current) URL.revokeObjectURL(prevStoryUrlRef.current)
    const url = URL.createObjectURL(file)
    prevStoryUrlRef.current = url
    setStoryFile(file)
    setStoryPreviewUrl(url)
    onLiveChange?.(feedPreviewUrl, url)
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
    if (!feedFile && !feedPreviewUrl) return
    const image: AdImageData = {
      type: "file",
      feedFileName: feedFile?.name ?? "",
      feedPreviewUrl: feedPreviewUrl ?? "",
      storyFileName: storyFile?.name,
      storyPreviewUrl: storyPreviewUrl ?? undefined,
    }
    onComplete(image, feedFile, storyFile)
  }

  const canSubmit = feedFile !== null || (initialValue?.type === "file" && feedPreviewUrl !== null)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <ImageSlot
        label="Feed"
        dimensions="1080 × 1080 px"
        file={feedFile}
        previewUrl={feedPreviewUrl}
        inputRef={feedInputRef}
        onFileSelect={handleFeedFileSelect}
        onClear={handleClearFeed}
      />
      <ImageSlot
        label="Story / Reels"
        dimensions="1080 × 1920 px · opcional"
        file={storyFile}
        previewUrl={storyPreviewUrl}
        inputRef={storyInputRef}
        onFileSelect={handleStoryFileSelect}
        onClear={handleClearStory}
      />
      <Button type="submit" className="w-full rounded-full" disabled={!canSubmit}>
        Continuar
      </Button>
    </form>
  )
}

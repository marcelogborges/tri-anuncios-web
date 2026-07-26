"use client"

import { useState } from "react"
import Cropper from "react-easy-crop"
import type { Area } from "react-easy-crop"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/features/adCreationFlow/crop-slider"

export const MIN_IMAGE_SIDE = 150

export type CropTarget = {
  sourceUrl: string
  fileName: string
  aspect: number
  outputWidth: number
  outputHeight: number
  title: string
}

type Props = {
  target: CropTarget | null
  onOpenChange: (open: boolean) => void
  onCropped: (file: File) => void
}

export const maxCropWidth = (width: number, height: number, aspect: number) =>
  Math.floor(Math.min(width, height * aspect))

export const cropSizeError = (formatLabel: string, aspect: number) => {
  const minWidth = MIN_IMAGE_SIDE
  const minHeight = Math.ceil(MIN_IMAGE_SIDE / aspect)
  return `Imagem muito pequena para o formato ${formatLabel}. Use uma foto com pelo menos ${minWidth}px de largura e ${minHeight}px de altura.`
}

export const readImageDimensions = async (file: File): Promise<{ width: number; height: number }> => {
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    return { width: image.naturalWidth, height: image.naturalHeight }
  } finally {
    URL.revokeObjectURL(url)
  }
}

const cropToFile = async (target: CropTarget, area: Area): Promise<File> => {
  const image = new Image()
  image.src = target.sourceUrl
  await image.decode()
  const width = Math.min(target.outputWidth, Math.round(area.width))
  const height = Math.round(width * (target.outputHeight / target.outputWidth))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("canvas 2d context unavailable")
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, width, height)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92))
  if (!blob) throw new Error("crop export failed")
  const baseName = target.fileName.replace(/\.[^.]+$/, "")
  return new File([blob], `${baseName}-${target.outputWidth}x${target.outputHeight}.jpg`, { type: "image/jpeg" })
}

export const ImageCropDialog = ({ target, onOpenChange, onCropped }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [exporting, setExporting] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedArea(null)
    }
    onOpenChange(open)
  }

  const handleConfirm = async () => {
    if (!target || !croppedArea) return
    setExporting(true)
    try {
      const file = await cropToFile(target, croppedArea)
      handleOpenChange(false)
      onCropped(file)
    } catch {
      handleOpenChange(false)
    } finally {
      setExporting(false)
    }
  }

  return (
    <Dialog open={target !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{target?.title ?? "Ajustar imagem"}</DialogTitle>
          <DialogDescription>
            Arraste para posicionar e use o zoom para enquadrar como no Instagram.
          </DialogDescription>
        </DialogHeader>
        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-muted">
          {target && (
            <Cropper
              image={target.sourceUrl}
              crop={crop}
              zoom={zoom}
              aspect={target.aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, areaPixels) => setCroppedArea(areaPixels)}
            />
          )}
        </div>
        <Slider value={zoom} min={1} max={3} step={0.05} onChange={setZoom} label="Zoom" />
        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="rounded-full" onClick={handleConfirm} disabled={!croppedArea || exporting}>
            {exporting ? "Recortando..." : "Usar recorte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ImageSlotProps = {
  label: string
  dimensions: string
  file: File | null
  previewUrl: string | null
  inputRef: React.RefObject<HTMLInputElement | null>
  onFileSelect: (file: File) => void
  onClear: () => void
}

export const ImageSlot = ({ label, dimensions, file, previewUrl, inputRef, onFileSelect, onClear }: ImageSlotProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-baseline justify-between">
      <p className="text-body-sm font-semibold">{label}</p>
      <p className="text-label-caps text-muted-foreground">{dimensions}</p>
    </div>
    <div
      onClick={() => !previewUrl && inputRef.current?.click()}
      onDrop={(e) => {
        e.preventDefault()
        const dropped = e.dataTransfer.files?.[0]
        if (dropped && dropped.type.startsWith("image/")) onFileSelect(dropped)
      }}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-5 transition-colors",
        previewUrl
          ? "border-primary bg-[var(--primary-soft)] cursor-default"
          : "cursor-pointer hover:border-primary hover:bg-[var(--primary-soft)]"
      )}
    >
      {previewUrl ? (
        <>
          <img src={previewUrl} alt={label} className="max-h-40 w-full rounded-md object-contain" />
          <p className="text-label-caps text-muted-foreground">{file?.name}</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear() }}
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <ImageIcon className="h-7 w-7 text-muted-foreground" />
          <div className="text-center">
            <p className="text-body-sm font-semibold">Clique ou arraste</p>
            <p className="text-label-caps text-muted-foreground mt-1">PNG, JPEG ou GIF · Máx. 30MB</p>
          </div>
        </>
      )}
    </div>
    <input
      ref={inputRef}
      type="file"
      accept="image/png,image/jpeg,image/gif"
      className="hidden"
      onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileSelect(f) }}
    />
  </div>
)

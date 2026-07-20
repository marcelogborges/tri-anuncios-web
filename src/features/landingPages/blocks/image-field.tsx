"use client"

import { useRef, useState } from "react"
import { FieldLabel } from "@measured/puck"

import { uploadLandingPageImage } from "@/api/landing-pages"

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
}

function ImageFieldInput({ label, value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { url } = await uploadLandingPageImage(file)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar imagem")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <FieldLabel label={label}>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ou envie do computador"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-60"
        >
          {uploading ? "Enviando..." : "Enviar do computador"}
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="max-h-24 w-full rounded-md border object-contain"
          />
        )}
      </div>
    </FieldLabel>
  )
}

export const imageField = (label: string) => ({
  type: "custom" as const,
  label,
  render: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <ImageFieldInput label={label} value={value} onChange={onChange} />
  ),
})

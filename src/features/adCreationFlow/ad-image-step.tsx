"use client"

import { useRef, useState, useEffect } from "react"
import { ImageIcon, LinkIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AdImageData } from "@/features/adCreationFlow/use-ad-creation-flow"

type Props = {
  initialValues?: AdImageData | null
  onComplete: (data: AdImageData, file?: File) => void
}

type Mode = "file" | "url"

export const AdImageStep = ({ initialValues, onComplete }: Props) => {
  const [mode, setMode] = useState<Mode>(
    initialValues?.type === "url" ? "url" : "file"
  )
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [url, setUrl] = useState(
    initialValues?.type === "url" ? initialValues.url : ""
  )
  const [urlError, setUrlError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (!dropped) return
    if (!dropped.type.startsWith("image/")) return
    setFile(dropped)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === "file" && file) {
      onComplete({ type: "file", fileName: file.name }, file)
      return
    }

    if (mode === "url") {
      try {
        new URL(url)
        onComplete({ type: "url", url })
      } catch {
        setUrlError("Insira uma URL válida")
      }
    }
  }

  const canSubmit =
    (mode === "file" && file !== null) ||
    (mode === "url" && url.trim().length > 0)

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-title-2">Imagem do Anúncio</CardTitle>
          <CardDescription className="text-body-md mt-2">
            Escolha uma imagem que represente o seu produto ou serviço.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex rounded-lg border p-1">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm transition-colors",
                mode === "file"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Upload className="h-4 w-4" />
              Enviar arquivo
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm transition-colors",
                mode === "url"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LinkIcon className="h-4 w-4" />
              Usar URL
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "file" ? (
              <>
                <div
                  onClick={() => inputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors",
                    "hover:border-primary hover:bg-muted/50",
                    file && "border-primary bg-muted/30"
                  )}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 w-full rounded-md object-contain"
                    />
                  ) : (
                    <>
                      <ImageIcon className="text-muted-foreground h-10 w-10" />
                      <div className="text-center">
                        <p className="text-body-sm font-medium">
                          Clique para selecionar
                        </p>
                        <p className="text-body-sm text-muted-foreground mt-1">
                          PNG, JPEG ou GIF · Máx. 30MB
                        </p>
                      </div>
                    </>
                  )}
                  {file && (
                    <p className="text-body-sm text-muted-foreground">
                      {file.name}
                    </p>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {initialValues?.type === "file" && !file && (
                  <p className="text-body-sm text-muted-foreground text-center">
                    Arquivo anterior: {initialValues.fileName}. Selecione novamente para usar.
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <label htmlFor="imageUrl" className="text-body-sm">
                  URL da imagem
                </label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    setUrlError("")
                  }}
                />
                {urlError && (
                  <p className="text-body-sm text-destructive">{urlError}</p>
                )}
                {url && !urlError && (
                  <img
                    src={url}
                    alt="Preview"
                    className="mt-2 max-h-48 w-full rounded-md object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                    onLoad={(e) => {
                      (e.target as HTMLImageElement).style.display = "block"
                    }}
                    style={{ display: "none" }}
                  />
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

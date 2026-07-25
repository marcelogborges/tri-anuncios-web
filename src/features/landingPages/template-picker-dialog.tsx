"use client"

import { useState } from "react"
import { Render } from "@measured/puck"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { landingPageConfig } from "./puck-config"
import { applyDynamicText } from "./dynamic-text"
import { LANDING_PAGE_TEMPLATES, type LandingPageTemplate } from "./templates"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string, template: LandingPageTemplate, slug: string) => Promise<void>
  orgSlug?: string
}

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

/** Live miniature of the template — the real page scaled down. */
function TemplateThumbnail({ template }: { template: LandingPageTemplate }) {
  // Empty params resolve {{param|fallback}} tokens to their fallbacks,
  // so template syntax never leaks into the gallery preview.
  const previewData = applyDynamicText(template.content, new URLSearchParams())
  return (
    <div className="pointer-events-none h-40 overflow-hidden bg-white" aria-hidden>
      <div style={{ width: "400%", transform: "scale(0.25)", transformOrigin: "top left" }}>
        <Render config={landingPageConfig} data={previewData} />
      </div>
    </div>
  )
}

export function TemplatePickerDialog({ open, onOpenChange, onCreate, orgSlug }: Props) {
  const [selected, setSelected] = useState<LandingPageTemplate>(LANDING_PAGE_TEMPLATES[0])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const templates = LANDING_PAGE_TEMPLATES

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  const handleSlugChange = (value: string) => {
    setSlugTouched(true)
    setSlug(slugify(value))
  }

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Dê um nome para a página.")
      return
    }
    if (!slug) {
      setError("Escolha o endereço da página.")
      return
    }
    setCreating(true)
    setError(null)
    try {
      await onCreate(name.trim(), selected, slug)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar página")
      setCreating(false)
    }
  }

  const urlPrefix = `${typeof window !== "undefined" ? window.location.host : ""}/${orgSlug ?? "sua-empresa"}/`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova página de vendas</DialogTitle>
          <DialogDescription>
            Comece por um modelo pronto para o seu segmento — tudo é editável depois.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3" data-testid="template-grid">
          {templates.map((template) => (
            // div+role instead of <button>: the live preview renders the
            // template's own buttons inside, and nested <button> is invalid HTML
            <div
              key={template.key}
              role="button"
              tabIndex={0}
              aria-pressed={selected.key === template.key}
              data-testid={`template-${template.key}`}
              onClick={() => setSelected(template)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setSelected(template)
                }
              }}
              className={cn(
                "cursor-pointer overflow-hidden rounded-lg border text-left transition-shadow",
                selected.key === template.key
                  ? "border-primary ring-2 ring-primary"
                  : "hover:shadow-lift",
              )}
            >
              <TemplateThumbnail template={template} />
              <div className="border-t p-3">
                <div className="text-sm font-semibold">{template.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{template.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-col gap-3">
          <label className="text-sm font-medium">
            Nome da página
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={`Ex: ${selected.name} — Campanha de agosto`}
              className="mt-1"
              data-testid="template-page-name"
            />
          </label>
          <label className="text-sm font-medium">
            Endereço da página
            <div className="mt-1 flex items-center gap-1">
              <span className="shrink-0 text-sm text-muted-foreground">{urlPrefix}</span>
              <Input
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="promocao-de-inverno"
                data-testid="template-page-slug"
              />
            </div>
          </label>
          <Button onClick={handleCreate} disabled={creating} className="self-end" data-testid="template-create">
            {creating ? "Criando..." : "Criar página"}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </DialogContent>
    </Dialog>
  )
}

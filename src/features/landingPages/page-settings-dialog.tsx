"use client"

import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAdRequests, type AdRequest } from "@/api/ad-request"
import {
  getMetaPixels,
  updateLandingPage,
  type LandingPage,
  type MetaPixel,
} from "@/api/landing-pages"

type Props = {
  page: LandingPage
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (page: LandingPage) => void
}

/**
 * Landing page settings: name, slug, Meta pixel (for conversion events)
 * and the ad that drives traffic to this page.
 */
export const PageSettingsDialog = ({ page, open, onOpenChange, onSaved }: Props) => {
  const [name, setName] = useState(page.name)
  const [slug, setSlug] = useState(page.slug)
  const [pixelId, setPixelId] = useState(page.meta_pixel_id ?? "")
  const [adRequestId, setAdRequestId] = useState<string>(page.ad_request_id?.toString() ?? "")
  const [pixels, setPixels] = useState<MetaPixel[] | null>(null)
  const [adRequests, setAdRequests] = useState<AdRequest[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const loadOptions = async () => {
      try {
        setPixels(await getMetaPixels())
      } catch {
        setPixels([])
      }
      try {
        setAdRequests(await getAdRequests())
      } catch {
        setAdRequests([])
      }
    }
    loadOptions()
  }, [open])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const updated = await updateLandingPage(page.id, {
        name,
        slug,
        meta_pixel_id: pixelId || null,
        ad_request_id: adRequestId ? Number(adRequestId) : null,
      })
      onSaved(updated)
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações da página</DialogTitle>
          <DialogDescription>
            Endereço, pixel de conversão e anúncio vinculado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Nome
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </label>

          <label className="block text-sm font-medium">
            Endereço (slug)
            <div className="mt-1 flex items-center gap-1">
              <span className="shrink-0 text-sm text-muted-foreground">
                {page.public_url.replace(/^https?:\/\//, "").replace(/[^/]+$/, "")}
              </span>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                data-testid="settings-slug"
              />
            </div>
          </label>

          <label className="block text-sm font-medium">
            Pixel da Meta (eventos de conversão)
            <select
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              data-testid="settings-pixel"
            >
              <option value="">Sem pixel</option>
              {pixels?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
              {pixelId && pixels && !pixels.some((p) => p.id === pixelId) && (
                <option value={pixelId}>{pixelId}</option>
              )}
            </select>
            {pixels !== null && pixels.length === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Nenhum pixel encontrado — conecte sua conta Meta em Configurações ou verifique se a
                conta de anúncios tem um pixel criado. Ao enviar um lead, o evento &quot;Lead&quot; é
                disparado no navegador e via Conversions API.
              </p>
            )}
          </label>

          <label className="block text-sm font-medium">
            Anúncio que envia tráfego para esta página
            <select
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={adRequestId}
              onChange={(e) => setAdRequestId(e.target.value)}
            >
              <option value="">Nenhum</option>
              {adRequests.map((ad) => (
                <option key={ad.id} value={ad.id}>
                  #{ad.id} — {ad.base_ad_creative?.name ?? "Anúncio"}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} data-testid="settings-save">
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

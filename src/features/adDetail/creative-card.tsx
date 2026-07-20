"use client"

import { useState } from "react"
import { ImageIcon, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AdRequestBaseAdCreative } from "@/api/ad-request"

type GeoCity = { name: string; region: string; key?: string }

type GeoLocations = {
  cities?: GeoCity[]
  countries?: string[]
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-muted text-label-caps rounded-full px-3 py-1 text-xs inline-flex items-center gap-1">
      {children}
    </span>
  )
}

type CreativeCardProps = {
  creative: AdRequestBaseAdCreative
}

export function CreativeCard({ creative }: CreativeCardProps) {
  const [showEditNote, setShowEditNote] = useState(false)
  const geo = (creative.geo_locations ?? {}) as GeoLocations
  const cities: GeoCity[] = geo.cities ?? []

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden lg:sticky lg:top-6">
      {/* Media */}
      <div className="relative w-full aspect-square overflow-hidden bg-muted">
        {(creative.feed_image_url ?? creative.story_image_url) ? (
          <img
            src={(creative.feed_image_url ?? creative.story_image_url)!}
            alt={creative.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-primary-foreground"
          style={{
            background: "rgba(0,0,0,0.70)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Lock className="w-3 h-3" />
          Não editável
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-4">
        {creative.message && (
          <div>
            <p className="text-label-caps text-muted-foreground uppercase tracking-wider mb-1">
              Mensagem
            </p>
            <p className="text-body-md">{creative.message}</p>
          </div>
        )}

        {creative.link && (
          <>
            <div className="border-t border-border" />
            <div>
              <p className="text-label-caps text-muted-foreground uppercase tracking-wider mb-2">
                Direciona para
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip>💬 {creative.link}</Chip>
              </div>
            </div>
          </>
        )}

        <div className="border-t border-border" />
        <div>
          <p className="text-label-caps text-muted-foreground uppercase tracking-wider mb-2">
            Localização
          </p>
          <div className="flex flex-wrap gap-2">
            {cities.length > 0 ? (
              cities.map((c) => (
                <Chip key={`${c.name}-${c.region}`}>
                  📍 {c.name} · {c.region}
                </Chip>
              ))
            ) : (
              <Chip>🌎 Brasil (amplo)</Chip>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-6 border-t border-border bg-background">
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-full"
          onClick={() => setShowEditNote((v) => !v)}
        >
          ℹ Por que não posso editar?
        </Button>
        {showEditNote && (
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            O criativo não pode ser editado depois de publicado para manter a
            consistência com as plataformas de anúncio.
          </p>
        )}
      </div>
    </div>
  )
}

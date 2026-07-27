"use client"

import { ExternalLink, Globe, Lock, MapPin } from "lucide-react"
import { CALL_TO_ACTION_LABELS } from "@/features/adCreationFlow/constants"
import type { AdRequestBaseAdCreative } from "@/api/ad-request"

type GeoCity = { name: string; region: string; key?: string }

type GeoLocations = {
  cities?: GeoCity[]
  countries?: string[]
}

const GENDER_LABELS: Record<string, string> = {
  all: "Todos",
  male: "Homens",
  female: "Mulheres",
}

const MEDIA_TYPE_LABELS: Record<string, string> = {
  static_image: "Imagem única",
  video: "Vídeo",
  carousel: "Carrossel",
}

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-label-caps">
    {children}
  </span>
)

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="mb-1.5 text-label-caps uppercase tracking-wider text-muted-foreground">{label}</p>
    {children}
  </div>
)

type CreativeDetailsProps = {
  creative: AdRequestBaseAdCreative
}

export const CreativeDetails = ({ creative }: CreativeDetailsProps) => {
  const geo = (creative.geo_locations ?? {}) as GeoLocations
  const cities: GeoCity[] = geo.cities ?? []
  const variations = (creative.message_variations ?? []).filter(
    (text) => text && text !== creative.message
  )
  const mediaLabel =
    creative.media_type === "carousel"
      ? `${MEDIA_TYPE_LABELS.carousel} · ${creative.carousel_cards.length} cartões`
      : MEDIA_TYPE_LABELS[creative.media_type] ?? creative.media_type
  const ctaLabel = creative.call_to_action
    ? CALL_TO_ACTION_LABELS[creative.call_to_action] ?? creative.call_to_action
    : null
  const ageLabel = `${creative.target_age_min ?? 18} – ${creative.target_age_max ?? 65} anos`
  const genderLabel = GENDER_LABELS[creative.target_gender] ?? creative.target_gender
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="hidden flex-wrap items-center justify-between gap-2 border-b border-border px-6 py-4 lg:flex">
        <p className="font-quicksand text-base font-bold">Detalhes do anúncio</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Lock className="h-3 w-3" />
          Não editável
        </span>
      </div>
      <div className="flex flex-col gap-5 p-6">
        {creative.message && (
          <DetailRow label="Mensagem">
            <p className="whitespace-pre-line text-body-md">{creative.message}</p>
          </DetailRow>
        )}
        {variations.length > 0 && (
          <DetailRow label="Variações de texto">
            <ol className="flex flex-col gap-2">
              {variations.map((text, index) => (
                <li key={text} className="flex items-start gap-2.5 text-body-sm font-normal">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="whitespace-pre-line">{text}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-label-caps normal-case tracking-normal text-muted-foreground">
              A Meta alterna os textos e prioriza o que tiver melhor resultado.
            </p>
          </DetailRow>
        )}
        <div className="grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
          {creative.headline && (
            <DetailRow label="Título">
              <p className="text-body-sm">{creative.headline}</p>
            </DetailRow>
          )}
          {ctaLabel && (
            <DetailRow label="Botão do anúncio">
              <span className="inline-flex rounded-full border border-border px-3 py-1 text-sm font-semibold">
                {ctaLabel}
              </span>
            </DetailRow>
          )}
          <DetailRow label="Formato">
            <p className="text-body-sm">{mediaLabel}</p>
          </DetailRow>
          {creative.product_service && (
            <DetailRow label="Produto ou serviço">
              <p className="text-body-sm">{creative.product_service}</p>
            </DetailRow>
          )}
        </div>
        {creative.link && (
          <DetailRow label="Direciona para">
            <a
              href={creative.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-body-sm text-primary hover:underline"
            >
              <span className="truncate">{creative.link}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </DetailRow>
        )}
        <div className="grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
          <DetailRow label="Localização">
            <div className="flex flex-wrap gap-2">
              {cities.length > 0 ? (
                cities.map((c) => (
                  <Chip key={`${c.name}-${c.region}`}>
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {c.name} · {c.region}
                  </Chip>
                ))
              ) : (
                <Chip>
                  <Globe className="h-3.5 w-3.5 shrink-0 text-primary" />
                  Brasil (amplo)
                </Chip>
              )}
            </div>
          </DetailRow>
          <DetailRow label="Público">
            <p className="text-body-sm">
              {genderLabel} · {ageLabel}
            </p>
          </DetailRow>
        </div>
        <p className="border-t border-border pt-4 text-label-caps normal-case tracking-normal text-muted-foreground">
          O criativo não pode ser editado depois de publicado para manter a consistência com as
          plataformas de anúncio.
        </p>
      </div>
    </div>
  )
}

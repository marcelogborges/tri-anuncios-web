"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublishAdModal } from "@/features/myAds/publish-ad-modal"
import { cn } from "@/lib/utils"
import type { AdRequest, AdRequestPlatformPublication } from "@/api/ad-request"
import type { InsightsData } from "@/api/platform-publication"

const fmt = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n)

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
}

function addDays(iso: string, days: number): Date {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

// ─── Live Publication Block ────────────────────────────────────────────────

type LiveBlockProps = {
  adRequestId: number
  pub: AdRequestPlatformPublication
  pubIndex: number
  durationDays: number
  insights: InsightsData | null
}

function LivePublicationBlock({
  adRequestId,
  pub,
  pubIndex,
  durationDays,
  insights,
}: LiveBlockProps) {
  const startsAt = new Date(pub.created_at)
  const endsAt = addDays(pub.created_at, durationDays)
  const today = new Date()
  const elapsed = Math.max(0, daysBetween(startsAt, today))
  const total = Math.max(1, durationDays)
  const progress = Math.min(100, Math.round((elapsed / total) * 100))
  const remaining = Math.max(0, daysBetween(today, endsAt))

  return (
    <div className="plan-featured rounded-2xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Publicação ao vivo
        </span>
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
          Publicação #{pubIndex} · {fmtDate(pub.created_at)} → {fmtDate(endsAt.toISOString())}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        {(["impressions", "clicks"] as const).map((key) => (
          <div
            key={key}
            className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.10)" }}
          >
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              {key === "impressions" ? "Impressões" : "Cliques"}
            </p>
            <p className="font-quicksand font-bold text-[2rem] leading-none text-white">
              {insights ? fmt(insights[key]) : "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 8, background: "rgba(255,255,255,0.18)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: "#b4f4d3" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          <span>Dia {elapsed} de {total}</span>
          <span>
            {remaining > 0
              ? `Termina em ${remaining} dia${remaining !== 1 ? "s" : ""} · ${fmtDate(endsAt.toISOString())}`
              : "Encerrado"}
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link href={`/anuncios/${adRequestId}/estatisticas`}>
        <Button className="w-full rounded-full bg-white text-primary hover:bg-white/90 font-semibold">
          Ver desempenho completo
        </Button>
      </Link>
    </div>
  )
}

// ─── Republish CTA Block ───────────────────────────────────────────────────

type RepublishCtaProps = {
  adRequestId: number
  hasPreviousPublications: boolean
  onPublished: () => void
}

function RepublishCtaBlock({ adRequestId, hasPreviousPublications, onPublished }: RepublishCtaProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="border border-border rounded-2xl p-8 bg-card flex flex-col items-start gap-4">
        {hasPreviousPublications ? (
          <>
            <div className="flex items-start gap-4">
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: 56,
                  height: 56,
                  background: "var(--primary-soft)",
                }}
              >
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-base mb-1">Publicar novamente</p>
                <p className="text-body-sm text-muted-foreground">
                  Esse criativo já foi veiculado. Você pode publicá-lo de novo com um novo
                  pacote.
                </p>
              </div>
            </div>
            <Button className="rounded-full self-end" onClick={() => setModalOpen(true)}>
              Publicar
            </Button>
          </>
        ) : (
          <div className="w-full flex flex-col items-center gap-3 py-4">
            <p className="text-muted-foreground text-body-sm text-center">
              Esse anúncio ainda não foi publicado.
            </p>
            <Button className="rounded-full" onClick={() => setModalOpen(true)}>
              Publicar agora
            </Button>
          </div>
        )}
      </div>

      <PublishAdModal
        adRequestId={adRequestId}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onPublished={() => {
          setModalOpen(false)
          onPublished()
        }}
      />
    </>
  )
}

// ─── Publication History Block ─────────────────────────────────────────────

type HistoryBlockProps = {
  adRequestId: number
  publications: AdRequestPlatformPublication[]
  durationDays: number
  packageName: string | null
  activeInsights: InsightsData | null
  activePubId: number | null
}

function PublicationHistoryBlock({
  adRequestId,
  publications,
  durationDays,
  packageName,
  activeInsights,
  activePubId,
}: HistoryBlockProps) {
  const sorted = [...publications].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border">
        <p className="font-quicksand font-bold text-base">Histórico de publicações</p>
        <span className="text-sm text-muted-foreground font-medium">{publications.length}</span>
      </div>

      {publications.length === 0 ? (
        <div className="px-6 py-8 text-center text-body-sm text-muted-foreground">
          Nenhuma publicação ainda. Publique agora para ver os dados aqui.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {sorted.map((pub, i) => {
            const isActive = pub.id === activePubId
            const startsAt = pub.created_at
            const endsAt = addDays(startsAt, durationDays).toISOString()
            const index = i + 1
            const pubInsights = isActive ? activeInsights : null

            return (
              <Link
                key={pub.id}
                href={`/anuncios/${adRequestId}/estatisticas`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors"
              >
                {/* Number circle */}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full text-sm font-bold shrink-0",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-primary"
                  )}
                  style={{
                    width: 36,
                    height: 36,
                    background: isActive ? undefined : "var(--primary-soft)",
                  }}
                >
                  {index}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">
                      {fmtDate(startsAt)} → {fmtDate(endsAt)}
                    </span>
                    {packageName && (
                      <span className="bg-muted text-label-caps rounded-full px-2 py-0.5 text-xs">
                        {packageName}
                      </span>
                    )}
                    {isActive && (
                      <span className="text-xs text-emerald-600 font-semibold">Em curso</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="font-quicksand font-bold">
                      {pubInsights ? fmt(pubInsights.impressions) : "—"}
                    </span>{" "}
                    impressões ·{" "}
                    <span className="font-quicksand font-bold">
                      {pubInsights ? fmt(pubInsights.clicks) : "—"}
                    </span>{" "}
                    cliques
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Public export: right column orchestrator ──────────────────────────────

type PublicationBlocksProps = {
  adRequest: AdRequest
  insights: InsightsData | null
  onPublished: () => void
}

export function PublicationBlocks({ adRequest, insights, onPublished }: PublicationBlocksProps) {
  const isLive =
    adRequest.status === "published" || adRequest.status === "partially_published"

  const pubs = adRequest.platform_publications ?? []
  const durationDays = adRequest.ad_package?.duration_days ?? 14
  const packageName = adRequest.ad_package?.name ?? null

  const activePub = pubs.find(
    (p) => p.status === "published"
  ) ?? (isLive ? pubs[pubs.length - 1] : null)

  const sortedPubs = [...pubs].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  const activePubIndex = activePub
    ? sortedPubs.findIndex((p) => p.id === activePub.id) + 1
    : null

  return (
    <div className="flex flex-col gap-6">
      {isLive && activePub && activePubIndex != null ? (
        <LivePublicationBlock
          adRequestId={adRequest.id}
          pub={activePub}
          pubIndex={activePubIndex}
          durationDays={durationDays}
          insights={insights}
        />
      ) : (
        <RepublishCtaBlock
          adRequestId={adRequest.id}
          hasPreviousPublications={pubs.length > 0}
          onPublished={onPublished}
        />
      )}

      <PublicationHistoryBlock
        adRequestId={adRequest.id}
        publications={pubs}
        durationDays={durationDays}
        packageName={packageName}
        activeInsights={insights}
        activePubId={activePub?.id ?? null}
      />
    </div>
  )
}

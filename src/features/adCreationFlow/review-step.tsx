"use client"

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AdCreationFlowState } from "@/features/adCreationFlow/use-ad-creation-flow"
import { CALL_TO_ACTION_LABELS, OBJECTIVE_LABELS } from "@/features/adCreationFlow/constants"
import { StepHeader } from "@/features/adCreationFlow/step-header"
import { AdPreview } from "@/features/adCreationFlow/ad-preview"
import type { AdPreviewProps } from "@/features/adCreationFlow/ad-preview"

const formatPhoneDisplay = (waLink: string) => {
  const match = waLink.match(/wa\.me\/55(\d{2})(\d{5})(\d{4})/)
  if (!match) return waLink
  return `(${match[1]}) ${match[2]}-${match[3]}`
}

type Props = {
  flow: AdCreationFlowState
  preview: AdPreviewProps
  submitting?: boolean
  onEdit: (step: number) => void
  onSaveDraft: () => void
  onPublish: () => void
}

const ReviewRow = ({
  label,
  value,
  step,
  onEdit,
}: {
  label: string
  value: string
  step: number
  onEdit: (step: number) => void
}) => (
  <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[110px_1fr_auto] items-start gap-x-3 gap-y-1 py-3 border-b border-border last:border-b-0">
    <p className="text-label-caps text-muted-foreground pt-0.5">{label}</p>
    <button
      type="button"
      onClick={() => onEdit(step)}
      className="text-muted-foreground hover:text-foreground transition-colors p-1 shrink-0 sm:order-last"
    >
      <Pencil className="h-4 w-4" />
    </button>
    <p className="text-body-sm break-words min-w-0 [overflow-wrap:anywhere] col-span-2 sm:col-span-1">{value}</p>
  </div>
)

const ReviewBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-card">
    <div className="px-5 py-4 border-b border-border">
      <p className="text-body-sm font-semibold">{title}</p>
    </div>
    <div className="px-5">{children}</div>
  </div>
)

const mediaRows = (image: AdCreationFlowState["adImage"]): Array<{ label: string; value: string }> => {
  if (!image) return [{ label: "Mídia", value: "—" }]

  switch (image.type) {
    case "file": {
      const rows: Array<{ label: string; value: string }> = []
      if (image.feedPreviewUrl) rows.push({ label: "Imagem feed", value: `📎 ${image.feedFileName ?? "Imagem enviada"}` })
      if (image.storyPreviewUrl) rows.push({ label: "Imagem story", value: `📎 ${image.storyFileName ?? "Imagem enviada"}` })
      return rows.length > 0 ? rows : [{ label: "Mídia", value: "—" }]
    }
    case "generated":
      return [{ label: "Imagem", value: "🖼 Imagem gerada por IA" }]
    case "video":
      return [
        { label: "Vídeo", value: `🎬 ${image.videoFileName || "Vídeo enviado"}` },
        { label: "Capa", value: `📎 ${image.thumbFileName || "Capa enviada"}` },
      ]
    case "carousel":
      return [{ label: "Carrossel", value: `🖼 ${image.cards.length} cartões` }]
  }
}

export const ReviewStep = ({ flow, preview, submitting, onEdit, onSaveDraft, onPublish }: Props) => {
  const { adBasicInfo, adImage, adMessage, geoLocation, optimizationGoal } = flow

  const media = mediaRows(adImage)

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-8">
      <StepHeader
        eyebrow="PASSO 6 · REVISÃO"
        title="Tudo certo?"
        subtitle="Confira os dados antes de publicar."
      />
      <div className="mb-6 py-6 lg:hidden">
        <AdPreview {...preview} />
      </div>
      <div className="flex flex-col gap-4">
        <ReviewBlock title="Criativo">
          {adBasicInfo && (
            <>
              <ReviewRow label="Nome" value={adBasicInfo.name} step={1} onEdit={onEdit} />
              <ReviewRow label="Produto" value={adBasicInfo.productService} step={1} onEdit={onEdit} />
            </>
          )}
          {adMessage && (
            <ReviewRow label="Mensagem" value={adMessage} step={2} onEdit={onEdit} />
          )}
          {media.map((row) => (
            <ReviewRow key={row.label} label={row.label} value={row.value} step={3} onEdit={onEdit} />
          ))}
        </ReviewBlock>

        <ReviewBlock title="Localização">
          {geoLocation && ((geoLocation.states?.length ?? 0) > 0 || geoLocation.cities.length > 0) ? (
            <ReviewRow
              label="Locais"
              value={[
                ...(geoLocation.states ?? []).map((s) => `${s.name} · Estado`),
                ...geoLocation.cities.map((c) => `${c.name} · ${c.state}`),
              ].join(", ")}
              step={4}
              onEdit={onEdit}
            />
          ) : (
            <ReviewRow label="Locais" value="Brasil (amplo)" step={4} onEdit={onEdit} />
          )}
        </ReviewBlock>

        {optimizationGoal && (
          <ReviewBlock title="Objetivo">
            <ReviewRow
              label="Objetivo"
              value={OBJECTIVE_LABELS[optimizationGoal.objective] ?? optimizationGoal.objective}
              step={5}
              onEdit={onEdit}
            />
            <ReviewRow
              label={
                optimizationGoal.objective === "whatsapp_messages"
                  ? "WhatsApp"
                  : optimizationGoal.landingPage
                    ? "Página de vendas"
                    : "Link"
              }
              value={
                optimizationGoal.objective === "whatsapp_messages"
                  ? formatPhoneDisplay(optimizationGoal.link)
                  : optimizationGoal.landingPage
                    ? `${optimizationGoal.landingPage.name} — ${optimizationGoal.link}`
                    : optimizationGoal.link
              }
              step={5}
              onEdit={onEdit}
            />
            <ReviewRow
              label="Botão"
              value={CALL_TO_ACTION_LABELS[optimizationGoal.callToAction] ?? optimizationGoal.callToAction}
              step={5}
              onEdit={onEdit}
            />
          </ReviewBlock>
        )}

        <div className="flex flex-col items-center gap-3 pt-4">
          <Button className="w-full rounded-full" onClick={onPublish} disabled={submitting}>
            Continuar
          </Button>
          <Button className="w-full rounded-full" variant="outline" onClick={onSaveDraft} disabled={submitting}>
            Salvar rascunho
          </Button>
          <p className="text-label-caps text-muted-foreground">
            Você escolhe o investimento na próxima etapa.
          </p>
        </div>
      </div>
    </div>
  )
}

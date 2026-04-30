"use client"

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AdCreationFlowState } from "@/features/adCreationFlow/use-ad-creation-flow"
import { SOCIAL_CLASS_LABELS, GENDER_LABELS, OBJECTIVE_LABELS } from "@/features/adCreationFlow/constants"

const formatPhoneDisplay = (waLink: string) => {
  const match = waLink.match(/wa\.me\/55(\d{2})(\d{5})(\d{4})/)
  if (!match) return waLink
  return `(${match[1]}) ${match[2]}-${match[3]}`
}

type Props = {
  flow: AdCreationFlowState
  submitting?: boolean
  onEdit: (step: number) => void
  onSaveDraft: () => void
  onPublish: () => void
}

const Row = ({
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
  <div className="flex items-start justify-between gap-2 border-b py-3 last:border-b-0">
    <div className="min-w-0 flex-1">
      <p className="text-body-sm text-muted-foreground">{label}</p>
      <p className="text-body mt-0.5 break-words">{value}</p>
    </div>
    <button
      type="button"
      onClick={() => onEdit(step)}
      className="text-muted-foreground hover:text-foreground mt-0.5 shrink-0 p-1"
    >
      <Pencil className="h-4 w-4" />
    </button>
  </div>
)

export const ReviewStep = ({ flow, submitting, onEdit, onSaveDraft, onPublish }: Props) => {
  const { adBasicInfo, adMessage, socialClasses, audience, geoLocation, optimizationGoal } = flow

  return (
    <Card className="mx-auto mt-6 mb-12 w-full max-w-lg border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-heading">Revise seu Anúncio</CardTitle>
        <CardDescription>
          Confira os dados antes de enviar
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {adBasicInfo && (
          <>
            <Row
              label="Nome do anúncio"
              value={adBasicInfo.name}
              step={1}
              onEdit={onEdit}
            />
            <Row
              label="Produto / Serviço"
              value={adBasicInfo.productService}
              step={1}
              onEdit={onEdit}
            />
          </>
        )}

        {adMessage && (
          <Row label="Mensagem" value={adMessage} step={2} onEdit={onEdit} />
        )}

        {socialClasses && socialClasses.length > 0 && (
          <Row
            label="Classes sociais"
            value={socialClasses.map((c) => SOCIAL_CLASS_LABELS[c] ?? c).join(", ")}
            step={3}
            onEdit={onEdit}
          />
        )}

        {audience && (
          <>
            <Row
              label="Gênero"
              value={GENDER_LABELS[audience.targetGender] ?? audience.targetGender}
              step={4}
              onEdit={onEdit}
            />
            <Row
              label="Faixa etária"
              value={`${audience.targetAgeMin} – ${audience.targetAgeMax} anos`}
              step={4}
              onEdit={onEdit}
            />
          </>
        )}

        {geoLocation && geoLocation.cities.length > 0 && (
          <Row
            label="Cidades"
            value={geoLocation.cities.map((c) => `${c.name} – ${c.state}`).join(", ")}
            step={5}
            onEdit={onEdit}
          />
        )}

        {optimizationGoal && (
          <>
            <Row
              label="Objetivo"
              value={OBJECTIVE_LABELS[optimizationGoal.objective] ?? optimizationGoal.objective}
              step={6}
              onEdit={onEdit}
            />
            <Row
              label={optimizationGoal.objective === "lead_generation" ? "WhatsApp" : "Link"}
              value={
                optimizationGoal.objective === "lead_generation"
                  ? formatPhoneDisplay(optimizationGoal.link)
                  : optimizationGoal.link
              }
              step={6}
              onEdit={onEdit}
            />
          </>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Button className="w-full" onClick={onPublish} disabled={submitting}>
            {submitting ? "Criando..." : "Publicar Agora"}
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={onSaveDraft}
            disabled={submitting}
          >
            Salvar Rascunho
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

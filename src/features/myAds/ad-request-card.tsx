import Link from "next/link"
import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AdRequest, AdRequestStatus } from "@/api/ad-request"

const timeAgo = (dateStr: string): string => {
  const now = Date.now()
  const past = new Date(dateStr).getTime()
  const diffMs = now - past
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "agora mesmo"
  if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours} hora${hours > 1 ? "s" : ""}`
  const days = Math.floor(hours / 24)
  if (days < 30) return `há ${days} dia${days > 1 ? "s" : ""}`
  const months = Math.floor(days / 30)
  return `há ${months} ${months > 1 ? "meses" : "mês"}`
}

const STATUS_CONFIG: Record<AdRequestStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "tertiary" }> = {
  draft: { label: "Rascunho", variant: "secondary" },
  pending_publication: { label: "Processando", variant: "secondary" },
  processing: { label: "Processando", variant: "tertiary" },
  partially_published: { label: "Parcialmente publicado", variant: "tertiary" },
  published: { label: "Publicado", variant: "default" },
  failed: { label: "Falhou", variant: "destructive" },
  rejected: { label: "Rejeitado", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "secondary" },
}


type AdRequestCardProps = {
  adRequest: AdRequest
  onPublish?: (adRequest: AdRequest) => void
}

export const AdRequestCard = ({ adRequest, onPublish }: AdRequestCardProps) => {
  const imageUrl = adRequest.base_ad_creative.image_url
  const statusConfig = STATUS_CONFIG[adRequest.status] ?? { label: adRequest.status, variant: "outline" as const }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white sm:flex-row sm:items-center sm:gap-5 sm:overflow-visible sm:border sm:px-5 sm:py-4">
      <div className="relative sm:contents">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={adRequest.base_ad_creative.name}
            className="h-36 w-full object-cover sm:h-28 sm:w-28 sm:shrink-0 sm:rounded-lg"
          />
        ) : (
          <div className="flex h-36 w-full items-center justify-center bg-muted sm:h-28 sm:w-28 sm:shrink-0 sm:rounded-lg">
            <ImageIcon className="size-10 text-muted-foreground" />
          </div>
        )}
        <Badge variant={statusConfig.variant} className="absolute bottom-2 left-2 text-xs sm:hidden">
          {statusConfig.label}
        </Badge>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 p-4 sm:p-0">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-bold">
            {adRequest.base_ad_creative.name}
          </p>
          <Badge variant={statusConfig.variant} className="hidden shrink-0 text-xs sm:inline-flex">
            {statusConfig.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Anúncio criado {timeAgo(adRequest.created_at)}
        </p>

        <div className="mt-3 flex items-center gap-3">
          {adRequest.status === "draft" && onPublish && (
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-full border-foreground/30 sm:w-auto"
              onClick={() => onPublish(adRequest)}
            >
              Publicar
            </Button>
          )}

          {adRequest.status !== "draft" && (
            <Button variant="outline" size="lg" className="w-full rounded-full border-foreground/30 sm:w-auto" asChild>
              <Link href={`/anuncios/${adRequest.id}/estatisticas`}>
                Ver Estatísticas
              </Link>
            </Button>
          )}


        </div>
      </div>
    </div>
  )
}

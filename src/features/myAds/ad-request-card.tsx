import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { AdRequest, AdRequestStatus } from "@/api/ad-request"

const STATUS_CONFIG: Record<AdRequestStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "tertiary" }> = {
  draft: { label: "Rascunho", variant: "secondary" },
  pending_publication: { label: "Aguardando publicação", variant: "outline" },
  processing: { label: "Processando", variant: "tertiary" },
  partially_published: { label: "Parcialmente publicado", variant: "tertiary" },
  published: { label: "Publicado", variant: "default" },
  failed: { label: "Falhou", variant: "destructive" },
  rejected: { label: "Rejeitado", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "secondary" },
}

const PROVIDER_LABELS: Record<string, string> = {
  meta: "Meta Ads",
  tiktok_ads: "TikTok Ads",
  google_ads: "Google Ads",
}

const PUB_STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  processing: "Processando",
  published: "Publicado",
  failed: "Falhou",
  rejected: "Rejeitado",
  paused: "Pausado",
  cancelled: "Cancelado",
}

const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100)

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateStr))

type AdRequestCardProps = {
  adRequest: AdRequest
}

export const AdRequestCard = ({ adRequest }: AdRequestCardProps) => {
  const statusConfig = STATUS_CONFIG[adRequest.status] ?? { label: adRequest.status, variant: "outline" as const }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <CardTitle className="truncate">
            {adRequest.base_ad_creative.name}
          </CardTitle>
          {adRequest.base_ad_creative.product_service && (
            <p className="text-sm text-muted-foreground">
              {adRequest.base_ad_creative.product_service}
            </p>
          )}
        </div>
        <Badge variant={statusConfig.variant} className="shrink-0">
          {statusConfig.label}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Pacote: </span>
            <span className="font-medium">{adRequest.ad_package.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Valor: </span>
            <span className="font-medium">{formatCurrency(adRequest.ad_package.price_cents)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Duração: </span>
            <span className="font-medium">{adRequest.ad_package.duration_days} dias</span>
          </div>
          <div>
            <span className="text-muted-foreground">Criado em: </span>
            <span className="font-medium">{formatDate(adRequest.created_at)}</span>
          </div>
        </div>

        {adRequest.platform_publications.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-3">
              {adRequest.platform_publications.map((pub) => (
                <div
                  key={pub.id}
                  className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
                >
                  <span className="font-medium">
                    {PROVIDER_LABELS[pub.provider] ?? pub.provider}
                  </span>
                  <span className="text-muted-foreground">
                    {PUB_STATUS_LABELS[pub.status] ?? pub.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

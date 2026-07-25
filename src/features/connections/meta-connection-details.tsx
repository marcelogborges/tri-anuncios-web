import type { PlatformAccount } from "@/api/platform-accounts"
import { cn } from "@/lib/utils"

type MetaConnectionDetailsProps = {
  account: PlatformAccount
  className?: string
}

const STATUS_LABELS: Record<string, string> = {
  active: "Ativa",
  paused: "Pausada",
  deleted: "Removida",
  with_problems: "Com problemas",
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

export const MetaConnectionDetails = ({ account, className }: MetaConnectionDetailsProps) => {
  const isActive = account.status === "active"

  return (
    <div className={cn("grid grid-cols-2 gap-x-6 gap-y-5 rounded-xl p-5", className)}>
      <div>
        <p className="text-[13px] text-muted-foreground">Status da conexão</p>
        <p
          className={cn(
            "mt-0.5 text-sm font-bold",
            isActive ? "text-primary" : "text-foreground"
          )}
        >
          {STATUS_LABELS[account.status] ?? account.status}
        </p>
      </div>
      <div>
        <p className="text-[13px] text-muted-foreground">Conectada em</p>
        <p className="mt-0.5 text-sm font-bold text-foreground">
          {formatDate(account.updated_at)}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-[13px] text-muted-foreground">Página do Facebook</p>
        <p className="mt-0.5 truncate text-sm font-bold text-foreground">
          {account.facebook_page_name ?? "—"}
        </p>
        {account.facebook_page_id && (
          <p className="mt-0.5 truncate text-xs tabular-nums text-muted-foreground">
            ID {account.facebook_page_id}
          </p>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] text-muted-foreground">Conta do Instagram</p>
        <p className="mt-0.5 truncate text-sm font-bold text-foreground">
          {account.instagram_account_id ? `ID ${account.instagram_account_id}` : "Nenhuma vinculada"}
        </p>
      </div>
      <div className="col-span-2 min-w-0">
        <p className="text-[13px] text-muted-foreground">Conta de anúncios</p>
        <p className="mt-0.5 truncate text-sm font-bold tabular-nums text-foreground">
          {account.external_id ?? "—"}
        </p>
      </div>
    </div>
  )
}

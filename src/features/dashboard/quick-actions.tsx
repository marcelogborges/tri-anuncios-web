import Link from "next/link"
import { LayoutTemplate, Megaphone, Plus, Settings } from "lucide-react"

const ACTIONS = [
  { href: "/anuncios/criar", label: "Criar anúncio", icon: Plus },
  { href: "/anuncios", label: "Meus anúncios", icon: Megaphone },
  { href: "/paginas-de-vendas", label: "Páginas de vendas", icon: LayoutTemplate },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

export const QuickActions = () => {
  const tiles = ACTIONS.map(action => (
    <Link
      key={action.href}
      href={action.href}
      className="group flex flex-col items-center justify-center gap-2 rounded-xl p-4 shadow-ambient transition-all hover:shadow-lift hover:-translate-y-0.5"
      style={{ background: "linear-gradient(160deg, #014a32 0%, #006c49 100%)" }}
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-white/15 text-white">
        <action.icon className="size-4" />
      </div>
      <span className="text-[13px] font-semibold text-white text-center leading-tight">
        {action.label}
      </span>
    </Link>
  ))

  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{tiles}</div>
}

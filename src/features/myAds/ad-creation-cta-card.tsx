import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const AdCreationCtaCard = () => (
  <Link href="/anuncios/criar" className="block">
    <div className="flex flex-col items-center justify-center gap-4 min-h-[420px] rounded-lg border-2 border-dashed border-[var(--border-strong)] bg-transparent hover:border-primary hover:bg-[var(--primary-soft)] transition-all duration-200 group">
      <div className="w-14 h-14 rounded-full bg-muted group-hover:bg-primary flex items-center justify-center transition-colors duration-200">
        <PlusCircle className="w-6 h-6 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
      </div>
      <div className="text-center">
        <p className="font-bold text-foreground">Criar novo anúncio</p>
        <p className="text-sm text-muted-foreground mt-1">Comece pelo criativo.</p>
        <p className="text-sm text-muted-foreground">Você só paga quando publicar.</p>
      </div>
    </div>
  </Link>
)

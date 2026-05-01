import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const FinalCtaSection = () => {
  return (
    <div className="mx-8 mb-16 max-[960px]:mx-4 max-[960px]:mb-12">
      <div className="relative rounded-[28px] overflow-hidden text-center px-8 py-20 max-[960px]:px-6 max-[960px]:py-14" style={{ background: "linear-gradient(160deg, #014a32 0%, #006c49 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 12% 20%, rgba(255,255,255,0.08) 0, transparent 40%), radial-gradient(circle at 88% 80%, rgba(255,255,255,0.06) 0, transparent 50%)" }} />

        <div className="relative z-10 max-w-[720px] mx-auto">
          <h2 className="font-quicksand text-[clamp(2rem,3.4vw,2.75rem)] font-bold leading-[1.1] text-white mb-4 text-balance">
            Seu próximo cliente está a um anúncio de distância.
          </h2>
          <p className="text-[1.125rem] text-white/[0.78] mb-8 leading-relaxed">
            Comece em 5 minutos. Sem cartão de crédito até a publicação.
          </p>
          <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90" asChild>
            <Link href="/register">
              Criar meu primeiro anúncio
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

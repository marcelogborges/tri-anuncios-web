import Image from "next/image"

const platforms = [
  { src: "/meta.png", name: "Meta Ads", active: true },
  { src: "/google.png", name: "Google Ads", active: false },
  { src: "/tiktok.png", name: "TikTok Ads", active: false },
]

export const PlatformsSection = () => {
  return (
    <section className="bg-card border-y border-border py-24 max-[960px]:py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-[0.08em] mb-4">
            <span className="size-1.5 rounded-full bg-primary" />
            Plataformas
          </span>
          <h2 className="font-quicksand text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-4 text-balance">
            Onde seu anúncio aparece.
          </h2>
          <p className="text-[1.125rem] text-muted-foreground max-w-[620px] mx-auto leading-relaxed">
            Começamos pela Meta, empresa responsável pelo Facebook e Instagram, onde a maioria dos pequenos negócios já concentra seu público. Em breve, também teremos Google e TikTok.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-[18px] max-w-[920px] mx-auto max-[560px]:grid-cols-1">
          {platforms.map((p) => (
            <div
              key={p.name}
              className={`bg-background rounded-2xl p-6 text-center relative ${
                p.active
                  ? "border-2 border-primary"
                  : "border border-border"
              }`}
            >
              <Image
                src={p.src}
                alt={p.name}
                width={44}
                height={44}
                className="mx-auto mb-3.5 object-contain h-11 w-auto"
              />
              <h4 className="font-bold text-[1rem] mb-1">{p.name}</h4>
              {p.active ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Disponível
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.06em] bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                  Em breve
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

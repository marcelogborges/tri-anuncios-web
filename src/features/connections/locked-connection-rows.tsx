const LOCKED_PROVIDERS = [
  { key: "google_ads", name: "Google Ads", icon: "/google.png" },
  { key: "tiktok_ads", name: "TikTok Ads", icon: "/tiktok.png" },
]

export const LockedConnectionRows = () => {
  const rows = LOCKED_PROVIDERS.map(provider => (
    <div
      key={provider.key}
      className="flex items-center gap-3 border-t px-6 py-4 opacity-60 max-[480px]:px-4"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-secondary/20 p-2">
          <img src={provider.icon} alt="" className="h-full w-full object-contain grayscale" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{provider.name}</p>
          <p className="text-[13px] text-muted-foreground">Disponível em breve</p>
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Em breve
      </span>
    </div>
  ))

  return <>{rows}</>
}

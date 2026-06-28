import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-6 md:px-10">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-body-sm text-muted-foreground">TriAnuncios</p>
          <nav className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="text-label-caps text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Privacidade
            </Link>
            <Link
              href="/terms"
              className="text-label-caps text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Termos
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

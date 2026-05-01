import Link from "next/link"

type BreadcrumbProps = { name: string }

export const Breadcrumb = ({ name }: BreadcrumbProps) => {
  return (
    <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
      <Link
        href="/anuncios"
        className="hover:text-foreground transition-colors shrink-0 max-[480px]:max-w-[60px] truncate"
      >
        Anúncios
      </Link>
      <span className="opacity-40 shrink-0">/</span>
      <span className="truncate max-w-[130px] sm:max-w-xs">{name}</span>
      <span className="opacity-40 shrink-0">/</span>
      <span className="font-semibold text-foreground shrink-0">Estatísticas</span>
    </nav>
  )
}

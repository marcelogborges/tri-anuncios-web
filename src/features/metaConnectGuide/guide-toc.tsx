import type { GuideSection } from "./guide-content"

type GuideTocProps = { sections: GuideSection[] }

export const GuideToc = ({ sections }: GuideTocProps) => {
  return (
    <nav aria-label="Seções do guia" className="rounded-lg border bg-muted/30 p-6">
      <p className="text-label-caps text-muted-foreground mb-3 uppercase tracking-widest">
        Nesta página
      </p>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-body-md text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

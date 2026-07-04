import Image from "next/image"
import type { GuideSection as GuideSectionData } from "./guide-content"

type GuideSectionProps = { section: GuideSectionData }

export const GuideSection = ({ section }: GuideSectionProps) => {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="text-title-2 text-foreground mb-4">{section.title}</h2>
      <p className="text-body-md text-muted-foreground leading-relaxed mb-8">
        {section.intro}
      </p>
      <ol className="space-y-10">
        {section.steps.map((step, index) => (
          <li key={step.image} className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <p className="text-body-md text-foreground leading-relaxed">
                {step.text}
              </p>
            </div>
            <Image
              src={step.image}
              alt={`Passo ${index + 1}: ${step.text}`}
              width={step.width}
              height={step.height}
              loading="lazy"
              className="w-full rounded-lg border"
            />
          </li>
        ))}
      </ol>
    </section>
  )
}

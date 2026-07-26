type Props = {
  eyebrow: string
  title: string
  subtitle?: string
}

export const StepHeader = ({ eyebrow, title, subtitle }: Props) => (
  <div className="mb-8 max-sm:mb-5">
    <p className="text-label-caps uppercase tracking-wider text-primary mb-1">{eyebrow}</p>
    <h2 className="text-title-1 max-sm:text-title-2">{title}</h2>
    {subtitle && <p className="text-body-sm text-muted-foreground mt-2 max-sm:mt-1">{subtitle}</p>}
  </div>
)

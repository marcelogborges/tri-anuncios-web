type Props = {
  eyebrow: string
  title: string
  subtitle?: string
}

export const StepHeader = ({ eyebrow, title, subtitle }: Props) => (
  <div className="mb-8">
    <p className="text-label-caps uppercase tracking-wider text-primary mb-1">{eyebrow}</p>
    <h2 className="text-title-1">{title}</h2>
    {subtitle && <p className="text-body-sm text-muted-foreground mt-2">{subtitle}</p>}
  </div>
)

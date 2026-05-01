import { BarChart3 } from "lucide-react"

type Props = {
  title: string
  description: string
}

export const InsightsEmptyState = ({ title, description }: Props) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
      <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <BarChart3 className="size-6" />
      </div>
      <h3 className="text-title-2 mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  )
}

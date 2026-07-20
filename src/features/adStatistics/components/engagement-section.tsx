"use client"

import { Bookmark, Heart, MessageCircle, Play, Share2 } from "lucide-react"
import type { InsightsActions } from "@/api/platform-publication"
import { formatBR } from "../formatters"
import { CollapsibleSection } from "./collapsible-section"

const ENGAGEMENT_ITEMS = [
  { key: "post_reaction", label: "Reações", icon: Heart },
  { key: "comment", label: "Comentários", icon: MessageCircle },
  { key: "post", label: "Compartilhamentos", icon: Share2 },
  { key: "onsite_conversion.post_save", label: "Salvamentos", icon: Bookmark },
  { key: "video_view", label: "Views de vídeo", icon: Play },
] as const

type Props = { actions: InsightsActions }

export const EngagementSection = ({ actions }: Props) => {
  const items = ENGAGEMENT_ITEMS.map((item) => ({ ...item, value: actions[item.key] ?? 0 })).filter(
    (item) => item.value > 0
  )

  if (items.length === 0) return null

  return (
    <CollapsibleSection
      className="mt-4"
      title="Engajamento"
      subtitle="Interações com o anúncio no período"
    >
      <div className="flex flex-col px-4 py-1 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-2.5 sm:p-4">
        {items.map(({ key, label, icon: Icon, value }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0 sm:block sm:border-0 sm:rounded-lg sm:bg-secondary/30 sm:p-3"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground min-w-0 sm:mb-2">
              <Icon className="size-3.5 text-primary shrink-0" />
              <span className="min-w-0 truncate">{label}</span>
            </div>
            <div className="font-quicksand text-lg font-bold tabular-nums shrink-0 sm:text-2xl">
              {formatBR(value)}
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}

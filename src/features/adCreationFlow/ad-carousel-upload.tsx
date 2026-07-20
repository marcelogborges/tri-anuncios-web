"use client"

import { useRef, useState } from "react"
import { ImagePlus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { AdImageData, CarouselCardData } from "@/features/adCreationFlow/use-ad-creation-flow"

const MIN_CARDS = 2
const MAX_CARDS = 10

type CardDraft = {
  id: string
  file: File | null
  previewUrl: string | null
  fileName: string
  headline: string
  link: string
}

export type CarouselFiles = Array<File | null>

type Props = {
  initialValue?: AdImageData | null
  onComplete: (media: AdImageData, files: CarouselFiles) => void
  onLiveChange?: (cards: Array<{ imageUrl: string; headline?: string }>) => void
}

let cardIdSeq = 0

const nextCardId = () => `card-${cardIdSeq++}`

const emptyCard = (): CardDraft => ({ id: nextCardId(), file: null, previewUrl: null, fileName: "", headline: "", link: "" })

const fromInitial = (initial: CarouselCardData[]): CardDraft[] =>
  initial.map((c) => ({
    id: nextCardId(),
    file: null,
    previewUrl: c.previewUrl,
    fileName: c.fileName,
    headline: c.headline ?? "",
    link: c.link ?? "",
  }))

export const AdCarouselUpload = ({ initialValue, onComplete, onLiveChange }: Props) => {
  const initialCards = initialValue?.type === "carousel" ? initialValue.cards : null
  const [cards, setCards] = useState<CardDraft[]>(
    initialCards && initialCards.length > 0 ? fromInitial(initialCards) : [emptyCard(), emptyCard()]
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const targetIndexRef = useRef(0)

  const emitLiveChange = (next: CardDraft[]) => {
    onLiveChange?.(
      next
        .filter((c) => c.previewUrl)
        .map((c) => ({ imageUrl: c.previewUrl!, headline: c.headline || undefined }))
    )
  }

  const updateCards = (next: CardDraft[]) => {
    setCards(next)
    emitLiveChange(next)
  }

  const pickImage = (index: number) => {
    targetIndexRef.current = index
    inputRef.current?.click()
  }

  const handleFileSelected = (file: File) => {
    const index = targetIndexRef.current
    updateCards(
      cards.map((card, i) => {
        if (i !== index) return card
        if (card.previewUrl && card.file) URL.revokeObjectURL(card.previewUrl)
        return { ...card, file, fileName: file.name, previewUrl: URL.createObjectURL(file) }
      })
    )
  }

  const updateField = (index: number, field: "headline" | "link", value: string) => {
    updateCards(cards.map((card, i) => (i === index ? { ...card, [field]: value } : card)))
  }

  const addCard = () => {
    if (cards.length >= MAX_CARDS) return
    updateCards([...cards, emptyCard()])
  }

  const removeCard = (index: number) => {
    if (cards.length <= MIN_CARDS) return
    const card = cards[index]
    if (card.previewUrl && card.file) URL.revokeObjectURL(card.previewUrl)
    updateCards(cards.filter((_, i) => i !== index))
  }

  const filledCards = cards.filter((c) => c.previewUrl)
  const canSubmit = cards.length >= MIN_CARDS && filledCards.length === cards.length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onComplete(
      {
        type: "carousel",
        cards: cards.map((c) => ({
          fileName: c.fileName,
          previewUrl: c.previewUrl!,
          headline: c.headline || undefined,
          link: c.link || undefined,
        })),
      },
      cards.map((c) => c.file)
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <span className="text-body-sm font-semibold">Cartões do carrossel</span>
        <span className="text-label-caps text-muted-foreground">
          {cards.length} de {MAX_CARDS} · mínimo {MIN_CARDS}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {cards.map((card, index) => (
          <div key={card.id} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-label-caps font-semibold text-muted-foreground">CARTÃO {index + 1}</span>
              {cards.length > MIN_CARDS && (
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Remover cartão ${index + 1}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => pickImage(index)}
                className={cn(
                  "flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-md border-2 border-dashed transition-colors",
                  card.previewUrl
                    ? "border-primary bg-[var(--primary-soft)]"
                    : "border-border-strong bg-muted text-muted-foreground hover:border-primary hover:bg-[var(--primary-soft)]"
                )}
              >
                {card.previewUrl ? (
                  <img src={card.previewUrl} alt={`Cartão ${index + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <>
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-label-caps">1080×1080</span>
                  </>
                )}
              </button>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Título (opcional)"
                  value={card.headline}
                  onChange={(e) => updateField(index, "headline", e.target.value)}
                  maxLength={35}
                />
                <Input
                  type="url"
                  placeholder="Link (opcional)"
                  value={card.link}
                  onChange={(e) => updateField(index, "link", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {cards.length < MAX_CARDS && (
        <button
          type="button"
          onClick={addCard}
          className="flex items-center justify-center gap-2 rounded-full border border-dashed border-border-strong bg-muted px-4 py-2.5 text-body-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:bg-[var(--primary-soft)] hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Adicionar cartão
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelected(file)
          e.target.value = ""
        }}
      />

      <Button type="submit" className="w-full rounded-full" disabled={!canSubmit}>
        Continuar
      </Button>
    </form>
  )
}

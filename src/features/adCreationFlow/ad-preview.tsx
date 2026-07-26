"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type AdPreviewCarouselCard = {
  imageUrl: string
  headline?: string
}

export type AdPreviewProps = {
  name?: string | null
  message?: string
  feedImageUrl?: string
  storyImageUrl?: string
  videoUrl?: string
  carousel?: AdPreviewCarouselCard[]
  organizationName?: string
  link?: string | null
  callToAction?: string
  className?: string
}

type Tab = "story" | "feed"

const IG_GRADIENT = "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"

const IG_COLORS = {
  text: "#262626",
  textMuted: "#8e8e8e",
  border: "#efefef",
  surfaceAlt: "#f3f3f3",
  ctaButton: "#0095f6",
  storyBg: "#1c1c1e",
  storyBubbleBg: "#e5e5e5",
  storyBubbleText: "#555",
  imagePlaceholder: "#efefef",
}

const AVATAR_INITIALS = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase() || "?"

const STORY_BUBBLES = [
  { initials: "Jo" },
  { initials: "Ma" },
  { initials: "Ca" },
]

const getLinkInfo = (link?: string | null): { domain: string; cta: string } => {
  if (!link) return { domain: "seusite.com.br", cta: "Saiba mais" }
  if (link.includes("wa.me")) return { domain: "wa.me · WhatsApp", cta: "Enviar" }
  try {
    const hostname = new URL(link).hostname.replace(/^www\./, "")
    return { domain: hostname, cta: "Saiba mais" }
  } catch {
    return { domain: link, cta: "Saiba mais" }
  }
}

const StoryFrame = ({
  imageUrl,
  videoUrl,
  caption,
  businessName,
  ctaLabel,
}: {
  ctaLabel?: string
  imageUrl?: string
  videoUrl?: string
  caption?: string
  businessName: string
}) => (
  <div
    className="relative mx-auto overflow-hidden rounded-[20px] bg-black"
    style={{ width: "100%", maxWidth: 300, aspectRatio: "9/16" }}
  >
    <div className="absolute inset-0">
      {videoUrl ? (
        <video src={videoUrl} className="h-full w-full object-cover" autoPlay muted loop playsInline />
      ) : imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background: IG_COLORS.storyBg,
            backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0 12px, rgba(255,255,255,0.04) 12px 24px)",
          }}
        />
      )}
    </div>
    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
    <div className="absolute top-3 inset-x-3 flex gap-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-0.5 flex-1 rounded-full"
          style={{ background: i === 1 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}
        />
      ))}
    </div>
    <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    <div className="absolute right-3 flex flex-col items-center gap-5" style={{ bottom: 110 }}>
      <div className="flex flex-col items-center gap-0.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span style={{ fontSize: 10, color: "white", fontWeight: 600 }}>4</span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </div>
    </div>
    <div className="absolute inset-x-0 bottom-4 pl-3 pr-12 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div style={{ width: 30, height: 30, borderRadius: 9999, flexShrink: 0, background: "#dbdbdb", padding: 2 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 9999, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, border: "1.5px solid #fff" }}>
            {AVATAR_INITIALS(businessName)}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-white font-bold truncate" style={{ fontSize: 11, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
            {businessName}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#3897f0" style={{ flexShrink: 0 }}>
            <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="#3897f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <button type="button" style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.8)", color: "#fff", padding: "3px 10px", borderRadius: 6, fontWeight: 700, fontSize: 10, whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer" }}>
          Seguir
        </button>
      </div>
      <button type="button" style={{ width: "100%", background: "rgba(255,255,255,0.92)", border: "none", borderRadius: 8, padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: IG_COLORS.text }}>{ctaLabel ?? "Saiba mais"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={IG_COLORS.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      {caption && (
        <p className="line-clamp-2" style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", lineHeight: 1.4, textShadow: "0 1px 3px rgba(0,0,0,0.6)", margin: 0 }}>
          {caption}
        </p>
      )}
    </div>
  </div>
)

const CarouselMedia = ({ cards }: { cards: AdPreviewCarouselCard[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{ position: "relative", flexShrink: 0, width: "100%", aspectRatio: "1/1", scrollSnapAlign: "start", background: IG_COLORS.imagePlaceholder }}
          >
            <img src={card.imageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            {card.headline && (
              <span style={{ position: "absolute", left: 8, bottom: 8, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, maxWidth: "80%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {card.headline}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 9999 }}>
        {activeIndex + 1}/{cards.length}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "8px 0 2px" }}>
        {cards.map((_, index) => (
          <span
            key={index}
            style={{
              width: 6,
              height: 6,
              borderRadius: 9999,
              background: index === activeIndex ? IG_COLORS.ctaButton : "#c7c7c7",
              transition: "background 150ms",
            }}
          />
        ))}
      </div>
    </div>
  )
}

const FeedFrame = ({
  imageUrl,
  videoUrl,
  carousel,
  caption,
  name,
  businessName,
  link,
  ctaLabel,
}: {
  imageUrl?: string
  videoUrl?: string
  carousel?: AdPreviewCarouselCard[]
  caption?: string
  name?: string
  businessName: string
  link?: string | null
  ctaLabel?: string
}) => {
  const { domain, cta } = getLinkInfo(link)

  return (
    <div
      className="mx-auto overflow-hidden"
      style={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 28,
        background: "#fff",
        boxShadow: "0 10px 20px rgba(6, 78, 59, 0.04), 0 0 0 1px rgba(0,0,0,0.06)",
        fontFamily: '-apple-system, "Helvetica Neue", sans-serif',
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 8px", borderBottom: `1px solid ${IG_COLORS.border}` }}>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "Quicksand, sans-serif", color: IG_COLORS.text }}>
          Instagram
        </span>
        <div style={{ display: "flex", gap: 14, color: IG_COLORS.text }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, padding: "10px 14px", overflowX: "hidden", borderBottom: `1px solid ${IG_COLORS.border}` }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <div style={{ width: 46, height: 46, borderRadius: 9999, padding: 2, background: "#dbdbdb" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 9999, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, border: "2px solid #fff" }}>
              S
            </div>
          </div>
          <span style={{ fontSize: 9, color: IG_COLORS.text }}>Você</span>
        </div>
        {STORY_BUBBLES.map((b) => (
          <div key={b.initials} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div style={{ width: 46, height: 46, borderRadius: 9999, padding: 2, background: IG_GRADIENT }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 9999, background: IG_COLORS.storyBubbleBg, color: IG_COLORS.storyBubbleText, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, border: "2px solid #fff" }}>
                {b.initials}
              </div>
            </div>
            <span style={{ fontSize: 9, color: IG_COLORS.text }}>{b.initials}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9999, flexShrink: 0, background: IG_GRADIENT, padding: 2 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 9999, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, border: "1.5px solid #fff" }}>
            {AVATAR_INITIALS(businessName)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <strong style={{ display: "block", fontWeight: 700, fontSize: "0.8125rem", color: IG_COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{businessName}</strong>
          <small style={{ fontSize: "0.6875rem", color: IG_COLORS.textMuted, fontWeight: 400 }}>Patrocinado</small>
        </div>
        <button type="button" style={{ background: "transparent", border: "none", padding: 4, color: IG_COLORS.text, cursor: "pointer", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
        </button>
      </div>
      {carousel && carousel.length > 0 ? (
        <CarouselMedia cards={carousel} />
      ) : (
        <div style={{ position: "relative", aspectRatio: "1/1", width: "100%", overflow: "hidden", background: videoUrl ? "#000" : IG_COLORS.imagePlaceholder }}>
          {videoUrl ? (
            <video src={videoUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} autoPlay muted loop playsInline />
          ) : imageUrl ? (
            <img src={imageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, rgba(0,0,0,0.02) 0 12px, rgba(0,0,0,0.04) 12px 24px)" }} />
              <div style={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: IG_COLORS.textMuted, fontSize: "0.75rem", fontWeight: 600 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" ry="3" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                <span>Sua imagem aqui</span>
              </div>
            </>
          )}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 14px", color: IG_COLORS.text }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 10, background: IG_COLORS.surfaceAlt, borderTop: `1px solid ${IG_COLORS.border}`, borderBottom: `1px solid ${IG_COLORS.border}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: IG_COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name || "Sua frase de destaque"}
          </strong>
          <small style={{ fontSize: "0.6875rem", color: IG_COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {domain}
          </small>
        </div>
        <button type="button" style={{ background: IG_COLORS.ctaButton, color: "#fff", border: "none", padding: "7px 14px", borderRadius: 8, fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0 }}>
          {ctaLabel ?? cta}
        </button>
      </div>
      {caption && (
        <div style={{ padding: "8px 14px 12px" }}>
          <p className="line-clamp-2" style={{ fontSize: "0.8125rem", lineHeight: 1.4, color: IG_COLORS.text, margin: 0 }}>
            <strong style={{ fontWeight: 700 }}>{businessName} </strong>
            {caption}
          </p>
        </div>
      )}
    </div>
  )
}

export const AdPreview = ({ name, message, feedImageUrl, storyImageUrl, videoUrl, carousel, organizationName = "Meu negócio", link, callToAction, className }: AdPreviewProps) => {
  const [tab, setTab] = useState<Tab>("feed")

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="flex rounded-full bg-card p-1 shadow-ambient">
        {(["feed", "story"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-4 py-1.5 text-label-caps font-semibold transition-colors",
              tab === t
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "story" ? "Stories & Reels" : "Feed"}
          </button>
        ))}
      </div>
      {tab === "story" ? (
        <StoryFrame
          imageUrl={storyImageUrl}
          videoUrl={videoUrl}
          caption={message}
          businessName={organizationName}
          ctaLabel={callToAction}
        />
      ) : (
        <FeedFrame
          imageUrl={feedImageUrl}
          videoUrl={videoUrl}
          carousel={carousel}
          caption={message}
          name={name ?? undefined}
          businessName={organizationName}
          link={link}
          ctaLabel={callToAction}
        />
      )}
      <p className="text-label-caps text-muted-foreground text-center max-lg:hidden">
        Prévia do anúncio · atualiza conforme você preenche
      </p>
    </div>
  )
}

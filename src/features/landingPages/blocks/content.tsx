import type { ComponentConfig } from "@measured/puck";

import {
  type SectionStyleProps,
  sectionStyleFields,
  sectionStyleDefaults,
  sectionWrapper,
  buttonStyle,
  colorField,
} from "./shared";
import { imageField } from "./image-field";

/* ------------------------------------------------------------------ */
/* BrandHeader                                                         */
/* ------------------------------------------------------------------ */

export type BrandHeaderProps = {
  businessName: string;
  logoUrl: string;
  backgroundColor: string;
  textColor: string;
  align: "left" | "center";
};

export const BrandHeader: ComponentConfig<BrandHeaderProps> = {
  label: "Barra de marca (topo)",
  fields: {
    businessName: { type: "text", label: "Nome do negócio" },
    logoUrl: imageField("Logo (opcional)"),
    backgroundColor: colorField("Cor de fundo"),
    textColor: colorField("Cor do texto"),
    align: {
      type: "radio",
      label: "Alinhamento",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
      ],
    },
  },
  defaultProps: {
    businessName: "Seu Negócio",
    logoUrl: "",
    backgroundColor: "#047857",
    textColor: "#ffffff",
    align: "left",
  },
  render: ({ businessName, logoUrl, backgroundColor, textColor, align }) => (
    <header style={{ backgroundColor, color: textColor, padding: "14px 16px" }}>
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        {logoUrl && (
          /* eslint-disable-next-line @next/next/no-img-element -- user-provided external URL */
          <img src={logoUrl} alt={businessName} style={{ height: 32, display: "block" }} />
        )}
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 0.2 }}>{businessName}</span>
      </div>
    </header>
  ),
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export type HeroProps = {
  title: string;
  subtitle: string;
  backgroundColor: string;
  backgroundImage: string;
  overlayOpacity: number;
  textColor: string;
  align: "left" | "center";
  paddingY: number;
  buttonLabel: string;
  buttonUrl: string;
  buttonColor: string;
};

export const Hero: ComponentConfig<HeroProps> = {
  label: "Hero (topo)",
  fields: {
    title: { type: "text", label: "Título" },
    subtitle: { type: "textarea", label: "Subtítulo" },
    backgroundColor: colorField("Cor de fundo"),
    backgroundImage: imageField("Imagem de fundo (opcional)"),
    overlayOpacity: { type: "number", label: "Escurecer imagem (0-100)" },
    textColor: colorField("Cor do texto"),
    align: {
      type: "radio",
      label: "Alinhamento",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
      ],
    },
    paddingY: { type: "number", label: "Altura (espaçamento vertical px)" },
    buttonLabel: { type: "text", label: "Botão: texto (vazio = sem botão)" },
    buttonUrl: { type: "text", label: "Botão: link" },
    buttonColor: colorField("Botão: cor"),
  },
  defaultProps: {
    title: "Seu negócio merece mais clientes",
    subtitle: "Descreva aqui a principal oferta da sua campanha.",
    backgroundColor: "#1d4ed8",
    backgroundImage: "",
    overlayOpacity: 40,
    textColor: "#ffffff",
    align: "center",
    paddingY: 64,
    buttonLabel: "",
    buttonUrl: "#form",
    buttonColor: "#16a34a",
  },
  render: ({
    title,
    subtitle,
    backgroundColor,
    backgroundImage,
    overlayOpacity,
    textColor,
    align,
    paddingY,
    buttonLabel,
    buttonUrl,
    buttonColor,
  }) => (
    <section
      style={{
        position: "relative",
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: textColor,
        padding: `${paddingY}px 16px`,
        textAlign: align,
        overflow: "hidden",
      }}
    >
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#000",
            opacity: Math.min(Math.max(overlayOpacity, 0), 100) / 100,
          }}
        />
      )}
      <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 18, marginTop: 16, opacity: 0.92 }}>{subtitle}</p>}
        {buttonLabel && (
          <a href={buttonUrl} style={{ ...buttonStyle(buttonColor), marginTop: 24 }}>
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  ),
};

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

export type TextProps = SectionStyleProps & {
  content: string;
  fontSize: number;
  textColor: string;
  align: "left" | "center" | "right";
};

export const Text: ComponentConfig<TextProps> = {
  label: "Texto",
  fields: {
    content: { type: "textarea", label: "Conteúdo" },
    fontSize: { type: "number", label: "Tamanho da fonte" },
    textColor: colorField("Cor do texto"),
    align: {
      type: "radio",
      label: "Alinhamento",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
    },
    ...sectionStyleFields,
  },
  defaultProps: {
    content: "Escreva aqui os detalhes da sua oferta.",
    fontSize: 16,
    textColor: "#111827",
    align: "left",
    ...sectionStyleDefaults,
  },
  render: ({ content, fontSize, textColor, align, ...section }) => {
    const s = sectionWrapper(section);
    return (
      <section style={s.outer}>
        <p
          style={{
            ...s.inner,
            fontSize,
            color: textColor,
            textAlign: align,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </p>
      </section>
    );
  },
};

/* ------------------------------------------------------------------ */
/* Heading                                                             */
/* ------------------------------------------------------------------ */

export type HeadingProps = SectionStyleProps & {
  text: string;
  level: "h1" | "h2" | "h3";
  textColor: string;
  align: "left" | "center";
};

const HEADING_SIZES: Record<HeadingProps["level"], number> = { h1: 40, h2: 32, h3: 24 };

export const Heading: ComponentConfig<HeadingProps> = {
  label: "Título de seção",
  fields: {
    text: { type: "text", label: "Texto" },
    level: {
      type: "radio",
      label: "Tamanho",
      options: [
        { label: "Principal (h1)", value: "h1" },
        { label: "Grande", value: "h2" },
        { label: "Médio", value: "h3" },
      ],
    },
    textColor: colorField("Cor do texto"),
    align: {
      type: "radio",
      label: "Alinhamento",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
      ],
    },
    ...sectionStyleFields,
  },
  defaultProps: {
    text: "Título da seção",
    level: "h2",
    textColor: "#111827",
    align: "center",
    ...sectionStyleDefaults,
  },
  render: ({ text, level, textColor, align, ...section }) => {
    const s = sectionWrapper(section);
    const Tag = level;
    return (
      <section style={s.outer}>
        <Tag
          style={{
            ...s.inner,
            color: textColor,
            textAlign: align,
            fontSize: HEADING_SIZES[level],
            fontWeight: 800,
            margin: "0 auto",
          }}
        >
          {text}
        </Tag>
      </section>
    );
  },
};

/* ------------------------------------------------------------------ */
/* Image                                                               */
/* ------------------------------------------------------------------ */

export type ImageProps = SectionStyleProps & {
  url: string;
  alt: string;
  borderRadius: number;
  maxWidth: number;
};

export const Image: ComponentConfig<ImageProps> = {
  label: "Imagem",
  fields: {
    url: imageField("Imagem"),
    alt: { type: "text", label: "Texto alternativo" },
    borderRadius: { type: "number", label: "Borda arredondada (px)" },
    maxWidth: { type: "number", label: "Largura máxima (px)" },
    ...sectionStyleFields,
  },
  defaultProps: {
    url: "https://placehold.co/720x360",
    alt: "",
    borderRadius: 12,
    maxWidth: 720,
    ...sectionStyleDefaults,
  },
  render: ({ url, alt, borderRadius, maxWidth, ...section }) => {
    const s = sectionWrapper(section, maxWidth);
    return (
      <section style={s.outer}>
        <div style={s.inner}>
          {/* eslint-disable-next-line @next/next/no-img-element -- user-provided external URL */}
          <img src={url} alt={alt} style={{ width: "100%", borderRadius, display: "block" }} />
        </div>
      </section>
    );
  },
};

/* ------------------------------------------------------------------ */
/* Video (YouTube)                                                     */
/* ------------------------------------------------------------------ */

export type VideoProps = SectionStyleProps & {
  url: string;
};

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export const Video: ComponentConfig<VideoProps> = {
  label: "Vídeo (YouTube)",
  fields: {
    url: { type: "text", label: "Link do vídeo no YouTube" },
    ...sectionStyleFields,
  },
  defaultProps: {
    url: "",
    ...sectionStyleDefaults,
  },
  render: ({ url, puck, ...section }) => {
    const s = sectionWrapper(section);
    const embed = youtubeEmbedUrl(url);

    // Without a valid URL: show a hint inside the editor, render nothing on
    // the published page.
    if (!embed && !puck?.isEditing) return <></>;

    return (
      <section style={s.outer}>
        <div style={s.inner}>
          {embed ? (
            <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden" }}>
              <iframe
                src={embed}
                title="Vídeo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
          ) : (
            <div
              style={{
                border: "2px dashed #d1d5db",
                borderRadius: 12,
                padding: 40,
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              Cole um link do YouTube no painel ao lado
            </div>
          )}
        </div>
      </section>
    );
  },
};

/* ------------------------------------------------------------------ */
/* FeatureList                                                         */
/* ------------------------------------------------------------------ */

export type FeatureListProps = SectionStyleProps & {
  items: { icon: string; title: string; description: string }[];
  columns: number;
  textColor: string;
};

export const FeatureList: ComponentConfig<FeatureListProps> = {
  label: "Lista de benefícios",
  fields: {
    items: {
      type: "array",
      label: "Itens",
      getItemSummary: (item) => item.title || "Benefício",
      arrayFields: {
        icon: { type: "text", label: "Ícone (emoji)" },
        title: { type: "text", label: "Título" },
        description: { type: "textarea", label: "Descrição" },
      },
      defaultItemProps: { icon: "✅", title: "Benefício", description: "" },
    },
    columns: { type: "number", label: "Colunas (1-4)", min: 1, max: 4 },
    textColor: colorField("Cor do texto"),
    ...sectionStyleFields,
  },
  defaultProps: {
    items: [
      { icon: "🚀", title: "Rápido", description: "Atendimento ágil do início ao fim." },
      { icon: "💰", title: "Preço justo", description: "Qualidade sem pesar no bolso." },
      { icon: "⭐", title: "Bem avaliado", description: "Clientes satisfeitos recomendam." },
    ],
    columns: 3,
    textColor: "#111827",
    ...sectionStyleDefaults,
  },
  render: ({ items, columns, textColor, ...section }) => {
    const s = sectionWrapper(section, 960);
    return (
      <section style={s.outer}>
        <div
          className="lp-columns"
          style={{
            ...s.inner,
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(Math.max(columns, 1), 4)}, 1fr)`,
            gap: 24,
            color: textColor,
          }}
        >
          {items.map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36 }}>{item.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "8px 0 4px" }}>{item.title}</h3>
              <p style={{ fontSize: 14, opacity: 0.8, margin: 0, lineHeight: 1.5 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  },
};

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export type TestimonialsProps = SectionStyleProps & {
  items: { quote: string; name: string; role: string; avatarUrl: string }[];
};

export const Testimonials: ComponentConfig<TestimonialsProps> = {
  label: "Depoimentos",
  fields: {
    items: {
      type: "array",
      label: "Depoimentos",
      getItemSummary: (item) => item.name || "Depoimento",
      arrayFields: {
        quote: { type: "textarea", label: "Depoimento" },
        name: { type: "text", label: "Nome" },
        role: { type: "text", label: "Descrição (ex: cliente desde 2023)" },
        avatarUrl: imageField("Foto (opcional)"),
      },
      defaultItemProps: { quote: "Recomendo demais!", name: "Cliente", role: "", avatarUrl: "" },
    },
    ...sectionStyleFields,
  },
  defaultProps: {
    items: [
      {
        quote: "Serviço excelente, superou minhas expectativas.",
        name: "Maria Silva",
        role: "Cliente",
        avatarUrl: "",
      },
    ],
    ...sectionStyleDefaults,
  },
  render: ({ items, ...section }) => {
    const s = sectionWrapper(section, 960);
    return (
      <section style={s.outer}>
        <div
          className="lp-columns"
          style={{
            ...s.inner,
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(items.length, 3) || 1}, 1fr)`,
            gap: 24,
          }}
        >
          {items.map((item, i) => (
            <figure
              key={i}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 24,
                margin: 0,
                backgroundColor: "#ffffff",
              }}
            >
              <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.6, fontStyle: "italic" }}>
                “{item.quote}”
              </blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
                {item.avatarUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element -- user-provided external URL */
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                  {item.role && <div style={{ fontSize: 12, color: "#6b7280" }}>{item.role}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  },
};

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export type FaqProps = SectionStyleProps & {
  items: { question: string; answer: string }[];
};

export const Faq: ComponentConfig<FaqProps> = {
  label: "Perguntas frequentes",
  fields: {
    items: {
      type: "array",
      label: "Perguntas",
      getItemSummary: (item) => item.question || "Pergunta",
      arrayFields: {
        question: { type: "text", label: "Pergunta" },
        answer: { type: "textarea", label: "Resposta" },
      },
      defaultItemProps: { question: "Nova pergunta?", answer: "" },
    },
    ...sectionStyleFields,
  },
  defaultProps: {
    items: [
      { question: "Como funciona?", answer: "Explique aqui o passo a passo." },
      { question: "Qual o prazo?", answer: "Explique aqui prazos e condições." },
    ],
    ...sectionStyleDefaults,
  },
  render: ({ items, ...section }) => {
    const s = sectionWrapper(section);
    return (
      <section style={s.outer}>
        <div style={s.inner}>
          {items.map((item, i) => (
            <details
              key={i}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 8,
                backgroundColor: "#ffffff",
              }}
            >
              <summary style={{ fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
                {item.question}
              </summary>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    );
  },
};

/* ------------------------------------------------------------------ */
/* CustomHtml                                                          */
/* ------------------------------------------------------------------ */

export type CustomHtmlProps = {
  html: string;
};

export const CustomHtml: ComponentConfig<CustomHtmlProps> = {
  label: "HTML personalizado",
  fields: {
    html: { type: "textarea", label: "Código HTML" },
  },
  defaultProps: {
    html: "",
  },
  render: ({ html }) => (
    // Owner-authored content on their own page (same trust model as Unbounce custom scripts)
    <div dangerouslySetInnerHTML={{ __html: html }} />
  ),
};

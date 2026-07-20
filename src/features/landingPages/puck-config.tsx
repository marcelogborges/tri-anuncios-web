"use client";

import type { Config } from "@measured/puck";

import {
  BrandHeader,
  Hero,
  Text,
  Heading,
  Image,
  Video,
  FeatureList,
  Testimonials,
  Faq,
  CustomHtml,
  type BrandHeaderProps,
  type HeroProps,
  type TextProps,
  type HeadingProps,
  type ImageProps,
  type VideoProps,
  type FeatureListProps,
  type TestimonialsProps,
  type FaqProps,
  type CustomHtmlProps,
} from "./blocks/content";
import {
  Columns,
  Spacer,
  Divider,
  type ColumnsProps,
  type SpacerProps,
  type DividerProps,
} from "./blocks/layout";
import {
  CallToAction,
  LeadForm,
  WhatsAppButton,
  type CallToActionProps,
  type LeadFormProps,
  type WhatsAppButtonProps,
} from "./blocks/conversion";

/**
 * Puck config — shared by the editor and the public renderer.
 * Blocks use inline styles so published pages don't depend on the app's
 * Tailwind bundle (and render correctly inside Puck's editor iframe).
 */

export type LandingPageProps = {
  BrandHeader: BrandHeaderProps;
  Hero: HeroProps;
  Text: TextProps;
  Heading: HeadingProps;
  Image: ImageProps;
  Video: VideoProps;
  FeatureList: FeatureListProps;
  Testimonials: TestimonialsProps;
  Faq: FaqProps;
  CustomHtml: CustomHtmlProps;
  Columns: ColumnsProps;
  Spacer: SpacerProps;
  Divider: DividerProps;
  CallToAction: CallToActionProps;
  LeadForm: LeadFormProps;
  WhatsAppButton: WhatsAppButtonProps;
};

export type RootProps = {
  backgroundColor: string;
  textColor: string;
  fontFamily: "system" | "serif" | "mono";
};

const FONT_STACKS: Record<RootProps["fontFamily"], string> = {
  system: "system-ui, -apple-system, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'Courier New', monospace",
};

/**
 * Fields the editor exposes per block — content only (texts, images, links,
 * form fields). Everything structural (layout, spacing, colors, typography)
 * is locked to the template's values. Slot fields must stay declared so the
 * editor keeps rendering and selecting nested blocks inside Columns.
 */
const EDITOR_CONTENT_FIELDS: Record<keyof LandingPageProps, string[]> = {
  BrandHeader: ["businessName", "logoUrl"],
  Hero: ["title", "subtitle", "backgroundImage", "buttonLabel", "buttonUrl"],
  Text: ["content"],
  Heading: ["text"],
  Image: ["url", "alt"],
  Video: ["url"],
  FeatureList: ["items"],
  Testimonials: ["items"],
  Faq: ["items"],
  CustomHtml: [],
  Columns: ["left", "right", "third"],
  Spacer: [],
  Divider: [],
  CallToAction: ["label", "url"],
  LeadForm: ["title", "buttonLabel", "successMessage", "formFields"],
  WhatsAppButton: ["phone", "message", "label"],
}

export const landingPageConfig: Config<LandingPageProps, RootProps> = {
  components: {
    BrandHeader,
    Hero,
    Text,
    Heading,
    Image,
    Video,
    FeatureList,
    Testimonials,
    Faq,
    CustomHtml,
    Columns,
    Spacer,
    Divider,
    CallToAction,
    LeadForm,
    WhatsAppButton,
  },
  categories: {
    layout: { title: "Layout", components: ["Columns", "Spacer", "Divider"] },
    conteudo: {
      title: "Conteúdo",
      components: [
        "BrandHeader",
        "Hero",
        "Heading",
        "Text",
        "Image",
        "Video",
        "FeatureList",
        "Testimonials",
        "Faq",
      ],
    },
    conversao: {
      title: "Conversão",
      components: ["CallToAction", "LeadForm", "WhatsAppButton"],
    },
    avancado: { title: "Avançado", components: ["CustomHtml"] },
  },
  root: {
    fields: {
      backgroundColor: { type: "text", label: "Cor de fundo da página" },
      textColor: { type: "text", label: "Cor padrão do texto" },
      fontFamily: {
        type: "select",
        label: "Fonte",
        options: [
          { label: "Moderna (padrão)", value: "system" },
          { label: "Clássica (serifada)", value: "serif" },
          { label: "Monoespaçada", value: "mono" },
        ],
      },
    },
    defaultProps: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      fontFamily: "system",
    },
    render: ({ children, backgroundColor, textColor, fontFamily }) => (
      <div
        style={{
          fontFamily: FONT_STACKS[fontFamily ?? "system"],
          color: textColor ?? "#111827",
          backgroundColor: backgroundColor ?? "#ffffff",
          minHeight: "100vh",
        }}
      >
        <style>{`@media (max-width: 640px) { .lp-columns { grid-template-columns: 1fr !important; } }`}</style>
        {children}
      </div>
    ),
  },
};

/**
 * Editor-only variant: same components and render functions, but each block
 * exposes only its content fields and the page root exposes none. Structure
 * always comes from the chosen template. The public renderer keeps using
 * `landingPageConfig`, so existing pages render unchanged.
 */
export const landingPageEditorConfig: Config<LandingPageProps, RootProps> = {
  ...landingPageConfig,
  components: Object.fromEntries(
    Object.entries(landingPageConfig.components).map(([name, component]) => {
      const allowed = EDITOR_CONTENT_FIELDS[name as keyof LandingPageProps] ?? []
      return [
        name,
        {
          ...component,
          fields: Object.fromEntries(
            Object.entries(component.fields ?? {}).filter(([field]) => allowed.includes(field)),
          ),
        },
      ]
    }),
  ) as Config<LandingPageProps, RootProps>["components"],
  root: {
    ...landingPageConfig.root,
    // Theme is locked to the template; the editor shows no page-level fields.
    fields: {} as NonNullable<Config<LandingPageProps, RootProps>["root"]>["fields"],
  },
};

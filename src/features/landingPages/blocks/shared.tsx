import type { Fields } from "@measured/puck";

/** Style options shared by every content section. */
export type SectionStyleProps = {
  paddingY: number;
  backgroundColor: string;
};

export const sectionStyleFields: Fields<SectionStyleProps> = {
  paddingY: { type: "number", label: "Espaçamento vertical (px)" },
  backgroundColor: { type: "text", label: "Cor de fundo (ex: #ffffff ou transparent)" },
};

export const sectionStyleDefaults: SectionStyleProps = {
  paddingY: 24,
  backgroundColor: "transparent",
};

export function sectionWrapper(
  { paddingY, backgroundColor }: SectionStyleProps,
  maxWidth = 720,
): { outer: React.CSSProperties; inner: React.CSSProperties } {
  return {
    outer: { backgroundColor, padding: `${paddingY}px 16px` },
    inner: { maxWidth, margin: "0 auto" },
  };
}

export const buttonStyle = (backgroundColor: string, radius = 999): React.CSSProperties => ({
  display: "inline-block",
  backgroundColor,
  color: "#fff",
  fontWeight: 700,
  fontSize: 18,
  padding: "14px 36px",
  borderRadius: radius,
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
});

export const colorField = (label: string) => ({ type: "text" as const, label });

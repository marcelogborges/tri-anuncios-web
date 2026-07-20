import type { ComponentConfig, Slot } from "@measured/puck";

import {
  type SectionStyleProps,
  sectionStyleFields,
  sectionStyleDefaults,
  colorField,
} from "./shared";

export type ColumnsProps = SectionStyleProps & {
  ratio: "1fr 1fr" | "2fr 1fr" | "1fr 2fr" | "1fr 1fr 1fr";
  gap: number;
  verticalAlign: "start" | "center" | "end";
  left: Slot;
  right: Slot;
  third: Slot;
};

export const Columns: ComponentConfig<ColumnsProps> = {
  label: "Colunas",
  fields: {
    ratio: {
      type: "select",
      label: "Layout",
      options: [
        { label: "2 colunas — 50% / 50%", value: "1fr 1fr" },
        { label: "2 colunas — 66% / 33%", value: "2fr 1fr" },
        { label: "2 colunas — 33% / 66%", value: "1fr 2fr" },
        { label: "3 colunas iguais", value: "1fr 1fr 1fr" },
      ],
    },
    gap: { type: "number", label: "Espaço entre colunas (px)" },
    verticalAlign: {
      type: "radio",
      label: "Alinhamento vertical",
      options: [
        { label: "Topo", value: "start" },
        { label: "Centro", value: "center" },
        { label: "Base", value: "end" },
      ],
    },
    left: { type: "slot", label: "Coluna 1" },
    right: { type: "slot", label: "Coluna 2" },
    third: { type: "slot", label: "Coluna 3 (só no layout de 3)" },
    ...sectionStyleFields,
  },
  defaultProps: {
    ratio: "1fr 1fr",
    gap: 24,
    verticalAlign: "start",
    left: [],
    right: [],
    third: [],
    ...sectionStyleDefaults,
  },
  render: ({
    ratio,
    gap,
    verticalAlign,
    left: Left,
    right: Right,
    third: Third,
    paddingY,
    backgroundColor,
  }) => (
    <section style={{ backgroundColor, padding: `${paddingY}px 16px` }}>
      <div
        className="lp-columns"
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: ratio,
          gap,
          alignItems: verticalAlign,
        }}
      >
        <Left />
        <Right />
        {ratio === "1fr 1fr 1fr" && <Third />}
      </div>
    </section>
  ),
};

export type SpacerProps = { height: number };

export const Spacer: ComponentConfig<SpacerProps> = {
  label: "Espaçador",
  fields: {
    height: { type: "number", label: "Altura (px)" },
  },
  defaultProps: { height: 32 },
  render: ({ height }) => <div style={{ height }} />,
};

export type DividerProps = {
  color: string;
  thickness: number;
  width: number;
};

export const Divider: ComponentConfig<DividerProps> = {
  label: "Linha divisória",
  fields: {
    color: colorField("Cor"),
    thickness: { type: "number", label: "Espessura (px)" },
    width: { type: "number", label: "Largura (%)" },
  },
  defaultProps: { color: "#e5e7eb", thickness: 1, width: 100 },
  render: ({ color, thickness, width }) => (
    <div style={{ padding: "16px 16px" }}>
      <hr
        style={{
          border: "none",
          borderTop: `${thickness}px solid ${color}`,
          width: `${Math.min(Math.max(width, 5), 100)}%`,
          margin: "0 auto",
        }}
      />
    </div>
  ),
};

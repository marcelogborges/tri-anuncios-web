"use client";

import { useState } from "react";
import type { ComponentConfig } from "@measured/puck";

import { useLandingPageRuntime } from "../runtime-context";
import {
  type SectionStyleProps,
  sectionStyleFields,
  sectionStyleDefaults,
  sectionWrapper,
  buttonStyle,
  colorField,
} from "./shared";

/* ------------------------------------------------------------------ */
/* CallToAction                                                        */
/* ------------------------------------------------------------------ */

export type CallToActionProps = SectionStyleProps & {
  label: string;
  url: string;
  buttonColor: string;
  borderRadius: number;
  size: "md" | "lg";
  align: "left" | "center";
};

export const CallToAction: ComponentConfig<CallToActionProps> = {
  label: "Botão (CTA)",
  fields: {
    label: { type: "text", label: "Texto do botão" },
    url: { type: "text", label: "Link" },
    buttonColor: colorField("Cor do botão"),
    borderRadius: { type: "number", label: "Borda arredondada (px)" },
    size: {
      type: "radio",
      label: "Tamanho",
      options: [
        { label: "Normal", value: "md" },
        { label: "Grande", value: "lg" },
      ],
    },
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
    label: "Quero aproveitar",
    url: "#",
    buttonColor: "#16a34a",
    borderRadius: 999,
    size: "md",
    align: "center",
    ...sectionStyleDefaults,
  },
  render: ({ label, url, buttonColor, borderRadius, size, align, ...section }) => {
    const s = sectionWrapper(section);
    return (
      <section style={{ ...s.outer, textAlign: align }}>
        <a
          href={url}
          style={{
            ...buttonStyle(buttonColor, borderRadius),
            fontSize: size === "lg" ? 22 : 18,
            padding: size === "lg" ? "18px 48px" : "14px 36px",
          }}
        >
          {label}
        </a>
      </section>
    );
  },
};

/* ------------------------------------------------------------------ */
/* LeadForm                                                            */
/* ------------------------------------------------------------------ */

export type FormFieldDef = {
  label: string;
  fieldType: "text" | "email" | "tel" | "textarea";
  required: boolean;
};

export type LeadFormProps = SectionStyleProps & {
  title: string;
  buttonLabel: string;
  buttonColor: string;
  successMessage: string;
  formFields: FormFieldDef[];
};

export const LeadForm: ComponentConfig<LeadFormProps> = {
  label: "Formulário de contato",
  fields: {
    title: { type: "text", label: "Título" },
    buttonLabel: { type: "text", label: "Texto do botão" },
    buttonColor: colorField("Cor do botão"),
    successMessage: { type: "text", label: "Mensagem de sucesso" },
    formFields: {
      type: "array",
      label: "Campos do formulário",
      getItemSummary: (item) => item.label || "Campo",
      arrayFields: {
        label: { type: "text", label: "Rótulo" },
        fieldType: {
          type: "select",
          label: "Tipo",
          options: [
            { label: "Texto", value: "text" },
            { label: "E-mail", value: "email" },
            { label: "Telefone", value: "tel" },
            { label: "Texto longo", value: "textarea" },
          ],
        },
        required: {
          type: "radio",
          label: "Obrigatório",
          options: [
            { label: "Sim", value: true },
            { label: "Não", value: false },
          ],
        },
      },
      defaultItemProps: { label: "Novo campo", fieldType: "text", required: false },
    },
    ...sectionStyleFields,
  },
  defaultProps: {
    title: "Deixe seu contato",
    buttonLabel: "Enviar",
    buttonColor: "#1d4ed8",
    successMessage: "Recebemos seus dados! Entraremos em contato.",
    formFields: [
      { label: "Nome", fieldType: "text", required: true },
      { label: "E-mail", fieldType: "email", required: true },
      { label: "Telefone", fieldType: "tel", required: false },
    ],
    ...sectionStyleDefaults,
  },
  render: (props) => <LeadFormBlock {...props} />,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 4,
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 16,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

function LeadFormBlock({
  title,
  buttonLabel,
  buttonColor,
  successMessage,
  formFields,
  ...section
}: LeadFormProps) {
  const runtime = useLandingPageRuntime();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const s = sectionWrapper(section);

  return (
    <section style={s.outer} id="form">
      <div
        style={{
          ...s.inner,
          maxWidth: 480,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 24,
          backgroundColor: "#ffffff",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 0 }}>{title}</h2>
        {status === "sent" ? (
          <p data-testid="lead-success" style={{ color: "#16a34a", fontWeight: 600 }}>
            {successMessage}
          </p>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const fields = Object.fromEntries(
                new FormData(form).entries(),
              ) as Record<string, string>;
              setStatus("sending");
              try {
                await runtime.submitLead({ fields });
                setStatus("sent");
              } catch {
                setStatus("error");
              }
            }}
          >
            {formFields.map((field, index) => (
              <label key={index} style={{ display: "block", marginBottom: 12, fontSize: 14 }}>
                {field.label}
                {field.required ? " *" : ""}
                {field.fieldType === "textarea" ? (
                  <textarea name={field.label} required={field.required} rows={4} style={inputStyle} />
                ) : (
                  <input
                    name={field.label}
                    type={field.fieldType}
                    required={field.required}
                    style={inputStyle}
                  />
                )}
              </label>
            ))}
            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                ...buttonStyle(buttonColor, 8),
                width: "100%",
                fontSize: 16,
                opacity: status === "sending" ? 0.7 : 1,
              }}
            >
              {status === "sending" ? "Enviando..." : buttonLabel}
            </button>
            {status === "error" && (
              <p style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>
                Não foi possível enviar. Tente novamente.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* WhatsAppButton                                                      */
/* ------------------------------------------------------------------ */

export type WhatsAppButtonProps = SectionStyleProps & {
  phone: string;
  message: string;
  label: string;
  floating: boolean;
};

export const WhatsAppButton: ComponentConfig<WhatsAppButtonProps> = {
  label: "Botão WhatsApp",
  fields: {
    phone: { type: "text", label: "Telefone (com DDI, só números)" },
    message: { type: "textarea", label: "Mensagem pré-preenchida" },
    label: { type: "text", label: "Texto do botão" },
    floating: {
      type: "radio",
      label: "Flutuante (canto da tela)",
      options: [
        { label: "Sim", value: true },
        { label: "Não", value: false },
      ],
    },
    ...sectionStyleFields,
  },
  defaultProps: {
    phone: "5551999999999",
    message: "Olá! Vi seu anúncio e quero saber mais.",
    label: "Chamar no WhatsApp",
    floating: false,
    ...sectionStyleDefaults,
  },
  render: ({ phone, message, label, floating, ...section }) => {
    const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    const whatsAppIcon = (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
    if (floating) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 50,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#25d366",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,.25)",
          }}
        >
          {whatsAppIcon}
        </a>
      );
    }
    const s = sectionWrapper(section);
    return (
      <section style={{ ...s.outer, textAlign: "center" }}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...buttonStyle("#25d366"), fontSize: 18 }}
        >
          {label}
        </a>
      </section>
    );
  },
};

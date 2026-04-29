# Tri Anuncios Design System — Luminous Growth

## Intent

Tri Anuncios is engineered for small business owners who require a high-performance ad management tool without the complexity of enterprise software. The brand personality is encouraging, clear, and "frictionless."

The design style follows a **Soft Corporate** aesthetic — a blend of modern minimalism and approachable, rounded geometry. By using generous white space and a restricted emerald palette, the UI reduces cognitive load, making the intimidating task of ad management feel manageable and even pleasant. The interface should evoke a sense of steady, organic growth through its use of natural greens and airy layouts.

This file is the source of truth for UI work in this repository. When creating or editing screens, components, or shadcn variants, follow this document before inventing new styles.

## Core Principles

- Prefer semantic tokens over hard-coded colors.
- Prefer tonal layers and low-contrast outlines over heavy shadows.
- Keep layouts airy. Spacing should feel intentional, not compressed.
- Use emerald green as emphasis, not decoration.
- Favor composition with shadcn primitives. Do not fork parallel component families unless the product truly needs a new pattern.
- Keep the UI soft-corporate and modern, not playful, neon, or ornamental.

## Register

- Surface type: `product`
- Color strategy: `emerald-restrained`
- Default theme: `light`
- Accent family: `emerald`

## Color Tokens

These semantic roles are mapped in `src/app/globals.css` and consumed by Tailwind and shadcn.

The palette is Emerald-focused to signal success and vitality:

- **Primary:** Emerald Green (`#006c49`) for all primary actions, progress indicators, and active states.
- **Primary Container:** Bright Emerald (`#10b981`) for filled containers and badges.
- **Secondary:** Deep Forest (`#2b6954`) for high-contrast text and navigation elements.
- **Tertiary:** Muted Sage (`#416656`) for supporting elements.
- **Error:** Standard red (`#ba1a1a`) for destructive actions.
- **Neutral:** A strict range of whites (`#ffffff`) and light grays (`#f8f9fa`, `#f3f4f5`, `#edeeef`) to maintain a clean, organized environment.

Avoid using harsh blacks; use `on-surface` (`#191c1d`) for the darkest text to keep the interface feeling "soft."

Semantic token mapping:

- `background`: airy page canvas (`surface`)
- `foreground`: primary text (`on-surface`)
- `card`: white-raised surface for cards (`surface-container-lowest`)
- `card-foreground`: text on cards (`on-surface`)
- `primary`: main CTA, active navigation, focus accents
- `primary-foreground`: text on primary surfaces
- `secondary`: soft mint structural fill (`secondary-container`)
- `secondary-foreground`: text on mint fills (`on-secondary-container`)
- `accent`: hover and selected-neutral emphasis (`surface-container-high`)
- `accent-foreground`: text/icons on accent surfaces
- `muted`: low-contrast panels and grouped controls (`surface-container`)
- `muted-foreground`: metadata and support text (`on-surface-variant`)
- `border`: low-contrast outlines (`outline-variant`)
- `input`: form field background — light gray, borderless by default
- `ring`: focus ring — emerald
- `destructive`: error and destructive actions

## Typography

- Font family: `Plus Jakarta Sans`
- Selected for its modern, rounded terminals that provide a friendly and approachable feel without sacrificing professional rigor.
- Headlines use Bold weights with slight negative letter-spacing for a distinctive, editorial look.
- Body uses Regular weight for high readability with generous line-height.
- Labels use Semi-Bold for clarity against emerald backgrounds.

Use the provided utility classes when possible:

- `.text-display`: hero or page-leading title (40px / 48px, 700, -0.02em)
- `.text-title-1`: major section heading (32px / 40px, 700, -0.02em)
- `.text-title-2`: standard section heading (24px / 32px, 600, -0.01em)
- `.text-body-lg`: long-form lead text (18px / 28px, 400)
- `.text-body-md`: default body copy (16px / 24px, 400)
- `.text-body-sm`: labels and supporting text (14px / 20px, 600, 0.01em)
- `.text-label-caps`: captions and small metadata (12px / 16px, 500)

## Spacing And Shape

- Base unit: `8px`
- Spacing scale: `xs` 4px · `sm` 12px · `md` 24px · `lg` 48px · `xl` 80px
- Gutter: `24px`
- Page margin: `32px`
- Default page max width: `1280px`
- Grid: 12-column system with 24px gutters

Rounded corners:

- `sm`: 0.25rem (4px) — small controls
- `DEFAULT`: 0.5rem (8px) — input fields, small cards
- `md`: 0.75rem (12px) — medium elements
- `lg`: 1rem (16px) — main dashboard cards, modals
- `xl`: 1.5rem (24px) — hero sections
- `full`: 9999px — buttons (pill-shaped), chips, badges

## Elevation And Depth

This design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** `#f8f9fa`
- **Level 1 (Cards/Surface):** White (`#ffffff`) with a 1px border of `outline-variant`. No shadow.
- **Level 2 (Interactive/Floating):** White (`#ffffff`) with a very soft, diffused ambient shadow (Emerald-900 at 4% opacity, blur 20px, Y 10px).
- **Active State:** Elements should "lift" using the Level 2 shadow and a 2px Emerald border.

Default ambient shadow: `0 10px 20px rgba(6, 78, 59, 0.04)`

## Component Rules

### Buttons

- `default`: emerald green fill, white text, pill-shaped (`rounded-full`), no visible border
- `secondary`: soft mint fill (`secondary`), emerald text
- `outline`: white background, subtle border, mint hover
- `ghost`: no base fill, mint hover
- `link`: emerald text, no gradient or underline decoration unless interaction requires it
- Avoid ghost buttons for primary actions to ensure clear hierarchy

### Inputs And Textareas

- Light gray background (`#f3f4f6`) with no border in default state
- On focus, transition to white background with a 2px Emerald border
- No dark, glassy, or heavily tinted input backgrounds in the light theme

### Cards

- White surface with 1rem (16px) corner radius
- 1px `outline-variant` border
- Use for grouping ad campaign stats
- Headers within cards should be separated by a subtle 1px divider
- Avoid stacking card inside card unless the inner surface is visually lighter and clearly structural

### Badges And Chips

- Pill-shaped (`rounded-full`)
- Used for "Ad Status" (e.g., Active, Paused, Draft)
- High-chroma text on low-chroma backgrounds (e.g., dark green text on mint background)
- Reserve solid emerald for status that needs stronger emphasis

### Progress Bars

- Thick, 12px height with fully rounded caps
- Background is light gray, fill is emerald green

### Checkboxes And Radios

- Large hit-areas (minimum 44px)
- Selection indicator uses the primary emerald color

### Tabs

- The list behaves like a grouped control on a soft mint rail
- Active tab should feel crisp and elevated, not loud

## Do Not Do This

- No gradient text
- No colored side borders on cards or alerts
- No heavy drop shadows
- No pure black literals in component code
- No random color usage outside the semantic token set
- No ad hoc rounded values when an existing radius token fits
- No harsh blacks — use `on-surface` (`#191c1d`) for darkest text

## Implementation Guidance For AI

When changing UI in this repository:

1. Start from shadcn primitives in `src/components/ui`.
2. Reuse semantic classes like `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`.
3. If a new repeated visual pattern appears 3 or more times, extract it into the existing design-system layer instead of hard-coding it in feature code.
4. If you need a new color or spacing value, add or justify a token first. Do not sprinkle raw hex values through JSX.
5. Preserve the soft-corporate, growth-oriented tone. If a screen feels flashy, busy, or generic-SaaS, simplify it.
6. Buttons should be pill-shaped (`rounded-full`) by default.
7. Use generous white space — `xl` spacing (80px) between major sections.
8. Cards use `rounded-lg` (16px) with 24px internal padding.

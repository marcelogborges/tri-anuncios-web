# Tri Anuncios Web

Frontend web do projeto Tri Anuncios.

## Stack

- Next.js 16
- React 19
- React Native Web
- Tailwind CSS 3
- shadcn/ui
- TypeScript

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Estrutura inicial

- `src/app`: App Router do Next.js
- `src/app/page.tsx`: home inicial baseada em componentes do shadcn/ui
- `src/app/globals.css`: tokens semanticos e utilitarios base do tema
- `src/components/ui`: componentes base do design system
- `src/components/theme-provider.tsx`: provider de tema
- `src/components/mode-toggle.tsx`: alternador de tema
- `DESIGN.md`: guia canônico da identidade visual e regras de uso para IA e humanos
- `tailwind.config.ts`: configuracao do Tailwind para o shadcn/ui
- `next.config.ts`: alias para `react-native-web`
- `components.json`: configuracao do registry do shadcn/ui

## Observacao

O `create-next-app` atual gera Tailwind 4 por padrao. Como o projeto usa `react-native-web`, a base foi ajustada para Tailwind 3 e alias do `react-native` no `Next`. O `shadcn/ui` foi instalado na versao `2.3.0`, que e a linha compativel com Tailwind 3 segundo a documentacao do projeto.

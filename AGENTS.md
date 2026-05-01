# AGENTS

## Produto

`tri-anuncios-web` e o frontend de um MVP para simplificar a solicitacao e a gestao de anuncios pagos em plataformas digitais.

O produto centraliza o cadastro de organizacoes, usuarios, pacotes de anuncio, solicitacoes de campanha, contas de plataforma e publicacoes. A proposta e oferecer uma camada mais simples para pequenos negocios organizarem suas necessidades de divulgacao sem lidar diretamente com toda a complexidade operacional das ferramentas de trafego pago.

Este repositorio faz parte de um TCC focado no desenvolvimento e validacao de uma aplicacao web para apoiar pequenos negocios na criacao e solicitacao de anuncios pagos. O frontend consome a API do repositorio `tri-anuncios-api`.

## Stack

- `Next.js` com `App Router`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`

`react-native-web` existe no projeto, mas a aplicacao deve ser tratada como **web-first**.

## Arquitetura

O projeto deve seguir organizacao **feature oriented**.

Exemplos de features:

- `home`
- `login`
- `adCreationFlow`
- `dashboard`
- `organizations`
- `users`

Estrutura esperada:

```txt
src/
  features/
    home/
    login/
    adCreationFlow/
    dashboard/
    organizations/
    users/
```

Regra:

- o que pertence a um dominio deve ficar na feature
- o que e base compartilhada pode ficar fora da feature

Codigo global permitido:

- `src/components/ui`: base do `shadcn/ui`
- `src/lib`: infraestrutura compartilhada
- `src/api`: chamadas HTTP por dominio enquanto a camada continuar simples

## API / Actions

Chamadas para o backend devem ser simples e centralizadas por dominio.

Exemplos:

- `src/api/organization.ts`
- `src/api/ad-request.ts`
- `src/api/user.ts`
- `src/api/auth.ts`

Regras:

- componentes nao fazem `fetch` direto
- a UI consome funcoes de `src/api/*`
- a logica HTTP compartilhada fica em `src/lib/api.ts`
- nomes devem ser explicitos, como `getOrganizations`, `createOrganization`, `signIn`, `signOut`
- payloads devem respeitar o contrato real do backend Rails

## UI

Use `shadcn/ui` como base.

Regras:

- antes de alterar UI, ler `DESIGN.md`
- preferir componentes de `src/components/ui`
- evitar criar componentes paralelos que duplicam o `shadcn/ui`
- componentes especificos de uma feature devem ficar dentro da propria feature
- usar tokens semanticos de cor, espaco e raio em vez de valores soltos
- se um padrao visual repetir 3 vezes ou mais, extrair para a camada compartilhada

## Regras De Codigo

- nao usar `function`
- usar apenas arrow functions, como `const myFunction = () => {}`
- nao usar `.then()` / `.catch()` em promises; usar `async` / `await` com `try` / `catch`
- nao usar `Promise.allSettled`; usar `await` individuais com `try` / `catch` separados
- nao fazer chamadas HTTP diretamente em componentes
- nao colocar regra de backend dentro da UI
- preferir nomes claros e orientados ao dominio
- evitar abstracoes cedo demais
- manter solucoes simples e consistentes com o projeto

## Regras De TSX

- sem comentarios dentro do JSX (`{/* ... */}`)
- sem linhas em branco dentro do bloco JSX retornado
- sempre uma linha em branco antes e depois de blocos de codigo fora do JSX (entre declaracoes de variaveis, funcoes, hooks, return)
- nunca declarar `const`, `let` ou funcoes dentro do JSX (ex: dentro de `.map`); extrair para variaveis ou funcoes antes do `return`
- um unico componente exportado por arquivo
- nunca usar IIFE dentro do JSX; calcular valores antes do `return` e usar condicionais simples no JSX

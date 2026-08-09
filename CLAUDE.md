# GUARDA — frontend

Interface do GUARDA: plataforma onde um professor de jiu jitsu publica aulas
organizadas em trilhas e o aluno assiste na ordem que o professor ensina.

Next.js 15 (App Router) consumindo o `guarda-backend` (porta 3001) via HTTP com
cookies de sessão do Better Auth.

Este repositório nasceu do `blank-frontend`, que continua acessível como remote
`upstream` — dá para puxar melhorias da base com `git fetch upstream`.

## Antes de escrever código

Leia [`docs/frontend_architecture.md`](docs/frontend_architecture.md) e
[`docs/api_architecture.md`](docs/api_architecture.md). Cobrem a stack, o fluxo de
autenticação em três camadas, o sistema de formulários e a organização de uma
tela. O que está abaixo complementa, não substitui.

## Idioma

**Código em inglês, texto de tela em português.**

Rotas, componentes, arquivos, hooks, variáveis e mensagens de commit em inglês.
Todo texto visível ao usuário passa por i18n — nada de string em português
hardcoded no JSX. As traduções vivem em `src/i18n/messages/pt/`; por enquanto só
`pt` é preenchido.

## Referências visuais

Duas fontes, complementares:

- **Paper** — arquivo `GUARDA — Plataforma do Professor`. Fonte de verdade do
  desktop e do design system. Consultável pelo MCP do Paper Desktop.
- **`guarda-prototipo`** — protótipo funcional em Preact, responsivo. Referência
  para comportamento mobile e para telas que o Paper não cobre
  (`ProfAlunos`, `AlunoTrilhas`).

## Regras que não estão na doc

**Nada de fetch em componente.** Toda chamada de API passa por um hook de slice em
`src/lib/<feature>/<feature>.slice.ts`, com um objeto `keys` no padrão de
`src/lib/userInfo/userInfo.slice.ts`.

> A doc de API mostra `axiosInstance` como default import. O código real exporta
> `api` nomeado de `@/utils/axios`. Siga o código.

**Navegação.** Sempre `<Link href>`. Nunca `router.push()` em `onClick` — bloqueia
o pre-render e gera atraso visível no clique. Para botões, `<Button asChild>` com
`<Link>` dentro, como o `NavigationButton` já faz.

**Formulários.** `Controller` do React Hook Form, nunca `register()`. Use os
componentes do barrel `@/components/layout/Form` — `FormInput`, `FormTextarea`,
`FormSelect`, `FormPasswordInput`, `SubmitButton`. Schemas Zod em `schema.ts` ao
lado da tela.

**Ordem dentro de um componente.** Hooks e variáveis → funções e handlers →
`useEffect` → JSX.

**Organização de tela.** `page.tsx` monta; `components/` guarda o que é só dela;
`schema.ts` os Zod; `slice.ts` as queries. Componente usado em três ou mais telas
sobe para `src/components/layout/<Name>/index.tsx`.

**Design system.** Cores, tipografia, espaçamento e raio vêm dos tokens em
`src/app/globals.css` e `tailwind.config.ts`, traduzidos dos tokens do Paper.
Nada de hex solto no JSX.

**Primitivos.** `src/components/ui/` é shadcn — não edite diretamente. Componha
por cima em `src/components/layout/`.

## Comandos

```bash
yarn dev     # http://localhost:3000
yarn build
yarn lint
```

Precisa do backend rodando em `NEXT_PUBLIC_API_URL` (padrão `http://localhost:3001`).

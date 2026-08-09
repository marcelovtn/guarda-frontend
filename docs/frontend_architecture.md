# Frontend — Arquitetura

## Stack

| Tecnologia                  | Papel                                                       |
| --------------------------- | ----------------------------------------------------------- |
| **Next.js 15 (App Router)** | Framework principal, SSR + Client Components                |
| **TypeScript**              | Tipagem estática em todo o projeto                          |
| **Tailwind CSS**            | Estilização                                                 |
| **shadcn/ui + Radix**       | Componentes de UI primitivos (`src/components/ui/`)         |
| **TanStack Query**          | Cache e estado de dados remotos (substituindo fetch direto) |
| **React Hook Form + Zod**   | Formulários e validação                                     |
| **Better Auth (client)**    | Autenticação no cliente                                     |
| **i18next**                 | Internacionalização (pt, en, es)                            |

---

## Estrutura de diretórios

```
src/
├── app/                        # App Router do Next.js
│   ├── (public)/               # Rotas públicas (landing page)
│   ├── (protected)/            # Rotas autenticadas
│   │   ├── layout.tsx          # Verifica sessão server-side, redireciona se inválida
│   │   ├── ProtectedLayoutClient.tsx  # Shell visual (sidebar, topnav)
│   │   ├── home/               # Dashboard principal
│   │   └── settings/           # Configurações do usuário
│   ├── auth/                   # Telas de autenticação (login, register, etc.)
│   ├── auth-flow/              # Fluxos pós-auth (verificação de email, etc.)
│   └── middleware.ts           # Guarda de rotas e detecção de locale
│
├── components/
│   ├── ui/                     # Primitivos shadcn/ui — NÃO modifique diretamente
│   └── layout/                 # Componentes compostos da aplicação
│       ├── Form/               # Sistema de formulários (ver abaixo)
│       ├── PageContainer/      # Wrapper de página com padding padrão
│       ├── PageHeader/         # Cabeçalho de página com título e ações
│       ├── TopNavigation/      # Navbar superior (mobile)
│       ├── SidebarNavigation/  # Menu lateral (desktop)
│       └── ...
│
├── hooks/                      # Custom hooks reutilizáveis
├── lib/                        # Serviços e slices de estado
│   ├── auth-client.ts          # Instância do Better Auth client
│   ├── queryClient.ts          # Configuração do TanStack Query
│   ├── userInfo/               # Slice de dados do usuário
│   └── userData/               # Slice de dados da conta
├── utils/                      # Funções utilitárias puras
├── i18n/                       # Configuração e traduções
├── context/                    # Providers React (ThemeProvider)
└── actions/                    # Server Actions do Next.js (somente auth)
```

---

## Fluxo de autenticação

O sistema de autenticação tem três camadas que trabalham juntas para evitar bugs de performance e loops de redirecionamento.

### 1. Middleware (`src/middleware.ts`)

Executa em toda requisição antes do render. Faz duas coisas:

- **Redireciona usuários logados** de rotas públicas (`/`, `/auth/login`, etc.) para `/home`
- **Detecta `?forceLogin=1`** para evitar o loop: `protected → login → home → protected`

```ts
// Sem o forceLogin, uma sessão expirada causa loop infinito:
// layout.tsx detecta sessão inválida → redireciona para /auth/login
// middleware vê cookie ainda presente → redireciona de volta para /home
// loop...

// Com o forceLogin:
// layout.tsx redireciona para /auth/login?forceLogin=1
// middleware ignora o redirect → usuário chega na tela de login
```

O middleware também define o header `x-pathname` para que o layout server-side possa ler o path atual.

### 2. Layout protegido (`src/app/(protected)/layout.tsx`)

Server Component que roda a cada navegação para rotas protegidas:

```ts
export const dynamic = 'force-dynamic' // Impede cache de sessão antiga

export default async function ProtectedLayout({ children }) {
  const session = await getSession() // React cache() — sem chamadas duplicadas

  if (!session) {
    redirect('/auth/login?forceLogin=1') // Sinaliza para o middleware não fazer loop
  }

  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
}
```

> **Por que `force-dynamic`?** Sem ele, o Next.js pode cachear a resposta do layout. Isso faz o usuário deslogado ver conteúdo de sessões antigas.

### 3. `getSession` (`src/actions/auth.ts`)

Faz fetch para o backend `/api/auth/get-session` passando os cookies da requisição. Usa `cache()` do React para deduplicar chamadas dentro da mesma árvore de render:

```ts
export const getSession = cache(async function getSession() {
  // cache() garante que múltiplos Server Components chamando getSession()
  // na mesma requisição fazem apenas 1 fetch, não N
})
```

---

## Sistema de formulários

Todos os formulários usam **React Hook Form com Controller pattern** (não o `register()` legado).

### Componentes disponíveis

Importe tudo do barrel:

```ts
import { FormInput, FormPasswordInput, FormSelect, SubmitButton } from '@/components/layout/Form'
```

| Componente             | Uso                                                                          |
| ---------------------- | ---------------------------------------------------------------------------- |
| `FormField`            | Wrapper genérico com label e erro (use quando precisar de campo customizado) |
| `FormInput`            | Campo de texto/email/número                                                  |
| `FormPasswordInput`    | Campo de senha com toggle e indicador de força                               |
| `FormSelect`           | Dropdown com opções                                                          |
| `FormTextarea`         | Área de texto                                                                |
| `FormRadioGroup`       | Grupo de radio buttons com estilo de pill                                    |
| `FormCheckbox`         | Checkbox simples com label                                                   |
| `FormChecklistGroup`   | Lista de checkboxes em grid                                                  |
| `SubmitButton`         | Botão de submit com estado de loading                                        |
| `FormDisabledProvider` | Context para desabilitar todos os campos de um formulário                    |

### Exemplo de uso

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput, FormPasswordInput, SubmitButton } from '@/components/layout/Form'

function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput name="email" control={control} label="Email" type="email" />
      <FormPasswordInput name="password" control={control} label="Senha" />
      <SubmitButton isLoading={isSubmitting} label="Entrar" />
    </form>
  )
}
```

> **Por que Controller e não register()?** Controller integra melhor com componentes controlados (Select, RadioGroup, etc.), centraliza o estado de erro no `fieldState`, e permite o `FormDisabledProvider` funcionar sem prop drilling.

---

## Navegação

Use **sempre `<Link href="...">` para navegação**, nunca `router.push()` em `onClick`.

```tsx
// CORRETO — permite pre-render no hover, sem delay
<Link href="/dashboard">Dashboard</Link>

// ERRADO — bloqueia o pre-render do React, causa delay visível ao clicar
<button onClick={() => router.push('/dashboard')}>Dashboard</button>
```

O `NavigationButton` já implementa esse padrão corretamente com `Button asChild`:

```tsx
<Button asChild>
  <Link href={route}>{label}</Link>
</Button>
```

---

## Estado remoto (React Query / slices)

Cada feature tem um arquivo `.slice.ts` com os hooks de query/mutation:

```ts
// lib/userInfo/userInfo.slice.ts
export function useGetMinimalUserInfo() {
  return useQuery({ queryKey: ['userInfo', 'minimal'], queryFn: fetchMinimalUserInfo })
}
```

Regras:

- **Queries** → `useQuery` — dados que você lê
- **Mutations** → `useMutation` — ações que modificam dados
- **Snake_case** no que vem do backend, **camelCase** no que é interno ao frontend
- Nunca faça fetch direto em componentes — use sempre um hook de slice

---

## Organização de uma tela

```
app/(protected)/minha-feature/
├── page.tsx              # Monta a tela com os componentes
├── components/           # Componentes específicos desta tela
│   └── MeuComponente/
│       ├── index.tsx
│       └── components/   # Subcomponentes privados
│           └── MeuComponenteHeader.tsx
├── hooks/                # Hooks específicos desta tela (se necessário)
├── schema.ts             # Schemas Zod dos formulários
└── slice.ts              # Queries/mutations do React Query
```

Ordem dentro de um componente:

1. Hooks e variáveis
2. Funções e handlers
3. `useEffect`
4. Return (JSX)

---

## Internacionalização (i18n)

Tradução em 3 idiomas: `pt` (padrão), `en`, `es`.

```ts
// Num componente cliente:
const { t } = useTranslation('auth')
return <p>{t('LOGIN_TITLE')}</p>
```

Arquivos de tradução em `src/i18n/messages/[lang]/[namespace].json`.

O locale é detectado pelo middleware via cookie `LOCALE_COOKIE`. Para trocar idioma:

```ts
const { i18n } = useTranslation()
i18n.changeLanguage('en')
```

---

## Variáveis de ambiente

| Variável              | Descrição                                    |
| --------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL do backend (ex: `http://localhost:3001`) |

Copie `.env` para `.env.local` e preencha antes de rodar.

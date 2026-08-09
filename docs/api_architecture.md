# Frontend → Backend — Integração de API

## Visão geral

O frontend se comunica com o **blank-backend** (servidor Hono separado, rodando na porta 3001 por padrão). Toda comunicação é feita via HTTP com cookies de sessão do Better Auth.

```
Browser / Server Component
        │
        ├── Server Components → fetch() direto com cookies forwarding
        └── Client Components → Axios + TanStack Query
                │
                └── blank-backend :3001
                        ├── /api/auth/*         (Better Auth)
                        ├── /api/userInfo/*
                        ├── /api/user-data/*
                        └── /api/auth-custom/*
```

---

## Como fazer uma chamada de API

### No Client Component (padrão)

Use o **Axios** configurado em `src/utils/axios.ts` e envolva no TanStack Query via um `.slice.ts`:

```ts
// src/lib/minhaFeature/minhaFeature.slice.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/utils/axios'

export function useGetItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/items')
      return data
    },
  })
}

export function useCreateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateItemDTO) => {
      const { data } = await axiosInstance.post('/api/items', payload)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  })
}
```

```tsx
// No componente:
function MinhaLista() {
  const { data: items, isLoading } = useGetItems()
  const { mutateAsync: createItem } = useCreateItem()
  // ...
}
```

### No Server Component

Use `fetch()` diretamente, sempre passando os cookies:

```ts
// src/actions/minhaAction.ts
'use server'
import { cookies } from 'next/headers'

export async function getItems() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  })
  return res.json()
}
```

> Use Server Actions apenas para dados que precisam estar disponíveis no render inicial (ex: verificação de sessão). Para tudo que é interativo, use TanStack Query no cliente.

---

## Autenticação Better Auth

O Better Auth gerencia toda a autenticação. O frontend não armazena tokens — tudo é feito via cookies `HttpOnly`.

### No cliente

```ts
import { authClient } from '@/lib/auth-client'

// Login
const { data, error } = await authClient.signIn.email({ email, password })

// Registro
const { data, error } = await authClient.signUp.email({ email, password, name })

// Logout
await authClient.signOut()

// Sessão (hook React)
const { data: session } = authClient.useSession()
```

### No servidor (Server Components / Server Actions)

```ts
import { getSession } from '@/actions/auth'

const session = await getSession() // null se não autenticado
const user = session?.user
```

> **Nunca** tente ler ou manipular os cookies de sessão do Better Auth manualmente. O backend é a única fonte de verdade — use `getSession()` que delega para `/api/auth/get-session`.

---

## Endpoints disponíveis

| Método    | Rota                           | Descrição                       |
| --------- | ------------------------------ | ------------------------------- |
| `GET`     | `/api/auth/get-session`        | Retorna a sessão atual          |
| `POST`    | `/api/auth/sign-in/email`      | Login com email/senha           |
| `POST`    | `/api/auth/sign-up/email`      | Registro com email/senha        |
| `POST`    | `/api/auth/sign-out`           | Logout                          |
| `POST`    | `/api/auth/forget-password`    | Solicita reset de senha         |
| `POST`    | `/api/auth/reset-password`     | Redefine a senha com token      |
| `POST`    | `/api/auth-custom/check-email` | Verifica se email já existe     |
| `GET`     | `/api/userInfo/minimal`        | Dados mínimos do usuário logado |
| `GET`     | `/api/userInfo/`               | Dados completos do userInfo     |
| `PUT`     | `/api/userInfo/language`       | Atualiza idioma preferido       |
| `GET/PUT` | `/api/user-data/*`             | Dados da conta do usuário       |

---

## Tratamento de erros

O backend retorna erros com o formato:

```json
{ "error": "mensagem de erro" }
```

No frontend, erros do Better Auth são traduzidos via `translateBetterAuthError`:

```ts
import { translateBetterAuthError } from '@/lib/auth/utils'

const msg = translateBetterAuthError(error, t, 'AUTH_FALLBACK_KEY')
toast.error(msg)
```

Para erros de API genéricos, o Axios lança uma exceção que o TanStack Query captura. Use o `onError` da mutation ou o `isError` da query para tratar na UI.

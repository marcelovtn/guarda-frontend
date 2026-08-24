import ProtectedLayoutClient from './ProtectedLayoutClient'

/**
 * O portão de sessão vive no cliente, não aqui.
 *
 * Ler a sessão no servidor não funciona neste deploy: o cookie é emitido pelo
 * domínio da API e o servidor do Next só recebe os cookies do domínio do
 * frontend, então a sessão parecia sempre ausente e toda tela protegida
 * devolvia para o login. Ver o comentário em `src/actions/auth.ts`.
 */
export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
}

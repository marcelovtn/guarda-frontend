import { PublicLayoutClient } from './PublicLayoutClient'

/**
 * A checagem de sessão vive no cliente — o servidor do Next não recebe o
 * cookie, que pertence ao domínio da API. Ver `src/actions/auth.ts`.
 */
export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>
}

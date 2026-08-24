/**
 * Caminhos de autenticação que existem no código mas ainda não têm infra.
 *
 * Ficam escondidos porque um botão que dá erro é pior do que um botão que não
 * existe: o aluno tenta, falha e não descobre se o problema é ele. Religar cada
 * um é configuração, não código — preencha a variável e a tela volta.
 *
 * - `googleSignIn` precisa de GOOGLE_CLIENT_ID/SECRET no backend, com a URL da
 *   API registrada como redirect autorizado no Google Cloud.
 * - `passwordReset` precisa de três coisas: descomentar `sendResetPassword` em
 *   `src/lib/auth.ts` no backend, reescrever os templates de `src/lib/resend.ts`
 *   (hoje são de outro produto, o Jupter) e um domínio verificado no Resend.
 */
export const authFeatures = {
  googleSignIn: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true',
  passwordReset: process.env.NEXT_PUBLIC_ENABLE_PASSWORD_RESET === 'true',
}

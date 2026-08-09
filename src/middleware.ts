import { NextResponse, type NextRequest } from 'next/server'
import { LOCALE_COOKIE, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/config'

// Rotas públicas que devem redirecionar para /home se o usuário já estiver logado
const AUTH_REDIRECT_PATHS = new Set(['/', '/auth', '/auth/login', '/auth/register'])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verifica existência do cookie de sessão (prefixo __Secure- em produção/HTTPS)
  const sessionCookie =
    request.cookies.get('__Secure-am.session_token') ?? request.cookies.get('am.session_token')

  // forceLogin=1 é adicionado pelo protected layout quando a sessão é inválida/expirada,
  // para evitar o loop: protected→login→home→protected
  const isForceLogin = request.nextUrl.searchParams.get('forceLogin') === '1'

  if (sessionCookie && AUTH_REDIRECT_PATHS.has(pathname) && !isForceLogin) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  const response = NextResponse.next()

  // Passa o pathname para o layout server-side via header
  response.headers.set('x-pathname', pathname)

  // Gerenciamento de locale
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  const accept = request.headers.get('accept-language') || ''

  let locale = cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any) ? cookieLocale : ''
  if (!locale) {
    const preferred = accept.split(',')[0]?.split('-')[0]
    locale = SUPPORTED_LOCALES.includes(preferred as any) ? preferred : DEFAULT_LOCALE
  }

  if (!cookieLocale) {
    response.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

import { ToastProvider } from '@/components/layout/ToastProvider'
import { ThemeProvider } from '@/context/ThemeProvider'
import { I18nProvider } from '@/i18n/I18nProvider'
import { getServerLocale } from '@/i18n/getServerLocale'
import { queryClient } from '@/lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { Metadata } from 'next'
import { Inter_Tight } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

// Display face — headings and the wordmark. Body copy uses the system stack,
// matching the prototype. Exposed to Tailwind as `font-display`.
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GUARDA',
  description: 'O jiu jitsu do professor, na ordem certa.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getServerLocale()

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className={`${interTight.variable} font-sans antialiased`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <I18nProvider>{children}</I18nProvider>
            <ToastProvider />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

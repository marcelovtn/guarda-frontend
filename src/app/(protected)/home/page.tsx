'use client'

import { useGetUserSession } from '@/components/layout/UserProfileButton/userProfileButton.slice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Orbit, Settings, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { protectedRoutes } from '@/utils/routes'

export default function HomePage() {
  const { data: session } = useGetUserSession()

  const name = session?.data?.user?.user_metadata?.name?.split(' ')[0] ?? 'há'

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15">
          <Orbit className="h-8 w-8 text-violet-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Olá, {name}!</h1>
        <p className="mt-2 text-muted-foreground">
          Bem-vindo ao Jupter. O que você quer fazer hoje?
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={protectedRoutes.SETTINGS}>
          <Card className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
                  <Settings className="h-5 w-5 text-violet-500" />
                </div>
                Configurações
              </CardTitle>
              <CardDescription>
                Personalize idioma, tema e preferências da sua conta.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
                <Sparkles className="h-5 w-5 text-violet-500" />
              </div>
              Em breve
            </CardTitle>
            <CardDescription>Novos módulos chegando em breve para o Jupter.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Fique ligado nas novidades.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

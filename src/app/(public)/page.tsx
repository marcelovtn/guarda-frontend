import Link from 'next/link'
import { ArrowRight, Orbit } from 'lucide-react'
import { publicRoutes } from '@/utils/routes'

const stack = ['Next.js 15', 'Better Auth', 'React Query', 'Tailwind CSS', 'Radix UI', 'i18n']

export default function IntroductionPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-foreground">
      <div className="mb-12 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
          <Orbit className="h-6 w-6 text-violet-500" />
        </div>
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Blank</span>
      </div>

      <div className="max-w-xl text-center">
        <span className="mb-4 inline-block rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 ring-1 ring-violet-500/20 dark:text-violet-400">
          Project Template
        </span>

        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          Start from zero.
          <br />
          <span className="text-violet-500">Build anything.</span>
        </h1>

        <p className="mb-8 text-lg text-muted-foreground">
          Blank is a production-ready starter kit — auth, i18n, UI system, and data fetching already
          wired up so you can focus on what actually matters.
        </p>

        <Link
          href={publicRoutes.LOGIN}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-600"
        >
          Get started
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-2">
        {stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>

      <p className="mt-10 text-xs text-muted-foreground/50">Fork it. Rename it. Ship it.</p>
    </div>
  )
}

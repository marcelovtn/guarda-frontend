'use client'

import { EmptyState } from '@/components/layout/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetInstructorProfile } from '@/lib/instructor/instructor.slice'
import { studentRoutes } from '@/utils/routes'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Gates the instructor area.
 *
 * Being an instructor is the existence of an Instructor row, which only the
 * backend knows about — the session says nothing. Rather than let every screen
 * hit its own 403 and render a broken page, the profile is fetched once here
 * and the whole area waits on it.
 */
export function InstructorGuard({ children }: { children: ReactNode }) {
  const { t } = useTranslation('guarda')
  const { data: profile, isLoading, isError } = useGetInstructorProfile()

  if (isLoading) {
    return (
      <PageContainer className="flex flex-col gap-6">
        <Skeleton className="h-10 w-full max-w-72" />
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    )
  }

  if (isError || !profile) {
    return (
      <PageContainer>
        <EmptyState
          title={t('NOT_INSTRUCTOR_TITLE')}
          description={t('NOT_INSTRUCTOR_BODY')}
          action={
            <Button asChild>
              <Link href={studentRoutes.HOME}>{t('NOT_INSTRUCTOR_ACTION')}</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  return <>{children}</>
}

'use client'

import { EmptyState } from '@/components/layout/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetInstructorLesson } from '@/lib/lesson/lesson.slice'
import { instructorRoutes } from '@/utils/routes'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { LessonEditor } from './components/LessonEditor'

/**
 * The instructor's view of one of their own lessons.
 *
 * Every row of the library links here, and so does the redirect after creating
 * a lesson — the route existed in `instructorRoutes` before the screen did,
 * which is why both landed on a 404.
 */
export default function EditLessonPage() {
  const { t } = useTranslation('guarda')
  const params = useParams<{ id: string }>()

  const { data: lesson, isLoading, isError } = useGetInstructorLesson(params.id)

  if (isError) {
    return (
      <PageContainer className="flex max-w-[1000px] flex-col gap-8">
        <EmptyState
          title={t('EDIT_LESSON_NOT_FOUND_TITLE')}
          description={t('EDIT_LESSON_NOT_FOUND_BODY')}
          action={
            <Button asChild variant="outline">
              <Link href={instructorRoutes.LESSONS}>{t('EDIT_LESSON_BACK')}</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  if (isLoading || !lesson) {
    return (
      <PageContainer className="flex max-w-[1000px] flex-col gap-8">
        <Skeleton className="h-6 w-full max-w-64" />
        <Skeleton className="h-[220px] w-full rounded-lg" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-28 w-full" />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex max-w-[1000px] flex-col gap-8">
      {/* Keyed by lesson: navigating between two lessons remounts the form so
          the fields carry the new lesson, not the previous one's edits. */}
      <LessonEditor key={lesson.id} lesson={lesson} />
    </PageContainer>
  )
}

'use client'

import { EmptyState } from '@/components/layout/EmptyState'
import { InstructorAvatar } from '@/components/layout/InstructorAvatar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetInstructorStudents } from '@/lib/instructor/instructor.slice'
import { formatRelativeDate } from '@/utils/formatLesson'
import { useTranslation } from 'react-i18next'

export default function InstructorStudentsPage() {
  const { t } = useTranslation('guarda')
  const { data: students, isLoading } = useGetInstructorStudents()

  return (
    <PageContainer className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-xl font-black tracking-tight text-foreground">
          {t('STUDENTS_TITLE')}
        </h1>
        {isLoading ? (
          <Skeleton className="h-5 w-52" />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('STUDENT_COUNT', { count: students?.length ?? 0 })}
          </p>
        )}
      </header>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : (students ?? []).length === 0 ? (
        <EmptyState
          title={t('EMPTY_NO_STUDENTS_TITLE')}
          description={t('EMPTY_NO_STUDENTS_BODY')}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="hidden grid-cols-[1fr_140px_160px] gap-4 border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-caps text-muted-foreground md:grid">
            <span>{t('STUDENTS_COL_STUDENT')}</span>
            <span className="text-right">{t('STUDENTS_COL_COMPLETED')}</span>
            <span className="text-right">{t('STUDENTS_COL_LAST_ACTIVITY')}</span>
          </div>

          {(students ?? []).map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-1 items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-[1fr_140px_160px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <InstructorAvatar name={student.name} size="sm" />
                <div className="flex min-w-0 flex-col">
                  <p className="truncate text-base font-semibold text-foreground">{student.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                </div>
              </div>

              <p className="text-sm tabular-nums text-muted-foreground md:text-right">
                {t('LESSON_COUNT', { count: student.lessonsCompleted })}
              </p>

              <p className="text-sm text-muted-foreground md:text-right">
                {student.lastActivityAt
                  ? formatRelativeDate(student.lastActivityAt)
                  : t('STUDENTS_NEVER_WATCHED')}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}

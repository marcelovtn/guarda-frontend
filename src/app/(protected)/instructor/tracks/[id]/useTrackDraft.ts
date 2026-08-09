import { useCallback, useEffect, useMemo, useState } from 'react'

export interface DraftLesson {
  id: string
  title: string
  durationSec: number
  status: 'DRAFT' | 'PUBLISHED'
}

export interface DraftModule {
  /** Absent for a module created in this editing session. */
  id?: string
  /** Stable key for React and for drag targets, even before the module exists. */
  key: string
  title: string
  lessons: DraftLesson[]
}

interface LoadedModule {
  id: string
  title: string
  lessons: DraftLesson[]
}

/**
 * Local editing state for the track builder.
 *
 * The whole arrangement is held in memory and sent in one request when the
 * instructor saves. Persisting each drag would leave a lesson stranded between
 * modules if one call failed, and would make "Salvar alterações" a lie.
 */
export function useTrackDraft(loaded: LoadedModule[] | undefined, orphans: DraftLesson[]) {
  const [modules, setModules] = useState<DraftModule[]>([])
  const [unassigned, setUnassigned] = useState<DraftLesson[]>([])
  const [isDirty, setDirty] = useState(false)

  // Reset whenever the server data changes — after a save, or when switching
  // tracks without unmounting.
  useEffect(() => {
    if (!loaded) return
    setModules(loaded.map((module) => ({ ...module, key: module.id })))
    setUnassigned(orphans)
    setDirty(false)
    // orphans is rebuilt on every render of the parent; keying off its ids
    // avoids resetting the draft while the instructor is working.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, orphans.map((lesson) => lesson.id).join(',')])

  const lessonCount = useMemo(
    () => modules.reduce((total, module) => total + module.lessons.length, 0),
    [modules],
  )

  const totalDurationSec = useMemo(
    () =>
      modules.reduce(
        (total, module) =>
          total + module.lessons.reduce((sum, lesson) => sum + lesson.durationSec, 0),
        0,
      ),
    [modules],
  )

  const addModule = useCallback((title: string) => {
    setModules((current) => [...current, { key: `new-${crypto.randomUUID()}`, title, lessons: [] }])
    setDirty(true)
  }, [])

  const renameModule = useCallback((key: string, title: string) => {
    setModules((current) =>
      current.map((module) => (module.key === key ? { ...module, title } : module)),
    )
    setDirty(true)
  }, [])

  /** Removing a module returns its lessons to the unassigned pile. */
  const removeModule = useCallback((key: string) => {
    setModules((current) => {
      const target = current.find((module) => module.key === key)
      if (target) setUnassigned((pile) => [...target.lessons, ...pile])
      return current.filter((module) => module.key !== key)
    })
    setDirty(true)
  }, [])

  const moveLesson = useCallback(
    (lessonId: string, toModuleKey: string | null, toIndex?: number) => {
      setModules((currentModules) => {
        let moved: DraftLesson | undefined

        const stripped = currentModules.map((module) => {
          const found = module.lessons.find((lesson) => lesson.id === lessonId)
          if (found) moved = found
          return { ...module, lessons: module.lessons.filter((l) => l.id !== lessonId) }
        })

        if (!moved) {
          setUnassigned((pile) => {
            moved = pile.find((lesson) => lesson.id === lessonId)
            return pile.filter((lesson) => lesson.id !== lessonId)
          })
        }

        if (!moved) return currentModules

        if (toModuleKey === null) {
          setUnassigned((pile) => [moved!, ...pile.filter((l) => l.id !== lessonId)])
          return stripped
        }

        return stripped.map((module) => {
          if (module.key !== toModuleKey) return module
          const lessons = [...module.lessons]
          lessons.splice(toIndex ?? lessons.length, 0, moved!)
          return { ...module, lessons }
        })
      })
      setDirty(true)
    },
    [],
  )

  /** Moves a lesson one slot up or down inside its module. */
  const reorderLesson = useCallback((moduleKey: string, index: number, delta: number) => {
    setModules((current) =>
      current.map((module) => {
        if (module.key !== moduleKey) return module
        const target = index + delta
        if (target < 0 || target >= module.lessons.length) return module

        const lessons = [...module.lessons]
        ;[lessons[index], lessons[target]] = [lessons[target], lessons[index]]
        return { ...module, lessons }
      }),
    )
    setDirty(true)
  }, [])

  const toPayload = useCallback(
    () => ({
      modules: modules.map((module) => ({
        id: module.id,
        title: module.title,
        lessonIds: module.lessons.map((lesson) => lesson.id),
      })),
    }),
    [modules],
  )

  return {
    modules,
    unassigned,
    isDirty,
    lessonCount,
    totalDurationSec,
    addModule,
    renameModule,
    removeModule,
    moveLesson,
    reorderLesson,
    toPayload,
  }
}

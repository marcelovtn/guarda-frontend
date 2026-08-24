'use client'

import { useCreateLessonUploadTarget } from '@/lib/lesson/lesson.slice'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { VideoUploadState } from './components/VideoUploadField'

/**
 * How long the picked file is, read straight from the browser.
 *
 * Nothing on the server can answer this: the blob goes from the browser to
 * storage without passing through the API, and there is no transcoding step to
 * inspect it afterwards. Without measuring here, every lesson in the product
 * shows a duration of zero.
 */
function readDurationSec(file: File): Promise<number> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file)
    const probe = document.createElement('video')

    const finish = (seconds: number) => {
      URL.revokeObjectURL(objectUrl)
      resolve(seconds)
    }

    probe.preload = 'metadata'
    probe.onloadedmetadata = () =>
      finish(Number.isFinite(probe.duration) ? Math.round(probe.duration) : 0)
    // Um container que o browser não sabe decodificar — MKV é o caso comum —
    // não expõe duração. Zero é melhor do que impedir o upload por causa disso.
    probe.onerror = () => finish(0)
    probe.src = objectUrl
  })
}

/**
 * Puts a lesson video in storage and reports how far it has got.
 *
 * Progress lives in component state rather than React Query: it changes many
 * times a second and would thrash the cache for every subscriber of the lesson
 * keys. The form stays usable throughout — only publishing waits on `key`.
 */
export function useVideoUpload(initial: VideoUploadState | null = null) {
  const { t } = useTranslation('guarda')
  const { mutateAsync: createUploadTarget } = useCreateLessonUploadTarget()
  const [video, setVideo] = useState<VideoUploadState | null>(initial)

  async function upload(file: File) {
    const durationSec = await readDurationSec(file)

    setVideo({
      fileName: file.name,
      sizeBytes: file.size,
      uploadProgress: 0,
      key: null,
      durationSec,
    })

    try {
      const target = await createUploadTarget(file)

      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('PUT', target.uploadUrl)
        request.setRequestHeader('Content-Type', file.type)
        // No timeout: a gigabyte on a home connection can take hours, and
        // aborting halfway would make the instructor start over.
        request.timeout = 0

        request.upload.onprogress = (event) => {
          if (!event.lengthComputable) return
          setVideo((current) =>
            current ? { ...current, uploadProgress: event.loaded / event.total } : current,
          )
        }

        request.onload = () =>
          request.status >= 200 && request.status < 300
            ? resolve()
            : reject(new Error(`Storage respondeu ${request.status}`))
        request.onerror = () => reject(new Error(t('NEW_LESSON_UPLOAD_FAILED')))
        request.send(file)
      })

      setVideo((current) =>
        current ? { ...current, uploadProgress: 1, key: target.key } : current,
      )
    } catch (error: any) {
      setVideo((current) =>
        current ? { ...current, error: error?.message ?? t('NEW_LESSON_UPLOAD_FAILED') } : current,
      )
    }
  }

  return { video, upload, isUploaded: Boolean(video?.key) }
}

'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateLessonUploadTarget } from './lesson.slice'

export interface VideoUploadState {
  fileName: string
  sizeBytes: number
  /** 0–1 while uploading, 1 once the bytes are in storage. */
  uploadProgress: number
  /** Set once the upload finishes; this is what the lesson stores. */
  key: string | null
  /** Measured in the browser before the upload starts. */
  durationSec: number
  error?: string
}

/**
 * How long the picked file is, read straight from the browser.
 *
 * Nothing on the server can answer this: the blob goes from the browser to
 * storage without passing through the API, and there is no transcoding step to
 * inspect it afterwards. If it is not measured here, every lesson in the
 * product shows a duration of zero.
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
 * Picks a lesson video and pushes it to storage, reporting progress.
 *
 * The upload starts on pick and runs beside the form: a recording is over a
 * gigabyte, and blocking the instructor from typing a title for the twenty
 * minutes that takes would be absurd. Only publishing waits for it.
 *
 * Progress lives in component state rather than React Query because it changes
 * many times a second and would thrash the cache.
 */
export function useVideoUpload() {
  const { t } = useTranslation('guarda')
  const { mutateAsync: createUploadTarget } = useCreateLessonUploadTarget()
  const [video, setVideo] = useState<VideoUploadState | null>(null)

  async function select(file: File) {
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

  return { video, select }
}

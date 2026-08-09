import { api } from '@/utils/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

interface UploadPayload {
  file: File
  // Namespace do objeto no bucket (ex.: "avatars", "documents").
  // Sobrescreve o folder default passado ao hook.
  folder?: string
}

const UPLOAD_TIMEOUT_MS = 20_000
const UPLOAD_MAX_RETRIES = 2

// Limita uploads concorrentes ao R2/S3. Com 6+ simultâneos o R2 throttla
// causando delays de 20s+. Concorrência 2 mantém velocidade sem throttle.
const MAX_CONCURRENT_UPLOADS = 2
let _activeUploads = 0
const _pending: Array<() => void> = []

function withUploadQueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = async () => {
      _activeUploads++
      try {
        resolve(await fn())
      } catch (err) {
        reject(err)
      } finally {
        _activeUploads--
        if (_pending.length > 0) _pending.shift()!()
      }
    }
    if (_activeUploads < MAX_CONCURRENT_UPLOADS) {
      run()
    } else {
      _pending.push(run)
    }
  })
}

// Upload direto pro R2 via presigned URL (o blob não passa pelo backend).
// Retry só em timeout/abort — outros erros sobem na hora.
async function directUploadWithRetry(
  file: File,
  folder: string,
): Promise<{ url: string; key: string }> {
  const { data: presign } = await api.post<{
    presignedUrl: string
    publicUrl: string
    key: string
  }>('/api/storage/presign', {
    fileName: file.name,
    contentType: file.type,
    folder,
  })

  let lastError: unknown
  for (let attempt = 0; attempt <= UPLOAD_MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)
    try {
      await fetch(presign.presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
        signal: controller.signal,
      })
      return { url: presign.publicUrl, key: presign.key }
    } catch (err: unknown) {
      lastError = err
      if (!controller.signal.aborted) throw err
    } finally {
      clearTimeout(timeout)
    }
  }
  throw lastError
}

// Hook genérico de upload com fila de concorrência + retry.
// `defaultFolder` define o namespace; cada chamada pode sobrescrever via payload.
export function useUpload(defaultFolder = 'uploads') {
  return useMutation<{ url: string; key: string }, Error, UploadPayload>({
    mutationFn: ({ file, folder }) =>
      withUploadQueue(() => directUploadWithRetry(file, folder ?? defaultFolder)),
    onError: (error: any) => {
      const apiError = error?.response?.data?.error as string | undefined
      toast.error(apiError ?? error.message ?? 'Erro ao fazer upload do arquivo')
    },
  })
}

export function useDeleteUpload() {
  return useMutation<void, Error, string>({
    mutationFn: (key: string) => api.delete(`/api/storage/${key}`),
    onError: (error: any) => {
      const apiError = error?.response?.data?.error as string | undefined
      toast.error(apiError ?? error.message ?? 'Erro ao remover arquivo')
    },
  })
}

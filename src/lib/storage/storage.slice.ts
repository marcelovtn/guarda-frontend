import { api } from '@/utils/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

// Seleciona a política de tipo/tamanho no backend. Espelha AssetKind lá.
export type AssetKind = 'image' | 'video'

interface UploadPayload {
  file: File
  // Namespace do objeto no bucket (ex.: "avatars", "lessons").
  // Sobrescreve o folder default passado ao hook.
  folder?: string
  kind?: AssetKind
  // Progresso do upload, de 0 a 1. Usado na tela de Nova aula.
  onProgress?: (fraction: number) => void
}

// Imagens são pequenas: se passou de 20s, a rede travou e vale reabrir a
// conexão. Vídeo pode legitimamente levar horas, então não há timeout — abortar
// um upload de 1,4 GB pela metade só faria o professor recomeçar do zero.
const UPLOAD_TIMEOUT_MS: Record<AssetKind, number> = {
  image: 20_000,
  video: 0,
}

const UPLOAD_MAX_RETRIES = 2

// Limita uploads concorrentes ao R2/S3. Com 6+ simultâneos o R2 throttla
// causando delays de 20s+. Concorrência 2 mantém velocidade sem throttle.
//
// As filas são separadas por tipo: um vídeo ocupa um slot por horas, e numa
// fila única ele seguraria a troca da foto de perfil atrás dele.
const MAX_CONCURRENT_UPLOADS: Record<AssetKind, number> = {
  image: 2,
  video: 1,
}

const queues: Record<AssetKind, { active: number; pending: Array<() => void> }> = {
  image: { active: 0, pending: [] },
  video: { active: 0, pending: [] },
}

function withUploadQueue<T>(kind: AssetKind, fn: () => Promise<T>): Promise<T> {
  const queue = queues[kind]
  return new Promise<T>((resolve, reject) => {
    const run = async () => {
      queue.active++
      try {
        resolve(await fn())
      } catch (err) {
        reject(err)
      } finally {
        queue.active--
        if (queue.pending.length > 0) queue.pending.shift()!()
      }
    }
    if (queue.active < MAX_CONCURRENT_UPLOADS[kind]) {
      run()
    } else {
      queue.pending.push(run)
    }
  })
}

class UploadTimeoutError extends Error {
  constructor() {
    super('Upload timeout')
    this.name = 'UploadTimeoutError'
  }
}

/**
 * PUT do arquivo na URL pré-assinada.
 *
 * Usa XHR em vez de fetch por um motivo só: fetch não expõe progresso de
 * upload, e a tela de Nova aula precisa mostrar quanto já subiu de um arquivo
 * de mais de 1 GB.
 */
function putWithProgress(
  url: string,
  file: File,
  timeoutMs: number,
  onProgress?: (fraction: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', file.type)
    // 0 desliga o timeout do XHR — é o que queremos para vídeo.
    xhr.timeout = timeoutMs

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress(event.loaded / event.total)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(1)
        resolve()
        return
      }
      reject(new Error(`R2 respondeu ${xhr.status}`))
    }
    xhr.ontimeout = () => reject(new UploadTimeoutError())
    xhr.onerror = () => reject(new Error('Falha de rede ao enviar o arquivo'))
    xhr.send(file)
  })
}

// Upload direto pro R2 via presigned URL (o blob não passa pelo backend).
// Retry só em timeout — outros erros sobem na hora.
async function directUploadWithRetry(
  file: File,
  folder: string,
  kind: AssetKind,
  onProgress?: (fraction: number) => void,
): Promise<{ url: string; key: string }> {
  const { data: presign } = await api.post<{
    presignedUrl: string
    publicUrl: string
    key: string
  }>('/api/storage/presign', {
    fileName: file.name,
    contentType: file.type,
    folder,
    kind,
  })

  const timeoutMs = UPLOAD_TIMEOUT_MS[kind]

  let lastError: unknown
  for (let attempt = 0; attempt <= UPLOAD_MAX_RETRIES; attempt++) {
    try {
      await putWithProgress(presign.presignedUrl, file, timeoutMs, onProgress)
      return { url: presign.publicUrl, key: presign.key }
    } catch (err: unknown) {
      lastError = err
      if (!(err instanceof UploadTimeoutError)) throw err
      onProgress?.(0)
    }
  }
  throw lastError
}

// Hook genérico de upload com fila de concorrência + retry.
// `defaultFolder` define o namespace; cada chamada pode sobrescrever via payload.
export function useUpload(defaultFolder = 'uploads') {
  return useMutation<{ url: string; key: string }, Error, UploadPayload>({
    mutationFn: ({ file, folder, kind = 'image', onProgress }) =>
      withUploadQueue(kind, () =>
        directUploadWithRetry(file, folder ?? defaultFolder, kind, onProgress),
      ),
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

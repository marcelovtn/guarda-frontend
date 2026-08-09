'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, RotateCcw, VideoOff, X } from 'lucide-react'
import Image from 'next/image'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CameraDialogProps {
  open: boolean
  onClose: () => void
  onCapture: (file: File) => void
}

export function CameraDialog({ open, onClose, onCapture }: CameraDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captured, setCaptured] = useState<string | null>(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setReady(false)
  }, [])

  const startStream = useCallback(() => {
    setError(null)
    setReady(false)
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => setReady(true)
        }
      })
      .catch(() =>
        setError('Não foi possível acessar a câmera. Verifique as permissões do navegador.'),
      )
  }, [])

  useEffect(() => {
    if (!open) return
    setCaptured(null)
    startStream()
    return stopStream
  }, [open, startStream, stopStream])

  function handleCapture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    setCaptured(canvas.toDataURL('image/jpeg', 0.9))
    stopStream()
  }

  function handleRetake() {
    setCaptured(null)
    startStream()
  }

  function handleConfirm() {
    canvasRef.current?.toBlob(
      (blob) => {
        if (!blob) return
        onCapture(new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' }))
        handleClose()
      },
      'image/jpeg',
      0.9,
    )
  }

  function handleClose() {
    setCaptured(null)
    onClose()
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
            'flex h-dvh w-full flex-col overflow-hidden bg-black',
            'rounded-none duration-200',
            'sm:h-auto sm:max-w-2xl sm:rounded-2xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          )}
        >
          {/* Top bar */}
          <div className="flex shrink-0 items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold text-white/80">Câmera</span>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Fechar câmera"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Viewfinder */}
          <div className="relative flex-1 overflow-hidden bg-black sm:aspect-video sm:flex-none">
            {error ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8">
                <VideoOff className="h-10 w-10 text-white/30" />
                <p className="max-w-xs text-center text-sm text-white/50">{error}</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn('h-full w-full object-contain', captured && 'hidden')}
                />
                {captured && (
                  <Image
                    fill
                    unoptimized
                    src={captured}
                    alt="Foto capturada"
                    className="object-contain"
                  />
                )}
                {!ready && !captured && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bottom controls */}
          <div className="flex shrink-0 items-center justify-center gap-10 px-8 py-7">
            {captured ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Tirar nova foto"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform active:scale-95"
                  aria-label="Usar esta foto"
                >
                  <Check className="h-7 w-7 text-black" />
                </button>
                {/* spacer para simetria */}
                <div className="h-12 w-12" />
              </>
            ) : (
              <button
                type="button"
                onClick={handleCapture}
                disabled={!ready || !!error}
                className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white transition-transform active:scale-95 disabled:opacity-30"
                aria-label="Capturar foto"
              >
                <div className="h-11 w-11 rounded-full bg-white" />
              </button>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  )
}

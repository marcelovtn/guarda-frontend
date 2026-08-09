'use client'

export default function ConnectingAccount({
  message = 'Conectando sua conta...',
}: Readonly<{ message?: string }>) {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
        <span>{message}</span>
      </div>
    </div>
  )
}

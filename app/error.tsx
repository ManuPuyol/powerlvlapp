'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md space-y-6 text-center">
        <div className="inline-flex w-14 h-14 bg-destructive/10 items-center justify-center text-destructive border border-destructive/20">
          <AlertTriangle size={24} />
        </div>

        <div className="space-y-2">
          <p className="font-mono-tag text-destructive">[ ERROR / 500 ]</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Something went wrong.
          </h1>
          <p className="text-muted-foreground">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        <Button onClick={reset}>
          <RotateCw size={14} className="mr-2" />
          Try again
        </Button>
      </div>
    </div>
  )
}

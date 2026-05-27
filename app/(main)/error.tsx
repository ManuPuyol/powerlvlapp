'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCw } from 'lucide-react'

export default function MainError({
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
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">
      <div className="border border-destructive/30 bg-destructive/5 p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle size={20} />
          </div>
          <p className="font-mono-tag text-destructive">[ ERROR / SECTION ]</p>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tighter">
            Something went wrong.
          </h1>
          <p className="text-muted-foreground text-sm">
            {error.message || 'An unexpected error occurred while loading this page.'}
          </p>
        </div>

        <Button onClick={reset} size="sm">
          <RotateCw size={14} className="mr-2" />
          Try again
        </Button>
      </div>
    </div>
  )
}

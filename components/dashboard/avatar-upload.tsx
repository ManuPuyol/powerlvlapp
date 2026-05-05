'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadAvatarAction } from '@/app/actions/profiles'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

type AvatarUploadProps = {
  currentAvatarUrl: string | null
  fullName: string | null
}

export function AvatarUpload({ currentAvatarUrl, fullName }: AvatarUploadProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(uploadAvatarAction, null)
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  useEffect(() => {
    if (state && 'error' in state && state.error === null) {
      router.refresh()
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-4">
      {state && 'error' in state && state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        {/* Avatar preview */}
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-semibold">
              {fullName?.charAt(0) ?? '?'}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Photo
          </Button>
          <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max 2MB.</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        name="avatar"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview !== currentAvatarUrl && (
        <Button type="submit" size="sm">
          Upload
        </Button>
      )}
    </form>
  )
}

'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { updateVisibilityAction } from '@/app/actions/profiles'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}

type VisibilityFormProps = {
  currentVisibility: string
}

type ActionState = { error: string } | { error: null } | null

export function VisibilityForm({ currentVisibility }: VisibilityFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState<ActionState, FormData>(updateVisibilityAction, null)

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

      {state && 'error' in state && state.error === null && (
        <Alert>
          <AlertDescription>Visibility updated successfully!</AlertDescription>
        </Alert>
      )}

      <Select name="visibility" defaultValue={currentVisibility}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>

      <p className="text-xs text-muted-foreground">
        Public: Anyone can see your profile. Private: Only you can see your profile.
      </p>

      <SubmitButton />
    </form>
  )
}

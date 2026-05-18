'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { updateVisibilityAction } from '@/app/actions/profiles'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check } from 'lucide-react'

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
        <div className="border border-primary bg-primary/10 p-3 flex items-center gap-2 text-sm">
          <Check size={16} className="text-primary" />
          <span>Visibility updated</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="visibility" className="font-mono-tag text-muted-foreground">VISIBILITY</Label>
        <Select name="visibility" defaultValue={currentVisibility}>
          <SelectTrigger className="w-full md:w-72">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public — Anyone can see</SelectItem>
            <SelectItem value="private">Private — Only you</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SubmitButton />
    </form>
  )
}

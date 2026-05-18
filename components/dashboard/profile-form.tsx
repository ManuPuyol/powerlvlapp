'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { updateProfileAction } from '@/app/actions/profiles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check } from 'lucide-react'
import type { Profile } from '@/types/models'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? 'Saving...' : 'Save changes'}
    </Button>
  )
}

type ProfileFormProps = {
  profile: Pick<Profile,
    'full_name' | 'username' | 'bio' |
    'specialties' | 'price_per_session' |
    'is_available' | 'is_trainer'
  >
}

type ActionState = { error: string } | { error: null } | null

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState<ActionState, FormData>(updateProfileAction, null)

  useEffect(() => {
    if (state && 'error' in state && state.error === null) {
      router.refresh()
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="isTrainer" value={String(profile.is_trainer)} />

      {state && 'error' in state && state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state && 'error' in state && state.error === null && (
        <div className="border border-primary bg-primary/10 p-3 flex items-center gap-2 text-sm">
          <Check size={16} className="text-primary" />
          <span>Profile updated successfully</span>
        </div>
      )}

      {/* Basic info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="font-mono-tag text-muted-foreground">FULL NAME</Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={profile.full_name ?? ''}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="font-mono-tag text-muted-foreground">USERNAME</Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username ?? ''}
            placeholder="your-username"
            required
          />
          <p className="text-xs text-muted-foreground">
            Lowercase letters, numbers and hyphens only
          </p>
        </div>
      </div>

      {/* Trainer fields */}
      {profile.is_trainer && (
        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <p className="font-mono-tag text-muted-foreground">TRAINER INFO</p>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="font-mono-tag text-muted-foreground">BIO</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio ?? ''}
              placeholder="Tell potential clients about yourself..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Max 500 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialties" className="font-mono-tag text-muted-foreground">SPECIALTIES</Label>
            <Input
              id="specialties"
              name="specialties"
              defaultValue={profile.specialties?.join(', ') ?? ''}
              placeholder="gym, yoga, nutrition"
            />
            <p className="text-xs text-muted-foreground">Separate with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerSession" className="font-mono-tag text-muted-foreground">PRICE PER SESSION ($)</Label>
            <Input
              id="pricePerSession"
              name="pricePerSession"
              type="number"
              min="0"
              step="0.01"
              defaultValue={profile.price_per_session ?? ''}
              placeholder="45.00"
            />
          </div>

          <div className="flex items-center justify-between border p-3">
            <div>
              <Label htmlFor="isAvailable" className="font-medium">Available for new clients</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Turn off to stop receiving requests
              </p>
            </div>
            <Switch
              id="isAvailable"
              name="isAvailable"
              defaultChecked={profile.is_available ?? true}
              value="true"
            />
          </div>
        </div>
      )}

      <SubmitButton />
    </form>
  )
}

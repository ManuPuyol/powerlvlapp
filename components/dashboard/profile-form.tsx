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
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Profile } from '@/types/models'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
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
        <Alert>
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="font-medium">Basic Info</h3>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={profile.full_name ?? ''}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
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

      {profile.is_trainer && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="font-medium">Trainer Info</h3>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
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
              <Label htmlFor="specialties">Specialties</Label>
              <Input
                id="specialties"
                name="specialties"
                defaultValue={profile.specialties?.join(', ') ?? ''}
                placeholder="gym, yoga, nutrition"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerSession">Price per Session ($)</Label>
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

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isAvailable">Available for new clients</Label>
                <p className="text-xs text-muted-foreground">
                  Turn off to stop receiving new client requests
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
        </>
      )}

      <SubmitButton />
    </form>
  )
}

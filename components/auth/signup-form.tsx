'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { signupAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRight } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? 'Creating account...' : (
        <>
          Create Account <ArrowRight size={16} className="ml-1" />
        </>
      )}
    </Button>
  )
}

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, null)

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName" className="font-mono-tag text-muted-foreground">FULL NAME</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="font-mono-tag text-muted-foreground">EMAIL</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-mono-tag text-muted-foreground">PASSWORD</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <p className="text-xs text-muted-foreground">
          Min 8 characters with uppercase, lowercase and number
        </p>
      </div>

      <SubmitButton />
    </form>
  )
}

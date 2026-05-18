'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRight } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? 'Signing in...' : (
        <>
          Sign In <ArrowRight size={16} className="ml-1" />
        </>
      )}
    </Button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null)

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="font-mono-tag text-muted-foreground">EMAIL</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          defaultValue="admin@admin.com"
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
          defaultValue="Admin123!"
          required
        />
      </div>

      <SubmitButton />
    </form>
  )
}

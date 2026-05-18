import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="font-mono-tag text-primary">[ AUTH / SIGNUP ]</p>
        <h1 className="text-4xl font-bold tracking-tighter leading-[1.05]">
          Create account.
        </h1>
        <p className="text-muted-foreground">
          Start your training journey today
        </p>
      </div>

      <SignupForm />

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-foreground font-medium hover:text-primary transition-colors">
          Sign in →
        </Link>
      </p>
    </div>
  )
}

import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="font-mono-tag text-primary">[ AUTH / LOGIN ]</p>
        <h1 className="text-4xl font-bold tracking-tighter leading-[1.05]">
          Welcome back.
        </h1>
        <p className="text-muted-foreground">
          Sign in to continue your journey
        </p>
      </div>

      <LoginForm />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="font-mono-tag text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-sm text-center text-muted-foreground">
        New here?{' '}
        <Link href="/signup" className="text-foreground font-medium hover:text-primary transition-colors">
          Create an account →
        </Link>
      </p>
    </div>
  )
}

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { VisibilityForm } from '@/components/dashboard/visibility-form'

function SettingsSkeleton() {
  return (
    <div className="border bg-card">
      <div className="p-5 border-b">
        <div className="h-3 w-40 bg-muted animate-pulse" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-4 w-64 bg-muted animate-pulse" />
        <div className="h-10 w-48 bg-muted animate-pulse mt-4" />
      </div>
    </div>
  )
}

async function SettingsContent() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <section className="border bg-card">
      <div className="flex items-center justify-between p-5 border-b">
        <p className="font-mono-tag text-muted-foreground">PROFILE VISIBILITY</p>
        <span className="font-mono-tag text-muted-foreground">01</span>
      </div>
      <div className="p-5 space-y-2">
        <p className="text-sm text-muted-foreground mb-4">
          Control who can see your profile information
        </p>
        <VisibilityForm currentVisibility={profile.profile_visibility ?? 'public'} />
      </div>
    </section>
  )
}

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in-up">
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / SETTINGS
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
          Account<br />
          <span className="text-primary">settings.</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}

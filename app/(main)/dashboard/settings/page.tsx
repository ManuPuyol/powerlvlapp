import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { VisibilityForm } from '@/components/dashboard/visibility-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function SettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-40 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}

async function SettingsContent() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Visibility</CardTitle>
        <CardDescription>
          Control who can see your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VisibilityForm currentVisibility={profile.profile_visibility ?? 'public'} />
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}

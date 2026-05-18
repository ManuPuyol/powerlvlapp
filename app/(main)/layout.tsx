import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { Sidebar } from '@/components/shared/sidebar'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar
        isTrainer={profile?.is_trainer ?? false}
        fullName={profile?.full_name ?? null}
        avatarUrl={profile?.avatar_url ?? null}
      />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}

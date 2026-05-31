import { redirect } from 'next/navigation'
import { getCurrentProfileLite } from '@/services/profile.service'
import { getDevRoleOverride } from '@/lib/dev-role'
import { Sidebar } from '@/components/shared/sidebar'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfileLite()

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  // DEV: override de rol. TODO: quitar en producción
  const devOverride = await getDevRoleOverride()
  const isTrainer = devOverride ?? profile?.is_trainer ?? false

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar
        isTrainer={isTrainer}
        fullName={profile?.full_name ?? null}
        avatarUrl={profile?.avatar_url ?? null}
      />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}

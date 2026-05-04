import { getCurrentProfile } from '@/services/profile.service'
import { Sidebar } from '@/components/shared/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isTrainer={profile?.is_trainer ?? false}
        fullName={profile?.full_name ?? null}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

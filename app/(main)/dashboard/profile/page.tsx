import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { ProfileForm } from '@/components/dashboard/profile-form'
import { AvatarUpload } from '@/components/dashboard/avatar-upload'
import { PageHeader } from '@/components/shared/page-header'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in-up">
      <PageHeader
        breadcrumb="DASHBOARD / PROFILE"
        title={<>Edit your<br /><span className="text-primary">profile.</span></>}
        description="Update your personal information and how others see you"
      />

      <section className="border bg-card">
        <div className="flex items-center justify-between p-5 border-b">
          <p className="font-mono-tag text-muted-foreground">PROFILE PHOTO</p>
          <span className="font-mono-tag text-muted-foreground">01</span>
        </div>
        <div className="p-5">
          <AvatarUpload
            currentAvatarUrl={profile.avatar_url}
            fullName={profile.full_name}
          />
        </div>
      </section>

      <section className="border bg-card">
        <div className="flex items-center justify-between p-5 border-b">
          <p className="font-mono-tag text-muted-foreground">PROFILE INFO</p>
          <span className="font-mono-tag text-muted-foreground">02</span>
        </div>
        <div className="p-5">
          <ProfileForm profile={profile} />
        </div>
      </section>
    </div>
  )
}

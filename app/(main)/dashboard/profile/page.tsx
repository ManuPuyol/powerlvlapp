import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { ProfileForm } from '@/components/dashboard/profile-form'
import { AvatarUpload } from '@/components/dashboard/avatar-upload'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in-up">
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / PROFILE
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
          Edit your<br />
          <span className="text-primary">profile.</span>
        </h1>
        <p className="text-muted-foreground">
          Update your personal information and how others see you
        </p>
      </div>

      {/* Avatar */}
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

      {/* Info */}
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

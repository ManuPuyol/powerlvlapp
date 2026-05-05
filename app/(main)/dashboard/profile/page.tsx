import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { ProfileForm } from '@/components/dashboard/profile-form'
import { AvatarUpload } from '@/components/dashboard/avatar-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">Update your personal information</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>
            This photo will be visible to other users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentAvatarUrl={profile.avatar_url}
            fullName={profile.full_name}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            {profile.is_trainer
              ? 'This information will be visible on your public trainer profile'
              : 'Update your personal details'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}

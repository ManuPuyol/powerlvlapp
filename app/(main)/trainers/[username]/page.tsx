import { notFound } from 'next/navigation'
import { getTrainerByUsername, getCurrentProfile } from '@/services/profile.service'
import { getContractBetween } from '@/services/contracts.service'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/shared/avatar'
import { HireButton } from '@/components/trainers/hire-button'

type Props = {
  params: Promise<{ username: string }>
}

export default async function TrainerProfilePage({ params }: Props) {
  const { username } = await params
  const trainer = await getTrainerByUsername(username).catch(() => null)

  if (!trainer) {
    notFound()
  }

  const profile = await getCurrentProfile()
  const existingContract = profile
    ? await getContractBetween(profile.id, trainer.id)
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 animate-fade-in-up">
      <Card>
        <CardContent className="p-6 md:p-8 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-6 border-b">
            <Avatar src={trainer.avatar_url} name={trainer.full_name} size="lg" />
            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{trainer.full_name}</h1>
                <p className="text-muted-foreground">@{trainer.username}</p>
              </div>
              {trainer.is_available ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Available for new clients
                </div>
              ) : (
                <Badge variant="outline">Not available</Badge>
              )}
            </div>
          </div>

          {/* Bio */}
          {trainer.bio && (
            <div className="space-y-2">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">About</h2>
              <p className="leading-relaxed">{trainer.bio}</p>
            </div>
          )}

          {/* Specialties */}
          {trainer.specialties && trainer.specialties.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {trainer.specialties.map(specialty => (
                  <Badge key={specialty} variant="secondary" className="font-normal">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t">
            {trainer.price_per_session && (
              <div>
                <p className="text-3xl font-bold">${trainer.price_per_session}</p>
                <p className="text-sm text-muted-foreground">per session</p>
              </div>
            )}
            <HireButton trainerId={trainer.id} contractStatus={existingContract?.status ?? null} />
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

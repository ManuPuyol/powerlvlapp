import { notFound } from 'next/navigation'
import { getTrainerByUsername } from '@/services/profile.service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/shared/avatar'

type Props = {
  params: Promise<{ username: string }>
}

export default async function TrainerProfilePage({ params }: Props) {
  const { username } = await params

  const trainer = await getTrainerByUsername(username).catch(() => null)

  if (!trainer) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardContent className="pt-6 space-y-6">

          {/* Header */}
          <div className="flex items-center gap-4">
            <Avatar src={trainer.avatar_url} name={trainer.full_name} size="lg" />
            <div>
              <h1 className="text-2xl font-bold">{trainer.full_name}</h1>
              <p className="text-muted-foreground">@{trainer.username}</p>
              {trainer.is_available
                ? <Badge variant="secondary" className="mt-1">Available</Badge>
                : <Badge variant="outline" className="mt-1">Not available</Badge>
              }
            </div>
          </div>

          {/* Bio */}
          {trainer.bio && (
            <div>
              <h2 className="font-semibold mb-1">About</h2>
              <p className="text-muted-foreground">{trainer.bio}</p>
            </div>
          )}

          {/* Specialties */}
          {trainer.specialties && trainer.specialties.length > 0 && (
            <div>
              <h2 className="font-semibold mb-2">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {trainer.specialties.map(specialty => (
                  <Badge key={specialty} variant="outline">{specialty}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-4 border-t">
            {trainer.price_per_session && (
              <p className="text-lg font-semibold">
                ${trainer.price_per_session} <span className="text-sm font-normal text-muted-foreground">/ session</span>
              </p>
            )}
            <Button disabled>
              Contact Trainer
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

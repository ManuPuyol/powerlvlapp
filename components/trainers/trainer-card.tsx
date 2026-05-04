import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Profile } from '@/types/models'

type TrainerCardProps = {
  trainer: Pick<Profile, 'username' | 'full_name' | 'avatar_url' | 'bio' | 'specialties' | 'price_per_session' | 'is_available'>
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <Link href={`/trainers/${trainer.username}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
            {trainer.full_name?.charAt(0) ?? '?'}
          </div>
          <div>
            <p className="font-semibold">{trainer.full_name}</p>
            <p className="text-sm text-muted-foreground">@{trainer.username}</p>
          </div>
          {trainer.is_available && (
            <Badge variant="secondary" className="ml-auto">Available</Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {trainer.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {trainer.bio}
            </p>
          )}
          {trainer.specialties && trainer.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {trainer.specialties.map(specialty => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}
          {trainer.price_per_session && (
            <p className="text-sm font-medium">
              ${trainer.price_per_session} / session
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

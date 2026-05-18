import Link from 'next/link'
import { Avatar } from '@/components/shared/avatar'
import { ArrowUpRight } from 'lucide-react'
import type { Profile } from '@/types/models'

type TrainerCardProps = {
  trainer: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url' | 'bio' | 'specialties' | 'price_per_session' | 'is_available'>
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <Link href={`/trainers/${trainer.username}`} className="group block">
      <article className="relative h-full bg-card border border-border transition-all duration-200 hover:border-primary hover:-translate-y-1 hover:shadow-[0_8px_0_-2px_var(--primary)]">

        {/* Estado disponible - top right corner */}
        {trainer.is_available && (
          <div className="absolute top-0 right-0 z-10">
            <div className="bg-primary text-primary-foreground px-3 py-1 font-mono-tag flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              ONLINE
            </div>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Header: Avatar + nombre */}
          <div className="flex items-start gap-3 pr-20">
            <Avatar src={trainer.avatar_url} name={trainer.full_name} size="md" />
            <div className="flex-1 min-w-0 mt-0.5">
              <p className="font-bold truncate group-hover:text-primary transition-colors">
                {trainer.full_name}
              </p>
              <p className="font-mono-tag text-muted-foreground">
                @{trainer.username}
              </p>
            </div>
          </div>

          {/* Bio */}
          {trainer.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {trainer.bio}
            </p>
          )}

          {/* Specialties como pills brutalist */}
          {trainer.specialties && trainer.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {trainer.specialties.slice(0, 3).map(specialty => (
                <span
                  key={specialty}
                  className="font-mono-tag px-2 py-1 border border-foreground/20 bg-background"
                >
                  {specialty}
                </span>
              ))}
              {trainer.specialties.length > 3 && (
                <span className="font-mono-tag px-2 py-1 text-muted-foreground">
                  +{trainer.specialties.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer: Precio + arrow */}
          <div className="flex items-end justify-between pt-4 border-t">
            {trainer.price_per_session ? (
              <div>
                <p className="font-mono-tag text-muted-foreground">PRICE / SESSION</p>
                <p className="text-2xl font-bold font-display tracking-tighter">
                  ${trainer.price_per_session}
                </p>
              </div>
            ) : (
              <div />
            )}
            <div className="w-9 h-9 border border-border bg-background flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
              <ArrowUpRight size={16} className="group-hover:text-primary-foreground transition-colors" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

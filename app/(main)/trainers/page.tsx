import { Suspense } from 'react'
import { getTrainers } from '@/services/profile.service'
import { TrainerCard } from '@/components/trainers/trainer-card'
import { Dumbbell } from 'lucide-react'

function TrainersGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="border h-[280px] bg-muted animate-pulse" />
      ))}
    </div>
  )
}

async function TrainersList() {
  const trainers = await getTrainers()

  if (trainers.length === 0) {
    return (
      <div className="text-center py-20 space-y-4 border border-dashed">
        <div className="inline-flex w-16 h-16 bg-muted items-center justify-center text-muted-foreground">
          <Dumbbell size={28} />
        </div>
        <p className="text-muted-foreground">No trainers available yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
      {trainers.map(trainer => (
        <TrainerCard key={trainer.id} trainer={trainer} />
      ))}
    </div>
  )
}

async function TrainersCount() {
  const trainers = await getTrainers().catch(() => [])
  return <span className="text-primary">{String(trainers.length).padStart(2, '0')}</span>
}

export default function TrainersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          MARKETPLACE / TRAINERS
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
              Find your<br />
              <span className="text-primary">perfect match.</span>
            </h1>
            <p className="text-muted-foreground mt-3">
              Browse expert trainers ready to help you reach your goals
            </p>
          </div>
          <div className="font-mono-tag text-muted-foreground">
            SHOWING <Suspense fallback={<span>--</span>}><TrainersCount /></Suspense> TRAINERS
          </div>
        </div>
      </div>

      <Suspense fallback={<TrainersGridSkeleton />}>
        <TrainersList />
      </Suspense>
    </div>
  )
}

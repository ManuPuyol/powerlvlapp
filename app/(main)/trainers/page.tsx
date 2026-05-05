import { Suspense } from 'react'
import { getTrainers } from '@/services/profile.service'
import { TrainerCard } from '@/components/trainers/trainer-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function TrainersGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-3 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function TrainersList() {
  const trainers = await getTrainers()

  if (trainers.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">
        No trainers available at the moment.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainers.map(trainer => (
        <TrainerCard key={trainer.id} trainer={trainer} />
      ))}
    </div>
  )
}

export default function TrainersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find a Trainer</h1>
        <p className="text-muted-foreground mt-1">Browse available trainers</p>
      </div>

      <Suspense fallback={<TrainersGridSkeleton />}>
        <TrainersList />
      </Suspense>
    </div>
  )
}

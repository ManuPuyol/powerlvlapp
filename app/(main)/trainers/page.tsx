import { Suspense } from 'react'
import { getTrainers } from '@/services/profile.service'
import { TrainerCard } from '@/components/trainers/trainer-card'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { CardListSkeleton } from '@/components/shared/skeletons'
import { Dumbbell } from 'lucide-react'

async function TrainersList() {
  const trainers = await getTrainers()

  if (trainers.length === 0) {
    return <EmptyState icon={Dumbbell} message="No trainers available yet" />
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
      <PageHeader
        breadcrumb="MARKETPLACE / TRAINERS"
        title={<>Find your<br /><span className="text-primary">perfect match.</span></>}
        description="Browse expert trainers ready to help you reach your goals"
        meta={
          <>
            SHOWING <Suspense fallback={<span>--</span>}><TrainersCount /></Suspense> TRAINERS
          </>
        }
      />

      <Suspense fallback={<CardListSkeleton cols={3} height={280} />}>
        <TrainersList />
      </Suspense>
    </div>
  )
}

import { getTrainers } from '@/services/profile.service'
import { TrainerCard } from '@/components/trainers/trainer-card'

export default async function TrainersPage() {
  const trainers = await getTrainers()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find a Trainer</h1>
        <p className="text-muted-foreground mt-1">
          {trainers.length} trainer{trainers.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {trainers.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No trainers available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map(trainer => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      )}
    </div>
  )
}

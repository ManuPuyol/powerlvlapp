import { notFound } from 'next/navigation'
import { getMockClientPlan } from '@/lib/mock-plans'
import { WorkoutSession } from '@/components/training-plans/workout-session'

const TODAY_DAY = (() => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  return days[new Date().getDay()]
})()

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ day?: string }>
}

export default async function WorkoutPage({ params, searchParams }: Props) {
  const { id } = await params
  const { day: dayParam } = await searchParams

  const plan = getMockClientPlan(id)
  if (!plan) notFound()

  // Si pasan ?day=monday usar ese, si no buscar el de hoy, si no el primero disponible
  const day = dayParam
    ? plan.days.find(d => d.day === dayParam)
    : plan.days.find(d => d.day === TODAY_DAY) ?? plan.days[0]

  if (!day) notFound()

  return (
    <WorkoutSession
      day={day}
      planId={plan.id}
      planName={plan.name}
    />
  )
}

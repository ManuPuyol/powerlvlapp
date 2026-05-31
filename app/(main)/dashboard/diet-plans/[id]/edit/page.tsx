import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DietBuilder } from '@/components/diet-plans/diet-builder'
import { getMockDiet } from '@/lib/mock-diets'
import { ArrowLeft } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditDietPlanPage({ params }: Props) {
  const { id } = await params
  const diet = getMockDiet(id)

  if (!diet) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

      <div className="space-y-3">
        <Link
          href={`/dashboard/diet-plans/${diet.id}`}
          className="inline-flex items-center gap-1.5 font-mono-tag text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={12} />
          BACK TO DIET
        </Link>

        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / EDIT DIET
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.05]">
          Edit<br />
          <span className="text-primary">{diet.name}.</span>
        </h1>
      </div>

      <DietBuilder initialDiet={diet} />
    </div>
  )
}

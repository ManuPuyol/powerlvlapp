import Link from 'next/link'
import { DietBuilder } from '@/components/diet-plans/diet-builder'
import { ArrowLeft } from 'lucide-react'

export default function NewDietPlanPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

      <div className="space-y-3">
        <Link
          href="/dashboard/diet-plans"
          className="inline-flex items-center gap-1.5 font-mono-tag text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={12} />
          BACK TO DIETS
        </Link>

        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / NEW DIET
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.05]">
          Build a new<br />
          <span className="text-primary">diet plan.</span>
        </h1>
      </div>

      <DietBuilder />
    </div>
  )
}

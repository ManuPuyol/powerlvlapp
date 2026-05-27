import Link from 'next/link'
import { PlanBuilder } from '@/components/training-plans/plan-builder'
import { ArrowLeft } from 'lucide-react'

export default function NewTrainingPlanPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

      <div className="space-y-3">
        <Link
          href="/dashboard/training-plans"
          className="inline-flex items-center gap-1.5 font-mono-tag text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={12} />
          BACK TO PLANS
        </Link>

        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / NEW PLAN
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.05]">
          Build a new<br />
          <span className="text-primary">training plan.</span>
        </h1>
      </div>

      <PlanBuilder />
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/avatar'
import { AssignPlanDialog } from '@/components/training-plans/assign-plan-dialog'
import { getMockPlan, getMockPlanStats } from '@/lib/mock-plans'
import { PLAN_GOALS, DIFFICULTY_LEVELS } from '@/lib/exercise-library'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Edit, Copy, Trash2, UserPlus, Clock,
  Image as ImageIcon, Video, FileText,
} from 'lucide-react'

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'MON', full: 'Monday' },
  { id: 'tuesday', label: 'TUE', full: 'Tuesday' },
  { id: 'wednesday', label: 'WED', full: 'Wednesday' },
  { id: 'thursday', label: 'THU', full: 'Thursday' },
  { id: 'friday', label: 'FRI', full: 'Friday' },
  { id: 'saturday', label: 'SAT', full: 'Saturday' },
  { id: 'sunday', label: 'SUN', full: 'Sunday' },
] as const

type Props = {
  params: Promise<{ id: string }>
}

export default async function PlanDetailPage({ params }: Props) {
  const { id } = await params
  const plan = getMockPlan(id)

  if (!plan) notFound()

  const stats = getMockPlanStats(plan)
  const goalInfo = PLAN_GOALS.find(g => g.id === plan.goal)
  const difficultyInfo = DIFFICULTY_LEVELS.find(d => d.id === plan.difficulty)

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fade-in-up">

      {/* Back link */}
      <Link
        href="/dashboard/training-plans"
        className="inline-flex items-center gap-1.5 font-mono-tag text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={12} />
        BACK TO PLANS
      </Link>

      {/* Hero */}
      <div className="border bg-card overflow-hidden">

        {/* Top stripe with type indicator */}
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            {plan.is_template ? (
              <div className="inline-flex items-center gap-2 font-mono-tag text-muted-foreground">
                <FileText size={12} />
                TEMPLATE • CAN BE ASSIGNED TO MULTIPLE CLIENTS
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 font-mono-tag text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                ACTIVE PLAN
              </div>
            )}
            <span className="font-mono-tag text-muted-foreground">UPDATED {plan.updated_at.toUpperCase()}</span>
          </div>
        </div>

        {/* Main info */}
        <div className="p-6 md:p-8 space-y-6">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.05]">
                {plan.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl">{plan.description}</p>

              {/* Tags */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <span className={cn('font-mono-tag', goalInfo?.color)}>
                  {goalInfo?.label.toUpperCase()}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono-tag text-muted-foreground inline-flex items-center gap-1">
                  {difficultyInfo?.label.toUpperCase()}
                  <span className="flex gap-0.5 ml-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'w-1 h-1 rounded-full',
                          i < (difficultyInfo?.dots ?? 0) ? 'bg-primary' : 'bg-muted-foreground/30'
                        )}
                      />
                    ))}
                  </span>
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono-tag text-muted-foreground">
                  {plan.weeks} WEEKS
                </span>
              </div>
            </div>
          </div>

          {/* Assigned client */}
          {plan.assigned_to && (
            <Link
              href={`/trainers/${plan.assigned_to.username}`}
              className="group flex items-center gap-3 p-4 border bg-background hover:border-primary transition-colors max-w-md"
            >
              <Avatar src={plan.assigned_to.avatar_url} name={plan.assigned_to.full_name} size="sm" />
              <div className="flex-1">
                <p className="font-mono-tag text-muted-foreground">ASSIGNED TO</p>
                <p className="font-bold group-hover:text-primary transition-colors">
                  {plan.assigned_to.full_name}
                </p>
              </div>
            </Link>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link href={`/dashboard/training-plans/${plan.id}/edit`}>
                <Edit size={14} className="mr-1.5" />
                Edit plan
              </Link>
            </Button>
            {plan.is_template && (
              <AssignPlanDialog
                planName={plan.name}
                trigger={
                  <Button variant="outline">
                    <UserPlus size={14} className="mr-1.5" />
                    Assign to client
                  </Button>
                }
              />
            )}
            <Button variant="outline">
              <Copy size={14} className="mr-1.5" />
              Duplicate
            </Button>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <Trash2 size={14} className="mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBlock label="DAYS / WEEK" value={String(stats.days).padStart(2, '0')} accent />
        <StatBlock label="EXERCISES" value={String(stats.exercises).padStart(2, '0')} />
        <StatBlock label="SETS / WEEK" value={String(stats.sets).padStart(2, '0')} />
        <StatBlock label="AVG TIME" value={`${stats.avgTimePerDay}m`} />
      </div>

      {/* Days schedule */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-mono-tag text-muted-foreground">SCHEDULE</p>
          <span className="font-mono-tag text-muted-foreground">{String(plan.days.length).padStart(2, '0')} DAYS</span>
        </div>

        {/* Week strip visual */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {DAYS_OF_WEEK.map(day => {
            const planDay = plan.days.find(d => d.day === day.id)
            return (
              <div
                key={day.id}
                className={cn(
                  'aspect-square flex flex-col items-center justify-center font-mono-tag text-xs border',
                  planDay
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground/40'
                )}
              >
                <span className="opacity-70 text-[10px]">{day.label[0]}</span>
                {planDay && <span className="text-[8px] mt-0.5">{planDay.exercises.length}EX</span>}
              </div>
            )
          })}
        </div>

        {/* Day cards */}
        {plan.days.length === 0 ? (
          <div className="border border-dashed p-12 text-center">
            <p className="font-mono-tag text-muted-foreground">[ NO DAYS YET ]</p>
            <p className="text-sm text-muted-foreground mt-1">Edit the plan to add training days</p>
          </div>
        ) : (
          plan.days.map((day, dayIdx) => {
            const dayInfo = DAYS_OF_WEEK.find(d => d.id === day.day)
            const totalSets = day.exercises.reduce((s, e) => s + e.sets, 0)
            const time = day.exercises.reduce(
              (acc, e) => acc + e.sets * 45 + (e.sets - 1) * e.rest,
              0
            )

            return (
              <div key={day.id} className="border bg-card">
                <div className="flex items-center gap-3 p-4 border-b">
                  <div className="w-12 h-12 bg-primary text-primary-foreground flex flex-col items-center justify-center font-mono-tag font-bold leading-none">
                    <span className="text-[10px] opacity-70">{String(dayIdx + 1).padStart(2, '0')}</span>
                    <span className="text-xs">{dayInfo?.label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono-tag text-muted-foreground">
                      {dayInfo?.full.toUpperCase()} • {day.exercises.length} EX • {totalSets} SETS
                    </p>
                    <h3 className="font-bold text-lg">{day.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-tag text-primary inline-flex items-center gap-1">
                      <Clock size={10} /> {Math.round(time / 60)}m
                    </p>
                  </div>
                </div>

                <div className="divide-y">
                  {day.exercises.map((ex, idx) => (
                    <div key={ex.id} className="p-4 flex items-start gap-3">
                      <span className="font-mono-tag text-muted-foreground text-xs pt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{ex.name}</p>
                        <p className="font-mono-tag text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                          <span>{ex.sets} × {ex.reps}</span>
                          {ex.rest > 0 && <span>{ex.rest}s REST</span>}
                          {ex.tempo && <span>TEMPO {ex.tempo}</span>}
                          {ex.rpe && <span className="text-primary">RPE {ex.rpe}</span>}
                          {ex.category && (
                            <>
                              <span className="text-muted-foreground/40">•</span>
                              <span>{ex.category.toUpperCase()}</span>
                            </>
                          )}
                        </p>
                        {ex.notes && (
                          <p className="text-sm text-muted-foreground mt-1.5 italic">{ex.notes}</p>
                        )}
                        {ex.media.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {ex.media.map((m, i) => (
                              <span
                                key={i}
                                className="font-mono-tag text-xs px-1.5 py-0.5 bg-background border inline-flex items-center gap-1"
                              >
                                {m.type === 'image' ? <ImageIcon size={10} /> : <Video size={10} />}
                                {m.type.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function StatBlock({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn(
      'border bg-card p-4 relative overflow-hidden',
      accent && 'border-primary'
    )}>
      <div className={cn(
        'absolute top-0 left-0 right-0 h-0.5',
        accent ? 'bg-primary' : 'bg-foreground/10'
      )} />
      <p className="font-mono-tag text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl md:text-3xl font-bold font-display tracking-tighter">{value}</p>
    </div>
  )
}

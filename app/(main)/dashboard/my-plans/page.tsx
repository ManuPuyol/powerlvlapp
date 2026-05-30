'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/avatar'
import { MOCK_CLIENT_PLANS, getMockPlanStats, type ClientAssignedPlan } from '@/lib/mock-plans'
import { PLAN_GOALS, DIFFICULTY_LEVELS } from '@/lib/exercise-library'
import { cn } from '@/lib/utils'
import {
  Dumbbell, Calendar, ArrowUpRight, Play,
  Clock, CheckCircle2, Pause, Flame, Trophy, Activity,
} from 'lucide-react'

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'M', full: 'Monday' },
  { id: 'tuesday', label: 'T', full: 'Tuesday' },
  { id: 'wednesday', label: 'W', full: 'Wednesday' },
  { id: 'thursday', label: 'T', full: 'Thursday' },
  { id: 'friday', label: 'F', full: 'Friday' },
  { id: 'saturday', label: 'S', full: 'Saturday' },
  { id: 'sunday', label: 'S', full: 'Sunday' },
] as const

const TODAY_DAY = (() => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  return days[new Date().getDay()]
})()

const TAB_OPTIONS = [
  { id: 'active', label: 'Active' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
] as const

type TabId = typeof TAB_OPTIONS[number]['id']

export default function MyPlansPage() {
  const [tab, setTab] = useState<TabId>('active')

  const active = MOCK_CLIENT_PLANS.filter(p => p.status === 'active')
  const upcoming = MOCK_CLIENT_PLANS.filter(p => p.status === 'upcoming')
  const completed = MOCK_CLIENT_PLANS.filter(p => p.status === 'completed')
  const paused = MOCK_CLIENT_PLANS.filter(p => p.status === 'paused')

  const activePlan = active[0]
  const todayPlanDay = activePlan?.days.find(d => d.day === TODAY_DAY)

  // Mock personal stats
  const personalStats = {
    workoutsThisWeek: 3,
    streak: 12,
    totalCompleted: 47,
  }

  if (MOCK_CLIENT_PLANS.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="border border-dashed p-12 text-center space-y-4">
          <div className="inline-flex w-14 h-14 bg-muted items-center justify-center text-muted-foreground">
            <Dumbbell size={24} />
          </div>
          <p className="text-muted-foreground">You don&apos;t have any training plans yet</p>
          <Button asChild>
            <Link href="/trainers">Find a trainer</Link>
          </Button>
        </div>
      </div>
    )
  }

  const tabCounts = {
    active: active.length,
    upcoming: upcoming.length + paused.length,
    completed: completed.length,
  }

  const filtered =
    tab === 'active' ? active :
    tab === 'upcoming' ? [...upcoming, ...paused] :
    completed

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in-up">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / MY PLANS
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
          Your training<br /><span className="text-primary">journey.</span>
        </h1>
      </div>

      {/* Personal stats */}
      <div className="grid grid-cols-3 gap-4">
        <PersonalStat
          label="THIS WEEK"
          value={String(personalStats.workoutsThisWeek).padStart(2, '0')}
          hint="WORKOUTS"
          icon={<Activity size={14} />}
        />
        <PersonalStat
          label="STREAK"
          value={String(personalStats.streak).padStart(2, '0')}
          hint="DAYS"
          icon={<Flame size={14} />}
          accent
        />
        <PersonalStat
          label="TOTAL"
          value={String(personalStats.totalCompleted).padStart(2, '0')}
          hint="COMPLETED"
          icon={<Trophy size={14} />}
        />
      </div>

      {/* Featured: Active plan with today */}
      {activePlan && (
        <FeaturedActivePlan plan={activePlan} todayPlanDay={todayPlanDay} />
      )}

      {/* Tabs */}
      <div className="space-y-4">
        <div className="border-b flex items-center gap-1">
          {TAB_OPTIONS.map(opt => {
            const count = tabCounts[opt.id]
            const isActive = tab === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTab(opt.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 font-mono-tag text-xs border-b-2 -mb-px transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.label.toUpperCase()}
                <span className={cn(
                  'px-1.5 py-0.5 text-[10px] border',
                  isActive ? 'border-primary' : 'border-border'
                )}>
                  {String(count).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed p-12 text-center space-y-2">
            <p className="font-mono-tag text-muted-foreground">[ NO {tab.toUpperCase()} PLANS ]</p>
            {tab === 'active' && (
              <p className="text-sm text-muted-foreground">Ask your trainer to assign you a plan</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(plan => <PlanCard key={plan.id} plan={plan} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function PersonalStat({
  label, value, hint, icon, accent,
}: {
  label: string
  value: string
  hint: string
  icon: React.ReactNode
  accent?: boolean
}) {
  return (
    <div className={cn(
      'border bg-card p-4 relative overflow-hidden',
      accent && 'border-primary'
    )}>
      <div className={cn(
        'absolute top-0 left-0 right-0 h-0.5',
        accent ? 'bg-primary' : 'bg-foreground/10'
      )} />
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono-tag text-muted-foreground">{label}</p>
        <span className={cn(accent ? 'text-primary' : 'text-muted-foreground')}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className={cn(
          'text-3xl md:text-4xl font-bold font-display tracking-tighter',
          accent && 'text-primary'
        )}>
          {value}
        </p>
        <p className="font-mono-tag text-muted-foreground">{hint}</p>
      </div>
    </div>
  )
}

function FeaturedActivePlan({
  plan,
  todayPlanDay,
}: {
  plan: ClientAssignedPlan
  todayPlanDay: typeof plan.days[number] | undefined
}) {
  const goalInfo = PLAN_GOALS.find(g => g.id === plan.goal)

  return (
    <article className="relative border-2 border-primary bg-card overflow-hidden">

      {/* Top stripe with status */}
      <div className="bg-primary text-primary-foreground px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono-tag">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
          ACTIVE PLAN
        </div>
        <span className="font-mono-tag opacity-70">
          STARTED {plan.assigned_date.toUpperCase()}
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr]">

        {/* Left: today's workout */}
        <div className="p-6 lg:p-8 space-y-5 border-b lg:border-b-0 lg:border-r">

          {todayPlanDay ? (
            <>
              <div className="flex items-center gap-2 font-mono-tag text-primary">
                <Calendar size={12} />
                TODAY&apos;S WORKOUT
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.05]">
                  {todayPlanDay.name}
                </h2>
                <p className="font-mono-tag text-muted-foreground mt-2">
                  {todayPlanDay.exercises.length} EXERCISES • {todayPlanDay.exercises.reduce((s, e) => s + e.sets, 0)} SETS
                </p>
              </div>

              {/* Quick preview de los primeros 3 ejercicios */}
              <div className="space-y-1.5">
                {todayPlanDay.exercises.slice(0, 3).map((ex, idx) => (
                  <div key={ex.id} className="flex items-center gap-3 text-sm">
                    <span className="font-mono-tag text-muted-foreground text-xs">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-medium flex-1 truncate">{ex.name}</span>
                    <span className="font-mono-tag text-muted-foreground text-xs">
                      {ex.sets}×{ex.reps}
                    </span>
                  </div>
                ))}
                {todayPlanDay.exercises.length > 3 && (
                  <div className="font-mono-tag text-muted-foreground text-xs pl-7">
                    +{todayPlanDay.exercises.length - 3} more
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-2">
                <Button asChild size="lg">
                  <Link href={`/dashboard/my-plans/${plan.id}/workout`}>
                    <Play size={14} className="mr-1.5" />
                    Start workout
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`/dashboard/my-plans/${plan.id}`}>View plan</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
                <Calendar size={12} />
                TODAY • REST DAY
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                  Rest & recover.
                </h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  No workout scheduled for today. Get ready for tomorrow&apos;s session.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/dashboard/my-plans/${plan.id}`}>View plan</Link>
              </Button>
            </>
          )}
        </div>

        {/* Right: plan info + week */}
        <div className="p-6 lg:p-8 bg-muted/30 space-y-5">

          {/* Plan info */}
          <div>
            <p className="font-mono-tag text-muted-foreground mb-1">CURRENT PLAN</p>
            <h3 className="text-xl font-bold tracking-tighter">{plan.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn('font-mono-tag', goalInfo?.color)}>
                {goalInfo?.label.toUpperCase()}
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="font-mono-tag text-muted-foreground">{plan.weeks} WEEKS</span>
            </div>
          </div>

          {/* Trainer */}
          <Link
            href={`/trainers/${plan.trainer.username}`}
            className="group flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <Avatar src={plan.trainer.avatar_url} name={plan.trainer.full_name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="font-mono-tag text-muted-foreground text-[10px]">TRAINER</p>
              <p className="font-medium truncate">{plan.trainer.full_name}</p>
            </div>
            <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>

          {/* Week strip */}
          <div className="space-y-2">
            <p className="font-mono-tag text-muted-foreground">THIS WEEK</p>
            <div className="grid grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map(day => {
                const planDay = plan.days.find(d => d.day === day.id)
                const isToday = day.id === TODAY_DAY
                return (
                  <div
                    key={day.id}
                    className={cn(
                      'aspect-square flex flex-col items-center justify-center font-mono-tag text-[10px] border relative',
                      planDay
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground/40 bg-card',
                      isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                    )}
                  >
                    <span className="opacity-70">{day.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Progress */}
          {plan.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono-tag text-xs">
                <span className="text-muted-foreground">PROGRESS</span>
                <span className="text-primary">{plan.progress}%</span>
              </div>
              <div className="h-1.5 bg-muted relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all"
                  style={{ width: `${plan.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function PlanCard({ plan }: { plan: ClientAssignedPlan }) {
  const stats = getMockPlanStats(plan)
  const goalInfo = PLAN_GOALS.find(g => g.id === plan.goal)
  const difficultyInfo = DIFFICULTY_LEVELS.find(d => d.id === plan.difficulty)
  const isCompleted = plan.status === 'completed'

  return (
    <Link
      href={`/dashboard/my-plans/${plan.id}`}
      className={cn(
        'group relative border bg-card transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_0_-1px_var(--primary)]',
        isCompleted && 'opacity-80'
      )}
    >
      <div className={cn(
        'absolute top-0 left-0 right-0 h-0.5 group-hover:bg-primary transition-colors',
        plan.status === 'active' && 'bg-primary',
        plan.status === 'completed' && 'bg-foreground/10',
        plan.status === 'upcoming' && 'bg-blue-500/40',
        plan.status === 'paused' && 'bg-orange-500/40'
      )} />

      <div className="p-5 space-y-4">

        {/* Status + completed icon */}
        <div className="flex items-center justify-between">
          <StatusBadge status={plan.status} />
          {isCompleted && (
            <div className="w-8 h-8 bg-primary/10 flex items-center justify-center text-primary">
              <Trophy size={14} />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <p className="font-bold group-hover:text-primary transition-colors">{plan.name}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{plan.description}</p>
        </div>

        {/* Trainer */}
        <div className="flex items-center gap-2">
          <Avatar src={plan.trainer.avatar_url} name={plan.trainer.full_name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="font-mono-tag text-muted-foreground text-[10px]">TRAINER</p>
            <p className="text-sm font-medium truncate">{plan.trainer.full_name}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className={cn('font-mono-tag', goalInfo?.color)}>
            {goalInfo?.label.toUpperCase()}
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span className="font-mono-tag text-muted-foreground inline-flex items-center gap-1">
            {difficultyInfo?.label.toUpperCase()}
            <span className="flex gap-0.5">
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
        </div>

        {/* Progress bar */}
        {plan.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between font-mono-tag text-xs">
              <span className="text-muted-foreground">{isCompleted ? 'COMPLETED' : 'PROGRESS'}</span>
              <span className={isCompleted ? 'text-muted-foreground' : 'text-primary'}>{plan.progress}%</span>
            </div>
            <div className="h-1 bg-muted relative overflow-hidden">
              <div
                className={cn(
                  'absolute inset-y-0 left-0 transition-all',
                  isCompleted ? 'bg-foreground/40' : 'bg-primary'
                )}
                style={{ width: `${plan.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t flex items-center justify-between font-mono-tag text-xs text-muted-foreground">
          <div className="flex gap-3">
            <span>{stats.days}D</span>
            <span>•</span>
            <span>{stats.exercises}EX</span>
            <span>•</span>
            <span>{plan.weeks}W</span>
          </div>
          <ArrowUpRight size={14} className="group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  )
}

function StatusBadge({ status }: { status: ClientAssignedPlan['status'] }) {
  const config = {
    active: { label: 'ACTIVE', icon: <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />, className: 'text-primary' },
    completed: { label: 'COMPLETED', icon: <CheckCircle2 size={10} />, className: 'text-muted-foreground' },
    upcoming: { label: 'UPCOMING', icon: <Clock size={10} />, className: 'text-blue-500' },
    paused: { label: 'PAUSED', icon: <Pause size={10} />, className: 'text-orange-500' },
  }[status]

  return (
    <span className={cn('inline-flex items-center gap-1.5 font-mono-tag', config.className)}>
      {config.icon}
      {config.label}
    </span>
  )
}

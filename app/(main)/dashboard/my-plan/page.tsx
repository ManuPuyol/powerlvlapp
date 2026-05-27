import Link from 'next/link'
import { Avatar } from '@/components/shared/avatar'
import { Button } from '@/components/ui/button'
import { MOCK_PLANS, getMockPlanStats } from '@/lib/mock-plans'
import { PLAN_GOALS, DIFFICULTY_LEVELS } from '@/lib/exercise-library'
import { cn } from '@/lib/utils'
import {
  Clock, Image as ImageIcon, Video, Dumbbell,
  CheckCircle2, Circle, Calendar,
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

const TODAY_DAY = (() => {
  const days: typeof DAYS_OF_WEEK[number]['id'][] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
})()

export default function MyPlanPage() {
  // Mock: simular que el cliente tiene asignado el plan id 1 con un trainer
  const plan = MOCK_PLANS[0]
  const trainer = {
    full_name: 'Sara García',
    username: 'saragarcia',
    avatar_url: null,
  }

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="border border-dashed p-12 text-center space-y-4">
          <div className="inline-flex w-14 h-14 bg-muted items-center justify-center text-muted-foreground">
            <Dumbbell size={24} />
          </div>
          <p className="text-muted-foreground">You don&apos;t have a training plan assigned yet</p>
          <Button asChild>
            <Link href="/trainers">Find a trainer</Link>
          </Button>
        </div>
      </div>
    )
  }

  const stats = getMockPlanStats(plan)
  const goalInfo = PLAN_GOALS.find(g => g.id === plan.goal)
  const difficultyInfo = DIFFICULTY_LEVELS.find(d => d.id === plan.difficulty)
  const todayPlanDay = plan.days.find(d => d.day === TODAY_DAY)

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fade-in-up">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / MY PLAN
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
          Your<br /><span className="text-primary">training plan.</span>
        </h1>
      </div>

      {/* Today CTA */}
      {todayPlanDay ? (
        <div className="border-2 border-primary bg-primary/5 p-6 space-y-4">
          <div className="flex items-center gap-2 font-mono-tag text-primary">
            <Calendar size={12} />
            TODAY • {DAYS_OF_WEEK.find(d => d.id === TODAY_DAY)?.full.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tighter">{todayPlanDay.name}</h2>
            <p className="font-mono-tag text-muted-foreground mt-1">
              {todayPlanDay.exercises.length} EXERCISES • {todayPlanDay.exercises.reduce((s, e) => s + e.sets, 0)} SETS
            </p>
          </div>
          <Button size="lg">
            Start workout
          </Button>
        </div>
      ) : (
        <div className="border bg-card p-6 space-y-2">
          <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
            <Calendar size={12} />
            TODAY • {DAYS_OF_WEEK.find(d => d.id === TODAY_DAY)?.full.toUpperCase()}
          </div>
          <p className="font-bold">Rest day</p>
          <p className="text-sm text-muted-foreground">Recover and come back stronger tomorrow</p>
        </div>
      )}

      {/* Plan info */}
      <div className="border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b">
          <Avatar src={trainer.avatar_url} name={trainer.full_name} size="sm" />
          <div className="flex-1">
            <p className="font-mono-tag text-muted-foreground">FROM YOUR TRAINER</p>
            <Link
              href={`/trainers/${trainer.username}`}
              className="font-bold hover:text-primary transition-colors"
            >
              {trainer.full_name}
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tighter">{plan.name}</h2>
          <p className="text-muted-foreground mt-1">{plan.description}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
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

      {/* Week visual */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map(day => {
          const planDay = plan.days.find(d => d.day === day.id)
          const isToday = day.id === TODAY_DAY
          return (
            <div
              key={day.id}
              className={cn(
                'aspect-square flex flex-col items-center justify-center font-mono-tag border relative',
                planDay
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground/40 bg-card',
                isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}
            >
              <span className="text-[10px] opacity-70">{day.label[0]}</span>
              {planDay && <span className="text-[8px] mt-0.5">{planDay.exercises.length}EX</span>}
              {isToday && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatBlock label="DAYS / WEEK" value={String(stats.days).padStart(2, '0')} accent />
        <StatBlock label="EXERCISES" value={String(stats.exercises).padStart(2, '0')} />
        <StatBlock label="WEEK PROGRESS" value="00%" />
      </div>

      {/* All days schedule */}
      <div className="space-y-4">
        <p className="font-mono-tag text-muted-foreground">FULL SCHEDULE</p>

        {plan.days.map((day, dayIdx) => {
          const dayInfo = DAYS_OF_WEEK.find(d => d.id === day.day)
          const totalSets = day.exercises.reduce((s, e) => s + e.sets, 0)
          const time = day.exercises.reduce(
            (acc, e) => acc + e.sets * 45 + (e.sets - 1) * e.rest,
            0
          )
          const isToday = day.day === TODAY_DAY

          return (
            <div key={day.id} className={cn(
              'border bg-card',
              isToday && 'border-primary'
            )}>
              <div className="flex items-center gap-3 p-4 border-b">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex flex-col items-center justify-center font-mono-tag font-bold leading-none">
                  <span className="text-[10px] opacity-70">{String(dayIdx + 1).padStart(2, '0')}</span>
                  <span className="text-xs">{dayInfo?.label}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono-tag text-muted-foreground">
                    {dayInfo?.full.toUpperCase()} {isToday && '• TODAY'} • {totalSets} SETS
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
                  <ExerciseItem key={ex.id} exercise={ex} index={idx} />
                ))}
              </div>
            </div>
          )
        })}
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

function ExerciseItem({
  exercise,
  index,
}: {
  exercise: { id: string; name: string; sets: number; reps: string; rest: number; tempo: string; rpe: string; notes: string; media: { type: 'image' | 'video'; url: string }[] }
  index: number
}) {
  return (
    <div className="p-4 flex items-start gap-3 group hover:bg-muted/30 transition-colors">
      <button
        type="button"
        className="mt-1 text-muted-foreground/50 hover:text-primary transition-colors"
      >
        <Circle size={16} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-mono-tag text-muted-foreground text-xs">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="font-medium">{exercise.name}</p>
        </div>
        <p className="font-mono-tag text-muted-foreground mt-1 flex flex-wrap gap-x-3">
          <span>{exercise.sets} × {exercise.reps}</span>
          {exercise.rest > 0 && <span>{exercise.rest}s REST</span>}
          {exercise.tempo && <span>TEMPO {exercise.tempo}</span>}
          {exercise.rpe && <span className="text-primary">RPE {exercise.rpe}</span>}
        </p>
        {exercise.notes && (
          <p className="text-sm text-muted-foreground mt-1.5 italic">{exercise.notes}</p>
        )}
        {exercise.media.length > 0 && (
          <div className="flex gap-1 mt-2">
            {exercise.media.map((m, i) => (
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
  )
}

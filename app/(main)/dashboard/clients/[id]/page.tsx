import Link from 'next/link'
import { Avatar } from '@/components/shared/avatar'
import { Button } from '@/components/ui/button'
import { AssignPlanToClientDialog } from '@/components/training-plans/assign-plan-to-client-dialog'
import {
  getMockClient,
  getMockPlansForClient,
  getMockPlanStats,
  type ClientAssignedPlan,
} from '@/lib/mock-plans'
import { PLAN_GOALS, DIFFICULTY_LEVELS } from '@/lib/exercise-library'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, MessageSquare, UserPlus, Dumbbell,
  Calendar, ArrowUpRight, CheckCircle2, Clock, Pause,
  Activity, Flame, Trophy,
} from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params

  // MOCK: si el id no está en el mock, usamos un cliente genérico (datos reales vendrán de Supabase)
  const client = getMockClient(id) ?? {
    id,
    full_name: 'Client',
    username: 'client',
    avatar_url: null,
    active_plans: 0,
    since: 'recently',
  }

  const plans = getMockPlansForClient(id)
  const activePlans = plans.filter(p => p.status === 'active')
  const otherPlans = plans.filter(p => p.status !== 'active')

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fade-in-up">

      {/* Back */}
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center gap-1.5 font-mono-tag text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={12} />
        BACK TO CLIENTS
      </Link>

      {/* Hero */}
      <div className="border bg-card overflow-hidden">
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <div className="inline-flex items-center gap-2 font-mono-tag text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              ACTIVE CLIENT
            </div>
            <span className="font-mono-tag text-muted-foreground">
              SINCE {client.since.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar src={client.avatar_url} name={client.full_name} size="lg" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">{client.full_name}</h1>
              <p className="font-mono-tag text-muted-foreground mt-1">@{client.username}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <AssignPlanToClientDialog
              clientName={client.full_name}
              trigger={
                <Button>
                  <UserPlus size={14} className="mr-1.5" />
                  Assign plan
                </Button>
              }
            />
            <Button variant="outline">
              <MessageSquare size={14} className="mr-1.5" />
              Message
            </Button>
            <Button asChild variant="outline">
              <Link href={`/trainers/${client.username}`}>
                View profile <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Client stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ClientStat label="ACTIVE PLANS" value={String(activePlans.length).padStart(2, '0')} icon={<Dumbbell size={14} />} accent />
        <ClientStat label="THIS WEEK" value="03" hint="WORKOUTS" icon={<Activity size={14} />} />
        <ClientStat label="STREAK" value="12" hint="DAYS" icon={<Flame size={14} />} />
        <ClientStat label="COMPLETED" value="47" hint="TOTAL" icon={<Trophy size={14} />} />
      </div>

      {/* Active plans */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono-tag text-primary flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            ACTIVE PLANS
          </h2>
          <span className="font-mono-tag text-muted-foreground">
            {String(activePlans.length).padStart(2, '0')}
          </span>
        </div>

        {activePlans.length === 0 ? (
          <div className="border border-dashed p-8 text-center space-y-3">
            <div className="inline-flex w-12 h-12 bg-muted items-center justify-center text-muted-foreground">
              <Dumbbell size={20} />
            </div>
            <p className="text-sm text-muted-foreground">No active plans assigned</p>
            <AssignPlanToClientDialog
              clientName={client.full_name}
              trigger={
                <Button size="sm">
                  <UserPlus size={14} className="mr-1.5" />
                  Assign a plan
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePlans.map(plan => <ClientPlanCard key={plan.id} plan={plan} />)}
          </div>
        )}
      </section>

      {/* History */}
      {otherPlans.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono-tag text-muted-foreground">HISTORY</h2>
            <span className="font-mono-tag text-muted-foreground">
              {String(otherPlans.length).padStart(2, '0')}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherPlans.map(plan => <ClientPlanCard key={plan.id} plan={plan} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function ClientStat({
  label, value, hint, icon, accent,
}: {
  label: string
  value: string
  hint?: string
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
      <div className="flex items-baseline gap-1.5">
        <p className={cn('text-2xl md:text-3xl font-bold font-display tracking-tighter', accent && 'text-primary')}>
          {value}
        </p>
        {hint && <p className="font-mono-tag text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}

function ClientPlanCard({ plan }: { plan: ClientAssignedPlan }) {
  const stats = getMockPlanStats(plan)
  const goalInfo = PLAN_GOALS.find(g => g.id === plan.goal)
  const difficultyInfo = DIFFICULTY_LEVELS.find(d => d.id === plan.difficulty)

  return (
    <Link
      href={`/dashboard/training-plans/${plan.id}`}
      className="group relative border bg-card p-5 transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_0_-1px_var(--primary)]"
    >
      <div className={cn(
        'absolute top-0 left-0 right-0 h-0.5 group-hover:bg-primary transition-colors',
        plan.status === 'active' ? 'bg-primary' : 'bg-foreground/10'
      )} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <StatusBadge status={plan.status} />
        </div>

        <div>
          <p className="font-bold group-hover:text-primary transition-colors">{plan.name}</p>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{plan.description}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className={cn('font-mono-tag', goalInfo?.color)}>
            {goalInfo?.label.toUpperCase()}
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span className="font-mono-tag text-muted-foreground">
            {difficultyInfo?.label.toUpperCase()}
          </span>
        </div>

        {plan.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between font-mono-tag text-xs">
              <span className="text-muted-foreground">PROGRESS</span>
              <span className="text-primary">{plan.progress}%</span>
            </div>
            <div className="h-1 bg-muted relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-primary transition-all"
                style={{ width: `${plan.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="pt-3 border-t flex items-center justify-between font-mono-tag text-xs text-muted-foreground">
          <div className="flex gap-3">
            <span>{stats.days}D</span>
            <span>•</span>
            <span>{stats.exercises}EX</span>
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

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus, Users, Search, FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLAN_GOALS, DIFFICULTY_LEVELS } from '@/lib/exercise-library'
import { MOCK_PLANS, getMockPlanStats, type MockPlan } from '@/lib/mock-plans'

type FilterType = 'all' | 'templates' | 'assigned'
type SortKey = 'updated' | 'name'

export default function TrainingPlansPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [goalFilter, setGoalFilter] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('updated')

  const filtered = useMemo(() => {
    let result = MOCK_PLANS

    if (filter === 'templates') result = result.filter(p => p.is_template)
    if (filter === 'assigned') result = result.filter(p => !p.is_template)

    if (goalFilter !== 'all') result = result.filter(p => p.goal === goalFilter)

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.assigned_to?.full_name.toLowerCase().includes(q)
      )
    }

    if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))

    return result
  }, [search, filter, goalFilter, sort])

  const stats = useMemo(() => ({
    total: MOCK_PLANS.length,
    templates: MOCK_PLANS.filter(p => p.is_template).length,
    assigned: MOCK_PLANS.filter(p => !p.is_template).length,
  }), [])

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / TRAINING PLANS
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
              Training<br /><span className="text-primary">plans.</span>
            </h1>
            <p className="text-muted-foreground mt-3">
              Create and manage workout routines for your clients
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/dashboard/training-plans/new">
              <Plus size={16} className="mr-1" />
              New plan
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatTile label="TOTAL PLANS" value={stats.total} />
        <StatTile label="TEMPLATES" value={stats.templates} icon={<FileText size={14} />} />
        <StatTile label="ASSIGNED" value={stats.assigned} icon={<Users size={14} />} accent />
      </div>

      {/* Filters */}
      <div className="border bg-card">
        <div className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search plans, clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'templates', 'assigned'] as FilterType[]).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 font-mono-tag text-xs border transition-colors',
                  filter === f
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary'
                )}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <Select value={goalFilter} onValueChange={setGoalFilter}>
            <SelectTrigger className="md:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All goals</SelectItem>
              {PLAN_GOALS.map(g => (
                <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={v => setSort(v as SortKey)}>
            <SelectTrigger className="md:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-mono-tag text-muted-foreground">
            SHOWING <span className="text-primary">{String(filtered.length).padStart(2, '0')}</span> RESULTS
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed p-12 text-center space-y-3">
            <p className="font-mono-tag text-muted-foreground">[ NO RESULTS ]</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((plan, idx) => (
              <PlanCard key={plan.id} plan={plan} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatTile({ label, value, icon, accent }: { label: string; value: number; icon?: React.ReactNode; accent?: boolean }) {
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
        {icon && <span className={cn(accent ? 'text-primary' : 'text-muted-foreground')}>{icon}</span>}
      </div>
      <p className="text-3xl font-bold font-display tracking-tighter">
        {String(value).padStart(2, '0')}
      </p>
    </div>
  )
}

function PlanCard({ plan, idx }: { plan: MockPlan; idx: number }) {
  const goalInfo = PLAN_GOALS.find(g => g.id === plan.goal)
  const difficultyInfo = DIFFICULTY_LEVELS.find(d => d.id === plan.difficulty)
  const stats = getMockPlanStats(plan)

  return (
    <Link
      href={`/dashboard/training-plans/${plan.id}`}
      className="group relative border bg-card p-5 transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_0_-1px_var(--primary)]"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-foreground/10 group-hover:bg-primary transition-colors" />

      <div className="absolute top-0 right-0 font-mono-tag text-muted-foreground p-3">
        {String(idx + 1).padStart(2, '0')}
      </div>

      <div className="space-y-3 pr-8">
        {plan.is_template ? (
          <div className="inline-flex items-center gap-1.5 font-mono-tag text-muted-foreground">
            <FileText size={10} />
            TEMPLATE
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 font-mono-tag text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            ACTIVE • {plan.assigned_to?.full_name.toUpperCase()}
          </div>
        )}

        <div>
          <p className="font-bold group-hover:text-primary transition-colors">{plan.name}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{plan.description}</p>
        </div>

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
      </div>

      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <div className="flex gap-3 font-mono-tag text-muted-foreground text-xs">
          <span>{stats.days}D</span>
          <span>•</span>
          <span>{stats.exercises}EX</span>
          <span>•</span>
          <span>{plan.weeks}W</span>
        </div>
        <span className="font-mono-tag text-muted-foreground text-xs">
          {plan.updated_at.toUpperCase()}
        </span>
      </div>
    </Link>
  )
}

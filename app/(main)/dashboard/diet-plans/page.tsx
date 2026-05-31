'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus, Users, Search, FileText, Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DIET_GOALS, DIET_DIFFICULTY } from '@/lib/food-library'
import { MOCK_DIETS, getMockDietStats, type MockDiet } from '@/lib/mock-diets'

type FilterType = 'all' | 'templates' | 'assigned'
type SortKey = 'updated' | 'name'

export default function DietPlansPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [goalFilter, setGoalFilter] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('updated')

  const filtered = useMemo(() => {
    let result = MOCK_DIETS

    if (filter === 'templates') result = result.filter(d => d.is_template)
    if (filter === 'assigned') result = result.filter(d => !d.is_template)

    if (goalFilter !== 'all') result = result.filter(d => d.goal === goalFilter)

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.assigned_to?.full_name.toLowerCase().includes(q)
      )
    }

    if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))

    return result
  }, [search, filter, goalFilter, sort])

  const stats = useMemo(() => ({
    total: MOCK_DIETS.length,
    templates: MOCK_DIETS.filter(d => d.is_template).length,
    assigned: MOCK_DIETS.filter(d => !d.is_template).length,
  }), [])

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / DIET PLANS
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
              Diet<br /><span className="text-primary">plans.</span>
            </h1>
            <p className="text-muted-foreground mt-3">
              Create and manage nutrition plans for your clients
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/dashboard/diet-plans/new">
              <Plus size={16} className="mr-1" />
              New diet
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatTile label="TOTAL DIETS" value={stats.total} />
        <StatTile label="TEMPLATES" value={stats.templates} icon={<FileText size={14} />} />
        <StatTile label="ASSIGNED" value={stats.assigned} icon={<Users size={14} />} accent />
      </div>

      {/* Filters */}
      <div className="border bg-card">
        <div className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search diets, clients..."
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
              {DIET_GOALS.map(g => (
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
            {filtered.map((diet, idx) => (
              <DietCard key={diet.id} diet={diet} idx={idx} />
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

function DietCard({ diet, idx }: { diet: MockDiet; idx: number }) {
  const goalInfo = DIET_GOALS.find(g => g.id === diet.goal)
  const difficultyInfo = DIET_DIFFICULTY.find(d => d.id === diet.difficulty)
  const stats = getMockDietStats(diet)

  return (
    <Link
      href={`/dashboard/diet-plans/${diet.id}`}
      className="group relative border bg-card p-5 transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_0_-1px_var(--primary)]"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-foreground/10 group-hover:bg-primary transition-colors" />

      <div className="absolute top-0 right-0 font-mono-tag text-muted-foreground p-3">
        {String(idx + 1).padStart(2, '0')}
      </div>

      <div className="space-y-3 pr-8">
        {diet.is_template ? (
          <div className="inline-flex items-center gap-1.5 font-mono-tag text-muted-foreground">
            <FileText size={10} />
            TEMPLATE
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 font-mono-tag text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            ACTIVE • {diet.assigned_to?.full_name.toUpperCase()}
          </div>
        )}

        <div>
          <p className="font-bold group-hover:text-primary transition-colors">{diet.name}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{diet.description}</p>
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
          <span className="inline-flex items-center gap-1 text-primary">
            <Flame size={10} /> {diet.target_kcal}
          </span>
          <span>•</span>
          <span>{stats.meals}M</span>
          <span>•</span>
          <span>{stats.foods}F</span>
        </div>
        <span className="font-mono-tag text-muted-foreground text-xs">
          {diet.updated_at.toUpperCase()}
        </span>
      </div>
    </Link>
  )
}

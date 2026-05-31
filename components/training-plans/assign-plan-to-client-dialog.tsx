'use client'

import { useState, useMemo } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MOCK_PLANS, getMockPlanStats, type MockPlan } from '@/lib/mock-plans'
import { PLAN_GOALS, DIFFICULTY_LEVELS } from '@/lib/exercise-library'
import { cn } from '@/lib/utils'
import { Search, UserPlus, CheckCircle2, ArrowRight, FileText } from 'lucide-react'

type AssignPlanToClientDialogProps = {
  trigger: React.ReactNode
  clientName: string
  onAssign?: (planId: string) => void
}

export function AssignPlanToClientDialog({ trigger, clientName, onAssign }: AssignPlanToClientDialogProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'success'>('select')

  // Solo templates se pueden asignar
  const templates = useMemo(() => MOCK_PLANS.filter(p => p.is_template), [])

  const filtered = useMemo(() => {
    if (!search) return templates
    const q = search.toLowerCase()
    return templates.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }, [search, templates])

  const selected = templates.find(p => p.id === selectedId)

  function handleAssign() {
    if (!selectedId) return
    setStep('success')
    onAssign?.(selectedId)
    setTimeout(() => {
      setOpen(false)
      setTimeout(() => {
        setStep('select')
        setSelectedId(null)
        setSearch('')
      }, 200)
    }, 1500)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setTimeout(() => {
        setStep('select')
        setSelectedId(null)
        setSearch('')
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">

        {step === 'select' && (
          <>
            <DialogHeader>
              <p className="font-mono-tag text-muted-foreground">[ ASSIGN PLAN ]</p>
              <DialogTitle className="text-2xl tracking-tighter">
                Choose a plan
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Assigning to: <span className="text-foreground font-medium">{clientName}</span>
              </p>
            </DialogHeader>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto -mx-6 px-6">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No templates found
                </p>
              ) : (
                filtered.map(plan => (
                  <PlanRow
                    key={plan.id}
                    plan={plan}
                    isSelected={selectedId === plan.id}
                    onSelect={() => setSelectedId(plan.id)}
                  />
                ))
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t">
              <span className="font-mono-tag text-muted-foreground">
                {selected
                  ? <>SELECTED: <span className="text-primary">{selected.name.toUpperCase()}</span></>
                  : 'NO PLAN SELECTED'
                }
              </span>
              <Button disabled={!selectedId} onClick={handleAssign}>
                <UserPlus size={14} className="mr-1.5" />
                Assign
              </Button>
            </div>
          </>
        )}

        {step === 'success' && selected && (
          <div className="py-8 space-y-4 text-center">
            <div className="inline-flex w-16 h-16 bg-primary/10 items-center justify-center text-primary border border-primary">
              <CheckCircle2 size={28} />
            </div>
            <div className="space-y-1">
              <p className="font-mono-tag text-primary">[ SUCCESS ]</p>
              <h3 className="text-2xl font-bold tracking-tighter">
                Plan assigned!
              </h3>
              <p className="text-sm text-muted-foreground">
                {selected.name} → {clientName}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PlanRow({
  plan,
  isSelected,
  onSelect,
}: {
  plan: MockPlan
  isSelected: boolean
  onSelect: () => void
}) {
  const stats = getMockPlanStats(plan)
  const goalInfo = PLAN_GOALS.find(g => g.id === plan.goal)
  const difficultyInfo = DIFFICULTY_LEVELS.find(d => d.id === plan.difficulty)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full flex items-start gap-3 p-3 border text-left transition-all',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
    >
      <div className="w-9 h-9 bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <FileText size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{plan.name}</p>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <span className={cn('font-mono-tag text-[10px]', goalInfo?.color)}>
            {goalInfo?.label.toUpperCase()}
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span className="font-mono-tag text-muted-foreground text-[10px]">
            {difficultyInfo?.label.toUpperCase()}
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span className="font-mono-tag text-muted-foreground text-[10px]">
            {stats.days}D / {stats.exercises}EX
          </span>
        </div>
      </div>
      {isSelected && (
        <CheckCircle2 size={16} className="text-primary shrink-0 mt-1" />
      )}
    </button>
  )
}

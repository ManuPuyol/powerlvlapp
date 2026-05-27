'use client'

import { useState, useMemo } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/avatar'
import { MOCK_CLIENTS, type MockClient } from '@/lib/mock-plans'
import { cn } from '@/lib/utils'
import { Search, UserPlus, CheckCircle2, ArrowRight } from 'lucide-react'

type AssignPlanDialogProps = {
  trigger: React.ReactNode
  planName: string
  onAssign?: (clientId: string) => void
}

export function AssignPlanDialog({ trigger, planName, onAssign }: AssignPlanDialogProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select')

  const filtered = useMemo(() => {
    if (!search) return MOCK_CLIENTS
    const q = search.toLowerCase()
    return MOCK_CLIENTS.filter(c =>
      c.full_name.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q)
    )
  }, [search])

  const selected = MOCK_CLIENTS.find(c => c.id === selectedId)

  function handleAssign() {
    if (!selectedId) return
    setStep('success')
    onAssign?.(selectedId)
    setTimeout(() => {
      setOpen(false)
      // Reset al cerrar
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
                Choose a client
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Plan: <span className="text-foreground font-medium">{planName}</span>
              </p>
            </DialogHeader>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto -mx-6 px-6">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No clients found
                </p>
              ) : (
                filtered.map(client => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    isSelected={selectedId === client.id}
                    onSelect={() => setSelectedId(client.id)}
                  />
                ))
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t">
              <span className="font-mono-tag text-muted-foreground">
                {selected
                  ? <>SELECTED: <span className="text-primary">{selected.full_name.toUpperCase()}</span></>
                  : 'NO CLIENT SELECTED'
                }
              </span>
              <Button
                disabled={!selectedId}
                onClick={() => setStep('confirm')}
              >
                Continue
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </>
        )}

        {step === 'confirm' && selected && (
          <>
            <DialogHeader>
              <p className="font-mono-tag text-muted-foreground">[ CONFIRM ASSIGNMENT ]</p>
              <DialogTitle className="text-2xl tracking-tighter">
                Ready to go?
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono-tag text-muted-foreground">CLIENT</p>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar src={selected.avatar_url} name={selected.full_name} size="md" />
                  <div>
                    <p className="font-bold">{selected.full_name}</p>
                    <p className="font-mono-tag text-muted-foreground">@{selected.username}</p>
                  </div>
                </div>
              </div>

              <div className="border bg-muted/30 p-4 space-y-2">
                <p className="font-mono-tag text-muted-foreground">PLAN</p>
                <p className="font-bold">{planName}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                The client will be notified and can start the plan immediately.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t">
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button onClick={handleAssign}>
                <UserPlus size={14} className="mr-1.5" />
                Confirm assignment
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
                {planName} → {selected.full_name}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ClientRow({
  client,
  isSelected,
  onSelect,
}: {
  client: MockClient
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 p-3 border text-left transition-all',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
    >
      <Avatar src={client.avatar_url} name={client.full_name} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{client.full_name}</p>
        <p className="font-mono-tag text-muted-foreground">
          @{client.username} • {client.active_plans} {client.active_plans === 1 ? 'PLAN' : 'PLANS'}
        </p>
      </div>
      {isSelected && (
        <CheckCircle2 size={16} className="text-primary shrink-0" />
      )}
    </button>
  )
}

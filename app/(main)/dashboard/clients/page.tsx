import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { getContractsByTrainer } from '@/services/contracts.service'
import { Avatar } from '@/components/shared/avatar'
import { Users } from 'lucide-react'

function ClientsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="border h-24 bg-muted animate-pulse" />
      ))}
    </div>
  )
}

async function ClientsContent() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')
  if (!profile.is_trainer) redirect('/dashboard')

  const contracts = await getContractsByTrainer(profile.id).catch(() => [])
  const activeClients = contracts.filter(c => c.status === 'active')

  if (activeClients.length === 0) {
    return (
      <div className="border border-dashed py-20 text-center space-y-4">
        <div className="inline-flex w-14 h-14 bg-muted items-center justify-center text-muted-foreground">
          <Users size={24} />
        </div>
        <p className="text-muted-foreground">No active clients yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
      {activeClients.map((contract, idx) => (
        <article
          key={contract.id}
          className="relative border bg-card p-5 transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_0_-1px_var(--primary)]"
        >
          <div className="absolute top-0 right-0 font-mono-tag text-muted-foreground p-3">
            {String(idx + 1).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-3 pr-8">
            <Avatar
              src={contract.client?.avatar_url ?? null}
              name={contract.client?.full_name ?? null}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{contract.client?.full_name}</p>
              <p className="font-mono-tag text-muted-foreground">
                SINCE {new Date(contract.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono-tag text-primary">ACTIVE</span>
          </div>
        </article>
      ))}
    </div>
  )
}

async function ClientsCount() {
  const profile = await getCurrentProfile()
  if (!profile) return null
  const contracts = await getContractsByTrainer(profile.id).catch(() => [])
  const count = contracts.filter(c => c.status === 'active').length
  return <span className="text-primary">{String(count).padStart(2, '0')}</span>
}

export default function ClientsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          DASHBOARD / CLIENTS
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
              My<br />
              <span className="text-primary">clients.</span>
            </h1>
            <p className="text-muted-foreground mt-3">
              Active clients currently training with you
            </p>
          </div>
          <div className="font-mono-tag text-muted-foreground">
            ACTIVE <Suspense fallback={<span>--</span>}><ClientsCount /></Suspense>
          </div>
        </div>
      </div>

      <Suspense fallback={<ClientsSkeleton />}>
        <ClientsContent />
      </Suspense>
    </div>
  )
}

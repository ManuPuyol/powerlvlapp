import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import {
  getContractsByTrainerAndStatus,
  countActiveClientsForTrainer,
} from '@/services/contracts.service'
import { Avatar } from '@/components/shared/avatar'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { CardListSkeleton } from '@/components/shared/skeletons'
import { Users } from 'lucide-react'

async function ClientsList() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')
  if (!profile.is_trainer) redirect('/dashboard')

  const activeClients = await getContractsByTrainerAndStatus(profile.id, 'active').catch(() => [])

  if (activeClients.length === 0) {
    return <EmptyState icon={Users} message="No active clients yet" />
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
                SINCE {contract.created_at && new Date(contract.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()}
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
  const count = await countActiveClientsForTrainer(profile.id)
  return <span className="text-primary">{String(count).padStart(2, '0')}</span>
}

export default function ClientsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <PageHeader
        breadcrumb="DASHBOARD / CLIENTS"
        title={<>My <span className="text-primary">clients.</span></>}
        description="Active clients currently training with you"
        meta={
          <>
            ACTIVE <Suspense fallback={<span>--</span>}><ClientsCount /></Suspense>
          </>
        }
      />

      <Suspense fallback={<CardListSkeleton cols={2} />}>
        <ClientsList />
      </Suspense>
    </div>
  )
}

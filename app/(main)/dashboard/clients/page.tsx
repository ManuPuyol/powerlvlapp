import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { getDevRoleOverride } from '@/lib/dev-role'
import {
  getContractsByTrainerAndStatus,
  countActiveClientsForTrainer,
} from '@/services/contracts.service'
import { MOCK_CLIENTS } from '@/lib/mock-plans'
import { Avatar } from '@/components/shared/avatar'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { CardListSkeleton } from '@/components/shared/skeletons'
import { Users, ArrowUpRight } from 'lucide-react'

async function ClientsList() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  // DEV: respetar override de rol. TODO: quitar en producción
  const devOverride = await getDevRoleOverride()
  const isTrainer = devOverride ?? profile.is_trainer
  if (!isTrainer) redirect('/dashboard')

  const realClients = await getContractsByTrainerAndStatus(profile.id, 'active').catch(() => [])

  // DEV: si no hay clientes reales, usar mock para poder probar. TODO: quitar en producción
  const clients = realClients.length > 0
    ? realClients.map(c => ({
        id: c.id,
        clientId: c.client_id,
        fullName: c.client?.full_name ?? null,
        avatarUrl: c.client?.avatar_url ?? null,
        since: c.created_at
          ? new Date(c.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()
          : '',
      }))
    : MOCK_CLIENTS.map(c => ({
        id: c.id,
        clientId: c.id,
        fullName: c.full_name,
        avatarUrl: c.avatar_url,
        since: c.since.toUpperCase(),
      }))

  if (clients.length === 0) {
    return <EmptyState icon={Users} message="No active clients yet" />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
      {clients.map((client, idx) => (
        <Link
          key={client.id}
          href={`/dashboard/clients/${client.clientId}`}
          className="group relative border bg-card p-5 transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_0_-1px_var(--primary)]"
        >
          <div className="absolute top-0 right-0 font-mono-tag text-muted-foreground p-3">
            {String(idx + 1).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-3 pr-8">
            <Avatar
              src={client.avatarUrl}
              name={client.fullName}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate group-hover:text-primary transition-colors">{client.fullName}</p>
              <p className="font-mono-tag text-muted-foreground">
                SINCE {client.since}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono-tag text-primary">ACTIVE</span>
            </div>
            <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  )
}

async function ClientsCount() {
  const profile = await getCurrentProfile()
  if (!profile) return null
  const count = await countActiveClientsForTrainer(profile.id)
  // DEV: si no hay clientes reales, mostrar count del mock. TODO: quitar en producción
  const displayCount = count > 0 ? count : MOCK_CLIENTS.length
  return <span className="text-primary">{String(displayCount).padStart(2, '0')}</span>
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

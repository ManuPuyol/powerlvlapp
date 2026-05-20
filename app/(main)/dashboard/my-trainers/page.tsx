import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import {
  getContractsByClient,
  countActiveTrainersForClient,
  filterByStatus,
} from '@/services/contracts.service'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/avatar'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { CardListSkeleton } from '@/components/shared/skeletons'
import { Users, ArrowUpRight } from 'lucide-react'

async function TrainersList() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  const contracts = await getContractsByClient(profile.id).catch(() => [])
  const activeTrainers = filterByStatus(contracts, 'active')

  if (activeTrainers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        message="You don't have any active trainers yet"
        action={
          <Button asChild>
            <Link href="/trainers">
              Find a trainer <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
      {activeTrainers.map((contract, idx) => (
        <Link
          key={contract.id}
          href={`/trainers/${contract.trainer?.username}`}
          className="group relative border bg-card p-5 transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_0_-1px_var(--primary)]"
        >
          <div className="absolute top-0 right-0 font-mono-tag text-muted-foreground p-3">
            {String(idx + 1).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-3 pr-8">
            <Avatar
              src={contract.trainer?.avatar_url ?? null}
              name={contract.trainer?.full_name ?? null}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate group-hover:text-primary transition-colors">
                {contract.trainer?.full_name}
              </p>
              <p className="font-mono-tag text-muted-foreground">
                @{contract.trainer?.username}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2">
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

async function TrainersCount() {
  const profile = await getCurrentProfile()
  if (!profile) return null
  const count = await countActiveTrainersForClient(profile.id)
  return <span className="text-primary">{String(count).padStart(2, '0')}</span>
}

export default function MyTrainersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <PageHeader
        breadcrumb="DASHBOARD / MY TRAINERS"
        title={<>My <span className="text-primary">trainers.</span></>}
        description="Trainers currently helping you reach your goals"
        meta={
          <>
            ACTIVE <Suspense fallback={<span>--</span>}><TrainersCount /></Suspense>
          </>
        }
      />

      <Suspense fallback={<CardListSkeleton cols={2} />}>
        <TrainersList />
      </Suspense>
    </div>
  )
}

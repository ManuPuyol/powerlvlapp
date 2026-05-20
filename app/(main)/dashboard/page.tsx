import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentProfile } from '@/services/profile.service'
import { getContractsByTrainer, getContractsByClient } from '@/services/contracts.service'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/avatar'
import { StatBlock } from '@/components/shared/stat-block'
import { Users, Dumbbell, TrendingUp, Eye, ArrowUpRight } from 'lucide-react'
import { PendingContracts } from '@/components/dashboard/pending-contracts'

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted animate-pulse" />
        <div className="h-4 w-96 bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  )
}

async function DashboardContent() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  const date = now.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()

  if (profile.is_trainer) {
    const contracts = await getContractsByTrainer(profile.id).catch(() => [])
    const pendingContracts = contracts.filter(c => c.status === 'pending')
    const activeContracts = contracts.filter(c => c.status === 'active')

    return (
      <div className="space-y-8 animate-fade-in-up">
        {/* Hero */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 font-mono-tag text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {date} • {time}
            <span className="ml-auto">DASHBOARD / TRAINER</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Welcome back,<br />
            <span className="text-primary">{profile.full_name?.split(' ')[0]}</span>
          </h1>
        </div>

        {pendingContracts.length > 0 && <PendingContracts contracts={pendingContracts} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatBlock
            label="ACTIVE CLIENTS"
            value={String(activeContracts.length).padStart(2, '0')}
            hint={activeContracts.length === 0 ? 'No clients yet' : 'Currently training'}
            icon={<Users size={16} />}
            accent
          />
          <StatBlock
            label="PENDING REQUESTS"
            value={String(pendingContracts.length).padStart(2, '0')}
            hint={pendingContracts.length === 0 ? 'No new requests' : 'Awaiting response'}
            icon={<TrendingUp size={16} />}
          />
          <StatBlock
            label="VISIBILITY"
            value={profile.profile_visibility === 'public' ? 'PUBLIC' : 'PRIVATE'}
            hint="Your profile status"
            icon={<Eye size={16} />}
          />
        </div>

        <div className="border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono-tag text-muted-foreground">QUICK ACTIONS</h3>
            <div className="h-px flex-1 mx-4 bg-border" />
            <span className="font-mono-tag text-muted-foreground">{`>>>`}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/trainers/${profile.username}`}>
                View Public Profile <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/profile">Edit Profile</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/clients">Manage Clients</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // User dashboard
  const userContracts = await getContractsByClient(profile.id).catch(() => [])
  const activeTrainers = userContracts.filter(c => c.status === 'active')
  const pendingRequests = userContracts.filter(c => c.status === 'pending')

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-4">
        <div className="flex items-center gap-3 font-mono-tag text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {date} • {time}
          <span className="ml-auto">DASHBOARD / USER</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Welcome back,<br />
          <span className="text-primary">{profile.full_name?.split(' ')[0]}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatBlock
          label="MY TRAINERS"
          value={String(activeTrainers.length).padStart(2, '0')}
          hint={activeTrainers.length === 0 ? 'No active trainers' : 'Currently training'}
          icon={<Users size={16} />}
          accent
        />
        <StatBlock
          label="PENDING"
          value={String(pendingRequests.length).padStart(2, '0')}
          hint={pendingRequests.length === 0 ? 'No pending requests' : 'Awaiting response'}
          icon={<TrendingUp size={16} />}
        />

        <Link href="/trainers" className="group relative border border-border bg-card hover:border-primary transition-colors overflow-hidden">
          <div className="absolute inset-0 bg-brand-stripe opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative p-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="font-mono-tag text-muted-foreground">FIND TRAINERS</p>
              <Dumbbell size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-lg font-bold mb-1">Explore the marketplace</p>
              <p className="font-mono-tag text-primary flex items-center gap-1">
                BROWSE NOW <ArrowUpRight size={12} />
              </p>
            </div>
          </div>
        </Link>
      </div>

      {activeTrainers.length > 0 && (
        <div className="border bg-card">
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="font-mono-tag text-muted-foreground">MY TRAINERS</h3>
            <Link href="/dashboard/my-trainers" className="font-mono-tag text-primary hover:underline flex items-center gap-1">
              VIEW ALL <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y">
            {activeTrainers.slice(0, 3).map(contract => (
              <Link
                key={contract.id}
                href={`/trainers/${contract.trainer?.username}`}
                className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors group"
              >
                <Avatar src={contract.trainer?.avatar_url} name={contract.trainer?.full_name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{contract.trainer?.full_name}</p>
                  <p className="font-mono-tag text-muted-foreground">@{contract.trainer?.username}</p>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

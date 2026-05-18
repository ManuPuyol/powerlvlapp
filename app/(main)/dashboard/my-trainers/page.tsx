import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { getContractsByClient } from '@/services/contracts.service'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar } from '@/components/shared/avatar'
import { Badge } from '@/components/ui/badge'

function TrainersSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

async function TrainersContent() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  const contracts = await getContractsByClient(profile.id).catch(() => [])
  const activeTrainers = contracts.filter((c: any) => c.status === 'active')

  if (activeTrainers.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">
        You don&apos;t have any active trainers yet.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activeTrainers.map((contract: any) => (
        <Link key={contract.id} href={`/trainers/${contract.trainer?.username}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Avatar
                  src={contract.trainer?.avatar_url ?? null}
                  name={contract.trainer?.full_name ?? null}
                  size="md"
                />
                <div className="flex-1">
                  <p className="font-semibold">{contract.trainer?.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Trainer since {new Date(contract.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function TrainersPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Trainers</h1>
        <p className="text-muted-foreground">Your active trainers</p>
      </div>

      <Suspense fallback={<TrainersSkeleton />}>
        <TrainersContent />
      </Suspense>
    </div>
  )
}

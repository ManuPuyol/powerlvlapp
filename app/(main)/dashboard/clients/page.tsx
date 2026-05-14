import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/services/profile.service'
import { getContractsByTrainer } from '@/services/contracts.service'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar } from '@/components/shared/avatar'
import { Badge } from '@/components/ui/badge'

function ClientsSkeleton() {
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

async function ClientsContent() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  if (!profile.is_trainer) {
    redirect('/dashboard')
  }

  const contracts = await getContractsByTrainer(profile.id).catch(() => [])
  const activeClients = contracts.filter((c: any) => c.status === 'active')

  if (activeClients.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">
        You don&apos;t have any active clients yet.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activeClients.map((contract: any) => (
        <Card key={contract.id}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                src={contract.client?.avatar_url ?? null}
                name={contract.client?.full_name ?? null}
                size="md"
              />
              <div className="flex-1">
                <p className="font-semibold">{contract.client?.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  Client since {new Date(contract.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ClientsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Clients</h1>
        <p className="text-muted-foreground">Manage your active clients</p>
      </div>

      <Suspense fallback={<ClientsSkeleton />}>
        <ClientsContent />
      </Suspense>
    </div>
  )
}

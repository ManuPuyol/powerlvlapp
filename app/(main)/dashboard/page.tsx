import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentProfile } from '@/services/profile.service'
import { getContractsByTrainer } from '@/services/contracts.service'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Dumbbell, User } from 'lucide-react'
import { PendingContracts } from '@/components/dashboard/pending-contracts'

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardHeader>
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-12 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function DashboardContent() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  if (profile.is_trainer) {
    const contracts = await getContractsByTrainer(profile.id).catch((e) => {
      console.error('Error fetching contracts:', e.message)
      return []
    })
    const pendingContracts = contracts.filter((c: any) => c.status === 'pending')
    const activeContracts = contracts.filter((c: any) => c.status === 'active')

    return (
      <>
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {profile.full_name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your training business</p>
        </div>

        <PendingContracts contracts={pendingContracts} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeContracts.length}</p>
              <p className="text-xs text-muted-foreground">
                {activeContracts.length === 0 ? 'No active contracts yet' : 'Active contracts'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <User size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant="default">Trainer</Badge>
              <p className="text-xs text-muted-foreground mt-1">Your public profile is active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Availability</CardTitle>
              <Dumbbell size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Available</Badge>
              <p className="text-xs text-muted-foreground mt-1">You can receive new clients</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your trainer profile</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={`/trainers/${profile.username}`}>View Public Profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </>
    )
  }

  // User dashboard
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {profile.full_name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground">Find and connect with the best trainers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Trainers</CardTitle>
            <Users size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">No active trainers yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Trainers</CardTitle>
            <Dumbbell size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Browse trainers and find your perfect match</p>
            <Button asChild size="sm">
              <Link href="/trainers">Find a Trainer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

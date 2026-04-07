import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/services/auth.service'
import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Welcome, <span className="font-medium text-foreground">{user.email}</span>
          </p>
          <form action={logoutAction}>
            <Button type="submit" variant="destructive" className="w-full">
              Log Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

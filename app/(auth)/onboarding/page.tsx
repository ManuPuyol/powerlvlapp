import { onboardingAction } from '@/app/actions/profiles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome! How do you want to use the app?</CardTitle>
          <CardDescription>
            You can always change this later from your profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <form action={onboardingAction}>
            <input type="hidden" name="isTrainer" value="true" />
            <Button type="submit" variant="outline" className="w-full h-32 flex flex-col gap-2">
              <span className="text-3xl">🏋️</span>
              <span className="font-semibold">I am a Trainer</span>
              <span className="text-xs text-muted-foreground">I want to offer my services</span>
            </Button>
          </form>

          <form action={onboardingAction}>
            <input type="hidden" name="isTrainer" value="false" />
            <Button type="submit" variant="outline" className="w-full h-32 flex flex-col gap-2">
              <span className="text-3xl">👤</span>
              <span className="font-semibold">I am looking for a Trainer</span>
              <span className="text-xs text-muted-foreground">I want to find and hire a trainer</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

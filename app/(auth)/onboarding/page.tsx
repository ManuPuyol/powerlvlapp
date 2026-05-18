import { onboardingAction } from '@/app/actions/profiles'
import { Dumbbell, User, ArrowUpRight } from 'lucide-react'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-10 animate-fade-in-up">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 font-mono-tag text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            STEP 01 / SETUP
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
            How will you use<br />
            <span className="text-primary">PowerLvl?</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose your role to personalize your experience. You can change this anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form action={onboardingAction}>
            <input type="hidden" name="isTrainer" value="true" />
            <button
              type="submit"
              className="group relative w-full p-6 border-2 border-border bg-card hover:border-primary transition-all text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 font-mono-tag text-muted-foreground p-3">01</div>

              <div className="relative space-y-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xl tracking-tight">I&apos;m a Trainer</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Offer your services and grow your business
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono-tag text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  CONTINUE <ArrowUpRight size={12} />
                </div>
              </div>
            </button>
          </form>

          <form action={onboardingAction}>
            <input type="hidden" name="isTrainer" value="false" />
            <button
              type="submit"
              className="group relative w-full p-6 border-2 border-border bg-card hover:border-primary transition-all text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 font-mono-tag text-muted-foreground p-3">02</div>

              <div className="relative space-y-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xl tracking-tight">Find a Trainer</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect with experts to reach your goals
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono-tag text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  CONTINUE <ArrowUpRight size={12} />
                </div>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

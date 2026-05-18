import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.2fr_1fr]">
      {/* Brand panel - solo desktop */}
      <div className="hidden lg:flex relative bg-foreground text-background p-10 flex-col justify-between overflow-hidden">

        {/* Pattern de líneas */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(45deg, white 1px, transparent 1px), linear-gradient(-45deg, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Glow */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />

        {/* Top - Logo + status */}
        <div className="relative z-10 flex items-start justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-9 h-9 bg-primary flex items-center justify-center text-primary-foreground font-bold font-display">
              P
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-background" />
            </div>
            <div>
              <p className="font-bold tracking-tighter leading-none">PowerLvl</p>
              <p className="font-mono-tag text-background/60 leading-none mt-0.5">v1.0</p>
            </div>
          </Link>

          <div className="font-mono-tag text-background/60 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            SYSTEM ONLINE
          </div>
        </div>

        {/* Middle - Headline */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <p className="font-mono-tag text-primary">[ FITNESS / NETWORK ]</p>
          <h2 className="text-5xl font-bold tracking-tighter leading-[1.05]">
            Connect with the <span className="text-primary">best trainers</span> & level up.
          </h2>
          <p className="text-background/60 text-lg leading-relaxed">
            Find personal trainers, manage your training journey, and reach your goals faster.
          </p>
        </div>

        {/* Bottom - Stats brutalist */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-background/10 pt-6">
          <div>
            <p className="font-mono-tag text-background/60">TRAINERS</p>
            <p className="text-2xl font-bold font-display tracking-tighter">100+</p>
          </div>
          <div>
            <p className="font-mono-tag text-background/60">USERS</p>
            <p className="text-2xl font-bold font-display tracking-tighter">2.5K</p>
          </div>
          <div>
            <p className="font-mono-tag text-background/60">RATING</p>
            <p className="text-2xl font-bold font-display tracking-tighter text-primary">4.9★</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Logo móvil */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="relative w-8 h-8 bg-primary flex items-center justify-center text-primary-foreground font-bold font-display">
              P
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-foreground" />
            </div>
            <div>
              <p className="font-bold tracking-tighter leading-none">PowerLvl</p>
              <p className="font-mono-tag text-muted-foreground leading-none mt-0.5">v1.0</p>
            </div>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}

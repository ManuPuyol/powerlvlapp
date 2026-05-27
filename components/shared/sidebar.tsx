'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, LayoutDashboard, Users, User, Settings, LogOut, Dumbbell } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/actions/auth'
import { Avatar } from '@/components/shared/avatar'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  number: string
}

type SidebarProps = {
  isTrainer: boolean
  fullName: string | null
  avatarUrl: string | null
}

function NavItems({ items, pathname, onNavigate }: {
  items: NavItem[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col">
      {items.map((item, idx) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group relative flex items-center gap-3 px-3 py-2.5 text-sm transition-all',
              'border-l-2',
              isActive
                ? 'border-primary bg-primary/10 text-foreground font-medium'
                : 'border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            )}
          >
            <span className="font-mono-tag text-xs opacity-50 w-5">{item.number}</span>
            <span className="text-current">{item.icon}</span>
            <span>{item.label}</span>
            {isActive && (
              <span className="ml-auto text-primary font-mono-tag">●</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8 bg-primary flex items-center justify-center text-primary-foreground font-bold font-display">
        P
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-foreground" />
      </div>
      <div>
        <p className="font-bold tracking-tighter leading-none">PowerLvl</p>
        <p className="font-mono-tag text-muted-foreground leading-none mt-0.5">v1.0</p>
      </div>
    </div>
  )
}

export function Sidebar({ isTrainer, fullName, avatarUrl }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const trainerLinks: NavItem[] = [
    { number: '01', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { number: '02', label: 'My Clients', href: '/dashboard/clients', icon: <Users size={16} /> },
    { number: '03', label: 'Training Plans', href: '/dashboard/training-plans', icon: <Dumbbell size={16} /> },
    { number: '04', label: 'Trainers', href: '/trainers', icon: <Dumbbell size={16} /> },
    { number: '05', label: 'Profile', href: '/dashboard/profile', icon: <User size={16} /> },
    { number: '06', label: 'Settings', href: '/dashboard/settings', icon: <Settings size={16} /> },
  ]

  const userLinks: NavItem[] = [
    { number: '01', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { number: '02', label: 'My Plan', href: '/dashboard/my-plan', icon: <Dumbbell size={16} /> },
    { number: '03', label: 'Find Trainers', href: '/trainers', icon: <Dumbbell size={16} /> },
    { number: '04', label: 'My Trainers', href: '/dashboard/my-trainers', icon: <Users size={16} /> },
    // TODO: quitar cuando esté listo el flujo. De momento visible para todos para poder probar el builder.
    { number: '05', label: 'Training Plans', href: '/dashboard/training-plans', icon: <Dumbbell size={16} /> },
    { number: '06', label: 'Profile', href: '/dashboard/profile', icon: <User size={16} /> },
    { number: '07', label: 'Settings', href: '/dashboard/settings', icon: <Settings size={16} /> },
  ]

  const navItems = isTrainer ? trainerLinks : userLinks

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b">
        <Logo />
      </div>

      {/* Profile card */}
      <div className="px-3 py-4 border-b">
        <div className="flex items-center gap-3 p-2">
          <Avatar src={avatarUrl} name={fullName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fullName ?? 'User'}</p>
            <p className="font-mono-tag text-muted-foreground">
              {isTrainer ? 'TRAINER' : 'USER'}
            </p>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <p className="font-mono-tag text-muted-foreground">NAVIGATION</p>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3">
        <NavItems items={navItems} pathname={pathname} onNavigate={onNavigate} />
      </div>

      {/* Footer */}
      <div className="p-3 border-t">
        <form action={async () => { await logoutAction() }}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-sm">
        <Logo />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <VisuallyHidden>
              <SheetTitle>Navigation</SheetTitle>
            </VisuallyHidden>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r min-h-screen sticky top-0 bg-background">
        <SidebarContent />
      </aside>
    </>
  )
}

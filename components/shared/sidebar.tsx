'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LayoutDashboard, Users, User, Settings, LogOut, Dumbbell } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { logoutAction } from '@/app/actions/auth'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

type SidebarProps = {
  isTrainer: boolean
  fullName: string | null
}

function NavItems({ items, pathname, onNavigate }: {
  items: NavItem[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
            pathname === item.href
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export function Sidebar({ isTrainer, fullName }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const trainerLinks: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Clients', href: '/dashboard/clients', icon: <Users size={18} /> },
    { label: 'Trainers', href: '/trainers', icon: <Dumbbell size={18} /> },
    { label: 'Profile', href: '/dashboard/profile', icon: <User size={18} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={18} /> },
  ]

  const clientLinks: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Find Trainers', href: '/trainers', icon: <Dumbbell size={18} /> },
    { label: 'My Trainers', href: '/dashboard/my-trainers', icon: <Users size={18} /> },
    { label: 'Profile', href: '/dashboard/profile', icon: <User size={18} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={18} /> },
  ]

  const navItems = isTrainer ? trainerLinks : clientLinks

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full py-4 px-3">
      {/* Logo */}
      <div className="px-3 mb-6">
        <h1 className="font-bold text-lg">PowerLvl</h1>
        <p className="text-xs text-muted-foreground">{fullName}</p>
      </div>

      {/* Nav */}
      <div className="flex-1">
        <NavItems items={navItems} pathname={pathname} onNavigate={onNavigate} />
      </div>

      {/* Logout */}
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </form>
    </div>
  )

  return (
    <>
      {/* Mobile: Header con hamburger */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b">
        <h1 className="font-bold">PowerLvl</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop: Sidebar fijo */}
      <aside className="hidden md:flex flex-col w-64 border-r min-h-screen">
        <SidebarContent />
      </aside>
    </>
  )
}

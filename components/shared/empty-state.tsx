import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

type EmptyStateProps = {
  icon: LucideIcon
  message: string
  action?: ReactNode
}

/**
 * Empty state estándar - dashed border + icono + mensaje + CTA opcional
 */
export function EmptyState({ icon: Icon, message, action }: EmptyStateProps) {
  return (
    <div className="border border-dashed py-20 text-center space-y-4">
      <div className="inline-flex w-14 h-14 bg-muted items-center justify-center text-muted-foreground">
        <Icon size={24} />
      </div>
      <p className="text-muted-foreground">{message}</p>
      {action}
    </div>
  )
}

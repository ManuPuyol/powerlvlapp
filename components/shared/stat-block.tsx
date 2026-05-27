import { cn } from '@/lib/utils'

type StatBlockProps = {
  label: string
  value: string | number
  hint?: string
  icon?: React.ReactNode
  accent?: boolean
  className?: string
}

export function StatBlock({ label, value, hint, icon, accent, className }: StatBlockProps) {
  return (
    <div
      className={cn(
        'relative border bg-card overflow-hidden group',
        accent && 'border-primary',
        className
      )}
    >
      {/* Top stripe */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-1',
        accent ? 'bg-primary' : 'bg-foreground/10'
      )} />

      {/* Scan line en hover (solo accent) */}
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary-foreground/40 to-transparent animate-scan" />
        </div>
      )}

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-mono-tag text-muted-foreground">{label}</p>
          {icon && (
            <div className={cn(
              'w-7 h-7 flex items-center justify-center',
              accent ? 'text-primary' : 'text-muted-foreground'
            )}>
              {icon}
            </div>
          )}
        </div>

        <p className="text-4xl font-bold tracking-tighter font-display">{value}</p>

        {hint && (
          <p className="text-xs text-muted-foreground border-t pt-3">
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}

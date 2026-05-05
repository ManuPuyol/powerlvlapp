import { cn } from '@/lib/utils/cn'

type AvatarProps = {
  src: string | null
  name: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-lg',
  lg: 'w-20 h-20 text-3xl',
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  return (
    <div className={cn(
      'rounded-full bg-muted flex items-center justify-center overflow-hidden font-semibold',
      sizes[size],
      className
    )}>
      {src ? (
        <img src={src} alt={name ?? 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span>{name?.charAt(0) ?? '?'}</span>
      )}
    </div>
  )
}

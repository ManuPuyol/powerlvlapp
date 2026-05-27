import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

type AvatarProps = {
  src: string | null
  name: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { className: 'w-8 h-8 text-xs', px: 32 },
  md: { className: 'w-12 h-12 text-lg', px: 48 },
  lg: { className: 'w-20 h-20 text-3xl', px: 80 },
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const config = sizes[size]
  const initial = name?.charAt(0) ?? '?'

  return (
    <div className={cn(
      'relative rounded-full bg-muted flex items-center justify-center overflow-hidden font-semibold shrink-0',
      config.className,
      className
    )}>
      {src ? (
        <Image
          src={src}
          alt={name ?? 'Avatar'}
          width={config.px}
          height={config.px}
          className="w-full h-full object-cover"
          unoptimized={src.includes('supabase')}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  )
}

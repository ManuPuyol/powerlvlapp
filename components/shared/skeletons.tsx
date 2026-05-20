/**
 * Skeletons reutilizables para Suspense fallbacks
 */

type CardListProps = {
  count?: number
  cols?: 1 | 2 | 3
  height?: number
}

export function CardListSkeleton({ count = 3, cols = 2, height = 96 }: CardListProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }[cols]

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border bg-muted animate-pulse"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  )
}

export function StatGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-32 bg-muted animate-pulse" />
      ))}
    </div>
  )
}

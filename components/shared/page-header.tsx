import { ReactNode } from 'react'

type PageHeaderProps = {
  breadcrumb: string
  title: ReactNode
  description?: string
  meta?: ReactNode
}

/**
 * Header estándar para páginas con el estilo brutalist.
 *
 * @example
 * <PageHeader
 *   breadcrumb="DASHBOARD / CLIENTS"
 *   title={<>My <span className="text-primary">clients.</span></>}
 *   description="Active clients training with you"
 *   meta={<>ACTIVE 12</>}
 * />
 */
export function PageHeader({ breadcrumb, title, description, meta }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-mono-tag text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        {breadcrumb}
      </div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-3">{description}</p>
          )}
        </div>
        {meta && (
          <div className="font-mono-tag text-muted-foreground">{meta}</div>
        )}
      </div>
    </div>
  )
}

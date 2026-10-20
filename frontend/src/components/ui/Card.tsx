import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Card({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface p-5 transition',
        className,
      )}
    >
      {children}
    </div>
  )
}
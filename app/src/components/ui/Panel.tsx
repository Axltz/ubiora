import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        'rounded-xl border border-line bg-panel shadow-[0_1px_3px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all',
        className,
      )}
      {...props}
    />
  )
}

export function PanelHeader({
  title,
  eyebrow,
  action,
  className,
}: {
  title: ReactNode
  eyebrow?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        'flex min-h-[54px] items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-muted mb-0.5">
            {eyebrow}
          </p>
        )}
        <h2 className="truncate text-[13.5px] font-semibold tracking-[-0.015em] text-paper">
          {title}
        </h2>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </header>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3.5 grid size-11 place-items-center rounded-xl border border-line bg-surface text-muted">
        <span className="size-2 rounded-full bg-dim" />
      </div>
      <p className="text-[13px] font-semibold text-paper">{title}</p>
      <p className="mt-1 max-w-xs text-[11.5px] leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

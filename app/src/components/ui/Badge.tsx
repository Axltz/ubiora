import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type RiskLevel = 'Crítico' | 'Alto' | 'Medio' | 'Bajo'

const riskStyles: Record<RiskLevel, string> = {
  Crítico: 'border-danger/30 bg-danger/10 text-danger',
  Alto: 'border-warn/30 bg-warn/10 text-warn',
  Medio: 'border-lilac/25 bg-lilac/8 text-lilac',
  Bajo: 'border-line-strong bg-surface text-muted',
}

export function RiskBadge({
  level,
  dot = true,
  className,
}: {
  level: RiskLevel
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center gap-1.5 rounded-full border px-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em]',
        riskStyles[level],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {level}
    </span>
  )
}

export function Tag({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'acid' | 'danger' | 'warn' | 'sky'
  className?: string
}) {
  const tones = {
    neutral: 'border-line-strong bg-surface text-muted',
    acid: 'border-acid/25 bg-acid/8 text-acid',
    danger: 'border-danger/25 bg-danger/8 text-danger',
    warn: 'border-warn/25 bg-warn/8 text-warn',
    sky: 'border-sky/25 bg-sky/8 text-sky',
  } as const

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative flex size-1.5', className)}>
      <span className="pulse-dot absolute inset-0 rounded-full text-acid" />
      <span className="relative size-1.5 rounded-full bg-acid" />
    </span>
  )
}

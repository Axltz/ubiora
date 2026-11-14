import { cn } from '../../lib/utils'

type LogoProps = {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="relative grid size-8 shrink-0 place-items-center rounded-[9px] border border-line-strong bg-surface">
        <svg viewBox="0 0 28 28" className="size-[18px]" fill="none" aria-hidden="true">
          <path
            d="M6 5v9.4a8 8 0 0 0 16 0V5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="14" cy="7.4" r="1.9" fill="var(--color-acid)" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col">
          <span className="text-[13px] font-semibold tracking-[0.32em] text-paper">UBIORA</span>
          <span className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.18em] text-dim">
            PQC exposure intelligence
          </span>
        </span>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

export function ReadinessGauge({
  score,
  previous,
  className,
}: {
  score: number
  previous: number
  className?: string
}) {
  const [value, setValue] = useState(0)
  const delta = score - previous

  useEffect(() => {
    const timer = window.setTimeout(() => setValue(score), 180)
    return () => window.clearTimeout(timer)
  }, [score])

  const radius = 67
  const centerX = 90
  const centerY = 88
  const ticks = Array.from({ length: 25 }, (_, index) => {
    const angle = 180 + (index * 180) / 24
    const radians = (angle * Math.PI) / 180
    const inner = radius - 7
    const outer = radius + 2
    return {
      x1: centerX + inner * Math.cos(radians),
      y1: centerY + inner * Math.sin(radians),
      x2: centerX + outer * Math.cos(radians),
      y2: centerY + outer * Math.sin(radians),
      active: index / 24 <= value / 100,
    }
  })

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <svg viewBox="0 0 180 112" className="w-full max-w-[230px]" role="img" aria-label={`Readiness PQC ${score} de 100`}>
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f0a35e" />
            <stop offset="55%" stopColor="#c8f56b" />
            <stop offset="100%" stopColor="#83c8e8" />
          </linearGradient>
        </defs>

        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${value} 100`}
          style={{
            transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 0 8px rgba(200, 245, 107, 0.28))',
          }}
        />

        {ticks.map((tick, index) => (
          <line
            key={index}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.active ? 'var(--color-acid)' : 'var(--color-line-strong)'}
            strokeWidth={index % 6 === 0 ? 1.4 : 0.8}
            opacity={tick.active ? 0.85 : 0.55}
          />
        ))}
      </svg>

      <div className="-mt-12 flex flex-col items-center">
        <div className="flex items-start">
          <span className="tabular text-[44px] font-medium leading-none tracking-[-0.06em] text-paper">
            {score}
          </span>
          <span className="mt-1.5 ml-1 font-mono text-[11px] text-dim">/100</span>
        </div>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
          Readiness PQC
        </p>
        <p
          className={cn(
            'mt-1.5 font-mono text-[10px]',
            delta >= 0 ? 'text-acid' : 'text-warn',
          )}
        >
          {delta >= 0 ? '+' : ''}
          {delta} pts vs. trimestre anterior
        </p>
      </div>
    </div>
  )
}

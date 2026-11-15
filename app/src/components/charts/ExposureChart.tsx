import { useState, type MouseEvent } from 'react'
import { cn } from '../../lib/utils'

type Point = { month: string; findings: number; critical: number }

const WIDTH = 720
const HEIGHT = 248
const PAD = { top: 18, right: 16, bottom: 30, left: 42 }

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index]
    const p1 = points[index]
    const p2 = points[index + 1]
    const p3 = points[index + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return path
}

export function ExposureChart({ data, className }: { data: Point[]; className?: string }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const chartWidth = WIDTH - PAD.left - PAD.right
  const chartHeight = HEIGHT - PAD.top - PAD.bottom
  const max = 2000
  const step = chartWidth / (data.length - 1)
  const points = data.map((item, index) => ({
    x: PAD.left + index * step,
    y: PAD.top + chartHeight - (item.findings / max) * chartHeight,
  }))
  const line = smoothPath(points)
  const area = `${line} L ${points[points.length - 1].x} ${PAD.top + chartHeight} L ${points[0].x} ${PAD.top + chartHeight} Z`
  const yTicks = [0, 500, 1000, 1500, 2000]

  const handleMove = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const relative = ((event.clientX - rect.left) / rect.width) * WIDTH
    const index = Math.round((relative - PAD.left) / step)
    setHovered(Math.max(0, Math.min(data.length - 1, index)))
  }

  const active = hovered !== null ? data[hovered] : null
  const activePoint = hovered !== null ? points[hovered] : null
  const tooltipLeft = activePoint ? (activePoint.x / WIDTH) * 100 : 0

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
        role="img"
        aria-label="Evolución de hallazgos criptográficos en los últimos doce meses"
      >
        <defs>
          <linearGradient id="exposure-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8f56b" stopOpacity="0.2" />
            <stop offset="65%" stopColor="#c8f56b" stopOpacity="0.035" />
            <stop offset="100%" stopColor="#c8f56b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = PAD.top + chartHeight - (tick / max) * chartHeight
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y}
                y2={y}
                stroke="var(--color-line)"
                strokeDasharray={tick === 0 ? undefined : '2 5'}
                strokeWidth="0.7"
              />
              <text
                x={PAD.left - 9}
                y={y + 3}
                textAnchor="end"
                fill="var(--color-dim)"
                fontFamily="var(--font-mono)"
                fontSize="8.5"
              >
                {tick === 0 ? '0' : `${tick / 1000}k`}
              </text>
            </g>
          )
        })}

        <path d={area} fill="url(#exposure-fill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--color-acid)"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 7px rgba(200,245,107,0.2))' }}
        />

        {data.map((item, index) => (
          <text
            key={item.month}
            x={points[index].x}
            y={HEIGHT - 9}
            textAnchor={index === 0 ? 'start' : index === data.length - 1 ? 'end' : 'middle'}
            fill={index === data.length - 1 ? 'var(--color-muted)' : 'var(--color-dim)'}
            fontFamily="var(--font-mono)"
            fontSize="8.5"
            letterSpacing="0.04em"
          >
            {item.month.toUpperCase()}
          </text>
        ))}

        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="6" fill="var(--color-acid)" opacity="0.14" />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.5" fill="var(--color-acid)" />

        {activePoint && (
          <g>
            <line
              x1={activePoint.x}
              x2={activePoint.x}
              y1={PAD.top}
              y2={PAD.top + chartHeight}
              stroke="var(--color-line-strong)"
              strokeDasharray="3 3"
            />
            <circle cx={activePoint.x} cy={activePoint.y} r="4.5" fill="var(--color-ink)" stroke="var(--color-acid)" strokeWidth="2" />
          </g>
        )}
      </svg>

      {active && activePoint && (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-lg border border-line-strong bg-ink/95 px-3 py-2 shadow-xl shadow-black/40 backdrop-blur-sm"
          style={{ left: `clamp(74px, ${tooltipLeft}%, calc(100% - 74px))` }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
            {active.month} 2026
          </p>
          <p className="tabular mt-1 text-[15px] font-medium leading-none text-paper">
            {new Intl.NumberFormat('es-MX').format(active.findings)}
          </p>
          <p className="mt-1 font-mono text-[9px] text-muted">
            {active.critical} hallazgos críticos
          </p>
        </div>
      )}
    </div>
  )
}

export function Sparkline({
  data,
  color = 'var(--color-acid)',
  className,
}: {
  data: number[]
  color?: string
  className?: string
}) {
  const width = 96
  const height = 28
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - ((value - min) / range) * (height - 4) - 2,
  }))
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const area = `${line} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <path d={area} fill={color} opacity="0.08" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="1.7" fill={color} />
    </svg>
  )
}

import { cn } from '../../lib/utils'

type Family = { name: string; count: number; share: number; color: string }

export function AlgorithmBars({ data, className }: { data: Family[]; className?: string }) {
  const max = Math.max(...data.map((item) => item.count))

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-line">
        {data.map((item) => (
          <div
            key={item.name}
            title={`${item.name}: ${item.count.toLocaleString('es-MX')}`}
            style={{ width: `${item.share}%`, backgroundColor: item.color }}
            className="h-full border-r border-panel/60 last:border-r-0"
          />
        ))}
      </div>

      <div className="space-y-2.5">
        {data.map((item) => (
          <div key={item.name} className="group">
            <div className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="min-w-0 flex-1 truncate text-[11.5px] text-muted transition-colors group-hover:text-paper">
                {item.name}
              </span>
              <span className="tabular font-mono text-[10px] text-dim">
                {item.count.toLocaleString('es-MX')}
              </span>
              <span className="tabular w-8 text-right font-mono text-[10px] text-paper">
                {item.share}%
              </span>
            </div>
            <div className="ml-3.5 mt-1.5 h-1 overflow-hidden rounded-full bg-line/70">
              <div
                className="h-full rounded-full opacity-75 transition-all duration-700 group-hover:opacity-100"
                style={{ width: `${(item.count / max) * 100}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

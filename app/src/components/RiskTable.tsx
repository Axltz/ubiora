import { ChevronRight } from 'lucide-react'
import type { CryptoAsset } from '../data/types'
import { cn } from '../lib/utils'
import { RiskBadge } from './ui/Badge'

const scoreColor: Record<CryptoAsset['priority'], string> = {
  Crítico: 'bg-danger',
  Alto: 'bg-warn',
  Medio: 'bg-lilac',
  Bajo: 'bg-dim',
}

export function RiskTable({
  assets,
  onSelect,
  compact = false,
  className,
}: {
  assets: CryptoAsset[]
  onSelect: (asset: CryptoAsset) => void
  compact?: boolean
  className?: string
}) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="label px-4 py-2.5 font-medium sm:px-5">Activo</th>
            <th className="label px-3 py-2.5 font-medium">Algoritmo</th>
            {!compact && <th className="label hidden px-3 py-2.5 font-medium xl:table-cell">Exposición</th>}
            {!compact && <th className="label hidden px-3 py-2.5 font-medium lg:table-cell">Vida útil</th>}
            <th className="label px-3 py-2.5 font-medium">Score</th>
            <th className="label px-3 py-2.5 font-medium">Prioridad</th>
            <th className="w-8 px-2 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr
              key={asset.id}
              tabIndex={0}
              onClick={() => onSelect(asset)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(asset)
                }
              }}
              className="group cursor-pointer border-b border-line/80 transition-colors last:border-b-0 hover:bg-surface/55 focus-visible:bg-surface"
            >
              <td className="px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'size-1.5 shrink-0 rounded-full',
                      asset.priority === 'Crítico'
                        ? 'bg-danger'
                        : asset.priority === 'Alto'
                          ? 'bg-warn'
                          : 'bg-dim',
                    )}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[11.5px] text-paper">{asset.name}</p>
                    <p className="mt-0.5 truncate text-[10px] text-dim">
                      {asset.kind} · {asset.environment}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3">
                <p className="font-mono text-[10.5px] text-muted">{asset.algorithm}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.06em] text-dim">
                  {asset.keySize}
                </p>
              </td>
              {!compact && (
                <td className="hidden px-3 py-3 xl:table-cell">
                  <span className="text-[11px] text-muted">{asset.exposure}</span>
                  <p className="mt-0.5 text-[9.5px] text-dim">{asset.sensitivity}</p>
                </td>
              )}
              {!compact && (
                <td className="hidden px-3 py-3 lg:table-cell">
                  <span className="tabular font-mono text-[10.5px] text-muted">
                    {asset.shelfLife} años
                  </span>
                </td>
              )}
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="tabular w-6 font-mono text-[11px] text-paper">{asset.score}</span>
                  <div className="h-1 w-12 overflow-hidden rounded-full bg-line">
                    <div
                      className={cn('h-full rounded-full', scoreColor[asset.priority])}
                      style={{ width: `${asset.score}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-3 py-3">
                <RiskBadge level={asset.priority} dot={false} />
              </td>
              <td className="px-2 py-3">
                <ChevronRight className="size-3.5 text-dim transition-all group-hover:translate-x-0.5 group-hover:text-paper" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

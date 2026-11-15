import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowDownWideNarrow,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileJson,
  FileSpreadsheet,
  Radar,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react'
import { assets, environmentBreakdown, stats } from '../data/assets'
import type { CryptoAsset } from '../data/types'
import { cn, formatNumber } from '../lib/utils'
import { RiskDrawer } from '../components/RiskDrawer'
import { RiskBadge, Tag } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { FilterSelect } from '../components/ui/FilterSelect'
import { EmptyState } from '../components/ui/Panel'
import { useToast } from '../components/ui/Toast'

const PAGE_SIZE = 14

const priorityColors: Record<CryptoAsset['priority'], string> = {
  Crítico: 'bg-danger',
  Alto: 'bg-warn',
  Medio: 'bg-lilac',
  Bajo: 'bg-dim',
}

const statusTone = {
  Pendiente: 'neutral',
  'En migración': 'sky',
  Mitigado: 'acid',
} as const

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function Inventory() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [environment, setEnvironment] = useState('Todos')
  const [priority, setPriority] = useState(() => searchParams.get('riesgo') ?? 'Todas')
  const [algorithm, setAlgorithm] = useState('Todos')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<CryptoAsset | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const next = searchParams.get('riesgo')
    if (next) setPriority(next)
  }, [searchParams])

  useEffect(() => {
    setPage(1)
  }, [deferredQuery, environment, priority, algorithm, sortDesc])

  const algorithmOptions = useMemo(
    () => ['Todos', ...Array.from(new Set(assets.map((asset) => asset.algorithm))).sort()],
    [],
  )

  const filtered = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase()
    return assets
      .filter((asset) => {
        if (environment !== 'Todos' && asset.environment !== environment) return false
        if (priority !== 'Todas' && asset.priority !== priority) return false
        if (algorithm !== 'Todos' && asset.algorithm !== algorithm) return false
        if (!term) return true
        return `${asset.name} ${asset.algorithm} ${asset.location} ${asset.owner} ${asset.kind}`
          .toLowerCase()
          .includes(term)
      })
      .sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score))
  }, [deferredQuery, environment, priority, algorithm, sortDesc])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const activeFilters = [environment !== 'Todos', priority !== 'Todas', algorithm !== 'Todos'].filter(
    Boolean,
  ).length

  const toggleChecked = (id: string) => {
    setChecked((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const togglePage = () => {
    const pageIds = visible.map((asset) => asset.id)
    const allSelected = pageIds.every((id) => checked.has(id))
    setChecked((current) => {
      const next = new Set(current)
      if (allSelected) pageIds.forEach((id) => next.delete(id))
      else pageIds.forEach((id) => next.add(id))
      return next
    })
  }

  const clearFilters = () => {
    setEnvironment('Todos')
    setPriority('Todas')
    setAlgorithm('Todos')
    setQuery('')
    setSearchParams({})
  }

  const exportCbom = () => {
    const source = checked.size > 0 ? assets.filter((asset) => checked.has(asset.id)) : filtered
    const bom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.7',
      serialNumber: 'urn:uuid:4f1c9f6a-0e2b-4fd2-8b5e-cobalto-pay',
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        component: { type: 'application', name: 'Cobalto Pay', version: '2026.11' },
        tools: { components: [{ type: 'application', name: 'UBIORA Discovery Engine', version: '0.4.2' }] },
      },
      components: source.map((asset) => ({
        type: 'cryptographic-asset',
        'bom-ref': asset.id,
        name: asset.name,
        cryptoProperties: {
          assetType: asset.kind,
          algorithmProperties: {
            name: asset.algorithm,
            parameterSetIdentifier: asset.keySize,
            executionEnvironment: asset.environment,
          },
          certificateProperties: asset.kind === 'Certificado TLS' ? { subjectName: asset.location } : undefined,
        },
        properties: [
          { name: 'ubiora:risk-score', value: String(asset.score) },
          { name: 'ubiora:priority', value: asset.priority },
          { name: 'ubiora:exposure', value: asset.exposure },
          { name: 'ubiora:shelf-life', value: `${asset.shelfLife} years` },
        ],
      })),
    }
    downloadFile(JSON.stringify(bom, null, 2), 'cobalto-pay-cbom-2026-11-14.json', 'application/json')
    toast('CBOM exportado', {
      detail: `${formatNumber(source.length)} componentes en formato CycloneDX 1.7.`,
    })
  }

  const exportCsv = () => {
    const source = checked.size > 0 ? assets.filter((asset) => checked.has(asset.id)) : filtered
    const header = ['id', 'activo', 'tipo', 'algoritmo', 'llave', 'ambiente', 'sensibilidad', 'exposicion', 'vida_util', 'score', 'prioridad', 'estado', 'propietario']
    const rows = source.map((asset) => [
      asset.id,
      asset.name,
      asset.kind,
      asset.algorithm,
      asset.keySize,
      asset.environment,
      asset.sensitivity,
      asset.exposure,
      asset.shelfLife,
      asset.score,
      asset.priority,
      asset.status,
      asset.owner,
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    downloadFile(`\uFEFF${csv}`, 'cobalto-pay-inventario-2026-11-14.csv', 'text/csv;charset=utf-8')
    toast('Inventario exportado', { detail: `${formatNumber(source.length)} filas en CSV.` })
  }

  return (
    <div className="animate-rise">
      <div className="flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Tag tone="acid">
              <Check className="size-2.5" /> CycloneDX 1.7
            </Tag>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim">
              {formatNumber(stats.total)} componentes · {stats.owners} propietarios
            </span>
          </div>
          <h1 className="text-[clamp(2rem,3.2vw,3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-paper">
            El inventario que <span className="text-muted">nadie tiene.</span>
          </h1>
          <p className="mt-4 max-w-[560px] text-[13px] leading-relaxed text-muted">
            Cada certificado, llave, librería y endpoint con criptografía detectada. Filtra, audita
            y convierte el hallazgo en una decisión de migración.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="secondary" icon={<Download className="size-3.5" />} onClick={exportCbom}>
            Exportar CBOM
          </Button>
          <Button
            variant="primary"
            icon={<Radar className="size-3.5" />}
            onClick={() => navigate('/descubrimiento')}
          >
            Nuevo escaneo
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-[14px] border border-line bg-panel xl:grid-cols-4">
        {[
          { label: 'Componentes indexados', value: formatNumber(stats.total), note: 'CBOM completo' },
          { label: 'Hallazgos críticos', value: String(stats.critical), note: 'Requieren decisión' },
          { label: 'Expuestos a Internet', value: formatNumber(stats.internet), note: 'Superficie externa' },
          {
            label: 'Cobertura de inventario',
            value: '100%',
            note: 'Sin activos huérfanos',
          },
        ].map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'flex flex-col justify-between gap-4 p-4 sm:p-5',
              index !== 3 && 'border-b border-line xl:border-b-0',
              index % 2 === 0 && 'border-r border-line',
              index === 2 && 'xl:border-r',
            )}
          >
            <p className="label leading-[1.3]">{item.label}</p>
            <div>
              <p className="tabular text-[28px] font-medium leading-none tracking-[-0.05em] text-paper">
                {item.value}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.08em] text-dim">
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-3 sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative flex h-9 w-full items-center gap-2 rounded-lg border border-line bg-ink px-3 transition-colors focus-within:border-line-strong xl:max-w-[380px]">
              <Search className="size-3.5 shrink-0 text-dim" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por activo, algoritmo, ubicación o dueño…"
                className="w-full bg-transparent text-[12px] text-paper placeholder:text-dim focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-dim transition-colors hover:text-paper"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                label="Ambiente"
                value={environment}
                options={['Todos', ...environmentBreakdown.map((item) => item.name)]}
                onChange={setEnvironment}
              />
              <FilterSelect
                label="Algoritmo"
                value={algorithm}
                options={algorithmOptions}
                onChange={setAlgorithm}
              />
              <FilterSelect
                label="Prioridad"
                value={priority}
                options={['Todas', 'Crítico', 'Alto', 'Medio', 'Bajo']}
                onChange={setPriority}
              />
              <button
                type="button"
                onClick={() => setSortDesc((current) => !current)}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-line bg-panel px-2.5 text-[10.5px] text-muted transition-colors hover:border-line-strong hover:text-paper"
              >
                <ArrowDownWideNarrow className="size-3.5 text-dim" />
                Score {sortDesc ? '↓' : '↑'}
              </button>
              {(activeFilters > 0 || query) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex h-8 items-center gap-1 rounded-lg px-2 text-[10.5px] text-dim transition-colors hover:text-paper"
                >
                  <X className="size-3" /> Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-dim">
                {formatNumber(filtered.length)} resultados
                {activeFilters > 0 && ` · ${activeFilters} filtro${activeFilters > 1 ? 's' : ''} activo${activeFilters > 1 ? 's' : ''}`}
              </p>
              <span className="hidden h-3 w-px bg-line sm:block" />
              <button
                type="button"
                onClick={exportCsv}
                className="hidden items-center gap-1 font-mono text-[9px] uppercase tracking-[0.08em] text-dim transition-colors hover:text-paper sm:flex"
              >
                <FileSpreadsheet className="size-3" /> CSV
              </button>
              <button
                type="button"
                onClick={exportCbom}
                className="hidden items-center gap-1 font-mono text-[9px] uppercase tracking-[0.08em] text-dim transition-colors hover:text-paper sm:flex"
              >
                <FileJson className="size-3" /> JSON
              </button>
            </div>
            {checked.size > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-acid/25 bg-acid/8 px-2.5 py-1.5">
                <span className="font-mono text-[9.5px] text-acid">{checked.size} seleccionados</span>
                <button
                  type="button"
                  onClick={exportCbom}
                  className="font-mono text-[9px] uppercase tracking-[0.06em] text-acid/80 hover:text-acid"
                >
                  Exportar
                </button>
                <button
                  type="button"
                  onClick={() => setChecked(new Set())}
                  className="text-acid/70 hover:text-acid"
                  aria-label="Limpiar selección"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div ref={tableRef} className="overflow-x-auto">
          <table className="w-full min-w-[1060px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-ink-raised/60">
                <th className="w-10 px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={visible.length > 0 && visible.every((asset) => checked.has(asset.id))}
                    onChange={togglePage}
                    className="size-3.5 cursor-pointer accent-acid"
                    aria-label="Seleccionar página"
                  />
                </th>
                <th className="label px-2 py-2.5 font-medium">Activo</th>
                <th className="label px-3 py-2.5 font-medium">Algoritmo</th>
                <th className="label px-3 py-2.5 font-medium">Ambiente</th>
                <th className="label px-3 py-2.5 font-medium">Exposición</th>
                <th className="label px-3 py-2.5 font-medium">Sensibilidad</th>
                <th className="label px-3 py-2.5 font-medium">Vida útil</th>
                <th className="label px-3 py-2.5 font-medium">Score</th>
                <th className="label px-3 py-2.5 font-medium">Estado</th>
                <th className="label px-3 py-2.5 font-medium">Prioridad</th>
                <th className="w-8 px-2 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {visible.map((asset) => (
                <tr
                  key={asset.id}
                  tabIndex={0}
                  onClick={() => setSelected(asset)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') setSelected(asset)
                  }}
                  className="group cursor-pointer border-b border-line/80 transition-colors last:border-b-0 hover:bg-surface/50"
                >
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checked.has(asset.id)}
                      onChange={() => toggleChecked(asset.id)}
                      className="size-3.5 cursor-pointer accent-acid"
                      aria-label={`Seleccionar ${asset.name}`}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={cn('size-1.5 shrink-0 rounded-full', priorityColors[asset.priority])} />
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[11px] text-paper">{asset.name}</p>
                        <p className="mt-0.5 truncate text-[9.5px] text-dim">
                          {asset.kind} · {asset.owner}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-mono text-[10.5px] text-muted">{asset.algorithm}</p>
                    <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.06em] text-dim">
                      {asset.keySize}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-[10.5px] text-muted">{asset.environment}</td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        'text-[10.5px]',
                        asset.exposure === 'Internet' ? 'text-warn' : 'text-muted',
                      )}
                    >
                      {asset.exposure}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[10.5px] text-muted">{asset.sensitivity}</span>
                  </td>
                  <td className="tabular px-3 py-3 font-mono text-[10px] text-muted">
                    {asset.shelfLife} a
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="tabular w-5 font-mono text-[10.5px] text-paper">{asset.score}</span>
                      <div className="h-1 w-10 overflow-hidden rounded-full bg-line">
                        <div
                          className={cn('h-full rounded-full', priorityColors[asset.priority])}
                          style={{ width: `${asset.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Tag tone={statusTone[asset.status]}>{asset.status}</Tag>
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
          {visible.length === 0 && (
            <EmptyState
              title="Sin componentes para estos filtros"
              description="Prueba con otro algoritmo, ambiente o término de búsqueda."
              action={
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              }
            />
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-dim">
            {filtered.length === 0
              ? '0 componentes'
              : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} de ${formatNumber(filtered.length)}`}
            <span className="mx-2 text-line-strong">/</span>
            CycloneDX 1.7
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="grid size-7 place-items-center rounded-md border border-line text-muted transition-colors hover:text-paper disabled:opacity-30"
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            {Array.from({ length: Math.min(5, pageCount) }, (_, index) => {
              const start = Math.max(1, Math.min(currentPage - 2, pageCount - 4))
              const pageNumber = start + index
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => {
                    setPage(pageNumber)
                    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={cn(
                    'grid size-7 place-items-center rounded-md border font-mono text-[9.5px] transition-colors',
                    pageNumber === currentPage
                      ? 'border-acid/30 bg-acid/10 text-acid'
                      : 'border-line text-dim hover:text-paper',
                  )}
                >
                  {pageNumber}
                </button>
              )
            })}
            {pageCount > 5 && (
              <>
                <span className="px-1 font-mono text-[9px] text-dim">…</span>
                <button
                  type="button"
                  onClick={() => setPage(pageCount)}
                  className="grid size-7 place-items-center rounded-md border border-line font-mono text-[9.5px] text-dim transition-colors hover:text-paper"
                >
                  {pageCount}
                </button>
              </>
            )}
            <button
              type="button"
              disabled={currentPage === pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              className="grid size-7 place-items-center rounded-md border border-line text-muted transition-colors hover:text-paper disabled:opacity-30"
              aria-label="Página siguiente"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-[14px] border border-line bg-panel px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line-strong bg-surface">
            <ShieldAlert className="size-4 text-muted" />
          </span>
          <div>
            <p className="text-[12px] text-paper">El CBOM es la evidencia. La priorización es la decisión.</p>
            <p className="mt-0.5 text-[10.5px] text-dim">
              Score calculado con sensibilidad 30%, vida útil 25%, exposición 25% y criticidad 20%.
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/informe')}>
          Ver metodología <ChevronRight className="size-3.5" />
        </Button>
      </div>

      <RiskDrawer asset={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

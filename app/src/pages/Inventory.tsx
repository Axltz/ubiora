import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowDownWideNarrow,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Globe,
  Radar,
  Search,
  X,
} from 'lucide-react'
import { computeEnvironmentBreakdown } from '../data/assets'
import { useRealScan } from '../data/scanContext'
import type { CryptoAsset } from '../data/types'
import { formatNumber } from '../lib/utils'
import { downloadFile } from '../lib/download'
import { RiskDrawer } from '../components/RiskDrawer'
import { RiskBadge, Tag } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { FilterSelect } from '../components/ui/FilterSelect'
import { EmptyState } from '../components/ui/Panel'
import { useToast } from '../components/ui/Toast'

const PAGE_SIZE = 14

export function Inventory() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { allAssets, orgName, isDemo, loadDemo, clearAll } = useRealScan()
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
    () => ['Todos', ...Array.from(new Set(allAssets.map((asset) => asset.algorithm))).sort()],
    [allAssets],
  )

  const environmentOptions = useMemo(
    () => ['Todos', ...computeEnvironmentBreakdown(allAssets).map((item) => item.name)],
    [allAssets],
  )

  const filtered = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase()
    return allAssets
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
  }, [allAssets, deferredQuery, environment, priority, algorithm, sortDesc])

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
    const source = checked.size > 0 ? allAssets.filter((asset) => checked.has(asset.id)) : filtered
    const bom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.7',
      serialNumber: `urn:uuid:${crypto.randomUUID()}`,
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        component: { type: 'application', name: orgName, version: '2026.11' },
        tools: { components: [{ type: 'application', name: 'UBIORA Discovery Engine', version: '1.0' }] },
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
          { name: 'ubiora:owner', value: asset.owner },
          { name: 'ubiora:target', value: asset.target },
          { name: 'ubiora:effort', value: asset.effort },
          { name: 'ubiora:recommendation', value: asset.recommendation },
        ],
      })),
    }
    downloadFile(JSON.stringify(bom, null, 2), 'ubiora-cbom-cyclonedx-1.7.json', 'application/json')
    toast('CBOM CycloneDX 1.7 exportado', {
      detail: `${formatNumber(source.length)} componentes en formato estándar.`,
    })
  }

  const exportCsv = () => {
    const source = checked.size > 0 ? allAssets.filter((asset) => checked.has(asset.id)) : filtered
    const header = [
      'ID',
      'Activo',
      'Tipo',
      'Algoritmo',
      'Tamaño',
      'Ubicación',
      'Ambiente',
      'Sensibilidad',
      'Vida_util_anos',
      'Exposición',
      'Criticidad_operativa',
      'Score_riesgo',
      'Prioridad',
      'Propietario',
      'Recomendación',
      'Meta',
      'Esfuerzo',
      'Estado',
    ]
    const rows = source.map((asset) => [
      asset.id,
      asset.name,
      asset.kind,
      asset.algorithm,
      asset.keySize,
      asset.location,
      asset.environment,
      asset.sensitivity,
      asset.shelfLife,
      asset.exposure,
      asset.criticality,
      asset.score,
      asset.priority,
      asset.owner,
      asset.recommendation,
      asset.target,
      asset.effort,
      asset.status,
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    downloadFile(`\uFEFF${csv}`, 'ubiora-inventario-cbom.csv', 'text/csv;charset=utf-8')
    toast('Inventario exportado', { detail: `${formatNumber(source.length)} filas en CSV.` })
  }

  return (
    <div className="animate-rise">
      <div className="flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Tag tone="acid">CycloneDX 1.7 CBOM</Tag>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim">
              {formatNumber(allAssets.length)} activos indexados ·{' '}
              {allAssets.filter((asset) => asset.priority === 'Crítico').length} críticos
            </span>
            {isDemo && (
              <span className="inline-flex items-center gap-1 rounded-md border border-warn/30 bg-warn/10 px-2 py-0.5 text-[10px] font-medium text-warn">
                <Globe className="size-2.5" /> Catálogo de ejemplo
              </span>
            )}
            {!isDemo && allAssets.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md border border-acid/30 bg-acid/10 px-2 py-0.5 text-[10px] font-medium text-acid">
                <Globe className="size-2.5" /> {allAssets.length} activos propios
              </span>
            )}
          </div>
          <h1 className="max-w-[720px] text-[clamp(2rem,3.2vw,3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-paper">
            Inventario Criptográfico y CBOM
          </h1>
          <p className="mt-4 max-w-[580px] text-[13px] leading-relaxed text-muted">
            Catálogo exhaustivo de activos criptográficos conforme al estándar CycloneDX 1.7. Cada fila vincula el algoritmo detectado con su nivel de riesgo y recomendación NIST.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {allAssets.length === 0 && (
            <Button variant="outline" onClick={loadDemo} icon={<Radar className="size-3.5" />}>
              Cargar ejemplo
            </Button>
          )}
          {allAssets.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                clearAll()
                toast('Inventario vaciado', { detail: 'El sistema volvió a cero.', tone: 'info' })
              }}
              icon={<X className="size-3.5" />}
            >
              Vaciar
            </Button>
          )}
          <Button variant="secondary" icon={<Download className="size-3.5" />} onClick={exportCbom}>
            Exportar CBOM (JSON)
          </Button>
          <Button
            variant="secondary"
            icon={<FileSpreadsheet className="size-3.5" />}
            onClick={exportCsv}
          >
            Exportar CSV
          </Button>
          <Button
            variant="primary"
            icon={<Radar className="size-3.5" />}
            onClick={() => navigate('/descubrimiento')}
          >
            Nuevo Escaneo
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-line bg-panel p-2.5">
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dim" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, algoritmo, ubicación o responsable…"
              className="h-9 w-full rounded-lg border border-line bg-ink pl-9 pr-8 text-[12.5px] text-paper placeholder:text-dim focus:border-acid focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dim hover:text-paper"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <FilterSelect
            label="Ambiente"
            value={environment}
            options={environmentOptions}
            onChange={setEnvironment}
          />
          <FilterSelect
            label="Prioridad"
            value={priority}
            options={['Todas', 'Crítico', 'Alto', 'Medio', 'Bajo']}
            onChange={(val) => {
              setPriority(val)
              setSearchParams(val === 'Todas' ? {} : { riesgo: val })
            }}
          />
          <FilterSelect
            label="Algoritmo"
            value={algorithm}
            options={algorithmOptions}
            onChange={setAlgorithm}
          />
        </div>

        <div className="flex items-center gap-2">
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} icon={<X className="size-3" />}>
              Limpiar filtros
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSortDesc(!sortDesc)}
            icon={<ArrowDownWideNarrow className="size-3.5" />}
          >
            {sortDesc ? 'Mayor riesgo' : 'Menor riesgo'}
          </Button>
        </div>
      </div>

      {/* Tabla CBOM */}
      <div className="mt-4 overflow-hidden rounded-[12px] border border-line bg-panel">
        <div ref={tableRef} className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-ink-raised/70">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={visible.length > 0 && visible.every((a) => checked.has(a.id))}
                    onChange={togglePage}
                    className="accent-acid"
                  />
                </th>
                <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-wider text-muted">ID / Nombre</th>
                <th className="px-3 py-3 font-mono text-[9px] uppercase tracking-wider text-muted">Tipo</th>
                <th className="px-3 py-3 font-mono text-[9px] uppercase tracking-wider text-muted">Algoritmo</th>
                <th className="px-3 py-3 font-mono text-[9px] uppercase tracking-wider text-muted">Ambiente</th>
                <th className="px-3 py-3 font-mono text-[9px] uppercase tracking-wider text-muted">Exposición</th>
                <th className="px-3 py-3 font-mono text-[9px] uppercase tracking-wider text-muted">Score</th>
                <th className="px-3 py-3 font-mono text-[9px] uppercase tracking-wider text-muted">Prioridad</th>
                <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-wider text-muted text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      title={
                        allAssets.length === 0
                          ? 'Tu inventario está vacío'
                          : 'No se encontraron componentes'
                      }
                      description={
                        allAssets.length === 0
                          ? 'Ejecuta un descubrimiento para analizar endpoints reales o carga el catálogo de ejemplo para explorar la interfaz.'
                          : 'Prueba cambiando los términos de búsqueda o limpiando los filtros seleccionados.'
                      }
                      action={
                        allAssets.length === 0 ? (
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => navigate('/descubrimiento')}
                              icon={<Radar className="size-3.5" />}
                            >
                              Ejecutar descubrimiento
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                loadDemo()
                                toast('Datos de ejemplo cargados', {
                                  detail: 'Puedes vaciarlos cuando quieras.',
                                  tone: 'info',
                                })
                              }}
                            >
                              Cargar ejemplo
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={clearFilters}>
                            Limpiar filtros
                          </Button>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                visible.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => setSelected(asset)}
                    className="group cursor-pointer hover:bg-surface/60 transition-colors"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={checked.has(asset.id)}
                        onChange={() => toggleChecked(asset.id)}
                        className="accent-acid"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-dim">{asset.id}</span>
                        <span className="text-[12.5px] font-medium text-paper group-hover:text-acid transition-colors">
                          {asset.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[11.5px] text-muted">{asset.kind}</td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-[11px] text-paper bg-ink px-1.5 py-0.5 rounded border border-line">
                        {asset.algorithm}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[11.5px] text-muted">{asset.environment}</td>
                    <td className="px-3 py-3 text-[11.5px] text-muted">{asset.exposure}</td>
                    <td className="px-3 py-3 font-mono text-[12px] font-semibold text-paper">
                      {asset.score}
                    </td>
                    <td className="px-3 py-3">
                      <RiskBadge level={asset.priority} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight className="inline-block size-4 text-dim group-hover:text-paper" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-3 text-[11.5px] text-muted">
          <span>
            Mostrando {visible.length} de {filtered.length} activos
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              icon={<ChevronLeft className="size-3.5" />}
            >
              Anterior
            </Button>
            <span className="font-mono text-[10.5px] px-2 text-paper">
              {currentPage} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              iconRight={<ChevronRight className="size-3.5" />}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>

      <RiskDrawer asset={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

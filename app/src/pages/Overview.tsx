import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  CalendarClock,
  ChevronRight,
  FlaskConical,
  Radar,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import {
  computeAlgorithmFamilies,
  computeEnvironmentBreakdown,
  computeReadiness,
  computeStats,
  daysToDeadline,
} from '../data/assets'
import { nistDeadlines } from '../data/roadmap'
import type { CryptoAsset } from '../data/types'
import { cn, formatNumber } from '../lib/utils'
import { AlgorithmBars } from '../components/charts/AlgorithmBars'
import { ReadinessGauge } from '../components/charts/ReadinessGauge'
import { RiskDrawer } from '../components/RiskDrawer'
import { RiskTable } from '../components/RiskTable'
import { LiveDot, Tag } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState, Panel, PanelHeader } from '../components/ui/Panel'
import { useRealScan } from '../data/scanContext'

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function Overview() {
  const navigate = useNavigate()
  const { assets, orgName, isDemo, scans, loadDemo, clearAll } = useRealScan()
  const [selected, setSelected] = useState<CryptoAsset | null>(null)

  const stats = useMemo(() => computeStats(assets), [assets])
  const readiness = useMemo(() => computeReadiness(assets), [assets])
  const families = useMemo(() => computeAlgorithmFamilies(assets), [assets])
  const environments = useMemo(() => computeEnvironmentBreakdown(assets), [assets])
  const topRisks = useMemo(() => assets.slice(0, 8), [assets])
  const days = daysToDeadline()

  const priorityRows = [
    { label: 'Crítico', count: stats.critical, tone: 'bg-danger' },
    { label: 'Alto', count: stats.high, tone: 'bg-warn' },
    { label: 'Medio', count: stats.medium, tone: 'bg-lilac' },
    { label: 'Bajo', count: stats.low, tone: 'bg-dim' },
  ]

  const kpiCards = [
    {
      label: 'Hallazgos críticos',
      value: String(stats.critical).padStart(2, '0'),
      note: stats.total ? `${Math.round((stats.critical / stats.total) * 100)}% del inventario` : 'Sin inventario',
      color: 'var(--color-danger)',
    },
    {
      label: 'Activos criptográficos',
      value: formatNumber(stats.total),
      note: stats.total ? `${stats.owners} propietarios identificados` : 'Ejecuta un descubrimiento',
      color: 'var(--color-acid)',
    },
    {
      label: 'Expuestos a Internet',
      value: formatNumber(stats.internet),
      note: stats.total ? `${Math.round((stats.internet / stats.total) * 100)}% de la superficie` : 'Sin superficie analizada',
      color: 'var(--color-warn)',
    },
    {
      label: 'Componentes híbridos',
      value: formatNumber(stats.hybrid),
      note: stats.total ? `${Math.round((stats.hybrid / stats.total) * 100)}% con perfil resistente` : 'Sin perfil PQC',
      color: 'var(--color-sky)',
    },
  ]

  const lastScan = scans[0]
  const updatedLabel = lastScan ? formatDate(lastScan.startedAt) : 'Sin escaneos todavía'

  return (
    <div className="animate-rise">
      <div className="flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Tag tone="acid">
              <LiveDot /> CBOM v1.7
            </Tag>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim">
              {updatedLabel}
            </span>
            {isDemo && <Tag tone="warn">Datos de ejemplo</Tag>}
          </div>
          <h1 className="max-w-[770px] text-[clamp(2rem,3.4vw,3.15rem)] font-medium leading-[0.98] tracking-[-0.05em] text-paper">
            La criptografía que no ves, <span className="text-muted">priorizada.</span>
          </h1>
          <p className="mt-4 max-w-[560px] text-[13px] leading-relaxed text-muted">
            {stats.total === 0
              ? `${orgName} todavía no tiene un inventario criptográfico. UBIORA arranca vacío: ejecuta un descubrimiento o carga el ejemplo para ver todo el flujo.`
              : `${orgName} opera ${formatNumber(stats.total)} componentes criptográficos. UBIORA identifica cuáles fallan frente a la amenaza cuántica, cuánto pesan en el negocio y en qué orden migrarlos.`}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex h-9 items-center gap-2 rounded-lg border border-line bg-panel px-3 text-[11px] text-muted">
            <CalendarClock className="size-3.5 text-dim" />
            {lastScan ? lastScan.duration : 'Motor en espera'}
          </div>
          <Button
            variant="secondary"
            icon={<BookOpen className="size-3.5" />}
            onClick={() => navigate('/como-funciona')}
          >
            Cómo funciona
          </Button>
          <Button
            variant="primary"
            icon={<Radar className="size-3.5" />}
            onClick={() => navigate('/descubrimiento')}
          >
            Nuevo descubrimiento
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-[14px] border border-line bg-panel xl:grid-cols-4">
        {kpiCards.map((card, index) => (
          <div
            key={card.label}
            className={cn(
              'relative flex flex-col justify-between gap-5 p-4 sm:p-5',
              index < 2 && 'border-b border-line',
              index % 2 === 0 && 'border-r border-line',
              index < 3 && 'xl:border-r',
              'xl:border-b-0',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="label leading-[1.3]">{card.label}</p>
              <span
                className="mt-1 size-2 shrink-0 rounded-full"
                style={{ backgroundColor: card.color }}
              />
            </div>
            <div>
              <p className="tabular text-[30px] font-medium leading-none tracking-[-0.05em] text-paper">
                {card.value}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.06em] text-dim">
                {card.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      {stats.total === 0 ? (
        <Panel className="mt-4">
          <EmptyState
            title="El sistema está limpio"
            description="No hay activos precargados. Ejecuta un descubrimiento sobre un dominio real o carga un catálogo de ejemplo para recorrer la aplicación completa."
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button onClick={() => navigate('/descubrimiento')} icon={<Radar className="size-3.5" />}>
                  Ejecutar descubrimiento
                </Button>
                <Button
                  variant="secondary"
                  onClick={loadDemo}
                  icon={<FlaskConical className="size-3.5" />}
                >
                  Cargar ejemplo
                </Button>
              </div>
            }
          />
        </Panel>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Panel className="xl:col-span-7">
              <PanelHeader
                eyebrow="Readiness post-cuántico"
                title="Postura general"
                action={<Tag>{readiness.label}</Tag>}
              />
              <div className="grid min-h-[280px] grid-cols-1 md:grid-cols-[240px_1fr]">
                <div className="flex items-center justify-center border-b border-line p-5 md:border-b-0 md:border-r">
                  <ReadinessGauge score={readiness.score} previous={readiness.previous} />
                </div>
                <div className="flex flex-col justify-between p-5 sm:p-6">
                  <div>
                    <p className="max-w-[340px] text-[13px] leading-relaxed text-paper">
                      {readiness.score >= 50
                        ? 'La base ya existe. Ahora hay que cerrar los servicios críticos.'
                        : 'Ya hay inventario, pero la agilidad criptográfica sigue siendo el cuello de botella.'}
                    </p>
                    <p className="mt-2 max-w-[360px] text-[11.5px] leading-relaxed text-muted">
                      {readiness.description}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3.5">
                    {readiness.signals.map((signal) => (
                      <div key={signal.label}>
                        <div className="mb-1.5 flex items-baseline justify-between gap-3">
                          <span className="text-[11px] text-muted">{signal.label}</span>
                          <span className="font-mono text-[10px] text-paper">{signal.value}%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-line">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              signal.value >= 60 ? 'bg-acid' : signal.value >= 30 ? 'bg-warn' : 'bg-danger',
                            )}
                            style={{ width: `${signal.value}%` }}
                          />
                        </div>
                        <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.06em] text-dim">
                          {signal.note}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/inventario?riesgo=Cr%C3%ADtico')}
                    className="mt-6 flex items-center gap-3 rounded-lg border border-line bg-ink-raised px-3 py-2.5 text-left transition-colors hover:border-line-strong"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md border border-danger/25 bg-danger/10">
                      <ShieldAlert className="size-3.5 text-danger" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">
                        Brecha prioritaria
                      </span>
                      <span className="mt-0.5 block text-[11px] text-paper">
                        {stats.critical} activos críticos · {stats.internet} expuestos a Internet
                      </span>
                    </span>
                    <ChevronRight className="size-3.5 shrink-0 text-dim" />
                  </button>
                </div>
              </div>
            </Panel>

            <Panel className="xl:col-span-5">
              <PanelHeader
                eyebrow="NIST IR 8547"
                title="Reloj regulatorio"
                action={<Tag tone="warn">2030</Tag>}
              />
              <div className="p-5 sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="tabular text-[46px] font-medium leading-none tracking-[-0.06em] text-paper">
                      {formatNumber(days)}
                    </p>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                      días para el primer plazo
                    </p>
                  </div>
                  <div className="mb-1 text-right">
                    <p className="font-mono text-[10px] text-paper">31 dic 2030</p>
                    <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">
                      establecimiento de claves
                    </p>
                  </div>
                </div>

                <div className="relative mt-6">
                  <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
                    <span>2026</span>
                    <span className="text-warn">2030</span>
                    <span>2031</span>
                    <span>2035</span>
                  </div>
                  <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                    <div className="absolute inset-y-0 left-0 w-[20%] rounded-full bg-acid/80" />
                    <div className="absolute inset-y-0 left-[20%] w-[60%] rounded-full bg-gradient-to-r from-acid/50 via-warn/50 to-danger/50" />
                  </div>
                  <div className="absolute left-[20%] top-[18px] h-3 w-px bg-warn" />
                </div>

                <div className="mt-6 space-y-0 divide-y divide-line border-t border-line">
                  {nistDeadlines.map((deadline, index) => (
                    <div key={deadline.title} className="flex items-start gap-3 py-3">
                      <span
                        className={cn(
                          'mt-1 size-1.5 shrink-0 rounded-full',
                          index === 0 ? 'bg-danger' : index === 1 ? 'bg-warn' : 'bg-dim',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-[11.5px] text-paper">{deadline.title}</p>
                          <span className="shrink-0 font-mono text-[9px] text-dim">{deadline.date}</span>
                        </div>
                        <p className="mt-1 text-[10px] leading-relaxed text-dim">{deadline.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/hoja-de-ruta')}
                  className="mt-3 flex w-full items-center justify-between rounded-lg border border-line bg-ink-raised px-3 py-2.5 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-paper"
                >
                  Ver plan de migración
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </Panel>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Panel className="xl:col-span-8">
              <PanelHeader
                eyebrow="Composición del inventario"
                title="Distribución por prioridad"
                action={<Tag>{formatNumber(stats.total)} activos</Tag>}
              />
              <div className="px-5 pb-5 pt-5">
                <div className="space-y-4">
                  {priorityRows.map((row) => (
                    <div key={row.label}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={cn('size-1.5 rounded-full', row.tone)} />
                          <span className="text-[11.5px] text-muted">{row.label}</span>
                        </div>
                        <span className="font-mono text-[10px] text-paper">
                          {formatNumber(row.count)} ·{' '}
                          {stats.total ? Math.round((row.count / stats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-line">
                        <div
                          className={cn('h-full rounded-full', row.tone)}
                          style={{ width: `${stats.total ? (row.count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Pendientes', value: stats.total - stats.mitigated - stats.inMigration },
                    { label: 'En migración', value: stats.inMigration },
                    { label: 'Mitigados', value: stats.mitigated },
                  ].map((item) => (
                    <div key={item.label} className="panel-inset px-3 py-2.5">
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[15px] text-paper">{formatNumber(item.value)}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-dim">
                  Cada activo se clasifica con el score compuesto de UBIORA: sensibilidad 30% ·
                  vida útil 25% · exposición 25% · criticidad 20%.
                </p>
              </div>
            </Panel>

            <Panel className="xl:col-span-4">
              <PanelHeader
                eyebrow="Concentración"
                title="Mezcla de algoritmos"
                action={
                  families[0] ? <Tag tone="danger">{families[0].name} {families[0].share}%</Tag> : undefined
                }
              />
              <div className="p-5">
                {families.length > 0 ? (
                  <>
                    <AlgorithmBars data={families} />
                    <div className="mt-5 rounded-lg border border-line bg-ink-raised p-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 size-3.5 shrink-0 text-acid" />
                        <p className="text-[10.5px] leading-relaxed text-muted">
                          <span className="text-paper">{families[0].name} concentra el mayor volumen.</span>{' '}
                          {formatNumber(families[0].count)} componentes comparten esa familia
                          algorítmica.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    title="Sin algoritmos"
                    description="Cuando escanees tu primer endpoint aquí verás la mezcla de algoritmos detectados."
                  />
                )}
              </div>
            </Panel>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Panel className="xl:col-span-8">
              <PanelHeader
                eyebrow="Top 8 por score de riesgo"
                title="Cola de prioridad"
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    iconRight={<ChevronRight className="size-3.5" />}
                    onClick={() => navigate('/inventario')}
                  >
                    Ver inventario
                  </Button>
                }
              />
              <RiskTable assets={topRisks} onSelect={setSelected} compact />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 sm:px-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-dim">
                  Score = sensibilidad 30% · vida útil 25% · exposición 25% · criticidad 20%
                </p>
                <p className="font-mono text-[9px] text-dim">
                  {stats.critical} críticos · {stats.high} altos · {stats.medium} medios
                </p>
              </div>
            </Panel>

            <div className="flex flex-col gap-4 xl:col-span-4">
              <Panel className="flex-1">
                <PanelHeader
                  eyebrow="Historial local"
                  title="Escaneos recientes"
                  action={<LiveDot />}
                />
                {scans.length === 0 ? (
                  <EmptyState
                    title="Sin escaneos"
                    description="Los descubrimientos que ejecutes aparecerán aquí y en el inventario."
                  />
                ) : (
                  <div className="divide-y divide-line">
                    {scans.slice(0, 5).map((scan) => (
                      <div key={scan.id} className="flex items-center gap-3 px-5 py-3">
                        <span
                          className={cn(
                            'size-1.5 shrink-0 rounded-full',
                            scan.critical > 0 ? 'bg-warn' : 'bg-acid',
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] text-paper">{scan.target}</p>
                          <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
                            {formatNumber(scan.findings)} hallazgos · {scan.critical} críticos
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-[8.5px] text-dim">{scan.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel>
                <PanelHeader eyebrow="Cobertura" title="Por ambiente" />
                <div className="space-y-3 p-5">
                  {environments.map((environment) => (
                    <div key={environment.name}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted">{environment.name}</span>
                        <span className="font-mono text-[9.5px] text-dim">
                          {formatNumber(environment.count)} · {environment.share}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            environment.name === 'Core bancario'
                              ? 'bg-danger/80'
                              : environment.name === 'Producción'
                                ? 'bg-acid/80'
                                : 'bg-line-strong',
                          )}
                          style={{ width: `${environment.share}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </>
      )}

      <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-[14px] border border-line bg-panel px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-warn/25 bg-warn/10">
            <ShieldAlert className="size-4 text-warn" />
          </span>
          <div>
            <p className="text-[12px] text-paper">
              Quedan {Math.ceil(days / 30)} meses de ventana de migración.
            </p>
            <p className="mt-0.5 text-[10.5px] text-dim">
              El primer plazo del NIST es el 31 de diciembre de 2030 para establecimiento de claves.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDemo && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Vaciar datos de ejemplo
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/informe')}
            iconRight={<ChevronRight className="size-3.5" />}
          >
            Abrir informe ejecutivo
          </Button>
        </div>
      </div>

      <RiskDrawer asset={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  ChevronRight,
  Radar,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import {
  algorithmFamilies,
  activityFeed,
  environmentBreakdown,
  exposureTrend,
  kpis,
  readiness,
  recentScans,
  stats,
  topRisks,
} from '../data/assets'
import { nistDeadlines, roadmapSummary } from '../data/roadmap'
import type { CryptoAsset } from '../data/types'
import { cn, formatNumber } from '../lib/utils'
import { AlgorithmBars } from '../components/charts/AlgorithmBars'
import { ExposureChart } from '../components/charts/ExposureChart'
import { ReadinessGauge } from '../components/charts/ReadinessGauge'
import { Sparkline } from '../components/charts/Sparkline'
import { RiskDrawer } from '../components/RiskDrawer'
import { RiskTable } from '../components/RiskTable'
import { LiveDot, Tag } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Panel, PanelHeader } from '../components/ui/Panel'

const ranges = [
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '12M', months: 12 },
]

const kpiCards = [
  {
    label: 'Hallazgos críticos',
    value: String(kpis.critical).padStart(2, '0'),
    note: '1 menos que el trimestre anterior',
    trend: 'down',
    good: true,
    data: [24, 24, 23, 22, 22, 21, 21, 20, 19, 19, 18, 17],
    color: 'var(--color-danger)',
  },
  {
    label: 'Activos criptográficos',
    value: formatNumber(kpis.total),
    note: '114 menos que el trimestre anterior',
    trend: 'down',
    good: true,
    data: [1820, 1776, 1801, 1734, 1688, 1695, 1622, 1578, 1516, 1472, 1398, 1284],
    color: 'var(--color-acid)',
  },
  {
    label: 'Expuestos a Internet',
    value: formatNumber(stats.internet),
    note: '9 más que el trimestre anterior',
    trend: 'up',
    good: false,
    data: [312, 318, 321, 327, 334, 339, 345, 351, 358, 367, 376, 387],
    color: 'var(--color-warn)',
  },
  {
    label: 'Componentes híbridos',
    value: '142',
    note: '11 más que el trimestre anterior',
    trend: 'up',
    good: true,
    data: [42, 54, 61, 72, 81, 94, 101, 110, 118, 127, 136, 142],
    color: 'var(--color-sky)',
  },
]

export function Overview() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<CryptoAsset | null>(null)
  const [range, setRange] = useState(12)

  const trend = useMemo(() => exposureTrend.slice(-range), [range])
  const change = useMemo(() => {
    const first = trend[0].findings
    const last = trend[trend.length - 1].findings
    return (((last - first) / first) * 100).toFixed(1)
  }, [trend])

  return (
    <div className="animate-rise">
      <div className="flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Tag tone="acid">
              <LiveDot /> CBOM v1.7
            </Tag>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim">
              Actualizado 14 nov 2026 · 08:42
            </span>
          </div>
          <h1 className="max-w-[770px] text-[clamp(2rem,3.4vw,3.15rem)] font-medium leading-[0.98] tracking-[-0.05em] text-paper">
            La criptografía que no ves, <span className="text-muted">priorizada.</span>
          </h1>
          <p className="mt-4 max-w-[540px] text-[13px] leading-relaxed text-muted">
            Cobalto Pay opera 1,284 componentes criptográficos. UBIORA identifica cuáles fallan
            frente a la amenaza cuántica, cuánto pesan en el negocio y en qué orden migrarlos.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex h-9 items-center gap-2 rounded-lg border border-line bg-panel px-3 text-[11px] text-muted">
            <CalendarClock className="size-3.5 text-dim" />
            Últimos 12 meses
          </div>
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
              <Sparkline data={card.data} color={card.color} className="hidden h-6 w-[74px] shrink-0 sm:block" />
            </div>
            <div>
              <p className="tabular text-[30px] font-medium leading-none tracking-[-0.05em] text-paper">
                {card.value}
              </p>
              <p
                className={cn(
                  'mt-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.06em]',
                  card.good ? 'text-acid/80' : 'text-warn/90',
                )}
              >
                {card.trend === 'up' ? (
                  <ArrowUpRight className="size-2.5" />
                ) : (
                  <ArrowDownRight className="size-2.5" />
                )}
                {card.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-7">
          <PanelHeader
            eyebrow="Readiness post-cuántico"
            title="Postura general"
            action={<Tag>Score compuesto</Tag>}
          />
          <div className="grid min-h-[280px] grid-cols-1 md:grid-cols-[240px_1fr]">
            <div className="flex items-center justify-center border-b border-line p-5 md:border-b-0 md:border-r">
              <ReadinessGauge score={readiness.score} previous={readiness.previous} />
            </div>
            <div className="flex flex-col justify-between p-5 sm:p-6">
              <div>
                <p className="max-w-[340px] text-[13px] leading-relaxed text-paper">
                  Ya hay inventario, pero la agilidad criptográfica sigue siendo el cuello de
                  botella.
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
                    5 servicios críticos expuestos sin perfil híbrido
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
                  {formatNumber(kpis.daysToDeadline)}
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
            eyebrow="Serie histórica"
            title="Hallazgos en el tiempo"
            action={
              <div className="flex items-center gap-1 rounded-lg border border-line bg-ink p-0.5">
                {ranges.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setRange(item.months)}
                    className={cn(
                      'rounded-md px-2 py-1 font-mono text-[9.5px] transition-colors',
                      range === item.months
                        ? 'bg-surface text-paper'
                        : 'text-dim hover:text-muted',
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            }
          />
          <div className="px-4 pb-4 pt-5 sm:px-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-3">
                <p className="tabular text-[34px] font-medium leading-none tracking-[-0.05em] text-paper">
                  {formatNumber(trend[trend.length - 1].findings)}
                </p>
                <p className="mb-1 flex items-center gap-1 font-mono text-[10px] text-acid">
                  <ArrowDownRight className="size-3" />
                  {change}%
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.08em] text-dim">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-acid" /> Hallazgos
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-danger" /> Críticos
                </span>
              </div>
            </div>
            <ExposureChart data={trend} />
            <p className="mt-2 border-t border-line pt-3 text-[10px] leading-relaxed text-dim">
              La reducción de 29.4% se explica por el retiro de TLS 1.1 y la rotación de 214
              certificados. Los hallazgos críticos bajaron de 24 a 17, pero 5 siguen en servicios
              expuestos a Internet.
            </p>
          </div>
        </Panel>

        <Panel className="xl:col-span-4">
          <PanelHeader
            eyebrow="Concentración"
            title="Mezcla de algoritmos"
            action={<Tag tone="danger">RSA {algorithmFamilies[0].share}%</Tag>}
          />
          <div className="p-5">
            <AlgorithmBars data={algorithmFamilies} />
            <div className="mt-5 rounded-lg border border-line bg-ink-raised p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-acid" />
                <p className="text-[10.5px] leading-relaxed text-muted">
                  <span className="text-paper">RSA concentra el mayor riesgo.</span>{' '}
                  {formatNumber(algorithmFamilies[0].count)} componentes dependen de RSA-2048 o
                  RSA-3072 y no tienen perfil híbrido configurado.
                </p>
              </div>
            </div>
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
              17 críticos · {stats.high} altos · {stats.medium} medios
            </p>
          </div>
        </Panel>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <Panel className="flex-1">
            <PanelHeader
              eyebrow="Últimas 24 horas"
              title="Actividad"
              action={<LiveDot />}
            />
            <div className="divide-y divide-line">
              {activityFeed.map((item) => (
                <div key={item.title} className="flex gap-3 px-5 py-3.5">
                  <span
                    className={cn(
                      'mt-1.5 size-1.5 shrink-0 rounded-full',
                      item.tone === 'acid'
                        ? 'bg-acid'
                        : item.tone === 'warn'
                          ? 'bg-warn'
                          : 'bg-sky',
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] leading-snug text-paper">{item.title}</p>
                    <p className="mt-1 truncate text-[10px] text-dim">{item.detail}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[8.5px] text-dim">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-line bg-ink-raised/50 px-5 py-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="label">Escaneos recientes</p>
                <button
                  type="button"
                  onClick={() => navigate('/descubrimiento')}
                  className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim transition-colors hover:text-paper"
                >
                  Ver todos
                </button>
              </div>
              {recentScans.slice(0, 2).map((scan) => (
                <div key={scan.id} className="flex items-center gap-2 py-1.5">
                  <span
                    className={cn(
                      'size-1.5 shrink-0 rounded-full',
                      scan.status === 'Con alertas' ? 'bg-warn' : 'bg-acid',
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-[10px] text-muted">{scan.target}</span>
                  <span className="font-mono text-[8.5px] text-dim">{scan.duration}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader eyebrow="Cobertura" title="Por ambiente" />
            <div className="space-y-3 p-5">
              {environmentBreakdown.map((environment) => (
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
                      style={{ width: `${environment.share * 1.6}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-[14px] border border-line bg-panel px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-warn/25 bg-warn/10">
            <ShieldAlert className="size-4 text-warn" />
          </span>
          <div>
            <p className="text-[12px] text-paper">Quedan 38 meses de ventana de migración.</p>
            <p className="mt-0.5 text-[10.5px] text-dim">
              El plan actual llega a 2030 con un riesgo residual proyectado de{' '}
              {roadmapSummary.projectedResidualRisk}%.
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/informe')}
          iconRight={<ChevronRight className="size-3.5" />}
        >
          Abrir informe ejecutivo
        </Button>
      </div>

      <RiskDrawer asset={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

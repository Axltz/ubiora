import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Circle,
  Download,
  FileText,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react'
import { DEMO_NOW } from '../data/assets'
import { nistDeadlines, roadmapInitiatives, roadmapPhases, roadmapSummary } from '../data/roadmap'
import type { RoadmapPhase } from '../data/types'
import { cn } from '../lib/utils'
import { downloadFile } from '../lib/download'
import { LiveDot, Tag } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Panel, PanelHeader } from '../components/ui/Panel'
import { useToast } from '../components/ui/Toast'

const TIMELINE_START = 2026 * 12 + 6
const TIMELINE_END = 2030 * 12 + 11
const TOTAL_MONTHS = TIMELINE_END - TIMELINE_START + 1

const yearSegments = [
  { year: 2026, months: 6 },
  { year: 2027, months: 12 },
  { year: 2028, months: 12 },
  { year: 2029, months: 12 },
  { year: 2030, months: 12 },
]

const phaseStatusTone = {
  Completado: 'acid',
  'En curso': 'sky',
  Planificado: 'neutral',
  Bloqueado: 'danger',
} as const

const initiativeStatusTone = {
  Completado: 'acid',
  'En curso': 'sky',
  Planificado: 'neutral',
} as const

function monthIndex(value: string) {
  const [year, month] = value.split('-').map(Number)
  return year * 12 + month - 1
}

function phasePosition(phase: RoadmapPhase) {
  const start = monthIndex(phase.start)
  const end = monthIndex(phase.end)
  return {
    left: ((start - TIMELINE_START) / TOTAL_MONTHS) * 100,
    width: ((end - start + 1) / TOTAL_MONTHS) * 100,
  }
}

const todayPosition =
  ((DEMO_NOW.getFullYear() * 12 + DEMO_NOW.getMonth() + DEMO_NOW.getDate() / 30 - TIMELINE_START) /
    TOTAL_MONTHS) *
  100

const yearBoundaries = yearSegments.map((segment, index) => ({
  year: segment.year,
  position:
    (yearSegments.slice(0, index).reduce((total, item) => total + item.months, 0) / TOTAL_MONTHS) *
    100,
}))

export function Roadmap() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedId, setSelectedId] = useState('phase-1')
  const [filter, setFilter] = useState<'Todas' | 'Completado' | 'En curso' | 'Planificado'>('Todas')

  const selectedPhase = roadmapPhases.find((phase) => phase.id === selectedId) ?? roadmapPhases[0]
  const filteredInitiatives = useMemo(
    () =>
      filter === 'Todas'
        ? roadmapInitiatives
        : roadmapInitiatives.filter((initiative) => initiative.status === filter),
    [filter],
  )

  const exportPlan = () => {
    const header = ['Fase', 'Inicio', 'Fin', 'Estado', 'Propietario', 'Estandar', 'Reduccion_riesgo']
    const rows = roadmapPhases.map((phase) => [
      phase.name,
      phase.start,
      phase.end,
      phase.status,
      phase.owner,
      phase.standard,
      phase.riskReduction,
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    downloadFile(`\uFEFF${csv}`, 'cobalto-pay-hoja-de-ruta-2026.csv', 'text/csv;charset=utf-8')
    toast('Hoja de ruta exportada', {
      detail: '6 fases y 11 iniciativas incluidas en el archivo.',
    })
  }

  return (
    <div className="animate-rise">
      <div className="flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Tag tone="acid">
              <LiveDot /> Plan vivo
            </Tag>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim">
              2026 – 2030 · NIST IR 8547
            </span>
          </div>
          <h1 className="max-w-[760px] text-[clamp(2rem,3.2vw,3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-paper">
            Un plan que cabe <span className="text-muted">en el calendario.</span>
          </h1>
          <p className="mt-4 max-w-[580px] text-[13px] leading-relaxed text-muted">
            Seis fases, once iniciativas y una ruta verificable hacia 2030. Cada movimiento reduce
            riesgo medible sin detener la operación del banco.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="secondary" icon={<Download className="size-3.5" />} onClick={exportPlan}>
            Exportar plan
          </Button>
          <Button
            variant="primary"
            icon={<FileText className="size-3.5" />}
            onClick={() => navigate('/informe')}
          >
            Abrir informe
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-[14px] border border-line bg-panel xl:grid-cols-4">
        {[
          {
            label: 'Progreso del plan',
            value: `${roadmapSummary.progress}%`,
            note: '1 de 6 fases completada',
            icon: CheckCircle2,
            bar: roadmapSummary.progress,
          },
          {
            label: 'Ventana restante',
            value: `${roadmapSummary.monthsRemaining} m`,
            note: 'hasta el plazo de 2030',
            icon: CalendarClock,
            bar: Math.round((38 / 54) * 100),
          },
          {
            label: 'Críticos por cerrar',
            value: String(roadmapSummary.currentCritical),
            note: 'de 17 hallazgos iniciales',
            icon: Target,
            bar: 100,
          },
          {
            label: 'Riesgo residual 2030',
            value: `${roadmapSummary.projectedResidualRisk}%`,
            note: 'objetivo después del cierre',
            icon: ShieldCheck,
            bar: roadmapSummary.projectedResidualRisk,
          },
        ].map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className={cn(
                'flex flex-col justify-between gap-4 p-4 sm:p-5',
                index !== 3 && 'border-b border-line xl:border-b-0',
                index % 2 === 0 && 'border-r border-line',
                index === 2 && 'xl:border-r',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="label leading-[1.3]">{item.label}</p>
                <Icon className="size-3.5 text-dim" />
              </div>
              <div>
                <p className="tabular text-[28px] font-medium leading-none tracking-[-0.05em] text-paper">
                  {item.value}
                </p>
                <div className="mt-2.5 h-0.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-acid/80" style={{ width: `${item.bar}%` }} />
                </div>
                <p className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.07em] text-dim">
                  {item.note}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <Panel className="mt-4 overflow-hidden">
        <PanelHeader
          eyebrow="Roadmap 2026–2030"
          title="Secuencia de migración"
          action={
            <div className="flex items-center gap-3 font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
              <span className="hidden items-center gap-1.5 sm:flex">
                <span className="size-1.5 rounded-full bg-acid" /> Completado
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                <span className="size-1.5 rounded-full bg-sky" /> En curso
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                <span className="size-1.5 rounded-full bg-dim" /> Planificado
              </span>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[260px_minmax(0,1fr)] border-b border-line">
              <div className="flex items-end px-5 py-3">
                <span className="label">Fase / ventana</span>
              </div>
              <div className="relative flex h-[42px] items-end">
                {yearSegments.map((segment) => (
                  <div
                    key={segment.year}
                    className="flex h-full items-end border-l border-line px-2 pb-2 first:border-l-0"
                    style={{ width: `${(segment.months / TOTAL_MONTHS) * 100}%` }}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-dim">
                      {segment.year}
                    </span>
                  </div>
                ))}
                <div
                  className="absolute inset-y-0 z-10 w-px bg-acid/60"
                  style={{ left: `${todayPosition}%` }}
                >
                  <span className="absolute -top-0.5 left-1.5 rounded bg-ink px-1 font-mono text-[8px] uppercase tracking-[0.08em] text-acid">
                    hoy
                  </span>
                </div>
              </div>
            </div>

            {roadmapPhases.map((phase) => {
              const position = phasePosition(phase)
              const months =
                monthIndex(phase.end) - monthIndex(phase.start) + 1
              const isSelected = phase.id === selectedId
              return (
                <div
                  key={phase.id}
                  className={cn(
                    'grid grid-cols-[260px_minmax(0,1fr)] border-b border-line last:border-b-0 transition-colors',
                    isSelected ? 'bg-surface/45' : 'hover:bg-surface/25',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(phase.id)}
                    className="flex h-[54px] items-center gap-2.5 px-5 text-left"
                  >
                    <span
                      className={cn(
                        'size-1.5 shrink-0 rounded-full',
                        phase.status === 'Completado'
                          ? 'bg-acid'
                          : phase.status === 'En curso'
                            ? 'bg-sky'
                            : 'bg-dim',
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block truncate text-[11.5px] transition-colors',
                          isSelected ? 'text-paper' : 'text-muted',
                        )}
                      >
                        {phase.name}
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-[8.5px] uppercase tracking-[0.07em] text-dim">
                        {phase.owner} · {months} meses
                      </span>
                    </span>
                    <ChevronRight
                      className={cn(
                        'size-3 shrink-0 transition-all',
                        isSelected ? 'translate-x-0.5 text-acid' : 'text-dim',
                      )}
                    />
                  </button>

                  <div
                    className="relative h-[54px]"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px)',
                      backgroundSize: `${100 / TOTAL_MONTHS}% 100%`,
                    }}
                  >
                    {yearBoundaries.map((boundary) => (
                      <span
                        key={boundary.year}
                        className="absolute inset-y-0 w-px bg-line-strong/70"
                        style={{ left: `${boundary.position}%` }}
                      />
                    ))}
                    <span
                      className="pointer-events-none absolute inset-y-0 z-[5] w-px border-l border-dashed border-acid/50"
                      style={{ left: `${todayPosition}%` }}
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedId(phase.id)}
                      title={`${phase.name} · ${phase.start} → ${phase.end}`}
                      className={cn(
                        'absolute top-1/2 z-10 flex h-6 -translate-y-1/2 items-center overflow-hidden rounded-md border px-2 text-left transition-all hover:brightness-110',
                        phase.status === 'Completado'
                          ? 'border-acid/40 bg-acid/85 text-ink'
                          : phase.status === 'En curso'
                            ? 'border-acid/50 bg-gradient-to-r from-acid/85 to-acid/45 text-ink'
                            : 'border-line-strong bg-surface-2 text-muted',
                        isSelected && 'ring-2 ring-paper/20 ring-offset-2 ring-offset-panel',
                      )}
                      style={{
                        left: `${position.left}%`,
                        width: `${position.width}%`,
                        backgroundImage:
                          phase.status === 'Planificado'
                            ? 'repeating-linear-gradient(135deg, transparent 0 4px, rgba(255,255,255,0.035) 4px 5px)'
                            : undefined,
                      }}
                    >
                      <span className="truncate font-mono text-[8.5px] font-medium uppercase tracking-[0.06em]">
                        {position.width > 12
                          ? `${phase.id.replace('phase-', 'F')} · ${phase.riskReduction}% de reducción`
                          : phase.id.replace('phase-', 'F')}
                      </span>
                      {phase.status === 'En curso' && (
                        <span className="absolute right-0 top-0 h-full w-1 animate-pulse bg-paper/60" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-ink-raised/50 px-5 py-3">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
            Cada barra representa una fase · la reducción es acumulada
          </p>
          <p className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
            Plazo NIST: 31 dic 2030
          </p>
        </div>
      </Panel>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-8">
          <PanelHeader
            eyebrow={`Detalle · ${selectedPhase.id.replace('phase-', 'Fase ')}`}
            title={selectedPhase.name}
            action={<Tag tone={phaseStatusTone[selectedPhase.status]}>{selectedPhase.status}</Tag>}
          />
          <div className="p-5 sm:p-6">
            <p className="max-w-[620px] text-[12.5px] leading-relaxed text-muted">
              {selectedPhase.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: 'Propietario', value: selectedPhase.owner, icon: Users },
                { label: 'Estándar', value: selectedPhase.standard, icon: ShieldCheck },
                { label: 'Esfuerzo', value: selectedPhase.effort, icon: Target },
                {
                  label: 'Reducción',
                  value: `${selectedPhase.riskReduction}%`,
                  icon: ArrowUpRight,
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="panel-inset px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Icon className="size-3 text-dim" />
                      <p className="font-mono text-[8px] uppercase tracking-[0.08em] text-dim">
                        {item.label}
                      </p>
                    </div>
                    <p className="mt-1.5 truncate text-[10.5px] text-paper">{item.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <p className="label mb-2.5">Entregables</p>
                <ul className="space-y-2">
                  {selectedPhase.deliverables.map((deliverable, index) => {
                    const done =
                      selectedPhase.status === 'Completado' ||
                      (selectedPhase.status === 'En curso' && index === 0)
                    return (
                      <li key={deliverable} className="flex items-start gap-2.5">
                        {done ? (
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-acid" />
                        ) : (
                          <Circle className="mt-0.5 size-3.5 shrink-0 text-dim" />
                        )}
                        <span className={cn('text-[11px] leading-snug', done ? 'text-paper' : 'text-muted')}>
                          {deliverable}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div>
                <p className="label mb-2.5">Dependencias</p>
                <div className="rounded-lg border border-line bg-ink-raised px-3 py-2.5">
                  <p className="text-[11px] leading-relaxed text-muted">{selectedPhase.dependencies}</p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="label">Reducción de riesgo acumulada</p>
                    <span className="font-mono text-[10px] text-paper">
                      {selectedPhase.riskReduction}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-acid transition-all duration-500"
                      style={{ width: `${selectedPhase.riskReduction}%` }}
                    />
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  icon={<FileText className="size-3" />}
                  onClick={() =>
                    toast('Fase añadida al informe', {
                      detail: `${selectedPhase.name} se incluirá en el próximo board brief.`,
                    })
                  }
                >
                  Añadir al informe
                </Button>
              </div>
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <Panel>
            <PanelHeader eyebrow="Principios" title="Reglas del plan" />
            <div className="divide-y divide-line">
              {[
                {
                  number: '01',
                  title: 'Nada se migra sin inventario',
                  detail: 'Cada decisión se apoya en un componente del CBOM, no en una suposición.',
                },
                {
                  number: '02',
                  title: 'Híbrido antes que PQC puro',
                  detail: 'Se combina el algoritmo clásico y el nuevo para no romper compatibilidad.',
                },
                {
                  number: '03',
                  title: 'La evidencia se produce durante',
                  detail: 'El cierre regulatorio se documenta fase por fase, no al final del programa.',
                },
              ].map((rule) => (
                <div key={rule.number} className="flex gap-3 px-5 py-3.5">
                  <span className="font-mono text-[10px] text-acid/80">{rule.number}</span>
                  <div>
                    <p className="text-[11.5px] text-paper">{rule.title}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-dim">{rule.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="flex-1">
            <PanelHeader eyebrow="Regulatorio" title="Fechas que no se mueven" />
            <div className="divide-y divide-line">
              {nistDeadlines.map((deadline, index) => (
                <div key={deadline.title} className="px-5 py-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'size-1.5 rounded-full',
                          index === 0 ? 'bg-danger' : index === 1 ? 'bg-warn' : 'bg-dim',
                        )}
                      />
                      <p className="text-[11px] text-paper">{deadline.title}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[9px] text-dim">{deadline.date}</span>
                  </div>
                  <p className="mt-1 pl-3.5 text-[9.5px] leading-relaxed text-dim">
                    {deadline.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-line bg-ink-raised/50 px-5 py-3">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.07em] text-dim">
                Capacidad: {roadmapSummary.budgetEffort}
              </p>
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <PanelHeader
          eyebrow="Ejecución"
          title="Iniciativas priorizadas"
          action={
            <div className="flex items-center gap-1 rounded-lg border border-line bg-ink p-0.5">
              {(['Todas', 'En curso', 'Planificado', 'Completado'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={cn(
                    'rounded-md px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.05em] transition-colors',
                    filter === item ? 'bg-surface text-paper' : 'text-dim hover:text-muted',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-ink-raised/60">
                <th className="label px-5 py-2.5 font-medium">Iniciativa</th>
                <th className="label px-3 py-2.5 font-medium">Trimestre</th>
                <th className="label px-3 py-2.5 font-medium">Fase</th>
                <th className="label px-3 py-2.5 font-medium">Dueño</th>
                <th className="label px-3 py-2.5 font-medium">Estándar</th>
                <th className="label px-3 py-2.5 font-medium">Impacto</th>
                <th className="label px-3 py-2.5 font-medium">Esfuerzo</th>
                <th className="label px-3 py-2.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredInitiatives.map((initiative) => (
                <tr
                  key={initiative.id}
                  className="border-b border-line/80 transition-colors last:border-b-0 hover:bg-surface/40"
                >
                  <td className="px-5 py-3">
                    <p className="text-[11.5px] text-paper">{initiative.title}</p>
                    <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.06em] text-dim">
                      {initiative.id} · dep: {initiative.dependencies}
                    </p>
                  </td>
                  <td className="tabular px-3 py-3 font-mono text-[10px] text-muted">{initiative.quarter}</td>
                  <td className="px-3 py-3 text-[10px] text-muted">{initiative.phase}</td>
                  <td className="px-3 py-3 text-[10px] text-muted">{initiative.owner}</td>
                  <td className="px-3 py-3 font-mono text-[9px] text-dim">{initiative.standard}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="tabular w-5 font-mono text-[10px] text-paper">{initiative.impact}%</span>
                      <div className="h-1 w-12 overflow-hidden rounded-full bg-line">
                        <div
                          className="h-full rounded-full bg-acid/80"
                          style={{ width: `${initiative.impact * 7}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[10px] text-muted">{initiative.effort}</td>
                  <td className="px-3 py-3">
                    <Tag tone={initiativeStatusTone[initiative.status]}>{initiative.status}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-line px-5 py-3">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
            {filteredInitiatives.length} iniciativas · impacto sobre el riesgo total
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/informe')}
            iconRight={<ChevronRight className="size-3.5" />}
          >
            Incluir en el informe
          </Button>
        </div>
      </Panel>
    </div>
  )
}

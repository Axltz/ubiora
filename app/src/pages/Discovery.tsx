import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Container,
  FileKey2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Network,
  Play,
  Radar,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { assets, stats } from '../data/assets'
import type { CryptoAsset } from '../data/types'
import { cn, formatNumber } from '../lib/utils'
import { RiskDrawer } from '../components/RiskDrawer'
import { RiskTable } from '../components/RiskTable'
import { LiveDot, RiskBadge, Tag } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Panel, PanelHeader } from '../components/ui/Panel'
import { useToast } from '../components/ui/Toast'

type ScanStatus = 'idle' | 'running' | 'complete'

const scopeOptions = [
  { id: 'tls', label: 'Endpoints TLS', count: 42, icon: Network, detail: 'Handshake y configuración' },
  { id: 'certs', label: 'Certificados X.509', count: 96, icon: FileKey2, detail: 'Autoridades y vigencia' },
  { id: 'code', label: 'Dependencias de código', count: 812, icon: Code2, detail: 'Repositorios y librerías' },
  { id: 'containers', label: 'Contenedores', count: 218, icon: Container, detail: 'Imágenes y secretos' },
  { id: 'keys', label: 'Llaves y secretos', count: 116, icon: KeyRound, detail: 'Vaults y KMS' },
]

const logScript: { at: number; text: string; tone?: 'ok' | 'warn' | 'dim' }[] = [
  { at: 1, text: 'ubiora discover --target prod/mx-central --mode deep' },
  { at: 3, text: '6 plugins cargados · perfil NIST SP 800-52r2', tone: 'dim' },
  { at: 7, text: 'Resolviendo 42 endpoints TLS…', tone: 'dim' },
  { at: 12, text: 'TLS 1.2 · api.cobalto.mx · RSA-2048 · vence en 184d', tone: 'ok' },
  { at: 18, text: 'TLS 1.3 · auth-service · ECDSA P-256 · OK', tone: 'ok' },
  { at: 24, text: 'Parseando 96 certificados X.509…', tone: 'dim' },
  { at: 31, text: 'ALERTA · kyc-pipeline · SHA-1 en cadena de verificación', tone: 'warn' },
  { at: 38, text: 'ALERTA · legacy-sftp · DH-1024 · grupo débil', tone: 'warn' },
  { at: 45, text: 'Analizando 812 dependencias en 34 repositorios…', tone: 'dim' },
  { at: 53, text: 'node-forge@0.9.0 · RSA-2048 · sin perfil híbrido', tone: 'warn' },
  { at: 61, text: 'Revisando 218 imágenes y 116 secretos…', tone: 'dim' },
  { at: 70, text: 'Contenedor settlement-worker · DH-1024', tone: 'warn' },
  { at: 78, text: 'Normalizando hallazgos a CycloneDX 1.7…', tone: 'dim' },
  { at: 87, text: 'Aplicando scoring: sensibilidad · vida útil · exposición', tone: 'dim' },
  { at: 94, text: 'Generando CBOM y cola de prioridad…', tone: 'dim' },
  { at: 99, text: '1,284 componentes · 17 críticos · 142 con perfil híbrido', tone: 'ok' },
]

const phases = [
  { label: 'Resolviendo endpoints', until: 18 },
  { label: 'Negociando TLS', until: 40 },
  { label: 'Parseando certificados', until: 58 },
  { label: 'Analizando dependencias', until: 80 },
  { label: 'Normalizando CBOM', until: 94 },
  { label: 'Priorizando riesgo', until: 100 },
]

export function Discovery() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [status, setStatus] = useState<ScanStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<{ text: string; tone?: 'ok' | 'warn' | 'dim' }[]>([])
  const [scope, setScope] = useState<string[]>(scopeOptions.map((option) => option.id))
  const [environment, setEnvironment] = useState('Producción')
  const [mode, setMode] = useState<'Rápido' | 'Profundo'>('Profundo')
  const [selected, setSelected] = useState<CryptoAsset | null>(null)
  const pushedRef = useRef(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  const estimated = useMemo(
    () =>
      scopeOptions
        .filter((option) => scope.includes(option.id))
        .reduce((total, option) => total + option.count, 0),
    [scope],
  )

  const currentPhase = useMemo(
    () => phases.find((phase) => progress <= phase.until) ?? phases[phases.length - 1],
    [progress],
  )

  useEffect(() => {
    if (status !== 'running') return
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100
        const next = current + (current < 70 ? 2.2 : 1.4)
        return Math.min(100, next)
      })
    }, 110)
    return () => window.clearInterval(timer)
  }, [status])

  useEffect(() => {
    if (status !== 'running') return
    const pending = logScript.slice(pushedRef.current).filter((entry) => entry.at <= progress)
    if (pending.length === 0) return
    setLogs((current) => [...current, ...pending.map(({ text, tone }) => ({ text, tone }))])
    pushedRef.current += pending.length
  }, [progress, status])

  useEffect(() => {
    if (status !== 'running' || progress < 100) return
    setStatus('complete')
    toast('Descubrimiento completado', {
      detail: '1,284 componentes normalizados · 17 hallazgos críticos.',
    })
  }, [progress, status, toast])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const startScan = () => {
    if (scope.length === 0) {
      toast('Selecciona al menos una superficie', {
        detail: 'El motor necesita un objetivo para iniciar el descubrimiento.',
        tone: 'warning',
      })
      return
    }
    setStatus('running')
    setProgress(0)
    setLogs([])
    pushedRef.current = 0
  }

  const resetScan = () => {
    setStatus('idle')
    setProgress(0)
    setLogs([])
    pushedRef.current = 0
  }

  const toggleScope = (id: string) => {
    if (status === 'running') return
    setScope((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const completed = status === 'complete'

  return (
    <div className="animate-rise">
      <div className="flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Tag tone="acid">
              <LiveDot /> Engine v0.4.2
            </Tag>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim">
              Último descubrimiento: 14 nov 2026 · 08:42
            </span>
          </div>
          <h1 className="max-w-[720px] text-[clamp(2rem,3.2vw,3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-paper">
            Encuentra lo que no está <span className="text-muted">en el diagrama.</span>
          </h1>
          <p className="mt-4 max-w-[560px] text-[13px] leading-relaxed text-muted">
            El motor recorre endpoints, certificados, dependencias y contenedores. Normaliza cada
            hallazgo a un CBOM y descubre la criptografía que el equipo no sabía que tenía.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2">
          <ShieldCheck className="size-3.5 text-acid" />
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">
            Solo lectura · sin interceptar tráfico
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="overflow-hidden xl:col-span-8">
          <PanelHeader
            eyebrow="STDOUT · motor de descubrimiento"
            title={
              <span className="flex items-center gap-2">
                Consola
                <span className="font-mono text-[9px] font-normal uppercase tracking-[0.1em] text-dim">
                  {environment.toLowerCase()} / mx-central
                </span>
              </span>
            }
            action={
              <div className="flex items-center gap-2">
                {status === 'running' && (
                  <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-acid">
                    <LoaderCircle className="size-3 animate-spin" /> En curso
                  </span>
                )}
                {completed && (
                  <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-acid">
                    <CheckCircle2 className="size-3" /> Completado
                  </span>
                )}
                <span className="rounded border border-line bg-ink px-1.5 py-1 font-mono text-[9px] text-dim">
                  {completed ? '4m 12s' : status === 'running' ? `${Math.round(progress)}%` : 'listo'}
                </span>
              </div>
            }
          />

          <div className="relative">
            {status === 'running' && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px overflow-hidden">
                <div className="scan-line h-px w-full" />
              </div>
            )}

            <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-2">
              <div className="flex items-center gap-2">
                <Terminal className="size-3 text-dim" />
                <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-dim">
                  discovery.log
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
                <span>{logs.length} líneas</span>
                <span className={cn(status === 'running' ? 'text-acid' : 'text-dim')}>
                  {status === 'running' ? 'streaming' : 'stdout'}
                </span>
              </div>
            </div>

            <div
              ref={terminalRef}
              className="relative h-[340px] overflow-y-auto bg-[#070907] px-4 py-4 font-mono text-[10.5px] leading-[1.9] sm:px-5"
            >
              <div className="pointer-events-none absolute inset-0 dot-bg opacity-40" />
              <div className="relative space-y-0.5">
                {logs.length === 0 && (
                  <>
                    <p className="text-muted">
                      <span className="text-acid">$</span> ubiora discover --target {environment.toLowerCase()}/mx-central
                    </p>
                    <p className="text-dim">Motor listo. Selecciona la superficie y ejecuta el descubrimiento.</p>
                    <p className="text-dim">
                      Plugins: tls · x509 · sca · containers · secrets · cbom
                    </p>
                    <p className="mt-3 text-dim">
                      <span className="text-acid">›</span> Esperando instrucción
                      <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-acid align-middle" />
                    </p>
                  </>
                )}
                {logs.map((log, index) => (
                  <p
                    key={`${index}-${log.text}`}
                    className={cn(
                      'whitespace-pre-wrap break-words',
                      log.tone === 'ok'
                        ? 'text-acid/90'
                        : log.tone === 'warn'
                          ? 'text-warn'
                          : log.tone === 'dim'
                            ? 'text-dim'
                            : 'text-muted',
                    )}
                  >
                    <span className="mr-2 select-none text-[9px] text-dim/70">
                      {String(Math.floor((index * 16) / 60)).padStart(2, '0')}:
                      {String((index * 16) % 60).padStart(2, '0')}
                    </span>
                    {log.text.startsWith('ALERTA') && <span className="mr-1 text-warn">▲</span>}
                    {log.tone === 'ok' && !log.text.startsWith('ALERTA') && (
                      <span className="mr-1 text-acid">✓</span>
                    )}
                    {log.text}
                  </p>
                ))}
                {status === 'running' && (
                  <p className="text-dim">
                    <span className="text-acid">›</span> {currentPhase.label.toLowerCase()}…
                    <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-acid align-middle" />
                  </p>
                )}
                {completed && (
                  <p className="mt-2 text-acid">
                    ✓ Descubrimiento completado · CBOM actualizado · 1,284 componentes indexados
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-line px-4 py-4 sm:px-5">
            <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.08em]">
              <span className={status === 'running' ? 'text-acid' : 'text-dim'}>
                {completed ? 'Proceso completado' : status === 'running' ? currentPhase.label : 'Listo para iniciar'}
              </span>
              <span className="text-dim">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-acid transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
                <span>{environment}</span>
                <span>{mode}</span>
                <span>{estimated} objetivos estimados</span>
                <span>{scope.length} superficies</span>
              </div>
              {!completed && status !== 'running' && (
                <span className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
                  Configura el alcance y ejecuta el motor →
                </span>
              )}
              {status === 'running' && (
                <Button variant="secondary" size="sm" disabled icon={<LoaderCircle className="size-3 animate-spin" />}>
                  Escaneando
                </Button>
              )}
              {completed && (
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={resetScan} icon={<Radar className="size-3" />}>
                    Nuevo escaneo
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/inventario')}
                    icon={<ArrowRight className="size-3" />}
                  >
                    Ver inventario
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <Panel className="xl:col-span-4">
          <PanelHeader
            eyebrow="Configuración"
            title="Alcance del escaneo"
            action={<span className="font-mono text-[9px] text-dim">{estimated} objetivos</span>}
          />
          <div className="p-5">
            <p className="label mb-2.5">Entorno objetivo</p>
            <div className="grid grid-cols-2 gap-1.5">
              {['Producción', 'Core bancario', 'Staging', 'Desarrollo'].map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={status === 'running'}
                  onClick={() => setEnvironment(item)}
                  className={cn(
                    'flex h-8 items-center justify-between rounded-lg border px-2.5 text-left text-[10.5px] transition-colors disabled:opacity-50',
                    environment === item
                      ? 'border-acid/30 bg-acid/8 text-paper'
                      : 'border-line bg-ink text-muted hover:border-line-strong',
                  )}
                >
                  {item}
                  {environment === item && <Check className="size-3 text-acid" />}
                </button>
              ))}
            </div>

            <div className="my-5 hairline" />

            <div className="mb-2.5 flex items-center justify-between">
              <p className="label">Superficie</p>
              <button
                type="button"
                disabled={status === 'running'}
                onClick={() =>
                  setScope(
                    scope.length === scopeOptions.length ? [] : scopeOptions.map((option) => option.id),
                  )
                }
                className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim transition-colors hover:text-paper disabled:opacity-40"
              >
                {scope.length === scopeOptions.length ? 'Quitar todo' : 'Todo'}
              </button>
            </div>
            <div className="space-y-1">
              {scopeOptions.map((option) => {
                const Icon = option.icon
                const active = scope.includes(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={status === 'running'}
                    onClick={() => toggleScope(option.id)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors disabled:opacity-60',
                      active
                        ? 'border-line-strong bg-surface/70'
                        : 'border-transparent hover:border-line hover:bg-surface/40',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-6 shrink-0 place-items-center rounded-md border',
                        active
                          ? 'border-acid/20 bg-acid/8 text-acid'
                          : 'border-line bg-ink text-dim',
                      )}
                    >
                      <Icon className="size-3" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-[11px]', active ? 'text-paper' : 'text-muted')}>
                        {option.label}
                      </span>
                      <span className="block text-[9px] text-dim">{option.detail}</span>
                    </span>
                    <span className="font-mono text-[9px] text-dim">{option.count}</span>
                    <span
                      className={cn(
                        'grid size-3.5 place-items-center rounded border transition-colors',
                        active ? 'border-acid bg-acid text-ink' : 'border-line-strong',
                      )}
                    >
                      {active && <Check className="size-2.5" strokeWidth={3} />}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="my-5 hairline" />

            <p className="label mb-2.5">Profundidad</p>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Rápido', 'Profundo'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={status === 'running'}
                  onClick={() => setMode(item)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left transition-colors disabled:opacity-50',
                    mode === item
                      ? 'border-acid/30 bg-acid/8'
                      : 'border-line bg-ink hover:border-line-strong',
                  )}
                >
                  <span className={cn('block text-[11px]', mode === item ? 'text-paper' : 'text-muted')}>
                    {item}
                  </span>
                  <span className="mt-0.5 block font-mono text-[8.5px] uppercase tracking-[0.06em] text-dim">
                    {item === 'Rápido' ? '~90 seg' : '~4 min'}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-line bg-ink-raised p-3">
              <div className="flex items-start gap-2">
                <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-acid" />
                <p className="text-[10px] leading-relaxed text-dim">
                  El motor solo lee configuración y metadatos. No descarga llaves privadas ni
                  intercepta tráfico productivo.
                </p>
              </div>
            </div>

            {status === 'idle' && (
              <Button
                variant="primary"
                className="mt-4 w-full"
                icon={<Play className="size-3.5" />}
                onClick={startScan}
              >
                Iniciar descubrimiento
              </Button>
            )}
            {status === 'running' && (
              <div className="mt-4">
                <div className="flex items-center justify-between font-mono text-[9px] text-dim">
                  <span>{currentPhase.label}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-acid transition-[width] duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {completed && (
              <div className="mt-4 rounded-lg border border-acid/25 bg-acid/8 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-acid" />
                  <p className="text-[11.5px] text-paper">Descubrimiento completado</p>
                </div>
                <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.06em] text-dim">
                  1,284 componentes · 17 críticos
                </p>
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Componentes', value: completed ? '1,284' : formatNumber(stats.total), icon: CircleDot },
          { label: 'Críticos', value: completed ? '17' : '—', icon: ShieldCheck },
          { label: 'Perfil híbrido', value: completed ? '142' : '—', icon: Network },
          { label: 'Duración', value: completed ? '4m 12s' : '—', icon: Clock3 },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="panel flex items-center gap-3 px-4 py-3.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface">
                <Icon className="size-3.5 text-muted" />
              </span>
              <div>
                <p className="tabular text-[18px] font-medium leading-none tracking-[-0.04em] text-paper">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
                  {stat.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {completed && (
        <Panel className="mt-4 animate-rise">
          <PanelHeader
            eyebrow="Resultado de esta ejecución"
            title="Hallazgos que requieren una decisión"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/inventario?riesgo=Cr%C3%ADtico')}
                iconRight={<ChevronRight className="size-3.5" />}
              >
                Ver los 17 críticos
              </Button>
            }
          />
          <RiskTable assets={assets.slice(0, 5)} onSelect={setSelected} />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <RiskBadge level="Crítico" />
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-dim">
                5 nuevos hallazgos desde el último escaneo
              </span>
            </div>
            <p className="font-mono text-[9px] text-dim">CBOM actualizado · 14 nov 2026 09:12</p>
          </div>
        </Panel>
      )}

      <RiskDrawer asset={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

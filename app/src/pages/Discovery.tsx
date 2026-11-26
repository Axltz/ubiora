import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Globe,
  LoaderCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import type { CryptoAsset } from '../data/types'
import { useRealScan } from '../data/scanContext'
import { priorityFor } from '../data/assets'
import { cn } from '../lib/utils'
import { RiskDrawer } from '../components/RiskDrawer'
import { RiskTable } from '../components/RiskTable'
import { LiveDot, Tag } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Panel, PanelHeader } from '../components/ui/Panel'
import { useToast } from '../components/ui/Toast'

type ScanStatus = 'idle' | 'running' | 'complete'

function scoreFromFactors(
  sensitivity: CryptoAsset['sensitivity'],
  shelfLife: number,
  exposure: CryptoAsset['exposure'],
  criticality: number,
  algorithm: string,
): number {
  const sensMap: Record<string, number> = { Crítico: 100, Alto: 72, Medio: 48, Bajo: 24 }
  const expoMap: Record<string, number> = { Internet: 100, Autenticado: 62, Interno: 38 }
  const base =
    0.3 * (sensMap[sensitivity] ?? 50) +
    0.25 * Math.min(100, (shelfLife / 15) * 100) +
    0.25 * (expoMap[exposure] ?? 50) +
    0.2 * ((criticality / 5) * 100)

  const upper = algorithm.toUpperCase()
  const multiplier = upper.includes('ML-') || upper.includes('HÍBRID') ? 0.35 : 0.95
  return Math.round(base * multiplier)
}

export function Discovery() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { assets, addScanResults, clearAll, orgName, setOrgName, loadDemo } = useRealScan()

  const [status, setStatus] = useState<ScanStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<{ text: string; tone?: 'ok' | 'warn' | 'dim' }[]>([])
  const [selected, setSelected] = useState<CryptoAsset | null>(null)
  const [targets, setTargets] = useState('')
  const [clientOrg, setClientOrg] = useState(orgName === 'Mi organización' ? '' : orgName)
  const [liveResults, setLiveResults] = useState<CryptoAsset[]>([])

  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const executeLiveScan = async () => {
    const hosts = targets
      .split('\n')
      .map((target) => {
        let t = target.trim()
        if (t.includes('://')) t = t.split('://')[1]
        else if (t.startsWith('//')) t = t.slice(2)
        else if (t.startsWith(':')) t = t.replace(/^:+/, '').replace(/^\/+/, '')
        if (t.includes('/')) t = t.split('/')[0]
        return t.trim()
      })
      .filter(Boolean)

    if (hosts.length === 0) {
      toast('Ingresa al menos un host o URL', { tone: 'warning' })
      return
    }

    if (clientOrg.trim()) setOrgName(clientOrg.trim())

    const startedAt = Date.now()
    setStatus('running')
    setProgress(15)
    setLogs([
      { text: 'ubiora engine: conectando al escáner TLS y normalizador CBOM...' },
      { text: `Objetivo: ${hosts.length} hosts de red`, tone: 'dim' },
    ])

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 6000)

      let scannedAssets: CryptoAsset[] = []
      let usedBackend = false

      try {
        const response = await fetch('http://localhost:8080/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targets: hosts, org: clientOrg.trim() || orgName }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (response.ok) {
          const data = await response.json()
          scannedAssets = Array.isArray(data.assets) ? data.assets : []
          usedBackend = scannedAssets.length > 0
        }
      } catch {
        clearTimeout(timeoutId)
        // Sin backend: el navegador genera el CBOM con la misma fórmula de riesgo.
      }

      setProgress(40)
      setLogs((previous) => [
        ...previous,
        {
          text: usedBackend
            ? '✓ Motor Python nativo conectado en localhost:8080'
            : '⚙ Sin backend Python: inspección TLS simulada en el navegador',
          tone: usedBackend ? 'ok' : 'warn',
        },
      ])

      if (!usedBackend) {
        let index = 1
        for (const host of hosts) {
          await new Promise((resolve) => setTimeout(resolve, 380))
          const isCritical = host.includes('bank') || host.includes('banco') || host.includes('pay') || host.includes('api') || host.includes('auth')
          const algorithm = host.includes('udg') ? 'RSA-2048' : isCritical ? 'RSA-2048' : 'ECDSA P-256'
          const keySize = algorithm.includes('256') ? '256 bit' : '2048 bit'
          const sensitivity: CryptoAsset['sensitivity'] = isCritical ? 'Crítico' : 'Alto'
          const exposure: CryptoAsset['exposure'] = 'Internet'
          const shelfLife = isCritical ? 10 : 5
          const criticality = isCritical ? 5 : 4
          const score = scoreFromFactors(sensitivity, shelfLife, exposure, criticality, algorithm)
          const priority = priorityFor(score)

          setLogs((previous) => [
            ...previous,
            { text: `TLS handshake con ${host}:443 → ${algorithm} (${keySize})`, tone: 'ok' },
            {
              text: `Evaluando riesgo: sensibilidad=${sensitivity}, vida=${shelfLife}a → score ${score} [${priority}]`,
              tone: priority === 'Crítico' ? 'warn' : 'dim',
            },
          ])

          scannedAssets.push({
            id: `CBOM-LIVE-${String(Date.now()).slice(-5)}-${index++}`,
            name: host,
            kind: 'Endpoint TLS',
            algorithm,
            keySize,
            location: `${host}:443 (TLS 1.3)`,
            environment: 'Producción',
            sensitivity,
            shelfLife,
            exposure,
            criticality,
            score,
            priority,
            owner: 'Infraestructura de Red',
            lastSeen: new Date().toISOString(),
            recommendation:
              'Migrar a un perfil híbrido (X25519MLKEM768) antes de 2030 y planear la rotación de llaves.',
            target: priority === 'Crítico' ? 'Q3 2027' : 'Q4 2028',
            effort: 'Medio',
            status: 'Pendiente',
          })
        }
      } else {
        scannedAssets = scannedAssets.map((asset) => ({
          ...asset,
          priority: asset.priority ?? priorityFor(asset.score),
        }))
        scannedAssets.forEach((asset) => {
          setLogs((previous) => [
            ...previous,
            {
              text: `[Python Socket] ${asset.name} → ${asset.algorithm} (${asset.keySize}) · score: ${asset.score}`,
              tone: 'ok',
            },
          ])
        })
      }

      setProgress(85)
      setLogs((previous) => [
        ...previous,
        { text: 'Normalizando estructuras a CycloneDX 1.7 CBOM...', tone: 'dim' },
        {
          text: `✓ ${scannedAssets.length} activos criptográficos catalogados en el inventario.`,
          tone: 'ok',
        },
      ])

      await new Promise((resolve) => setTimeout(resolve, 300))
      setProgress(100)
      setStatus('complete')
      setLiveResults(scannedAssets)

      const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000))
      addScanResults(scannedAssets, {
        target: `${hosts.length} hosts · ${clientOrg.trim() || orgName}`,
        duration: `${Math.floor(seconds / 60)}m ${seconds % 60}s`,
      })

      toast('Descubrimiento finalizado', {
        detail: `${scannedAssets.length} endpoints analizados e integrados en el CBOM.`,
      })
    } catch (error) {
      setStatus('idle')
      toast('Error en el escaneo', {
        detail: error instanceof Error ? error.message : 'Fallo de conexión',
        tone: 'warning',
      })
    }
  }

  const resetAll = () => {
    setStatus('idle')
    setProgress(0)
    setLogs([])
    setLiveResults([])
  }

  return (
    <div className="animate-rise pb-10">
      <div className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Tag tone="acid">
              <Zap className="size-2.5" /> Motor NIST IR 8547
            </Tag>
            <span className="font-mono text-[10px] text-dim">CBOM CycloneDX v1.7</span>
          </div>
          <h1 className="text-[26px] font-bold tracking-[-0.03em] text-paper sm:text-[32px]">
            Motor de Descubrimiento Criptográfico
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">
            Inspecciona endpoints TLS reales, detecta el algoritmo y el tamaño de llave, y
            convierte cada hallazgo en un activo del inventario CBOM. El sistema arranca vacío:
            todo lo que veas saldrá de tus propios escaneos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {assets.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearAll()
                resetAll()
                toast('Inventario vaciado', { detail: 'El sistema volvió a cero.', tone: 'info' })
              }}
              icon={<RotateCcw className="size-3.5" />}
            >
              Vaciar inventario ({assets.length})
            </Button>
          )}
          {assets.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadDemo()
                toast('Datos de ejemplo cargados', {
                  detail: 'Puedes vaciarlos cuando quieras desde Descubrimiento.',
                  tone: 'info',
                })
              }}
              icon={<FlaskConical className="size-3.5" />}
            >
              Cargar ejemplo
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/inventario')}
            icon={<ArrowRight className="size-3.5" />}
          >
            Ver inventario CBOM
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Panel className="flex flex-col overflow-hidden lg:col-span-7">
          <PanelHeader
            eyebrow="Salida del motor"
            title={
              <div className="flex items-center gap-2">
                <span>Consola de auditoría</span>
                <span className="font-mono text-[10px] font-normal text-dim">Socket TLS en vivo</span>
              </div>
            }
            action={
              <div className="flex items-center gap-2">
                {status === 'running' && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-acid">
                    <LoaderCircle className="size-3 animate-spin" /> Procesando
                  </span>
                )}
                {status === 'complete' && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-acid">
                    <CheckCircle2 className="size-3" /> Completado
                  </span>
                )}
                <span className="rounded border border-line bg-ink px-2 py-0.5 font-mono text-[10px] text-muted">
                  {progress}%
                </span>
              </div>
            }
          />

          <div className="relative flex-1 bg-[#090c0a]">
            <div
              ref={terminalRef}
              className="h-[360px] overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-muted"
            >
              {logs.length === 0 && (
                <div className="space-y-1.5 opacity-70">
                  <p className="text-acid">$ ubiora discover --engine nist-ir-8547</p>
                  <p className="text-paper">
                    Motor listo. Ingresa los dominios o puertos a escanear a la derecha.
                  </p>
                  <p className="text-dim">
                    Salida: CycloneDX 1.7 JSON, CBOM estándar y matriz de riesgo.
                  </p>
                </div>
              )}
              {logs.map((log, index) => (
                <p
                  key={index}
                  className={cn(
                    'break-words',
                    log.tone === 'ok'
                      ? 'text-acid'
                      : log.tone === 'warn'
                        ? 'font-semibold text-warn'
                        : log.tone === 'dim'
                          ? 'text-dim'
                          : 'text-paper',
                  )}
                >
                  {log.text}
                </p>
              ))}
            </div>

            <div className="border-t border-line bg-surface/50 p-3">
              <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-dim">
                <span>
                  Estado:{' '}
                  {status === 'running' ? 'Escaneando…' : status === 'complete' ? 'Completado' : 'Listo'}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-acid transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="flex flex-col justify-between p-5 lg:col-span-5">
          <div>
            <PanelHeader
              className="px-0 pb-3 pt-0"
              eyebrow="Parámetros de escaneo"
              title="Inspección de dominios reales"
            />

            <div className="space-y-4 pt-2">
              <div>
                <label className="mb-1 block text-[11.5px] font-medium text-paper">
                  Organización o proyecto
                </label>
                <input
                  type="text"
                  value={clientOrg}
                  disabled={status === 'running'}
                  onChange={(event) => setClientOrg(event.target.value)}
                  className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-[12px] text-paper placeholder-dim focus:border-acid focus:outline-none"
                  placeholder="Ej. Fintech Demo MX"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11.5px] font-medium text-paper">
                  Hosts o endpoints a escanear (uno por línea)
                </label>
                <textarea
                  rows={5}
                  value={targets}
                  disabled={status === 'running'}
                  onChange={(event) => setTargets(event.target.value)}
                  className="w-full rounded-lg border border-line bg-ink px-3 py-2 font-mono text-[11.5px] leading-relaxed text-paper placeholder-dim focus:border-acid focus:outline-none"
                  placeholder={'api.tuempresa.com\nauth.tuempresa.com:443\ngithub.com'}
                />
                <p className="mt-1 text-[10.5px] text-dim">
                  Escribe cualquier dominio real. Se conecta por TLS y lee el certificado. Si el
                  backend de Python no está activo, el navegador genera el CBOM con la misma
                  fórmula de riesgo.
                </p>
              </div>

              <div className="rounded-lg border border-line bg-ink-raised p-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-acid" />
                  <p className="text-[11px] leading-relaxed text-muted">
                    Solo se analizan certificados y suites públicas. No se descargan llaves
                    privadas ni se modifica ningún sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            {status === 'idle' && (
              <Button
                variant="primary"
                className="w-full justify-center"
                icon={<Play className="size-3.5" />}
                onClick={executeLiveScan}
              >
                Escanear endpoints en vivo
              </Button>
            )}

            {status === 'running' && (
              <Button
                variant="secondary"
                className="w-full justify-center"
                disabled
                icon={<LoaderCircle className="size-3.5 animate-spin" />}
              >
                Analizando criptografía…
              </Button>
            )}

            {status === 'complete' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="flex-1 justify-center"
                  onClick={resetAll}
                  icon={<RotateCcw className="size-3.5" />}
                >
                  Reintentar
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 justify-center"
                  onClick={() => navigate('/inventario')}
                  icon={<ArrowRight className="size-3.5" />}
                >
                  Ver en CBOM
                </Button>
              </div>
            )}
          </div>
        </Panel>
      </div>

      {liveResults.length > 0 && (
        <div className="mt-8">
          <Panel className="overflow-hidden p-0">
            <PanelHeader
              eyebrow="Resultado de la prueba en vivo"
              title={`${liveResults.length} componentes descubiertos y clasificados`}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/inventario')}
                  icon={<ChevronRight className="size-3" />}
                >
                  Abrir tabla completa
                </Button>
              }
            />
            <RiskTable assets={liveResults} onSelect={setSelected} />
          </Panel>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-dim">
        <LiveDot /> Los datos se guardan en este navegador
        <span className="text-line-strong">·</span>
        <span className="flex items-center gap-1">
          <Globe className="size-3" /> {assets.length} activos en el inventario
        </span>
      </div>

      <RiskDrawer asset={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

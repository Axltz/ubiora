import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Clipboard, Clock, Copy, Database, ShieldAlert, X } from 'lucide-react'
import type { CryptoAsset } from '../data/types'
import { formatDate } from '../lib/utils'
import { RiskBadge, Tag } from './ui/Badge'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'

const sensitivityWeight = { Crítico: 100, Alto: 72, Medio: 48, Bajo: 24 } as const
const exposureWeight = { Internet: 100, Autenticado: 62, Interno: 38 } as const

export function RiskDrawer({
  asset,
  onClose,
}: {
  asset: CryptoAsset | null
  onClose: () => void
}) {
  const { toast } = useToast()

  useEffect(() => {
    if (!asset) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [asset, onClose])

  if (!asset) return null

  const factors = [
    { label: 'Sensibilidad del dato', value: sensitivityWeight[asset.sensitivity], weight: '30%' },
    { label: 'Vida útil', value: Math.min(100, Math.round((asset.shelfLife / 15) * 100)), weight: '25%' },
    { label: 'Exposición', value: exposureWeight[asset.exposure], weight: '25%' },
    { label: 'Criticidad operativa', value: Math.round((asset.criticality / 5) * 100), weight: '20%' },
  ]

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(asset.id)
      toast('ID copiado', { detail: `${asset.id} está en el portapapeles.`, tone: 'info' })
    } catch {
      toast('No se pudo copiar', { detail: 'El navegador bloqueó el acceso al portapapeles.', tone: 'warning' })
    }
  }

  return createPortal(
    <div className="no-print fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Cerrar detalle"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[500px] flex-col border-l border-line-strong bg-ink-raised shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.8)] animate-slide-in">
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-5">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">{asset.id}</span>
              <Tag tone={asset.status === 'Mitigado' ? 'acid' : asset.status === 'En migración' ? 'sky' : 'neutral'}>
                {asset.status}
              </Tag>
            </div>
            <h2 className="truncate font-mono text-[16px] tracking-[-0.02em] text-paper">{asset.name}</h2>
            <p className="mt-1 text-[11.5px] text-muted">
              {asset.kind} · {asset.environment} · {asset.owner}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-paper"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[140px_1fr] gap-5 border-b border-line px-5 py-5">
            <div className="flex flex-col justify-center">
              <p className="tabular text-[40px] font-medium leading-none tracking-[-0.06em] text-paper">
                {asset.score}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                Risk score / 100
              </p>
              <div className="mt-3">
                <RiskBadge level={asset.priority} />
              </div>
            </div>
            <div className="space-y-3">
              {factors.map((factor) => (
                <div key={factor.label}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10.5px] text-muted">{factor.label}</span>
                    <span className="font-mono text-[9px] text-dim">{factor.weight}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-acid/75"
                      style={{ width: `${factor.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section className="border-b border-line px-5 py-5">
            <p className="label mb-3">Ficha criptográfica</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                ['Algoritmo', asset.algorithm],
                ['Tamaño de llave', asset.keySize],
                ['Exposición', asset.exposure],
                ['Sensibilidad', asset.sensitivity],
                ['Vida útil', `${asset.shelfLife} años`],
                ['Criticidad', `${asset.criticality} / 5`],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-dim">{label}</dt>
                  <dd className="mt-1 text-[12px] text-paper">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-line bg-panel px-3 py-2.5">
              <Database className="mt-0.5 size-3.5 shrink-0 text-dim" />
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-dim">Ubicación</p>
                <p className="mt-0.5 truncate font-mono text-[10.5px] text-muted">{asset.location}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 px-1 text-[10px] text-dim">
              <Clock className="size-3" />
              Última observación: {formatDate(asset.lastSeen, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
          </section>

          <section className="border-b border-line px-5 py-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldAlert className="size-3.5 text-warn" />
              <p className="label !text-warn">Recomendación de migración</p>
            </div>
            <p className="text-[12px] leading-relaxed text-muted">{asset.recommendation}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="panel-inset px-3 py-2.5">
                <p className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">Objetivo</p>
                <p className="mt-1 text-[11.5px] text-paper">{asset.target}</p>
              </div>
              <div className="panel-inset px-3 py-2.5">
                <p className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">Esfuerzo</p>
                <p className="mt-1 text-[11.5px] text-paper">{asset.effort}</p>
              </div>
              <div className="panel-inset px-3 py-2.5">
                <p className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">Prioridad</p>
                <p className="mt-1 text-[11.5px] text-paper">{asset.priority}</p>
              </div>
            </div>
          </section>

          <section className="px-5 py-5">
            <p className="label mb-2">Trazabilidad</p>
            <button
              type="button"
              onClick={copyId}
              className="flex w-full items-center justify-between rounded-lg border border-line bg-panel px-3 py-2.5 text-left transition-colors hover:border-line-strong"
            >
              <span className="flex items-center gap-2 font-mono text-[10.5px] text-muted">
                <Clipboard className="size-3.5 text-dim" />
                {asset.id} · CycloneDX 1.7
              </span>
              <Copy className="size-3.5 text-dim" />
            </button>
            <p className="mt-3 text-[10px] leading-relaxed text-dim">
              Este activo fue detectado por el motor de descubrimiento y normalizado al CBOM. La
              evidencia incluye configuración TLS, certificado y dependencia de librería.
            </p>
          </section>
        </div>

        <footer className="flex items-center gap-2 border-t border-line bg-panel px-5 py-4">
          <Button
            variant="primary"
            className="flex-1"
            icon={<ArrowUpRight className="size-3.5" />}
            onClick={() =>
              toast('Activo añadido a la hoja de ruta', {
                detail: `${asset.name} se incluyó en la ventana ${asset.target}.`,
              })
            }
          >
            Añadir a la hoja de ruta
          </Button>
          <Button variant="secondary" onClick={copyId} icon={<Copy className="size-3.5" />}>
            Copiar ID
          </Button>
        </footer>
      </aside>
    </div>,
    document.body,
  )
}

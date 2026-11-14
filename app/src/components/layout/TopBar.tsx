import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, ChevronRight, Menu, Search } from 'lucide-react'
import { pageMeta } from '../../lib/navigation'
import { useCommandPalette } from '../ui/CommandPalette'
import { LiveDot } from '../ui/Badge'

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const location = useLocation()
  const meta = pageMeta[location.pathname] ?? { title: 'UBIORA', eyebrow: '' }
  const { open } = useCommandPalette()
  const [alertsOpen, setAlertsOpen] = useState(false)
  const alertsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!alertsOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (!alertsRef.current?.contains(event.target as Node)) setAlertsOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [alertsOpen])

  return (
    <header className="no-print sticky top-0 z-30 flex h-[58px] items-center justify-between gap-4 border-b border-line bg-ink/85 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-paper lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-4" />
        </button>
        <div className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-dim sm:flex">
          <span>Cobalto Pay</span>
          <ChevronRight className="size-3" />
          <span className="text-muted">{meta.title}</span>
        </div>
        <span className="truncate text-[12px] font-medium text-muted sm:hidden">{meta.title}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-1 hidden items-center gap-2 rounded-full border border-line bg-panel px-2.5 py-1 md:flex">
          <LiveDot />
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            Scan engine · live
          </span>
        </div>

        <button
          type="button"
          onClick={open}
          className="group flex h-8 items-center gap-2 rounded-lg border border-line bg-panel px-2.5 text-muted transition-colors hover:border-line-strong hover:text-paper"
        >
          <Search className="size-3.5" />
          <span className="hidden text-[11.5px] sm:block">Buscar</span>
          <kbd className="ml-2 hidden rounded border border-line bg-ink px-1.5 py-0.5 font-mono text-[9px] text-dim sm:block">
            ⌘K
          </kbd>
        </button>

        <div ref={alertsRef} className="relative">
          <button
            type="button"
            onClick={() => setAlertsOpen((current) => !current)}
            className="relative grid size-8 place-items-center rounded-lg border border-line bg-panel text-muted transition-colors hover:border-line-strong hover:text-paper"
            aria-label="Alertas"
            aria-expanded={alertsOpen}
          >
            <Bell className="size-3.5" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-danger ring-2 ring-panel" />
          </button>

          {alertsOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] overflow-hidden rounded-xl border border-line-strong bg-panel shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="label">Alertas</span>
                <span className="rounded-full border border-danger/25 bg-danger/10 px-1.5 py-0.5 font-mono text-[9px] text-danger">
                  3 nuevas
                </span>
              </div>
              <div className="divide-y divide-line">
                {[
                  {
                    title: 'Nuevo certificado RSA-2048 en producción',
                    detail: 'api.cobalto.mx · hace 2 h',
                    tone: 'bg-danger',
                  },
                  {
                    title: 'Dependencia con SHA-1 detectada',
                    detail: 'kyc-pipeline · hace 5 h',
                    tone: 'bg-warn',
                  },
                  {
                    title: 'Escaneo trimestral completado',
                    detail: '42 endpoints · ayer',
                    tone: 'bg-acid',
                  },
                ].map((alert) => (
                  <div key={alert.title} className="flex gap-3 px-4 py-3">
                    <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${alert.tone}`} />
                    <div>
                      <p className="text-[11.5px] leading-snug text-paper">{alert.title}</p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-dim">
                        {alert.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-full border-t border-line bg-ink-raised px-4 py-2.5 text-left text-[11px] text-muted transition-colors hover:text-paper"
              >
                Ver todas las alertas
              </button>
            </div>
          )}
        </div>

        <div className="ml-1 flex items-center gap-2.5 border-l border-line pl-3">
          <span className="relative grid size-7 place-items-center rounded-full border border-line-strong bg-surface font-mono text-[9px] text-paper">
            CF
            <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-ink bg-acid" />
          </span>
          <div className="hidden xl:block">
            <p className="text-[11.5px] leading-none text-paper">Carlos Rivera</p>
            <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
              Cobalto Pay
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

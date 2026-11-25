import { NavLink } from 'react-router-dom'
import { CircleHelp, Command, Settings, ShieldCheck, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { navSections } from '../../lib/navigation'
import { useTour } from '../tour/ProductTour'
import { Logo } from '../brand/Logo'
import { LiveDot } from '../ui/Badge'
import { useCommandPalette } from '../ui/CommandPalette'
import { useRealScan } from '../../data/scanContext'

export function Sidebar({
  onNavigate,
  onClose,
  mobile = false,
}: {
  onNavigate?: () => void
  onClose?: () => void
  mobile?: boolean
}) {
  const { open: openCommand } = useCommandPalette()
  const { start: startTour } = useTour()
  const { orgName, assets, scans, isDemo } = useRealScan()

  const initials =
    orgName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'UB'

  return (
    <div className="flex h-full flex-col bg-ink-raised">
      <div className="flex h-[68px] items-center justify-between px-5">
        <NavLink to="/" onClick={onNavigate} aria-label="Ir al resumen">
          <Logo />
        </NavLink>
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-paper"
            aria-label="Cerrar menú"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="px-3">
        <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-line bg-panel px-2.5 py-2 text-left">
          <span className="grid size-7 shrink-0 place-items-center rounded-md border border-line-strong bg-surface font-mono text-[10px] text-paper">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium text-paper">{orgName}</span>
            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.1em] text-dim">
              {isDemo ? 'Datos de ejemplo' : assets.length > 0 ? 'Inventario propio' : 'Sin inventario'}
            </span>
          </span>
        </div>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto px-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <p className="label px-2.5 pb-2">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] transition-all duration-150',
                        isActive
                          ? 'bg-surface text-paper'
                          : 'text-muted hover:bg-surface/60 hover:text-paper',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            'absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-acid transition-opacity',
                            isActive ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <Icon
                          className={cn(
                            'size-4 shrink-0 transition-colors',
                            isActive ? 'text-acid' : 'text-dim group-hover:text-muted',
                          )}
                          strokeWidth={1.8}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line px-3 py-3">
        <div className="mb-3 rounded-[10px] border border-line bg-panel p-3">
          <div className="flex items-center justify-between">
            <span className="label">Motor de escaneo</span>
            <LiveDot />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-acid" strokeWidth={1.8} />
            <span className="text-[11.5px] text-paper">
              {scans.length > 0 ? 'Operativo' : 'En espera'}
            </span>
            <span className="ml-auto font-mono text-[9px] text-dim">
              {scans.length > 0 ? `${scans.length} escaneos` : 'sin escaneos'}
            </span>
          </div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-acid/70 transition-all"
              style={{ width: assets.length > 0 ? '72%' : '0%' }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">
            {assets.length.toLocaleString('es-MX')} activos indexados
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            openCommand()
            onNavigate?.()
          }}
          className="mb-2 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] text-muted transition-colors hover:bg-surface hover:text-paper"
        >
          <Command className="size-4 text-dim" strokeWidth={1.8} />
          <span className="flex-1 text-left">Búsqueda rápida</span>
          <kbd className="rounded border border-line bg-ink px-1.5 py-0.5 font-mono text-[8.5px] text-dim">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-1">
          <NavLink
            to="/descubrimiento"
            onClick={onNavigate}
            className="flex flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] text-muted transition-colors hover:bg-surface hover:text-paper"
          >
            <Settings className="size-4 text-dim" strokeWidth={1.8} />
            Configurar escaneo
          </NavLink>
          <button
            type="button"
            onClick={() => {
              startTour()
              onNavigate?.()
            }}
            className="grid size-8 place-items-center rounded-lg text-dim transition-colors hover:bg-surface hover:text-paper"
            aria-label="Iniciar recorrido guiado"
            title="Recorrido guiado"
          >
            <CircleHelp className="size-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2.5 border-t border-line pt-3">
          <span className="grid size-7 place-items-center rounded-full border border-line-strong bg-surface font-mono text-[9px] text-paper">
            UB
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11.5px] text-paper">Equipo UBIORA</span>
            <span className="block font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
              Analista de seguridad
            </span>
          </span>
          <span className="size-1.5 rounded-full bg-acid" />
        </div>
        <p className="mt-3 px-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-dim/70">
          UBIORA v0.5 · MVP
        </p>
      </div>
    </div>
  )
}

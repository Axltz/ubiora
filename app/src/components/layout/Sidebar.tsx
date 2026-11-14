import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Check,
  ChevronsUpDown,
  CircleHelp,
  Command,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { navSections } from '../../lib/navigation'
import { Logo } from '../brand/Logo'
import { LiveDot } from '../ui/Badge'
import { useCommandPalette } from '../ui/CommandPalette'

const workspaces = [
  { name: 'Cobalto Pay', detail: 'Producción · MX', initials: 'CP' },
  { name: 'Cobalto Pay', detail: 'Staging · MX', initials: 'CP' },
  { name: 'Aureo Capital', detail: 'Sandbox · MX', initials: 'AC' },
]

export function Sidebar({
  onNavigate,
  onClose,
  mobile = false,
}: {
  onNavigate?: () => void
  onClose?: () => void
  mobile?: boolean
}) {
  const [workspace, setWorkspace] = useState(workspaces[0])
  const [open, setOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)
  const { open: openCommand } = useCommandPalette()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [open])

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
        <div ref={switcherRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            className="flex w-full items-center gap-2.5 rounded-[10px] border border-line bg-panel px-2.5 py-2 text-left transition-colors hover:border-line-strong hover:bg-surface"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-md border border-line-strong bg-surface font-mono text-[10px] text-paper">
              {workspace.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-medium text-paper">
                {workspace.name}
              </span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.1em] text-dim">
                {workspace.detail}
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-dim" />
          </button>

          {open && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-[10px] border border-line-strong bg-panel p-1 shadow-2xl shadow-black/50">
              {workspaces.map((item) => (
                <button
                  key={`${item.name}-${item.detail}`}
                  type="button"
                  onClick={() => {
                    setWorkspace(item)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-surface"
                >
                  <span className="grid size-6 place-items-center rounded border border-line bg-ink font-mono text-[9px] text-muted">
                    {item.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] text-paper">{item.name}</span>
                    <span className="block font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">
                      {item.detail}
                    </span>
                  </span>
                  {workspace.detail === item.detail && <Check className="size-3 text-acid" />}
                </button>
              ))}
            </div>
          )}
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
                        {item.badge && (
                          <span className="rounded border border-line bg-ink px-1.5 py-0.5 font-mono text-[8.5px] text-dim">
                            {item.badge}
                          </span>
                        )}
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
            <span className="text-[11.5px] text-paper">Operativo</span>
            <span className="ml-auto font-mono text-[9px] text-dim">hace 4 h</span>
          </div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-line">
            <div className="h-full w-[72%] rounded-full bg-acid/70" />
          </div>
          <p className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">
            1,284 activos indexados
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
          <button
            type="button"
            className="flex flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] text-muted transition-colors hover:bg-surface hover:text-paper"
          >
            <Settings className="size-4 text-dim" strokeWidth={1.8} />
            Ajustes
          </button>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-lg text-dim transition-colors hover:bg-surface hover:text-paper"
            aria-label="Ayuda"
          >
            <CircleHelp className="size-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2.5 border-t border-line pt-3">
          <span className="grid size-7 place-items-center rounded-full border border-line-strong bg-surface font-mono text-[9px] text-paper">
            CF
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11.5px] text-paper">Carlos Rivera</span>
            <span className="block font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
              Director de seguridad
            </span>
          </span>
          <span className="size-1.5 rounded-full bg-acid" />
        </div>
        <p className="mt-3 px-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-dim/70">
          UBIORA v0.4.2 · pilot
        </p>
      </div>
    </div>
  )
}

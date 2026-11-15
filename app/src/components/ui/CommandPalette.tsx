import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  Gauge,
  PackageSearch,
  Play,
  Radar,
  Route,
  Search,
  ShieldAlert,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTour } from '../tour/ProductTour'
import { useToast } from './Toast'

type Command = {
  id: string
  label: string
  hint?: string
  group: 'Navegación' | 'Acciones'
  icon: typeof Gauge
  keywords?: string
  action: () => void
}

type CommandPaletteContextValue = {
  open: () => void
  close: () => void
  toggle: () => void
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null)

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { start: startTour } = useTour()

  const open = useCallback(() => {
    setQuery('')
    setSelected(0)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])

  const commands = useMemo<Command[]>(
    () => [
      {
        id: 'overview',
        label: 'Ir al resumen de exposición',
        hint: 'Overview',
        group: 'Navegación',
        icon: Gauge,
        keywords: 'dashboard inicio postura',
        action: () => navigate('/'),
      },
      {
        id: 'discovery',
        label: 'Ejecutar un descubrimiento',
        hint: 'Escanear',
        group: 'Acciones',
        icon: Radar,
        keywords: 'scan escaner nuevo',
        action: () => navigate('/descubrimiento'),
      },
      {
        id: 'inventory',
        label: 'Abrir inventario CBOM',
        hint: 'Activos',
        group: 'Navegación',
        icon: PackageSearch,
        keywords: 'cbom activos inventario',
        action: () => navigate('/inventario'),
      },
      {
        id: 'critical',
        label: 'Ver hallazgos críticos',
        hint: 'Riesgo',
        group: 'Acciones',
        icon: ShieldAlert,
        keywords: 'critico riesgo filtro',
        action: () => navigate('/inventario?riesgo=Cr%C3%ADtico'),
      },
      {
        id: 'roadmap',
        label: 'Consultar la hoja de ruta',
        hint: 'Plan',
        group: 'Navegación',
        icon: Route,
        keywords: 'migracion pqc plan',
        action: () => navigate('/hoja-de-ruta'),
      },
      {
        id: 'report',
        label: 'Abrir informe ejecutivo',
        hint: 'Board brief',
        group: 'Navegación',
        icon: FileText,
        keywords: 'reporte pdf consejo',
        action: () => navigate('/informe'),
      },
      {
        id: 'guide',
        label: '¿Cómo funciona UBIORA?',
        hint: 'Guía',
        group: 'Navegación',
        icon: BookOpen,
        keywords: 'ayuda explicacion guia entender producto',
        action: () => navigate('/como-funciona'),
      },
      {
        id: 'tour',
        label: 'Iniciar el recorrido guiado',
        hint: '3 min',
        group: 'Acciones',
        icon: Play,
        keywords: 'tour tutorial recorrido guiado ayuda',
        action: () => startTour(),
      },
      {
        id: 'export',
        label: 'Exportar CBOM en CycloneDX',
        hint: 'JSON',
        group: 'Acciones',
        icon: Download,
        keywords: 'exportar json cyclonedx',
        action: () =>
          toast('CBOM exportado', {
            detail: 'Se generó cobalto-pay-cbom-2026-11-14.json con 1,284 componentes.',
          }),
      },
    ],
    [navigate, startTour, toast],
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return commands
    return commands.filter((command) =>
      `${command.label} ${command.hint ?? ''} ${command.keywords ?? ''}`
        .toLowerCase()
        .includes(term),
    )
  }, [commands, query])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        toggle()
      }
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    setSelected(0)
  }, [query])

  const runCommand = (command: Command) => {
    command.action()
    close()
  }

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelected((current) => (current + 1) % Math.max(filtered.length, 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelected((current) => (current - 1 + filtered.length) % Math.max(filtered.length, 1))
    }
    if (event.key === 'Enter' && filtered[selected]) {
      event.preventDefault()
      runCommand(filtered[selected])
    }
  }

  const value = useMemo(() => ({ open, close, toggle }), [open, close, toggle])
  const groups: Command['group'][] = ['Acciones', 'Navegación']

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {isOpen && (
        <div className="no-print fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]">
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-[3px]"
            onClick={close}
            aria-label="Cerrar búsqueda"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Búsqueda global"
            className="relative w-full max-w-[580px] overflow-hidden rounded-xl border border-line-strong bg-panel shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)] animate-rise"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Search className="size-4 text-dim" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar páginas, activos o acciones…"
                className="w-full bg-transparent text-[14px] text-paper placeholder:text-dim focus:outline-none"
              />
              <kbd className="rounded border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-[9px] text-dim">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="px-3 py-10 text-center text-[13px] text-muted">
                  Sin resultados para “{query}”.
                </div>
              )}
              {groups.map((group) => {
                const items = filtered.filter((command) => command.group === group)
                if (items.length === 0) return null
                return (
                  <div key={group} className="mb-1 last:mb-0">
                    <p className="label px-2.5 py-2">{group}</p>
                    {items.map((command) => {
                      const index = filtered.indexOf(command)
                      const Icon = command.icon
                      return (
                        <button
                          key={command.id}
                          type="button"
                          onMouseEnter={() => setSelected(index)}
                          onClick={() => runCommand(command)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors',
                            selected === index ? 'bg-surface text-paper' : 'text-muted',
                          )}
                        >
                          <span
                            className={cn(
                              'grid size-7 shrink-0 place-items-center rounded-md border',
                              selected === index
                                ? 'border-acid/25 bg-acid/10 text-acid'
                                : 'border-line bg-ink text-dim',
                            )}
                          >
                            <Icon className="size-3.5" />
                          </span>
                          <span className="flex-1 text-[13px]">{command.label}</span>
                          {command.hint && (
                            <span className="font-mono text-[10px] text-dim">{command.hint}</span>
                          )}
                          <ArrowRight
                            className={cn(
                              'size-3 transition-opacity',
                              selected === index ? 'text-acid opacity-100' : 'opacity-0',
                            )}
                          />
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between border-t border-line bg-ink-raised px-4 py-2.5">
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-dim">
                <span>↑↓ navegar</span>
                <span>↵ abrir</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-dim">
                UBIORA · command
              </span>
            </div>
          </div>
        </div>
      )}
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext)
  if (!context) throw new Error('useCommandPalette must be used inside CommandPaletteProvider')
  return context
}

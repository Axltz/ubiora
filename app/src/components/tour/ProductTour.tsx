import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Gauge,
  Lightbulb,
  PackageSearch,
  Radar,
  Route,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/utils'

type TourStep = {
  route: string
  eyebrow: string
  title: string
  body: string
  tip: string
  icon: LucideIcon
}

const steps: TourStep[] = [
  {
    route: '/',
    eyebrow: 'Paso 1 · La foto completa',
    title: 'Empieza por el resumen',
    body: 'Aquí ves el tamaño del problema: cuántos componentes criptográficos tienes, cuántos son críticos y cuál es tu score de preparación. El reloj muestra cuánto falta para el primer plazo del NIST.',
    tip: 'Si el sistema está vacío, ejecuta un descubrimiento o pulsa «Cargar ejemplo». No intentes memorizar cada número: quédate con la idea de dónde está el riesgo.',
    icon: Gauge,
  },
  {
    route: '/descubrimiento',
    eyebrow: 'Paso 2 · De dónde salen los datos',
    title: 'Así se descubre la criptografía',
    body: 'Escribe dominios reales y UBIORA inspecciona sus certificados TLS, detecta el algoritmo y el tamaño de llave, y convierte cada hallazgo en un activo del inventario.',
    tip: 'El escaneo solo lee información pública del certificado. No toca sistemas internos ni descarga llaves privadas.',
    icon: Radar,
  },
  {
    route: '/inventario',
    eyebrow: 'Paso 3 · La evidencia',
    title: 'Cada hallazgo tiene nombre y dueño',
    body: 'El inventario CBOM es la lista completa: qué algoritmo usa cada activo, dónde vive, qué tan sensible es y quién es responsable. Puedes buscar, filtrar y exportar la evidencia.',
    tip: 'Haz clic en cualquier fila. Se abre una ficha con el score, la recomendación de migración y el tiempo que el dato debe protegerse.',
    icon: PackageSearch,
  },
  {
    route: '/hoja-de-ruta',
    eyebrow: 'Paso 4 · El plan',
    title: 'Del hallazgo a una fecha',
    body: 'La hoja de ruta convierte los hallazgos en seis fases entre 2026 y 2030. Primero se retira lo que ya está roto, después se prepara la agilidad y al final se migran los sistemas centrales.',
    tip: 'Cada fase tiene dueño, estándar, entregables y reducción de riesgo. La línea de «hoy» te dice dónde está el proyecto.',
    icon: Route,
  },
  {
    route: '/informe',
    eyebrow: 'Paso 5 · La decisión',
    title: 'Lo que lee el consejo',
    body: 'El informe ejecutivo traduce todo lo anterior en un documento de dos páginas. No pide aprobar la migración completa: pide aprobar el primer paso y asignar responsables.',
    tip: 'Puedes imprimirlo o guardarlo como PDF. Está diseñado para verse como un documento de consejo, no como una captura de pantalla.',
    icon: FileText,
  },
]

type TourContextValue = {
  start: () => void
  stop: () => void
  isOpen: boolean
}

const TourContext = createContext<TourContextValue | null>(null)

export function TourProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  const start = useCallback(() => {
    setIndex(0)
    setIsOpen(true)
  }, [])

  const stop = useCallback(() => setIsOpen(false), [])

  const next = useCallback(() => {
    if (index >= steps.length - 1) {
      setIsOpen(false)
      navigate('/como-funciona')
      return
    }
    setIndex(index + 1)
  }, [index, navigate])

  const back = useCallback(() => setIndex((current) => Math.max(0, current - 1)), [])

  useEffect(() => {
    if (isOpen) navigate(steps[index].route)
  }, [index, isOpen, navigate])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const value = useMemo(() => ({ start, stop, isOpen }), [start, stop, isOpen])
  const step = steps[index]
  const Icon = step.icon
  const isLast = index === steps.length - 1

  return (
    <TourContext.Provider value={value}>
      {children}
      {isOpen && (
        <div className="no-print fixed inset-x-3 bottom-3 z-[75] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[390px]">
          <div
            role="dialog"
            aria-label="Recorrido guiado por UBIORA"
            className="overflow-hidden rounded-xl border border-acid/30 bg-panel/97 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md animate-rise"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid size-6 shrink-0 place-items-center rounded-md border border-acid/25 bg-acid/10 font-mono text-[9px] text-acid">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-dim">
                  Recorrido guiado · {index + 1} de {steps.length}
                </span>
              </div>
              <button
                type="button"
                onClick={stop}
                className="grid size-6 place-items-center rounded-md text-dim transition-colors hover:bg-surface hover:text-paper"
                aria-label="Salir del recorrido"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="flex gap-1 px-4 pt-3">
              {steps.map((item, stepIndex) => (
                <span
                  key={item.route}
                  className={cn(
                    'h-0.5 flex-1 rounded-full transition-colors',
                    stepIndex <= index ? 'bg-acid' : 'bg-line-strong',
                  )}
                />
              ))}
            </div>

            <div className="px-4 pb-4 pt-4">
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line-strong bg-surface">
                  <Icon className="size-4 text-acid" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-dim">
                    {step.eyebrow}
                  </p>
                  <h2 className="mt-1 text-[15px] font-medium tracking-[-0.02em] text-paper">
                    {step.title}
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-[11.5px] leading-relaxed text-muted">{step.body}</p>

              <div className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-ink-raised px-3 py-2.5">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-warn" />
                <p className="text-[10px] leading-relaxed text-dim">{step.tip}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-line bg-ink-raised px-4 py-3">
              <button
                type="button"
                onClick={stop}
                className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim transition-colors hover:text-paper"
              >
                Saltar
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={back}
                  disabled={index === 0}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-[10.5px] text-muted transition-colors hover:border-line-strong hover:text-paper disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowLeft className="size-3" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-acid px-3 text-[10.5px] font-medium text-ink transition-colors hover:bg-[#d5ff7f]"
                >
                  {isLast ? 'Terminar' : 'Siguiente'}
                  {isLast ? <Check className="size-3" /> : <ArrowRight className="size-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (!context) throw new Error('useTour must be used inside TourProvider')
  return context
}

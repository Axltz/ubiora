import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '../../lib/utils'

type Tone = 'success' | 'warning' | 'info'
type Toast = { id: string; message: string; detail?: string; tone: Tone }

type ToastContextValue = {
  toast: (message: string, options?: { detail?: string; tone?: Tone }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneConfig = {
  success: { icon: CheckCircle2, className: 'text-acid border-acid/25' },
  warning: { icon: TriangleAlert, className: 'text-warn border-warn/25' },
  info: { icon: Info, className: 'text-sky border-sky/25' },
} as const

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, number>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (message: string, options?: { detail?: string; tone?: Tone }) => {
      const id = crypto.randomUUID()
      setToasts((current) => [
        ...current.slice(-2),
        { id, message, detail: options?.detail, tone: options?.tone ?? 'success' },
      ])
      const timer = window.setTimeout(() => dismiss(id), 4600)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="no-print pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(360px,calc(100vw-40px))] flex-col gap-2">
        {toasts.map((item) => {
          const config = toneConfig[item.tone]
          const Icon = config.icon
          return (
            <div
              key={item.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl border bg-panel/95 p-3.5 shadow-2xl shadow-black/40 backdrop-blur-md animate-rise',
                config.className,
              )}
            >
              <Icon className={cn('mt-0.5 size-4 shrink-0', config.className.split(' ')[0])} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-paper">{item.message}</p>
                {item.detail && <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{item.detail}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="text-dim transition-colors hover:text-paper"
                aria-label="Cerrar notificación"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}

import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Binary,
  ChevronRight,
  Clock3,
  FileText,
  Gauge,
  KeyRound,
  Lightbulb,
  PackageSearch,
  Play,
  Radar,
  Route,
  ShieldAlert,
  Sparkles,
  Timer,
  Workflow,
} from 'lucide-react'
import { stats } from '../data/assets'
import { formatNumber } from '../lib/utils'
import { useTour } from '../components/tour/ProductTour'
import { Tag } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Panel, PanelHeader } from '../components/ui/Panel'

const flow = [
  {
    number: '01',
    title: 'Descubre',
    description: 'Busca la criptografía que la empresa usa sin saberlo: certificados, librerías, llaves y endpoints.',
    to: '/descubrimiento',
    icon: Radar,
    verb: '¿Dónde está?',
  },
  {
    number: '02',
    title: 'Inventaría',
    description: 'Cada hallazgo se guarda en un CBOM: el inventario de todos los componentes criptográficos.',
    to: '/inventario',
    icon: PackageSearch,
    verb: '¿Qué tenemos?',
  },
  {
    number: '03',
    title: 'Prioriza',
    description: 'Se calcula el riesgo con el dato protegido, su vida útil, la exposición y la criticidad del sistema.',
    to: '/',
    icon: Gauge,
    verb: '¿Qué duele más?',
  },
  {
    number: '04',
    title: 'Planea',
    description: 'Los hallazgos se convierten en fases, responsables y fechas alineadas a los plazos del NIST.',
    to: '/hoja-de-ruta',
    icon: Route,
    verb: '¿Qué hacemos primero?',
  },
]

const screens = [
  {
    name: 'Resumen de exposición',
    to: '/',
    icon: Gauge,
    question: '¿Qué tan expuestos estamos?',
    what: 'Score de preparación, hallazgos críticos, tendencia y mezcla de algoritmos.',
    look: 'Mira el score 34/100, los 17 críticos y cuántos días quedan para 2030.',
  },
  {
    name: 'Descubrimiento',
    to: '/descubrimiento',
    icon: Radar,
    question: '¿De dónde salen los datos?',
    what: 'Simulación de un escaneo con alcance configurable y consola en vivo.',
    look: 'Inicia el escaneo y observa cómo aparecen los hallazgos hasta completar 1,284.',
  },
  {
    name: 'Inventario CBOM',
    to: '/inventario',
    icon: PackageSearch,
    question: '¿Qué componente es?',
    what: 'La lista completa con búsqueda, filtros, dueño, exposición y exportación.',
    look: 'Filtra por “Crítico” y abre una fila para ver la recomendación de migración.',
  },
  {
    name: 'Hoja de ruta',
    to: '/hoja-de-ruta',
    icon: Route,
    question: '¿Cuándo lo migramos?',
    what: 'Gantt 2026–2030 con seis fases, entregables y dependencias.',
    look: 'Selecciona una fase y revisa su dueño, estándar y reducción de riesgo.',
  },
  {
    name: 'Informe ejecutivo',
    to: '/informe',
    icon: FileText,
    question: '¿Qué decide el consejo?',
    what: 'Documento imprimible con el diagnóstico y la decisión solicitada.',
    look: 'Lee la sección “Decisión solicitada”. Eso es lo que se lleva a la presentación.',
  },
]

const glossary = [
  {
    term: 'Criptografía',
    definition: 'Las reglas matemáticas que protegen datos: cifran información y firman operaciones.',
    icon: KeyRound,
  },
  {
    term: 'CBOM',
    definition: 'Cryptographic Bill of Materials. La lista de todos los algoritmos, llaves y certificados que usa una empresa.',
    icon: PackageSearch,
  },
  {
    term: 'PQC',
    definition: 'Criptografía post-cuántica. Algoritmos nuevos diseñados para resistir a una computadora cuántica.',
    icon: Binary,
  },
  {
    term: 'RSA / ECDSA',
    definition: 'Algoritmos clásicos que hoy protegen casi todo, pero que un computador cuántico podría romper.',
    icon: ShieldAlert,
  },
  {
    term: 'Vida útil del dato',
    definition: 'Cuántos años debe seguir siendo secreta una información. Si son 20 años, la migración no puede esperar a 2035.',
    icon: Clock3,
  },
  {
    term: 'Harvest now, decrypt later',
    definition: 'Alguien copia datos cifrados hoy para descifrarlos cuando tenga un computador cuántico. Por eso importa el tiempo.',
    icon: Timer,
  },
]

export function Guide() {
  const navigate = useNavigate()
  const { start } = useTour()

  return (
    <div className="animate-rise">
      <div className="flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Tag tone="acid">
              <BookOpen className="size-2.5" /> Guía de producto
            </Tag>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim">
              Sin tecnicismos · 3 minutos
            </span>
          </div>
          <h1 className="max-w-[820px] text-[clamp(2rem,3.4vw,3.15rem)] font-medium leading-[0.98] tracking-[-0.05em] text-paper">
            Entiende UBIORA <span className="text-muted">sin saber de criptografía.</span>
          </h1>
          <p className="mt-4 max-w-[650px] text-[13px] leading-relaxed text-muted">
            UBIORA encuentra la criptografía que una empresa usa sin saberlo, la ordena por riesgo
            real y la convierte en un plan de migración. Esta página explica el flujo completo y qué
            mirar en cada pantalla.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            icon={<Play className="size-3.5" />}
            onClick={start}
          >
            Iniciar recorrido guiado
          </Button>
          <Button
            variant="primary"
            icon={<Gauge className="size-3.5" />}
            onClick={() => navigate('/')}
          >
            Ver el resumen
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-[14px] border border-line bg-panel sm:grid-cols-2 xl:grid-cols-4">
        {[
          { value: formatNumber(stats.total), label: 'componentes criptográficos', tone: 'text-paper' },
          { value: String(stats.critical), label: 'hallazgos críticos', tone: 'text-danger' },
          { value: '31%', label: 'de la superficie usa RSA', tone: 'text-warn' },
          { value: '2030', label: 'primer plazo regulatorio', tone: 'text-acid' },
        ].map((item, index, list) => (
          <div
            key={item.label}
            className={`flex flex-col justify-between gap-3 p-4 sm:p-5 ${
              index < list.length - 1 ? 'border-b border-line sm:border-b-0 sm:border-r' : ''
            } ${index === 1 ? 'sm:border-r' : ''}`}
          >
            <p className="label">{item.label}</p>
            <p className={`tabular text-[34px] font-medium leading-none tracking-[-0.05em] ${item.tone}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label mb-2">El flujo completo</p>
            <h2 className="text-[19px] font-medium tracking-[-0.03em] text-paper">
              Cuatro pasos, una sola historia
            </h2>
          </div>
          <p className="max-w-[360px] text-[11px] leading-relaxed text-muted">
            Cada pantalla responde una pregunta distinta. Juntas forman el argumento que se lleva al
            consejo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {flow.map((step, index) => {
            const Icon = step.icon
            return (
              <Link
                key={step.number}
                to={step.to}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-line bg-panel p-5 transition-colors hover:border-line-strong hover:bg-surface/40"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="grid size-9 place-items-center rounded-lg border border-line-strong bg-ink">
                      <Icon className="size-4 text-acid" strokeWidth={1.8} />
                    </span>
                    <span className="font-mono text-[10px] text-dim">{step.number}</span>
                  </div>
                  <p className="mt-5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-dim">
                    {step.verb}
                  </p>
                  <h3 className="mt-1 text-[17px] font-medium tracking-[-0.03em] text-paper">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{step.description}</p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim group-hover:text-paper">
                    Abrir pantalla
                  </span>
                  <ArrowRight className="size-3.5 text-dim transition-all group-hover:translate-x-0.5 group-hover:text-acid" />
                </div>
                {index < flow.length - 1 && (
                  <span className="pointer-events-none absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink text-dim xl:grid">
                    <ChevronRight className="size-2.5" />
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-7">
          <PanelHeader
            eyebrow="La idea en una frase"
            title="Sin inventario no hay migración"
            action={<Tag tone="warn">El problema</Tag>}
          />
          <div className="p-5 sm:p-6">
            <p className="max-w-[620px] text-[15px] leading-relaxed text-paper">
              La mayoría de las empresas no sabe qué criptografía usa, en qué sistemas vive ni qué
              tan crítico es. Si no lo sabe, no puede migrar antes de que sea tarde.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  title: 'No hay mapa',
                  detail: 'La criptografía está escondida en certificados, librerías y configuraciones.',
                },
                {
                  title: 'No hay prioridad',
                  detail: 'No todos los activos pesan igual. Importa el dato, su vida útil y la exposición.',
                },
                {
                  title: 'No hay plan',
                  detail: 'Sin un orden y un dueño, la migración se vuelve un proyecto eterno.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-line bg-ink-raised p-3.5">
                  <p className="text-[11.5px] font-medium text-paper">{item.title}</p>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-dim">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-acid/20 bg-acid/5 px-3.5 py-3">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-acid" />
              <p className="text-[10.5px] leading-relaxed text-muted">
                <span className="text-paper">La frase para la presentación:</span> “UBIORA no vende
                la migración completa; vende la visibilidad y la prioridad que la hacen posible.”
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="xl:col-span-5">
          <PanelHeader eyebrow="Cómo leer el producto" title="Las cinco pantallas" />
          <div className="divide-y divide-line">
            {screens.map((screen) => {
              const Icon = screen.icon
              return (
                <Link
                  key={screen.name}
                  to={screen.to}
                  className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-surface/40"
                >
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-line bg-ink">
                    <Icon className="size-3.5 text-muted" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11.5px] text-paper">{screen.name}</p>
                      <ChevronRight className="size-3 shrink-0 text-dim transition-all group-hover:translate-x-0.5 group-hover:text-paper" />
                    </div>
                    <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
                      {screen.question}
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted">{screen.what}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </Panel>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="label mb-2">Glosario mínimo</p>
            <h2 className="text-[19px] font-medium tracking-[-0.03em] text-paper">
              Seis términos para no perderse
            </h2>
          </div>
          <Tag>Sin siglas innecesarias</Tag>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {glossary.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.term} className="rounded-[14px] border border-line bg-panel p-4">
                <div className="flex items-center gap-2">
                  <Icon className="size-3.5 text-acid" strokeWidth={1.8} />
                  <p className="text-[12px] font-medium text-paper">{item.term}</p>
                </div>
                <p className="mt-2 text-[10.5px] leading-relaxed text-muted">{item.definition}</p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-8">
          <PanelHeader
            eyebrow="Para exponer"
            title="El guion de 60 segundos"
            action={<Tag tone="acid">Demo</Tag>}
          />
          <div className="divide-y divide-line">
            {[
              {
                time: '00–15',
                text: '“Cada empresa usa criptografía en cientos de lugares que no están en ningún diagrama. La migración post-cuántica empieza con un inventario.”',
              },
              {
                time: '15–30',
                text: '“Este es Cobalto Pay: 1,284 componentes, 17 críticos y 387 expuestos a Internet. Ya sabemos dónde está el riesgo.”',
              },
              {
                time: '30–45',
                text: '“El inventario se prioriza con la sensibilidad del dato, su vida útil, la exposición y la criticidad del sistema.”',
              },
              {
                time: '45–60',
                text: '“La hoja de ruta convierte eso en fases con dueño y fecha. El informe pide una sola decisión: aprobar el primer paso.”',
              },
            ].map((line) => (
              <div key={line.time} className="flex items-start gap-4 px-5 py-3.5">
                <span className="mt-0.5 shrink-0 font-mono text-[9px] text-acid/80">{line.time}</span>
                <p className="text-[11px] leading-relaxed text-muted">{line.text}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="xl:col-span-4">
          <PanelHeader
            eyebrow="Recorrido guiado"
            title="Que el sitio te lleve de la mano"
            action={<Sparkles className="size-3.5 text-acid" />}
          />
          <div className="flex h-[calc(100%-58px)] flex-col justify-between p-5">
            <div>
              <p className="text-[12px] leading-relaxed text-paper">
                Abre el recorrido y UBIORA te llevará por las cinco pantallas explicando qué hace
                cada una.
              </p>
              <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                Puedes salir cuando quieras con “Saltar” o la tecla <kbd className="rounded border border-line bg-ink px-1 py-0.5 font-mono text-[8.5px]">Esc</kbd>.
              </p>
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-line bg-ink-raised px-3 py-2.5">
                <Workflow className="mt-0.5 size-3.5 shrink-0 text-sky" />
                <p className="text-[10px] leading-relaxed text-dim">
                  También puedes abrirlo desde el botón de ayuda del menú lateral.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              className="mt-5 w-full"
              icon={<Play className="size-3.5" />}
              onClick={start}
            >
              Iniciar recorrido
            </Button>
          </div>
        </Panel>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-[14px] border border-line bg-panel px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line-strong bg-surface">
            <Lightbulb className="size-4 text-acid" />
          </span>
          <div>
            <p className="text-[12px] text-paper">Regla de oro para la demo.</p>
            <p className="mt-0.5 text-[10.5px] text-dim">
              No expliques las cinco pantallas: cuenta una sola historia. Descubrimos, priorizamos y
              planeamos.
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/informe')}
          iconRight={<ArrowRight className="size-3.5" />}
        >
          Ir al informe
        </Button>
      </div>
    </div>
  )
}

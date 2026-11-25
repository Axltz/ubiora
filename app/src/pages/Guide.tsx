import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Binary,
  ChevronRight,
  Clock3,
  FileText,
  Gauge,
  KeyRound,
  PackageSearch,
  Play,
  Radar,
  Route,
  Terminal,
} from 'lucide-react'
import { useTour } from '../components/tour/ProductTour'
import { Tag } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Panel, PanelHeader } from '../components/ui/Panel'

const flow = [
  {
    number: '01',
    title: 'Descubre',
    description: 'Inspecciona endpoints reales TLS y activos criptográficos: certificados, suites, librerías y llaves.',
    to: '/descubrimiento',
    icon: Radar,
    verb: '¿Dónde está?',
  },
  {
    number: '02',
    title: 'Inventaría',
    description: 'Genera el CBOM estructurado en CycloneDX 1.7 legible por máquina y exportable.',
    to: '/inventario',
    icon: PackageSearch,
    verb: '¿Qué tenemos?',
  },
  {
    number: '03',
    title: 'Prioriza',
    description: 'Calcula el score de riesgo: Sensibilidad × Vida útil (HNDL) × Exposición × Criticidad.',
    to: '/',
    icon: Gauge,
    verb: '¿Qué duele más?',
  },
  {
    number: '04',
    title: 'Planea',
    description: 'Convierte el diagnóstico en una hoja de ruta 2026–2030 alineada a los mandatos NIST IR 8547.',
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
    what: 'Score de preparación PQC calculado, conteo de activos críticos y distribución de riesgo.',
  },
  {
    name: 'Descubrimiento (Motor Real)',
    to: '/descubrimiento',
    icon: Radar,
    question: '¿Cómo se detectan los activos?',
    what: 'Conexión TLS en vivo para escanear dominios reales y generar el inventario desde cero.',
  },
  {
    name: 'Inventario CBOM',
    to: '/inventario',
    icon: PackageSearch,
    question: '¿Cuál es el inventario técnico?',
    what: 'La lista completa con búsqueda, filtros, algoritmo, dueño y exportación a CycloneDX 1.7.',
  },
  {
    name: 'Hoja de ruta',
    to: '/hoja-de-ruta',
    icon: Route,
    question: '¿Cómo y cuándo se migra?',
    what: 'Cronograma de referencia 2026–2030 con seis fases, entregables y reducción progresiva de riesgo.',
  },
  {
    name: 'Informe ejecutivo',
    to: '/informe',
    icon: FileText,
    question: '¿Qué se presenta a dirección?',
    what: 'Documento ejecutivo listo para imprimir o guardar como PDF formal de consejo.',
  },
]

const glossary = [
  {
    term: 'Criptografía Clásica',
    definition: 'Algoritmos asimétricos actuales (RSA, ECDSA, DH) cuya seguridad depende de problemas matemáticos vulnerables a computación cuántica (Algoritmo de Shor).',
    icon: KeyRound,
  },
  {
    term: 'CBOM (CycloneDX 1.7)',
    definition: 'Cryptographic Bill of Materials. Inventario estándar avalado por OWASP y adoptado por la industria para catalogar todo componente criptográfico.',
    icon: PackageSearch,
  },
  {
    term: 'PQC (Post-Quantum)',
    definition: 'Estándares del NIST (ML-KEM, ML-DSA, SLH-DSA) diseñados para resistir ataques de ordenadores cuánticos.',
    icon: Binary,
  },
  {
    term: 'Riesgo HNDL',
    definition: '"Harvest Now, Decrypt Later". Adversarios interceptan y almacenan datos confidenciales hoy para descifrarlos en cuanto dispongan de hardware cuántico.',
    icon: Clock3,
  },
]

export function Guide() {
  const navigate = useNavigate()
  const { start: startTour } = useTour()

  return (
    <div className="animate-rise pb-10">
      <div className="flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Tag tone="acid">
              <BookOpen className="size-2.5" /> Guía de Presentación
            </Tag>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim">
              Proyecto UBIORA · Clase de Innovación y Tecnología
            </span>
          </div>
          <h1 className="max-w-[760px] text-[clamp(2rem,3.2vw,3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-paper">
            Guía de Demostración y Funcionamiento Real
          </h1>
          <p className="mt-4 max-w-[620px] text-[13px] leading-relaxed text-muted">
            Este documento resume el sustento técnico y la ruta recomendada para presentar UBIORA ante el jurado o clase de innovación, respaldando la propuesta con ejecución real.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="secondary" icon={<Terminal className="size-3.5" />} onClick={() => navigate('/descubrimiento')}>
            Ir al Escáner
          </Button>
          <Button variant="primary" icon={<Play className="size-3.5" />} onClick={startTour}>
            Recorrido Interactivo
          </Button>
        </div>
      </div>

      {/* 4 Pasos del Flujo */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-paper">Flujo Metodológico UBIORA</h2>
          <span className="font-mono text-[10px] text-dim">De la detección a la decisión</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flow.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                onClick={() => navigate(step.to)}
                className="group cursor-pointer rounded-xl border border-line bg-panel p-5 transition-all hover:border-line-strong hover:bg-surface"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-acid">{step.number}</span>
                  <Icon className="size-4 text-dim group-hover:text-acid transition-colors" />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-paper group-hover:text-acid transition-colors">
                  {step.title}
                </h3>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-dim">{step.verb}</p>
                <p className="mt-3 text-[11.5px] leading-relaxed text-muted">{step.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Guion de Pitch en Clase */}
      <section className="mt-8">
        <Panel className="p-6">
          <PanelHeader
            className="px-0 pt-0 pb-4"
            eyebrow="Estructura del Pitch"
            title="Cómo Defender el Proyecto en 3 Minutos"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pt-2">
            <div className="rounded-lg border border-line bg-ink-raised p-4">
              <span className="font-mono text-[10px] uppercase font-bold text-danger">1. El Problema (Minuto 1)</span>
              <p className="mt-2 text-[12px] leading-relaxed text-paper">
                "Menos del 40% de las instituciones financieras sabe qué criptografía utiliza. No saben si sus datos sensibles están protegidos con RSA-2048 o si ya están siendo capturados bajo la amenaza <em>Harvest Now, Decrypt Later</em>."
              </p>
            </div>
            <div className="rounded-lg border border-line bg-ink-raised p-4">
              <span className="font-mono text-[10px] uppercase font-bold text-acid">2. La Solución (Minuto 2)</span>
              <p className="mt-2 text-[12px] leading-relaxed text-paper">
                "UBIORA no vende migraciones complejas de millones de dólares. Vende la capa indispensable que falta: <strong>visibilidad mediante CBOM automatizado y priorización matemática de riesgo</strong>."
              </p>
            </div>
            <div className="rounded-lg border border-line bg-ink-raised p-4">
              <span className="font-mono text-[10px] uppercase font-bold text-sky">3. La Demostración Real (Minuto 3)</span>
              <p className="mt-2 text-[12px] leading-relaxed text-paper">
                "Mostramos en vivo cómo el motor inspecciona endpoints reales, estructura los hallazgos en CycloneDX 1.7 y entrega una hoja de ruta con respaldo en los plazos NIST IR 8547."
              </p>
            </div>
          </div>
        </Panel>
      </section>

      {/* Fundamentos Teóricos */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-[16px] font-semibold text-paper">Fundamentos Teóricos Respaldados</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {glossary.map((g) => {
            const Icon = g.icon
            return (
              <div key={g.term} className="flex gap-3.5 rounded-xl border border-line bg-panel p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface">
                  <Icon className="size-4 text-acid" />
                </span>
                <div>
                  <h3 className="text-[13px] font-semibold text-paper">{g.term}</h3>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{g.definition}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pantallas del Sistema */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-[16px] font-semibold text-paper">Módulos del MVP</h2>
        </div>
        <div className="divide-y divide-line rounded-xl border border-line bg-panel">
          {screens.map((s) => (
            <div
              key={s.name}
              onClick={() => navigate(s.to)}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-surface/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <s.icon className="size-4 text-dim" />
                <div>
                  <p className="text-[13px] font-medium text-paper">{s.name}</p>
                  <p className="text-[11.5px] text-muted">{s.what}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="font-mono text-[10px] text-dim">{s.question}</span>
                <ChevronRight className="size-4 text-dim" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

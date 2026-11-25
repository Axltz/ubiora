import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Check, Download, FileText, Printer, Radar, ShieldCheck } from 'lucide-react'
import {
  computeAlgorithmFamilies,
  computeReadiness,
  computeStats,
  monthsToDeadline,
} from '../data/assets'
import { roadmapPhases } from '../data/roadmap'
import { cn, formatNumber } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { EmptyState, Panel } from '../components/ui/Panel'
import { Tag } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import { useRealScan } from '../data/scanContext'

const REPORT_DATE = new Date()

function todayLabel() {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(REPORT_DATE)
}

export function Report() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { assets, orgName, isDemo, loadDemo } = useRealScan()

  const stats = computeStats(assets)
  const readiness = computeReadiness(assets)
  const families = computeAlgorithmFamilies(assets)
  const months = monthsToDeadline()
  const topRisks = assets.slice(0, 5)

  const printReport = () => {
    toast('Preparando el documento', {
      detail: 'Elige «Guardar como PDF» en el diálogo de impresión.',
      tone: 'info',
    })
    window.setTimeout(() => window.print(), 300)
  }

  const shareReport = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast('Enlace copiado', {
        detail: 'El informe se puede compartir con el consejo y el CISO.',
        tone: 'info',
      })
    } catch {
      toast('No se pudo copiar el enlace', { tone: 'warning' })
    }
  }

  const paperStats = [
    { value: formatNumber(stats.total), label: 'componentes criptográficos' },
    { value: String(stats.critical), label: 'hallazgos críticos' },
    { value: `${readiness.score}/100`, label: 'readiness PQC' },
    { value: `${months}`, label: 'meses de ventana' },
  ]

  const decisions = [
    'Aprobar la hoja de ruta de migración y su secuencia de seis fases.',
    'Asignar un propietario ejecutivo por fase y reportar avance trimestral al comité de riesgo.',
    'Autorizar el piloto de crypto-agility en los servicios con mayor exposición.',
  ]

  const header = (
    <div className="no-print flex flex-col gap-6 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <Tag tone="acid">
            <FileText className="size-2.5" /> Board brief
          </Tag>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim">
            Versión 1.0 · {todayLabel()} · Confidencial
          </span>
          {isDemo && <Tag tone="warn">Datos de ejemplo</Tag>}
        </div>
        <h1 className="max-w-[780px] text-[clamp(2rem,3.2vw,3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-paper">
          El informe que <span className="text-muted">va al consejo.</span>
        </h1>
        <p className="mt-4 max-w-[560px] text-[13px] leading-relaxed text-muted">
          {stats.total === 0
            ? 'Aún no hay hallazgos que reportar. Ejecuta un descubrimiento o carga el ejemplo para generar el documento ejecutivo.'
            : `Un documento de dos páginas que traduce ${formatNumber(stats.total)} hallazgos técnicos en una decisión ejecutiva: qué está expuesto, por qué importa ahora y qué se aprueba.`}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button variant="secondary" icon={<Download className="size-3.5" />} onClick={shareReport}>
          Compartir
        </Button>
        <Button variant="primary" icon={<Printer className="size-3.5" />} onClick={printReport} disabled={stats.total === 0}>
          Imprimir / PDF
        </Button>
      </div>
    </div>
  )

  if (stats.total === 0) {
    return (
      <div className="animate-rise report-shell">
        {header}
        <Panel className="mt-5">
          <EmptyState
            title="Todavía no hay informe"
            description="El informe se construye con los activos del inventario. Primero descubre la criptografía de tu organización."
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button onClick={() => navigate('/descubrimiento')} icon={<Radar className="size-3.5" />}>
                  Ejecutar descubrimiento
                </Button>
                <Button variant="secondary" onClick={loadDemo}>
                  Cargar ejemplo
                </Button>
              </div>
            }
          />
        </Panel>
      </div>
    )
  }

  const vulnerable = stats.total - stats.hybrid
  const vulnerableShare = Math.round((vulnerable / stats.total) * 100)

  return (
    <div className="animate-rise report-shell">
      {header}

      <div className="no-print mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-line bg-panel px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.08em] text-dim">
          <span className="text-muted">Documento</span>
          <span>Audiencia · Consejo + CISO</span>
          <span>Fuente · CBOM v1.7</span>
          <span>{todayLabel()}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-acid" />
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">
            Listo para revisión
          </span>
        </div>
      </div>

      <article className="report-paper mx-auto mt-5 max-w-[1020px] rounded-[3px] bg-[#f2f0e9] px-6 py-8 text-[#1a1d19] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.75)] sm:px-10 sm:py-12 lg:px-16 lg:py-14">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#c9c7be] pb-6">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.34em]">UBIORA</p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[#697065]">
              PQC exposure intelligence
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#697065]">
              Confidencial · Borrador para consejo
            </p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#697065]">
              {todayLabel()} · Ciudad de México
            </p>
          </div>
        </header>

        <section className="pt-9">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="bg-[#1a1d19] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#f2f0e9]">
              Diagnóstico ejecutivo
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#697065]">
              {orgName}
            </span>
          </div>
          <h2 className="max-w-[840px] font-serif text-[clamp(2.5rem,5vw,4.4rem)] font-normal leading-[0.94] tracking-[-0.035em]">
            La exposición que la organización todavía no puede ver.
          </h2>
          <p className="mt-5 max-w-[700px] font-serif text-[clamp(1.15rem,1.8vw,1.45rem)] leading-[1.35] text-[#40463d]">
            {orgName} depende de criptografía clásica en los sistemas que sostienen su operación.
            La amenaza cuántica no es inmediata; la migración sí.
          </p>

          <div className="mt-9 grid grid-cols-2 border-y border-[#1a1d19] lg:grid-cols-4">
            {paperStats.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  'px-1 py-4 sm:px-4',
                  index !== paperStats.length - 1 && 'border-r border-[#c9c7be]',
                  index === 1 && 'border-r-0 lg:border-r',
                  index === 2 && 'border-t border-[#c9c7be] lg:border-t-0',
                  index === 3 && 'border-t border-[#c9c7be] lg:border-t-0',
                )}
              >
                <p className="font-serif text-[clamp(1.9rem,3vw,2.6rem)] leading-none tracking-[-0.03em]">
                  {item.value}
                </p>
                <p className="mt-2 max-w-[130px] font-mono text-[7.5px] uppercase leading-[1.5] tracking-[0.1em] text-[#697065]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-[9px] text-[#8a9186]">01</span>
              <h3 className="font-serif text-[1.6rem] leading-none tracking-[-0.02em]">Lo que encontramos</h3>
            </div>
            <p className="text-[12px] leading-[1.85] text-[#454b43] first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-[52px] first-letter:leading-[0.78]">
              El inventario criptográfico de {orgName} cubre {formatNumber(stats.total)} componentes
              en {new Set(assets.map((asset) => asset.environment)).size} entornos. {stats.critical}{' '}
              activos concentran el riesgo crítico. El {vulnerableShare}% de la superficie depende
              de algoritmos clásicos y {formatNumber(stats.internet)} componentes están expuestos a
              Internet. La organización ya tiene visibilidad; lo que falta es agilidad para cambiar
              de algoritmo sin reescribir los sistemas.
            </p>
            <p className="mt-4 text-[12px] leading-[1.85] text-[#454b43]">
              El dato más urgente es la vida útil del dato. Un respaldo cifrado hoy con RSA-2048 y
              conservado durante 20 años sigue expuesto en 2046. No se puede esperar a que el
              algoritmo sea prohibido para empezar a migrar: para entonces, el dato ya habrá sido
              capturado.
            </p>

            <div className="mt-7 border-t border-[#c9c7be]">
              <div className="flex items-center justify-between border-b border-[#c9c7be] py-2">
                <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#697065]">
                  Top 5 por score de riesgo
                </span>
                <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#697065]">
                  Score / 100
                </span>
              </div>
              {topRisks.map((asset) => (
                <div
                  key={asset.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#dcdad2] py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[9.5px]">{asset.name}</p>
                    <p className="mt-0.5 truncate text-[8.5px] text-[#767d72]">
                      {asset.algorithm} · {asset.environment}
                    </p>
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-[#767d72]">
                    {asset.sensitivity}
                  </span>
                  <span className="font-serif text-[18px] leading-none">{asset.score}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="border-l-0 border-[#c9c7be] lg:border-l lg:pl-8">
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#697065]">
              Por qué ahora
            </p>
            <p className="mt-3 font-serif text-[1.35rem] leading-[1.2] tracking-[-0.01em]">
              El 84% de las organizaciones cree que parte de sus datos cifrados ya está expuesta.
            </p>
            <p className="mt-3 text-[10.5px] leading-[1.75] text-[#5c6359]">
              “Harvest now, decrypt later” convierte cada dato capturado hoy en una obligación
              futura. Los plazos NIST fijan 2030 para establecimiento de claves y 2035 para
              prohibir los algoritmos clásicos.
            </p>
            <div className="mt-5 space-y-3 border-t border-[#c9c7be] pt-4">
              {[
                ['31 dic 2030', 'Establecimiento de claves PQC'],
                ['31 dic 2031', 'Firmas digitales PQC'],
                ['31 dic 2035', 'Prohibición de RSA / ECDSA'],
              ].map(([date, label]) => (
                <div key={date} className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[8px] uppercase tracking-[0.06em] text-[#697065]">
                    {date}
                  </span>
                  <span className="text-right text-[9.5px] leading-tight text-[#40463d]">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#e4e2d9] p-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#697065]">
                Concentración algorítmica
              </p>
              <div className="mt-3 space-y-2">
                {families.slice(0, 3).map((family) => (
                  <div key={family.name}>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#40463d]">{family.name}</span>
                      <span className="font-mono text-[8px] text-[#697065]">
                        {family.count} · {family.share}%
                      </span>
                    </div>
                    <div className="mt-1 h-1 bg-[#cfcdc4]">
                      <div
                        className="h-full bg-[#4c5d2d]"
                        style={{ width: `${family.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-11">
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-[9px] text-[#8a9186]">02</span>
            <h3 className="font-serif text-[1.6rem] leading-none tracking-[-0.02em]">La ruta</h3>
          </div>
          <p className="max-w-[620px] text-[12px] leading-[1.85] text-[#454b43]">
            La migración se organiza en seis fases. La lógica no es “cambiar todo a la vez”, sino
            retirar primero lo que ya está roto, crear agilidad después y migrar el core cuando la
            evidencia y los proveedores estén listos.
          </p>

          <div className="mt-6 grid grid-cols-1 border border-[#c9c7be] sm:grid-cols-3">
            {[
              {
                period: '2026–2027',
                title: 'Fundamentos',
                detail: 'CBOM, quick wins, abstracción criptográfica y piloto híbrido en el edge.',
                reduction: '38%',
              },
              {
                period: '2028–2029',
                title: 'Core y firmas',
                detail: 'ML-DSA en ledger, migración de HSM y re-cifrado de respaldos históricos.',
                reduction: '78%',
              },
              {
                period: '2030',
                title: 'Cierre regulatorio',
                detail: 'Auditoría externa, evidencia CNBV/NIST y plan de continuidad PQC.',
                reduction: '100%',
              },
            ].map((phase, index) => (
              <div
                key={phase.period}
                className={cn(
                  'p-5',
                  index !== 0 && 'border-t border-[#c9c7be] sm:border-l sm:border-t-0',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#697065]">
                    {phase.period}
                  </span>
                  <span className="font-serif text-[1.3rem] leading-none">{phase.reduction}</span>
                </div>
                <p className="mt-3 font-serif text-[1.2rem] leading-none">{phase.title}</p>
                <p className="mt-2 text-[9.5px] leading-[1.7] text-[#5c6359]">{phase.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {roadmapPhases.slice(1, 4).map((phase) => (
              <div key={phase.id} className="border-t border-[#1a1d19] pt-2.5">
                <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-[#697065]">
                  {phase.id.replace('phase-', 'Fase ')} · {phase.status}
                </p>
                <p className="mt-1 text-[10px] font-medium text-[#353b33]">{phase.name}</p>
                <p className="mt-1 text-[9px] leading-relaxed text-[#697065]">{phase.standard}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-11 bg-[#1a1d19] px-6 py-7 text-[#f2f0e9] sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#aeb5a9]">
                Decisión solicitada
              </p>
              <h3 className="mt-2 max-w-[560px] font-serif text-[1.8rem] leading-[1.05] tracking-[-0.02em]">
                Aprobar el primer paso, no la migración completa.
              </h3>
            </div>
            <span className="border border-[#4c5d2d] bg-[#2a331c] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8f56b]">
              Alcance · Diagnóstico + plan
            </span>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {decisions.map((decision, index) => (
              <div key={decision} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-[#4c5d2d] font-mono text-[8px] text-[#c8f56b]">
                  {index + 1}
                </span>
                <p className="text-[10px] leading-[1.7] text-[#cfd4ca]">{decision}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#3a4037] pt-4">
            <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#8f978a]">
              Preparado por el equipo UBIORA · Dirección de producto y CTO
            </p>
            <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#8f978a]">
              UBIORA · {REPORT_DATE.getFullYear()}
            </p>
          </div>
        </section>

        <section className="mt-10 border-t border-[#c9c7be] pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] text-[#8a9186]">Anexo A</span>
              <h3 className="font-serif text-[1.35rem] leading-none tracking-[-0.02em]">
                Metodología del scoring
              </h3>
            </div>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-[#697065]">
              CBOM · CycloneDX 1.7 · NIST IR 8547
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-[1.3fr_1fr]">
            <p className="text-[10px] leading-[1.8] text-[#5c6359]">
              Cada hallazgo recibe un score de 0 a 100 con cuatro factores: sensibilidad del dato
              (30%), vida útil del dato (25%), exposición del sistema (25%) y criticidad operativa
              (20%). El resultado se traduce en cuatro bandas —crítico, alto, medio y bajo— y en una
              ventana de migración. El CBOM conserva la trazabilidad del activo, su algoritmo, tamaño
              de llave, ubicación y propietario.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                ['Sensibilidad', '30%'],
                ['Vida útil', '25%'],
                ['Exposición', '25%'],
                ['Criticidad', '20%'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between border-b border-[#dcdad2] pb-1.5">
                  <span className="text-[9px] text-[#40463d]">{label}</span>
                  <span className="font-mono text-[9px]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-9 flex flex-wrap items-center justify-between gap-2 border-t border-[#c9c7be] pt-4">
          <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#697065]">
            UBIORA · Exposición criptográfica post-cuántica · {orgName}
          </p>
          <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#697065]">
            Generado desde CBOM v1.7 · {formatNumber(stats.total)} componentes
          </p>
        </footer>
      </article>

      <div className="no-print mx-auto mt-5 flex max-w-[1020px] flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.08em] text-dim">
          <Check className="size-3 text-acid" />
          Generado desde CBOM v1.7 · {formatNumber(stats.total)} componentes · {todayLabel()}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/hoja-de-ruta')}>
            Volver a la hoja de ruta <ArrowUpRight className="size-3.5" />
          </Button>
          <Button variant="secondary" size="sm" onClick={printReport} icon={<Printer className="size-3.5" />}>
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  )
}

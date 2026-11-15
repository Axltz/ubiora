# UBIORA

**Plataforma de descubrimiento y priorización de riesgo criptográfico post-cuántico.**

UBIORA permite a una empresa descubrir qué algoritmos criptográficos usa realmente, priorizar los activos que representan mayor riesgo frente a la computación cuántica y convertir ese inventario en una hoja de ruta de migración alineada a los estándares PQC del NIST.

> MVP académico para la materia de **Innovación y Tecnología**. Los datos, escaneos y hallazgos son simulados de forma determinista para demostrar el producto sin depender de infraestructura real.

![Resumen de exposición de UBIORA](docs/assets/screenshots/overview.png)

## El problema

La mayoría de las organizaciones no sabe qué criptografía usa, en qué sistemas, ni con qué criticidad. Sin un **Cryptographic Bill of Materials (CBOM)** no hay forma de planear la migración post-cuántica. Los plazos regulatorios ya existen y el riesgo *harvest now, decrypt later* convierte los datos capturados hoy en una obligación futura.

UBIORA no vende la migración completa: vende **visibilidad y priorización**. El primer paso que nadie ha dado.

## Qué incluye este MVP

| Módulo | Qué demuestra |
| --- | --- |
| **Resumen de exposición** | Score de readiness, reloj regulatorio, tendencia de hallazgos, mezcla de algoritmos y cola de prioridad. |
| **Inventario CBOM** | 1,284 componentes filtrables por ambiente, algoritmo y prioridad; selección masiva y exportación CSV / CycloneDX. |
| **Descubrimiento** | Configuración de alcance, consola de escaneo en vivo y resumen de hallazgos al terminar. |
| **Hoja de ruta** | Gantt 2026–2030, seis fases, entregables, dependencias e iniciativas priorizadas. |
| **Informe ejecutivo** | Documento editorial imprimible con hallazgos, decisiones solicitadas y metodología del scoring. |
| **Cómo funciona** | Guía en lenguaje claro con el flujo del producto, glosario mínimo, mapa de pantallas y guion de demo. |

La interfaz incluye además un **recorrido guiado** que lleva por las cinco pantallas paso a paso, búsqueda global (`⌘K` / `Ctrl+K`), notificaciones, drawer de detalle por activo y navegación responsive.

## Stack

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS 4** con tokens de diseño propios
- **React Router 7**
- **Lucide** para iconografía
- **Geist** / **Geist Mono** / **Newsreader** auto-hospedadas (sin dependencias de red en la demo)

No hay backend en esta fase: el motor de descubrimiento y el scoring están simulados en el cliente con datos deterministas. La arquitectura para conectar el motor real está documentada en [`docs/03-arquitectura.md`](docs/03-arquitectura.md).

## Desarrollo local

Requisitos: Node.js 20+ y npm 10+.

```bash
cd app
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

```bash
npm run build      # Typecheck + build de produccion
npm run preview    # Previsualizacion del build
npm run lint       # Oxlint
```

## Estructura del repositorio

```
.
├── app/                          # Aplicación React + Vite
│   ├── public/                   # Favicon y assets estáticos
│   └── src/
│       ├── components/
│       │   ├── brand/            # Identidad
│       │   ├── charts/           # Visualizaciones SVG a medida
│       │   ├── layout/           # Shell, sidebar y topbar
│       │   ├── tour/             # Recorrido guiado por las pantallas
│       │   └── ui/               # Primitivas: botones, badges, palette, toasts
│       ├── data/                 # Modelo, inventario simulado y hoja de ruta
│       ├── lib/                  # Utilidades, navegación y descargas
│       └── pages/                # Los cinco módulos y la guía "Cómo funciona"
├── docs/                         # Documentación de producto e ingeniería
│   ├── adr/                      # Architecture Decision Records
│   └── assets/screenshots/       # Capturas para documentación
├── ProyectoFinal.pdf             # Memoria original del proyecto
└── README.md
```

## Documentación

| Documento | Contenido |
| --- | --- |
| [`docs/README.md`](docs/README.md) | Índice y orden de lectura. |
| [`docs/01-producto-y-alcance.md`](docs/01-producto-y-alcance.md) | Problema, propuesta de valor, alcance y no-alcance del MVP. |
| [`docs/02-requerimientos.md`](docs/02-requerimientos.md) | Requerimientos funcionales y no funcionales, historias y trazabilidad. |
| [`docs/03-arquitectura.md`](docs/03-arquitectura.md) | Stack, diagrama de arquitectura, flujo de datos y plan de integración. |
| [`docs/04-datos-y-scoring.md`](docs/04-datos-y-scoring.md) | Modelo de datos, fórmula de riesgo y mapeo a CycloneDX. |
| [`docs/05-diseno-de-interfaz.md`](docs/05-diseno-de-interfaz.md) | Sistema de diseño, tipografía, componentes y criterios visuales. |
| [`docs/06-calidad-y-pruebas.md`](docs/06-calidad-y-pruebas.md) | Estrategia de pruebas, matriz manual y limitaciones conocidas. |
| [`docs/07-plan-de-entrega-y-demo.md`](docs/07-plan-de-entrega-y-demo.md) | Sprints, guion de demo y siguientes pasos. |
| [`docs/08-guia-de-uso.md`](docs/08-guia-de-uso.md) | Guía en lenguaje claro, recorrido guiado y glosario. |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Convenciones de commits, ramas y checklist de cambios. |

## Datos de demostración

El cliente ficticio es **Cobalto Pay**, una fintech mexicana de banca digital. El inventario se genera con una semilla determinista para que la demo sea reproducible:

- 1,284 componentes criptográficos.
- 17 hallazgos críticos.
- 4 ambientes: Producción, Core bancario, Staging y Desarrollo.
- 17 propietarios y 7 familias de algoritmos.
- Fecha de corte: **14 de noviembre de 2026**.

Ningún dato corresponde a una empresa real.

## Equipo

- **Carlos Fernando Rivera Leal** — Dirección General / Arquitectura de Producto.
- **Alex Guillermo Martínez Martínez** — CTO / Ingeniería de Desarrollo.

Proyecto académico de Ingeniería en Computación, 5.º semestre. Profesor: Rodrigo Antonio Campos Villarreal.

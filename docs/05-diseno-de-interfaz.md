# 05 · Diseño de interfaz

## 1. Intención

UBIORA debe parecer una herramienta de seguridad construida por un equipo con criterio, no una plantilla generada. La referencia mental no es un “dashboard SaaS” con tarjetas redondeadas y gradientes, sino una **consola de operaciones editorial**: densa, técnica, con acento quirúrgico y un documento ejecutivo que se siente impreso.

Tres principios guiaron cada decisión:

1. **Densidad con jerarquía.** Mostrar mucho sin ruido. El espacio, la tipografía y las líneas hacen el trabajo, no los colores.
2. **Un solo acento.** El lima ácido señala lo accionable. El rojo, ámbar y lila se reservan para riesgo.
3. **Contraste de contextos.** La operación vive en oscuro; el informe del consejo vive en papel claro con tipografía serif. Son dos productos en uno.

## 2. Sistema visual

### 2.1 Paleta

Definida como tokens en [`app/src/index.css`](../app/src/index.css).

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-ink` | `#080a09` | Fondo base. |
| `--color-ink-raised` | `#0b0e0c` | Sidebar y superficies elevadas. |
| `--color-panel` | `#0e1210` | Paneles. |
| `--color-surface` | `#131814` | Estados hover y elementos interactivos. |
| `--color-line` | `#202721` | Bordes de 1 px. |
| `--color-line-strong` | `#2d362e` | Bordes de énfasis. |
| `--color-paper` | `#e9efe6` | Texto principal. |
| `--color-muted` | `#939d94` | Texto secundario. |
| `--color-dim` | `#626b63` | Metadatos. |
| `--color-acid` | `#c8f56b` | Acento, CTA, estado positivo. |
| `--color-danger` | `#ff6f5e` | Riesgo crítico. |
| `--color-warn` | `#f0a35e` | Riesgo alto. |
| `--color-sky` | `#83c8e8` | En migración, información. |
| `--color-lilac` | `#b7a6f5` | Riesgo medio. |

El fondo no es negro puro: `#080a09` tiene un sesgo verde que evita el contraste duro y dialoga con el acento. El papel del informe es `#f2f0e9`, un off-white cálido.

### 2.2 Tipografía

| Rol | Fuente | Uso |
| --- | --- | --- |
| Interfaz | Geist Variable | Títulos, cuerpo, botones. |
| Datos | Geist Mono Variable | IDs, algoritmos, etiquetas, métricas, terminal. |
| Editorial | Newsreader Variable | Solo el informe ejecutivo. |

Las tres se sirven con `@fontsource-variable/*`, sin llamadas a Google Fonts. La interfaz usa `tracking` negativo en titulares (`-0.05em`) y `.tabular` para cifras. Las etiquetas usan mayúsculas, 8–10 px y `letter-spacing` amplio: es el recurso que separa el producto de un dashboard genérico.

### 2.3 Espaciado, radios y bordes

- Escala base de 4 px; contenedores con `gap-4` (16 px) y padding de 16–24 px.
- Radios: 6–10 px en controles, 14 px en paneles, 3 px en el papel del informe.
- Bordes de 1 px como estructura principal. No se usan sombras difusas en la interfaz operativa; solo en overlays.
- Fondo con retícula sutil (`grid-bg`) y puntos (`dot-bg`) en la terminal del descubrimiento.

## 3. Componentes

### 3.1 Primitivas (`components/ui`)

| Componente | Notas |
| --- | --- |
| `Button` | Cuatro variantes: primary, secondary, ghost, danger. Alturas 32/38/44 px. |
| `Badge` / `RiskBadge` / `Tag` | Riesgo con punto de color; etiquetas monoespaciadas. |
| `Panel` / `PanelHeader` | Contenedor con header de 58 px, eyebrow y acción. |
| `FilterSelect` | Select nativo estilizado; se ilumina cuando está activo. |
| `Toast` | Máximo tres toasts, autocierre a 4.6 s, `aria-label` para cerrar. |
| `CommandPalette` | Búsqueda global con grupos, teclado y foco atrapado. |

### 3.2 Gráficas (`components/charts`)

Todas son SVG hechas a medida, sin librería:

- **ReadinessGauge:** arco con gradiente, 24 ticks y animación de `stroke-dasharray`.
- **ExposureChart:** área suavizada con Bézier, tooltip por hover y rango 3/6/12 meses.
- **AlgorithmBars:** barra apilada + detalle por familia.
- **Sparkline:** mini tendencia en las tarjetas KPI.

La decisión evita 100–300 kB de dependencias y permite un lenguaje visual que no se reconoce como “chart por defecto”.

### 3.3 Tablas y drawer

- `RiskTable` es la tabla compacta del resumen y del descubrimiento; incluye navegación por teclado (`Enter`/`Espacio`).
- El inventario tiene su propia tabla con checkbox, filtros y paginación.
- `RiskDrawer` se renderiza con `createPortal` a `document.body`. Es indispensable: la animación `animate-rise` de la página aplica un `transform` que convierte al contenedor en *containing block* y rompe `position: fixed`. El portal aísla el drawer de ese contexto.

## 4. Layout

### 4.1 Shell

```
┌──────────────┬──────────────────────────────────────────────┐
│ Sidebar 240  │ TopBar 58 (breadcrumb, búsqueda, alertas)     │
│ workspace    ├──────────────────────────────────────────────┤
│ navegación   │ Main: max 1560 px, padding 24–32             │
│ motor        │                                              │
│ usuario      │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

- Sidebar fijo en desktop (`lg`), drawer con overlay en móvil.
- Topbar sticky con `backdrop-blur`.
- En móvil, el grid de KPIs pasa a dos columnas y las sparklines se ocultan para proteger la legibilidad.

### 4.2 Páginas

Cada módulo sigue el mismo ritmo:

1. Header editorial: tag de estado, título con clímax en gris, párrafo de contexto y acciones.
2. Banda de KPIs.
3. Contenido principal en grid de 12 columnas.
4. Banda de cierre con una decisión o CTA.

Esto crea consistencia sin repetir el mismo layout: el resumen es analítico, el inventario es una herramienta, el descubrimiento es una consola y el informe es un documento.

## 5. Interacción y movimiento

- Curvas principales: `cubic-bezier(0.16, 1, 0.3, 1)` para entrada; 150 ms para hover.
- `animate-rise` en la entrada de páginas (8 px, 0.5 s).
- `animate-slide-in` en el drawer (24 px, 0.32 s).
- La consola usa streaming por intervalos de 110 ms y auto-scroll.
- `prefers-reduced-motion` desactiva animaciones y transiciones.
- El botón de escaneo se deshabilita durante la ejecución; los filtros se bloquean mientras corre.

## 6. Accesibilidad

| Aspecto | Implementación |
| --- | --- |
| Foco | `:focus-visible` con outline ácido de 2 px y offset 2 px. |
| Teclado | Paleta (`Ctrl/⌘+K`), cierre con `Esc`, navegación con flechas y `Enter`; filas de tabla con `tabIndex`. |
| Etiquetas | `aria-label` en iconos y botones de cierre; `aria-expanded` en popovers. |
| Contraste | Texto principal sobre fondo oscuro supera AA; el texto `dim` se usa para metadatos no esenciales. |
| Movimiento | Respeto a `prefers-reduced-motion`. |
| Semántica | `header`, `nav`, `main`, `aside`, `table`, `aria-modal` en overlays. |

Pendiente: auditoría automatizada (axe) y revisión con lector de pantalla. Ver [`06-calidad-y-pruebas.md`](06-calidad-y-pruebas.md).

## 7. Responsive

| Breakpoint | Comportamiento |
| --- | --- |
| `< 640 px` | Una columna; KPIs en 2×2; sidebar en drawer; tablas con scroll horizontal; acciones compactas. |
| `640–1023 px` | Dos columnas donde aplica; sidebar aún en drawer. |
| `≥ 1024 px` | Sidebar fijo; grids de 2–3 columnas. |
| `≥ 1280 px` | Grid de 12 columnas completo; columnas secundarias de tablas visibles. |

El ancho mínimo soportado es 390 px (iPhone 14). El contenido nunca depende de hover para ser comprensible.

## 8. Informe ejecutivo

El informe rompe deliberadamente el lenguaje de la consola:

- Papel `#f2f0e9` con sombra de documento.
- Newsreader para titulares y cuerpo; mono solo para metadatos.
- Reglas horizontales de 1 px en lugar de tarjetas.
- Bloques en negro para la decisión solicitada.
- Capitular en el primer párrafo.
- `@page A4`, ocultamiento de `.no-print` y `break-inside: avoid` en secciones.

El objetivo es que al imprimir parezca un documento de consejo, no una captura de pantalla.

## 9. Lo que se evitó

- Gradientes decorativos y “glow” en cada tarjeta.
- Glassmorphism generalizado.
- Ilustraciones 3D o mascotas.
- Cards idénticas con icono, título y número.
- Colores pastel y sombras suaves por defecto.
- Dependencias de UI que imponen su propio look.
- Texto de relleno tipo “Lorem ipsum” o métricas sin contexto.

## 10. Archivos de referencia

- Tokens y estilos globales: [`app/src/index.css`](../app/src/index.css)
- Shell: [`app/src/components/layout/AppShell.tsx`](../app/src/components/layout/AppShell.tsx)
- Navegación: [`app/src/components/layout/Sidebar.tsx`](../app/src/components/layout/Sidebar.tsx)
- Paleta de comandos: [`app/src/components/ui/CommandPalette.tsx`](../app/src/components/ui/CommandPalette.tsx)
- Drawer: [`app/src/components/RiskDrawer.tsx`](../app/src/components/RiskDrawer.tsx)
- Informe: [`app/src/pages/Report.tsx`](../app/src/pages/Report.tsx)

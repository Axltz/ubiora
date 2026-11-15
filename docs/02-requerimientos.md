# 02 · Requerimientos

## 1. Convenciones

- **RF**: requerimiento funcional.
- **RNF**: requerimiento no funcional.
- **Prioridad**: `Must` (sin esto no hay demo), `Should` (eleva la calidad), `Could` (deseable).
- Los criterios de aceptación describen el comportamiento observable en el MVP.

## 2. Requerimientos funcionales

### Shell y navegación

| ID | Requerimiento | Prioridad | Criterio de aceptación |
| --- | --- | --- | --- |
| RF-01 | La aplicación debe ofrecer navegación persistente entre los cinco módulos. | Must | Desde cualquier módulo se puede llegar a Resumen, Descubrimiento, Inventario, Hoja de ruta e Informe en un clic. |
| RF-02 | La navegación debe indicar el módulo activo y adaptarse a móvil. | Must | El ítem activo tiene indicador visual; en `< 1024 px` se usa un drawer con overlay. |
| RF-03 | Debe existir búsqueda global con atajo de teclado. | Should | `Ctrl+K` / `⌘K` abre la paleta; `Esc` la cierra; las flechas y `Enter` navegan y ejecutan. |

### Resumen de exposición

| ID | Requerimiento | Prioridad | Criterio de aceptación |
| --- | --- | --- | --- |
| RF-04 | Mostrar score de readiness, hallazgos críticos, activos totales, expuestos a Internet e híbridos. | Must | Los cinco indicadores se leen sin scroll en desktop de 1440 px. |
| RF-05 | Mostrar el plazo regulatorio NIST y las tres fechas clave. | Must | Se muestran días restantes al 31/12/2030 y las fechas 2030, 2031 y 2035. |
| RF-06 | Visualizar la tendencia de hallazgos en 3, 6 y 12 meses. | Should | Cambiar el rango actualiza la serie y el porcentaje de cambio. |
| RF-07 | Mostrar la concentración por familia de algoritmos. | Must | Se listan familias con conteo, porcentaje y barra proporcional. |
| RF-08 | Mostrar una cola de prioridad con los activos de mayor score. | Must | La tabla muestra al menos 5 activos ordenados por score descendente. |
| RF-09 | Abrir el detalle de un activo desde la tabla. | Must | Un clic abre un drawer con score, ficha, recomendación y trazabilidad; `Esc` lo cierra. |

### Inventario CBOM

| ID | Requerimiento | Prioridad | Criterio de aceptación |
| --- | --- | --- | --- |
| RF-10 | Listar 1,284 componentes con paginación. | Must | Se muestran 14 filas por página y la navegación indica el rango actual. |
| RF-11 | Buscar por activo, algoritmo, ubicación, dueño o tipo. | Must | La búsqueda filtra en tiempo real y muestra el número de resultados. |
| RF-12 | Filtrar por ambiente, algoritmo y prioridad. | Must | Los filtros son combinables y se pueden limpiar en un clic. |
| RF-13 | Ordenar por score ascendente o descendente. | Should | El botón alterna el orden y reinicia la paginación. |
| RF-14 | Seleccionar filas y operar sobre la selección. | Should | El contador de seleccionados aparece y la exportación respeta la selección. |
| RF-15 | Exportar CBOM a JSON CycloneDX 1.7. | Should | Se descarga un archivo con metadatos, componentes y propiedades de riesgo. |
| RF-16 | Exportar inventario a CSV. | Should | Se descarga un CSV UTF-8 con encabezados legibles. |
| RF-17 | Abrir la vista filtrada de críticos desde otros módulos. | Should | La ruta `/inventario?riesgo=Crítico` aplica el filtro al entrar. |

### Descubrimiento

| ID | Requerimiento | Prioridad | Criterio de aceptación |
| --- | --- | --- | --- |
| RF-18 | Configurar entorno, superficies y profundidad del escaneo. | Must | El usuario puede activar/desactivar superficies y cambiar profundidad antes de iniciar. |
| RF-19 | Iniciar un descubrimiento simulado. | Must | El botón inicia una ejecución con progreso y logs en streaming. |
| RF-20 | Mostrar fases y porcentaje de avance. | Must | Se identifica la fase actual y una barra de progreso avanza hasta 100%. |
| RF-21 | Mostrar un resumen al completar. | Must | Aparecen 1,284 componentes, 17 críticos, 142 híbridos y 4m 12s de duración. |
| RF-22 | Permitir reiniciar el descubrimiento. | Should | “Nuevo escaneo” limpia logs, progreso y resultados. |
| RF-23 | Permitir navegar a los hallazgos al terminar. | Must | “Ver inventario” lleva al módulo CBOM. |

### Hoja de ruta

| ID | Requerimiento | Prioridad | Criterio de aceptación |
| --- | --- | --- | --- |
| RF-24 | Visualizar seis fases en un Gantt 2026–2030. | Must | Cada fase tiene inicio, fin, estado y reducción de riesgo acumulada. |
| RF-25 | Marcar la posición actual (“hoy”). | Should | Una línea vertical punteada indica noviembre de 2026. |
| RF-26 | Seleccionar una fase y ver su detalle. | Must | El panel inferior cambia a la fase seleccionada con entregables y dependencias. |
| RF-27 | Filtrar iniciativas por estado. | Should | Se puede ver Todas, En curso, Planificado y Completado. |
| RF-28 | Exportar el plan a CSV. | Could | Se descarga un CSV con las seis fases y sus datos principales. |

### Informe ejecutivo

| ID | Requerimiento | Prioridad | Criterio de aceptación |
| --- | --- | --- | --- |
| RF-29 | Renderizar un informe de dos páginas con narrativa ejecutiva. | Must | Incluye resumen, hallazgos, ruta, decisión solicitada y metodología. |
| RF-30 | Imprimir o guardar como PDF desde el navegador. | Must | `window.print()` produce un documento limpio sin sidebar, topbar ni controles. |
| RF-31 | Copiar el enlace del informe. | Could | Se copia la URL y se confirma con un toast. |

### Feedback y sistema

| ID | Requerimiento | Prioridad | Criterio de aceptación |
| --- | --- | --- | --- |
| RF-32 | Mostrar toasts para acciones relevantes. | Should | Exportar, copiar, completar un escaneo y añadir a la hoja de ruta generan feedback. |
| RF-33 | Mostrar alertas recientes en la topbar. | Could | El popover lista tres alertas con severidad y hora. |

## 3. Requerimientos no funcionales

| ID | Categoría | Requerimiento | Verificación |
| --- | --- | --- | --- |
| RNF-01 | Rendimiento | El bundle inicial debe mantenerse por debajo de 500 kB sin compresión y 150 kB gzip. | `npm run build` (actual: ~451 kB / ~131 kB gzip). |
| RNF-02 | Tipado | El proyecto debe compilar con TypeScript estricto sin errores. | `tsc -b` dentro de `npm run build`. |
| RNF-03 | Accesibilidad | Navegación por teclado, foco visible, etiquetas `aria` en iconos y contraste AA en texto principal. | Revisión manual; no hay auditoría automatizada todavía. |
| RNF-04 | Responsive | La aplicación debe ser usable desde 390 px hasta 1920 px. | Capturas en 390 px y 1440 px. |
| RNF-05 | Offline | Las fuentes deben servirse desde el bundle, sin Google Fonts. | `@fontsource-variable/*` en `app/src/index.css`. |
| RNF-06 | Determinismo | Los datos de demo deben ser idénticos en cada carga. | Generador con semilla `0x2f6e2b1` en `app/src/data/assets.ts`. |
| RNF-07 | Privacidad | No se deben enviar datos a servicios externos. | Sin llamadas de red en runtime. |
| RNF-08 | Impresión | El informe debe imprimirse en A4 sin controles de UI. | `@media print` en `app/src/index.css`. |
| RNF-09 | Compatibilidad | Últimas dos versiones de Chrome, Edge, Firefox y Safari. | Prueba manual en Chromium; pendiente matriz completa. |
| RNF-10 | Mantenibilidad | Componentes de UI reutilizables y datos separados de la presentación. | Estructura `components/ui`, `components/charts`, `data/`. |
| RNF-11 | Idioma | La interfaz y la documentación están en español; los términos técnicos se conservan en inglés. | Revisión de copy. |

## 4. Historias de usuario principales

### HU-01 · Entender la postura general

> Como CISO, quiero ver en una pantalla mi readiness post-cuántico y los activos críticos para saber si estoy en riesgo.

**Aceptación:** el resumen muestra score, críticos, plazo NIST y top de riesgos; el CTA principal lleva al descubrimiento.

### HU-02 · Encontrar un activo específico

> Como ingeniero de seguridad, quiero buscar un servicio por nombre y ver su algoritmo, ubicación y recomendación.

**Aceptación:** la búsqueda filtra el inventario y el drawer muestra la ficha completa.

### HU-03 · Exportar evidencia

> Como auditor, quiero descargar el CBOM en un formato estándar para revisarlo fuera de la plataforma.

**Aceptación:** el JSON descargado declara `bomFormat: CycloneDX`, `specVersion: 1.7` y contiene los componentes filtrados.

### HU-04 · Ejecutar un descubrimiento

> Como CTO, quiero lanzar un escaneo y ver qué encuentra el motor sin esperar a una consultoría.

**Aceptación:** el flujo muestra configuración, progreso, logs y resumen final.

### HU-05 · Presentar un plan al consejo

> Como director general, quiero un documento que explique el riesgo y pida una decisión concreta.

**Aceptación:** el informe se imprime en dos páginas y contiene una sección “Decisión solicitada”.

### HU-06 · Priorizar la migración

> Como líder de plataforma, quiero saber qué migrar primero y con qué estándar.

**Aceptación:** cada fase de la hoja de ruta indica estándar, entregables, dependencias y reducción de riesgo.

## 5. Matriz de trazabilidad

| Requerimiento | Implementación |
| --- | --- |
| RF-01–RF-03 | `components/layout/AppShell.tsx`, `Sidebar.tsx`, `TopBar.tsx`, `ui/CommandPalette.tsx` |
| RF-04–RF-09 | `pages/Overview.tsx`, `components/charts/*`, `components/RiskTable.tsx`, `RiskDrawer.tsx` |
| RF-10–RF-17 | `pages/Inventory.tsx`, `ui/FilterSelect.tsx`, `lib/download.ts` |
| RF-18–RF-23 | `pages/Discovery.tsx` |
| RF-24–RF-28 | `pages/Roadmap.tsx`, `data/roadmap.ts` |
| RF-29–RF-31 | `pages/Report.tsx`, `index.css` (`@media print`) |
| RF-32–RF-33 | `ui/Toast.tsx`, `layout/TopBar.tsx` |
| RNF-05 | `@fontsource-variable/geist`, `geist-mono`, `newsreader` |
| RNF-06 | `data/assets.ts` (`makeGeneratedAssets`) |

## 6. Supuestos y restricciones

- El entorno de demo tiene conexión a Internet solo para instalar dependencias; la app funciona sin red después del build.
- El navegador soporta `Blob`, `URL.createObjectURL` y `navigator.clipboard`.
- La impresión depende del navegador; no se genera un PDF en servidor.
- No hay autenticación: todas las rutas son públicas en la demo.
- El volumen de datos (1,284 registros) es suficiente para demostrar filtros y paginación, pero no representa un CBOM empresarial completo.

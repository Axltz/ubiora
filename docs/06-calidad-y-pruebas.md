# 06 · Calidad y pruebas

## 1. Enfoque

El MVP no tiene una suite de pruebas automatizadas. La estrategia fue **verificación en tres capas**:

1. **Estática:** TypeScript estricto y Oxlint en cada cambio.
2. **Build:** `npm run build` debe producir un bundle sin errores.
3. **Exploratoria:** recorrido manual de las cinco rutas en desktop y móvil, con inspección de consola y capturas.

La ausencia de tests automatizados es una limitación consciente del alcance académico, no una afirmación de que el producto esté listo para producción.

## 2. Comandos de verificación

```bash
cd app

npm run build     # tsc -b && vite build
npm run lint      # oxlint
npm run preview   # sirve el build de producción
```

Resultado esperado del build actual:

| Artefacto | Tamaño | Gzip |
| --- | --- | --- |
| JavaScript | ~451 kB | ~131 kB |
| CSS | ~62 kB | ~11 kB |
| Fuentes | ~250 kB (todas las variantes) | — |

El presupuesto definido en [RNF-01](02-requerimientos.md) es 500 kB / 150 kB gzip para JS. Se cumple con poco margen; cualquier librería de gráficas o de componentes lo rompería.

## 3. Matriz de pruebas manuales

Última ejecución: **14 de noviembre de 2026**, Chromium (Playwright) en 1440×1100 y 390×844.

### 3.1 Navegación y shell

| # | Caso | Resultado |
| --- | --- | --- |
| N-01 | Cargar `/` y ver el resumen | ✅ |
| N-02 | Navegar a los cinco módulos desde el sidebar | ✅ |
| N-03 | Abrir/cerrar el drawer móvil con overlay y `Esc` | ✅ |
| N-04 | Abrir la paleta con `Ctrl+K`, filtrar y ejecutar | ✅ |
| N-05 | Abrir el popover de alertas y cerrarlo al hacer clic fuera | ✅ |
| N-06 | Cambiar de workspace en el selector | ✅ (cambio visual) |
| N-07 | Ruta desconocida renderiza el resumen | ✅ |

### 3.2 Resumen

| # | Caso | Resultado |
| --- | --- | --- |
| O-01 | Leer KPIs y sparklines sin desbordes en 1440 px | ✅ |
| O-02 | Cambiar rango 3M / 6M / 12M y verificar la serie | ✅ |
| O-03 | Hover sobre la gráfica de exposición y ver tooltip | ✅ |
| O-04 | Abrir drawer desde la cola de prioridad y cerrar con `Esc` | ✅ |
| O-05 | Verificar que el drawer ocupa el viewport correctamente | ✅ (ver §5) |
| O-06 | Navegar al inventario filtrado por críticos | ✅ |
| O-07 | Revisar layout móvil en 390 px | ✅ |

### 3.3 Inventario

| # | Caso | Resultado |
| --- | --- | --- |
| I-01 | Cargar 1,284 registros y paginar | ✅ |
| I-02 | Buscar por activo, algoritmo, ubicación y dueño | ✅ |
| I-03 | Combinar filtros de ambiente, algoritmo y prioridad | ✅ |
| I-04 | Limpiar filtros y restaurar el total | ✅ |
| I-05 | Alternar orden por score | ✅ |
| I-06 | Seleccionar filas y ver el contador | ✅ |
| I-07 | Exportar CBOM (JSON) y abrir el archivo | ✅ |
| I-08 | Exportar CSV y verificar BOM/acentos | ✅ |
| I-09 | Entrar con `?riesgo=Crítico` y ver el filtro aplicado | ✅ |
| I-10 | Abrir el detalle de un activo | ✅ |

### 3.4 Descubrimiento

| # | Caso | Resultado |
| --- | --- | --- |
| D-01 | Alternar superficies y ver el conteo estimado | ✅ |
| D-02 | Intentar iniciar sin superficies | ✅ muestra advertencia |
| D-03 | Iniciar escaneo y ver progreso + logs | ✅ |
| D-04 | Bloquear cambios de configuración durante la ejecución | ✅ |
| D-05 | Completar al 100% y ver resumen | ✅ |
| D-06 | Reiniciar con “Nuevo escaneo” | ✅ |
| D-07 | Navegar a los hallazgos | ✅ |

### 3.5 Hoja de ruta

| # | Caso | Resultado |
| --- | --- | --- |
| R-01 | Ver las seis fases en el Gantt | ✅ |
| R-02 | Verificar la línea de “hoy” en nov 2026 | ✅ |
| R-03 | Seleccionar una fase y ver su detalle | ✅ |
| R-04 | Filtrar iniciativas por estado | ✅ |
| R-05 | Exportar el plan a CSV | ✅ |

### 3.6 Informe

| # | Caso | Resultado |
| --- | --- | --- |
| P-01 | Ver el informe en pantalla con tipografía serif | ✅ |
| P-02 | Copiar enlace y confirmar toast | ✅ |
| P-03 | Abrir el diálogo de impresión | ✅ |
| P-04 | Emular `print` y verificar que se ocultan sidebar/topbar | ✅ |
| P-05 | Verificar A4 sin cortes en el contenido principal | ✅ (revisión visual) |

### 3.7 Consola del navegador

Se recorrieron las cinco rutas con Playwright escuchando `console.error` y `pageerror`. Resultado: **sin errores**.

## 4. Pruebas de regresión clave

Estas son las que deben repetirse si se toca el layout o los datos:

1. **Drawer visible:** abrir una fila de la tabla y verificar que el panel arranca en `y = 0` y mide el alto del viewport. Si aparece desplazado o con `y` negativo, se rompió el portal.
2. **Conteos:** el inventario debe seguir mostrando 1,284 registros y 17 críticos.
3. **Determinismo:** recargar dos veces y comparar los primeros IDs y scores.
4. **Exportación:** descargar el JSON y verificar `bomFormat` y `specVersion`.
5. **Impresión:** el informe no debe incluir navegación ni botones.

## 5. Defectos corregidos

| Defecto | Causa | Corrección |
| --- | --- | --- |
| El drawer aparecía desplazado y fuera de pantalla | El `transform` de `animate-rise` en la página creaba un *containing block* para `position: fixed`. | Se renderiza con `createPortal` a `document.body`. |
| Los KPIs móviles quedaban en una sola columna y las sparklines se comprimían | Grid de una columna en `< 640 px`. | Grid 2×2, separadores correctos y sparklines ocultas en móvil. |
| El encabezado del inventario decía “10 propietarios” con 17 reales | Texto hardcodeado. | Se usa `stats.owners`. |
| Los timestamps de la terminal crecían demasiado lento | Cálculo de segundos incorrecto. | Se ajustó el paso a 16 s por línea. |
| El botón de inicio aparecía duplicado en el descubrimiento | CTA en la barra de progreso y en el panel de configuración. | Se dejó una sola acción principal. |

## 6. Limitaciones conocidas

| Área | Limitación | Impacto |
| --- | --- | --- |
| Scoring | El score está precalculado; la fórmula de cuatro factores no se ejecuta en runtime. | La explicación del drawer es ilustrativa, no un cálculo verificable. |
| Datos | Inventario simulado de 1,284 registros, no un CBOM real. | No refleja dependencias ni configuraciones de un cliente. |
| Escaneo | Simulación con temporizador; no hay motor ni red. | No descubre activos reales. |
| Exportación | CycloneDX no se valida contra el esquema oficial; no hay firma. | El archivo es una aproximación útil para demo. |
| PDF | Se usa la impresión del navegador. | El resultado depende de márgenes y del motor de impresión. |
| Accesibilidad | Sin auditoría axe ni pruebas con lector de pantalla. | Puede haber barreras no detectadas. |
| Tests | Sin suite unitaria, de integración ni E2E versionada. | Las regresiones dependen de revisión manual. |
| Persistencia | El estado se pierde al recargar. | No hay cuentas, sesiones ni historial. |
| Internacionalización | Copia en español hardcodeada. | No hay selector de idioma. |

## 7. Siguiente nivel de calidad

Si el proyecto continúa, el orden recomendado es:

1. **Vitest + Testing Library** para scoring, filtros del inventario y generación de CBOM.
2. **Playwright E2E** con los flujos de la matriz anterior.
3. **Validación de CycloneDX** con el esquema oficial en CI.
4. **axe-core** en las rutas principales.
5. **CI en GitHub Actions:** install, lint, build, tests.
6. **Presupuesto de bundle** con `vite-bundle-visualizer` o un check de tamaño.
7. **Pruebas de contrato** cuando exista el motor real.

## 8. Criterio de aceptación de la entrega

La entrega se considera verificada si:

- `npm run build` termina sin errores.
- Las cinco rutas cargan sin errores de consola.
- La matriz manual de §3 se ejecuta sin fallos.
- El informe se imprime sin controles de interfaz.
- Los conteos y el determinismo se mantienen.

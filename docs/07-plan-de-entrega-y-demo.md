# 07 · Plan de entrega y demo

## 1. Objetivo de la entrega

Llevar a la clase un MVP navegable que permita entender el problema, ver el producto y defender las decisiones de diseño e ingeniería en menos de diez minutos. La demo no depende de Internet ni de backend: corre desde una laptop con `npm run dev` o un build estático.

## 2. Alcance comprometido

| Entregable | Estado |
| --- | --- |
| Aplicación web con cinco módulos | Completado |
| Inventario CBOM de 1,284 componentes | Completado |
| Descubrimiento simulado con consola | Completado |
| Hoja de ruta 2026–2030 | Completado |
| Informe ejecutivo imprimible | Completado |
| Exportación CSV y CycloneDX | Completado |
| Documentación de producto e ingeniería | Completado |
| Repositorio con historial coherente | Completado |
| Suite de pruebas automatizada | Fuera de alcance |
| Motor de escaneo real | Fuera de alcance |

## 3. Organización del trabajo

El proyecto se ejecutó en sprints cortos de una a dos semanas, con entregas verticales: cada bloque terminaba en una pantalla usable, no en una capa técnica aislada.

| Sprint | Foco | Resultado |
| --- | --- | --- |
| S0 | Investigación y alcance | Problema, usuario, competencia y propuesta. |
| S1 | Sistema de diseño y shell | Tokens, tipografía, navegación, command palette. |
| S2 | Modelo de datos y scoring | 1,284 activos, agregados, hoja de ruta como dato. |
| S3 | Resumen de exposición | KPIs, gauge, gráficas, tabla y drawer. |
| S4 | Inventario CBOM | Filtros, paginación, selección y exportación. |
| S5 | Descubrimiento | Configuración, consola, progreso y cierre. |
| S6 | Hoja de ruta | Gantt, fases, iniciativas y CSV. |
| S7 | Informe ejecutivo | Documento imprimible y estilos A4. |
| S8 | Documentación y pulido | QA visual, README, docs, ADRs y commits. |

### Roles

| Persona | Rol | Responsabilidad |
| --- | --- | --- |
| Carlos Fernando Rivera Leal | Dirección general / producto | Narrativa, alcance, demo y relación con el problema. |
| Alex Guillermo Martínez Martínez | CTO / ingeniería | Arquitectura, implementación y calidad técnica. |

En un equipo más grande, los roles naturales siguientes serían diseñador de producto, ingeniero de datos y especialista en seguridad.

## 4. Preparación de la demo

### 4.1 Checklist previo

- [ ] `cd app && npm install` ejecutado en la laptop.
- [ ] `npm run build` sin errores.
- [ ] Servidor levantado con `npm run dev` (o `npm run preview` sobre el build).
- [ ] Navegador en 1440×900, zoom 100%, sin extensiones que alteren la página.
- [ ] Pestañas preabiertas: resumen, inventario, descubrimiento, hoja de ruta e informe.
- [ ] Datos deterministas verificados (17 críticos, 1,284 componentes).
- [ ] Plan B: capturas en [`docs/assets/screenshots/`](assets/screenshots/) si falla la laptop.
- [ ] Plan C: build estático servido desde otra máquina o USB.

### 4.2 Comando

```bash
cd app
npm install
npm run dev
```

Abrir `http://localhost:5173`.

## 5. Guion de demo (6 minutos)

### 0:00–0:45 · El problema

> “Cada empresa usa criptografía en cientos de lugares que no aparecen en ningún diagrama. El 84% cree que parte de sus datos cifrados ya está expuesta. La migración post-cuántica no empieza con un algoritmo: empieza con un inventario que nadie tiene.”

Abrir el resumen. Señalar el score de readiness (34/100) y el reloj regulatorio (días para 2030).

### 0:45–2:00 · La postura

> “Este es Cobalto Pay, una fintech mexicana ficticia. 1,284 componentes, 17 críticos, 387 expuestos a Internet. El 31% depende de RSA. Lo importante no es el número: es que ya sabemos dónde está.”

Mostrar la tendencia, el cambio de rango y la mezcla de algoritmos. Abrir un activo de la cola de prioridad:

> “El ledger-signer tiene score 97. No es solo RSA-3072: firma transacciones que deben verificarse por años. Por eso su ventana es 2027 y no 2030.”

### 2:00–3:15 · El descubrimiento

Ir a Descubrimiento. Mostrar el alcance configurable.

> “El motor recorre endpoints, certificados, dependencias, contenedores y secretos. Solo lectura: no intercepta tráfico ni descarga llaves privadas.”

Iniciar el escaneo. Mientras corre:

> “La consola muestra hallazgos en vivo. Esto es una simulación de la experiencia; el motor real se conecta en la siguiente fase.”

Esperar el resumen: 1,284 componentes, 17 críticos, 142 híbridos, 4m 12s. Navegar al inventario.

### 3:15–4:15 · El inventario y la evidencia

> “Cada hallazgo se normaliza a un CBOM CycloneDX. Se puede buscar, filtrar y exportar. Esto es lo que un auditor puede revisar.”

Filtrar por Crítico. Abrir un activo. Mostrar la recomendación, la vida útil y la ubicación.

> “La diferencia entre UBIORA y una hoja de cálculo es que el riesgo está priorizado con contexto de negocio.”

Exportar el CBOM (si el tiempo lo permite) y mostrar el toast.

### 4:15–5:15 · El plan

Ir a Hoja de ruta.

> “Seis fases. Primero se retira lo que ya está roto; después se crea agilidad; al final se migra el core. Cada fase tiene dueño, estándar, entregables y dependencia. La línea de hoy marca noviembre de 2026.”

Seleccionar una fase y mostrar el detalle. Señalar la reducción acumulada.

### 5:15–6:00 · La decisión

Ir al Informe ejecutivo.

> “El consejo no lee un dashboard. Lee un documento de dos páginas con una decisión concreta: aprobar el primer paso, no la migración completa.”

Mostrar la sección “Decisión solicitada” y la metodología. Cerrar:

> “UBIORA no vende la migración. Vende la visibilidad y la priorización que la hacen posible.”

## 6. Preguntas previsibles

| Pregunta | Respuesta corta |
| --- | --- |
| ¿Usan datos reales? | No. Cobalto Pay es ficticio; el inventario es determinista y está documentado. |
| ¿El escaneo es real? | No en esta entrega. La UI está lista para un motor FastAPI + workers; el contrato está en `docs/03-arquitectura.md`. |
| ¿Cómo calculan el riesgo? | Cuatro factores ponderados: sensibilidad 30%, vida útil 25%, exposición 25% y criticidad 20%. En el MVP el score está precalculado; la fórmula se implementará en el motor. |
| ¿Por qué no usaron una librería de gráficas? | Control visual, menor peso y una estética que no se reconoce como plantilla. |
| ¿Dónde está el valor de negocio? | Reemplaza una consultoría de inventario de semanas por un diagnóstico continuo y priorizado. |
| ¿Qué sigue? | Autenticación, motor real, validación CycloneDX, persistencia y monitoreo continuo. |

## 7. Riesgos de la demo y mitigación

| Riesgo | Probabilidad | Mitigación |
| --- | --- | --- |
| Falla el servidor local | Baja | Tener `npm run preview` y capturas listas. |
| El escaneo tarda más de lo previsto | Media | Hablar mientras corre; el resumen aparece en ~6 s. |
| El navegador bloquea la descarga | Baja | Mostrar el toast y el archivo en la carpeta de descargas. |
| La impresión cambia de página | Media | Ya se probó con `emulateMedia('print')`; llevar un PDF de respaldo. |
| Pregunta técnica sin respuesta | Media | Ofrecer la documentación y el ADR correspondiente. |
| Falta de tiempo | Media | El guion tiene marcadores; se puede saltar el inventario y cerrar con el informe. |

## 8. Publicación

El repositorio es `https://github.com/Axltz/ubiora`. Para publicar la app:

### Opción A · Vercel / Netlify

- Directorio: `app`
- Comando de build: `npm run build`
- Directorio de salida: `dist`
- Fallback SPA: `index.html`
- Sin variables de entorno.

### Opción B · GitHub Pages

Requiere `base` en `vite.config.ts` y un fallback de rutas (404.html). No es la opción más simple para React Router con rutas limpias.

### Opción C · Servidor propio

Servir `app/dist` con Nginx y `try_files $uri $uri/ /index.html`.

## 9. Siguientes pasos del producto

| Fase | Alcance | Resultado esperado |
| --- | --- | --- |
| F1 | Motor de descubrimiento TLS/X.509 y SCA | Hallazgos reales normalizados a CycloneDX. |
| F2 | Backend, autenticación y persistencia | Historial de escaneos y multiusuario. |
| F3 | Scoring ejecutable y validación | Score reproducible, pruebas de referencia y validación de esquema. |
| F4 | Integraciones SIEM/GRC y API | UBIORA dentro del flujo del CISO. |
| F5 | Monitoreo continuo y alertas | Cambio de criptografía detectado en producción. |

## 10. Cierre

El MVP demuestra la hipótesis central del proyecto: **la migración post-cuántica se vuelve accionable cuando existe un inventario priorizado**. La interfaz, los datos simulados y la documentación están diseñados para que esa idea se entienda y se defienda, no para aparentar que el producto ya está terminado.

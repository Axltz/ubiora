# UBIORA — Guía de uso y exposición desde cero

> Esta guía asume que **no sabes nada del proyecto** y que el sistema está **vacío**. Al final vas a poder instalarlo, usarlo completo y presentarlo frente al jurado sin depender de datos precargados.
>
> Documento hermano: [`GUIA_EMPRESA_Y_PROYECTO.md`](GUIA_EMPRESA_Y_PROYECTO.md) explica la empresa, el problema y el modelo de negocio en lenguaje sencillo.

---

## Índice

1. [Qué es UBIORA en una frase](#1-qué-es-ubiora-en-una-frase)
2. [Requisitos e instalación](#2-requisitos-e-instalación)
3. [Cómo arrancar el sistema](#3-cómo-arrancar-el-sistema)
4. [El sistema arranca vacío: qué significa](#4-el-sistema-arranca-vacío-qué-significa)
5. [Recorrido completo desde cero](#5-recorrido-completo-desde-cero)
6. [Funcionalidades pantalla por pantalla](#6-funcionalidades-pantalla-por-pantalla)
7. [Atajos y comportamientos útiles](#7-atajos-y-comportamientos-útiles)
8. [Guion de exposición de 10–12 minutos](#8-guion-de-exposición-de-1012-minutos)
9. [Versión corta de 5 minutos](#9-versión-corta-de-5-minutos)
10. [Si algo falla durante la exposición](#10-si-algo-falla-durante-la-exposición)
11. [Preguntas del jurado y respuestas](#11-preguntas-del-jurado-y-respuestas)
12. [Checklist final](#12-checklist-final)
13. [Apéndice técnico](#13-apéndice-técnico)

---

## 1. Qué es UBIORA en una frase

**UBIORA descubre qué criptografía usa realmente una empresa, la ordena en un inventario estándar (CBOM) y la prioriza según el riesgo que corre frente a las computadoras cuánticas.**

No vende la migración completa. Vende **visibilidad y priorización**: el primer paso que casi nadie ha dado.

La demo se apoya en tres ideas:

- **CBOM**: la “lista de materiales criptográficos” de la empresa. Qué algoritmo usa cada sistema, dónde vive y quién es responsable.
- **Riesgo post-cuántico**: RSA, ECDSA y Diffie-Hellman dejarán de ser seguros cuando existan computadoras cuánticas suficientemente grandes.
- **HNDL (“Harvest now, decrypt later”)**: alguien puede copiar tus datos cifrados hoy y descifrarlos en el futuro. Por eso el riesgo empieza antes de que exista el computador cuántico.

---

## 2. Requisitos e instalación

### 2.1 Lo que necesitas

| Herramienta | Versión recomendada | Para qué |
| --- | --- | --- |
| Node.js | 20 o superior | Ejecutar la interfaz web |
| npm | 10 o superior | Instalar dependencias |
| Python | 3.11 o superior | Motor real de escaneo TLS (opcional) |
| Navegador | Chrome, Edge o Firefox actualizado | Ver la aplicación |
| Conexión a Internet | Solo la primera vez | Instalar dependencias y escanear dominios reales |

Comprueba que están instalados:

```powershell
node --version
npm --version
python --version
```

Si algún comando no existe, instala Node.js desde <https://nodejs.org> y Python desde <https://python.org>. Marca la opción **“Add to PATH”** durante la instalación de Python.

### 2.2 Instalar dependencias del frontend

Abre PowerShell en la carpeta del proyecto:

```powershell
cd "C:\Universidad\6to Semestre\Ubiora"
npm install --prefix app
```

Esto descarga React, Vite, Tailwind y el resto de librerías. Solo se hace una vez (o cuando cambie `package.json`).

---

## 3. Cómo arrancar el sistema

Necesitas **dos terminales** si quieres el escaneo real con Python. Si no, con una sola terminal basta.

### Terminal 1 — Motor de escaneo Python (recomendado)

```powershell
cd "C:\Universidad\6to Semestre\Ubiora\scanner"
python server.py
```

Debe aparecer:

```text
[*] Servidor de descubrimiento UBIORA activo en http://localhost:8080
```

Déjala abierta. Este servidor escucha en `http://localhost:8080` y expone:

- `POST /api/scan` — recibe hosts y devuelve activos + CBOM.
- `GET /api/health` — confirma que está vivo.

### Terminal 2 — Aplicación web

```powershell
cd "C:\Universidad\6to Semestre\Ubiora"
npm --prefix app run dev
```

Abre el navegador en:

```text
http://localhost:5173
```

### Si no quieres usar Python

La aplicación funciona igual. Cuando escaneas sin backend, el navegador genera el CBOM con la misma fórmula de riesgo y lo avisa en la consola:

```text
⚙ Sin backend Python: inspección TLS simulada en el navegador
```

Para una exposición **lo ideal es tener Python activo**, porque el jurado ve el handshake real. El modo sin backend es el paracaídas.

### Compilar para producción (opcional)

```powershell
cd "C:\Universidad\6to Semestre\Ubiora\app"
npm run build
npm run preview
```

`npm run build` valida TypeScript y genera la carpeta `app/dist`. `npm run preview` sirve esa versión compilada.

---

## 4. El sistema arranca vacío: qué significa

La aplicación **no trae activos, empresas, escaneos ni métricas inventadas**. Al abrirla por primera vez verás:

- KPIs en cero.
- Readiness en 0.
- Inventario vacío.
- Mensaje “El sistema está limpio” con dos botones: **Ejecutar descubrimiento** y **Cargar ejemplo**.
- Hoja de ruta e informe disponibles como plantillas, pero el informe no se genera hasta que existan activos.

Todo lo que veas después sale de:

1. Tus escaneos reales, o
2. El catálogo de ejemplo que se carga solo si tú pulsas **Cargar ejemplo**.

Los datos se guardan en el navegador con `localStorage`, así que sobreviven a recargas. Claves usadas:

| Clave | Contenido |
| --- | --- |
| `ubiora.assets.v1` | Activos del inventario |
| `ubiora.scans.v1` | Historial de escaneos |
| `ubiora.org.v1` | Nombre de la organización |
| `ubiora.demo.v1` | Indica si el catálogo actual es de ejemplo |

Para volver a cero desde la interfaz: **Descubrimiento → Vaciar inventario** o **Inventario → Vaciar**. En el resumen también aparece **Vaciar datos de ejemplo** cuando cargaste el ejemplo.

---

## 5. Recorrido completo desde cero

Este es el flujo que debes practicar. Dura entre 5 y 10 minutos.

### Paso 1 — Abre el resumen

Ruta: **Resumen de exposición** (`/`).

Vas a ver el estado vacío. No lo ocultes: úsalo a tu favor.

> “El sistema arranca limpio a propósito. No hay datos de una empresa ficticia precargados. Lo que vean a continuación lo vamos a generar en vivo.”

### Paso 2 — Ejecuta un descubrimiento

Ruta: **Descubrimiento** (`/descubrimiento`).

1. En **Organización o proyecto**, escribe el nombre que quieras demostrar. Ejemplo:
   ```text
   Fintech Demo MX
   ```
2. En **Hosts o endpoints a escanear**, escribe uno o varios dominios reales, uno por línea:
   ```text
   github.com
   udg.mx
   google.com
   ```
   > Consejo: usa dominios conocidos y estables. Evita dominios de bancos reales si no quieres ruido; usa `github.com`, `udg.mx`, `mercadopago.com`, `microsoft.com`.
3. Pulsa **Escanear endpoints en vivo**.
4. Mira la consola:
   - Si Python está activo: `✓ Motor Python nativo conectado en localhost:8080`.
   - Si no: `⚙ Sin backend Python: inspección TLS simulada en el navegador`.
   - Verás cada host con su algoritmo y su score.
5. Al terminar aparecen la barra al 100 %, la tabla de resultados y el botón **Ver en CBOM**.

> Qué explicar mientras corre: “El motor abre una conexión TLS, lee el certificado público, identifica si la llave es RSA o ECDSA, mide su tamaño y aplica la fórmula de riesgo de cuatro factores.”

### Paso 3 — Revisa el inventario

Ruta: **Inventario CBOM** (`/inventario`).

1. Verás los activos que acabas de descubrir.
2. Prueba la búsqueda: escribe `github`.
3. Filtra por **Prioridad → Crítico**.
4. Filtra por **Ambiente** o **Algoritmo**.
5. Cambia el orden entre **Mayor riesgo** y **Menor riesgo**.
6. Haz clic en una fila: se abre el panel lateral con:
   - Score de 0 a 100 y prioridad.
   - Los cuatro factores de riesgo.
   - Ficha criptográfica: algoritmo, tamaño de llave, exposición, sensibilidad, vida útil, criticidad.
   - Ubicación y última observación.
   - Recomendación de migración (ML-KEM-768, ML-DSA-65, híbrido, etc.).
   - Botón para copiar el ID.
7. Marca uno o varios activos con las casillas y pulsa **Exportar CBOM (JSON)** o **Exportar CSV**.
   - JSON: `ubiora-cbom-cyclonedx-1.7.json` con formato CycloneDX 1.7.
   - CSV: `ubiora-inventario-cbom.csv` con todas las columnas.

### Paso 4 — Vuelve al resumen

Ruta: **Resumen de exposición** (`/`).

Ahora los KPIs, el gauge de readiness, la distribución por prioridad, la mezcla de algoritmos, la cola de prioridad y el historial de escaneos se calculan con **tus** activos.

Señala:

- **Hallazgos críticos**: cuántos activos cayeron en la banda crítica.
- **Activos criptográficos**: total indexado.
- **Expuestos a Internet**: superficie realmente expuesta.
- **Componentes híbridos**: cuántos ya usan un perfil resistente o AES-256.
- **Readiness**: score compuesto de visibilidad, agilidad y cobertura PQC.
- **Reloj regulatorio**: días hasta el 31 de diciembre de 2030.
- **Cola de prioridad**: los 8 activos con mayor score.

### Paso 5 — Presenta la hoja de ruta

Ruta: **Hoja de ruta** (`/hoja-de-ruta`).

Es un **plan de referencia** de seis fases (2026–2030), no datos de una empresa. Muestra:

- Diagrama tipo Gantt con la línea de “hoy”.
- Fase seleccionada: descripción, propietario, estándar, esfuerzo, entregables y dependencias.
- Iniciativas priorizadas con impacto y estado.
- Fechas NIST que no se mueven.
- Botón **Exportar plan** (CSV).

Frase recomendada: “La ruta no es cambiar todo a la vez. Primero se retira lo que ya está roto, después se crea agilidad y al final se migran los sistemas centrales.”

### Paso 6 — Genera el informe ejecutivo

Ruta: **Informe ejecutivo** (`/informe`).

Con activos cargados, el informe se construye solo:

- Nombre de tu organización.
- Totales reales.
- Top 5 de riesgos.
- Concentración algorítmica.
- Fechas regulatorias.
- Decisión solicitada.

Pulsa **Imprimir / PDF** y elige **Guardar como PDF** en el diálogo del navegador. También puedes **Compartir** para copiar el enlace.

### Paso 7 — Carga el ejemplo (solo si hace falta)

Si no hay Internet o el escaneo falla, usa **Cargar ejemplo** desde el resumen, el inventario, el descubrimiento o el informe.

Eso carga un catálogo ficticio de 1,284 componentes (la empresa de ejemplo es una fintech inventada). Aparece una etiqueta **“Datos de ejemplo”** para que nunca se confunda con datos reales. Puedes vaciarlo desde el resumen o desde descubrimiento.

### Paso 8 — Vuelve a cero

Para dejar el equipo listo para otra demostración:

1. **Descubrimiento → Vaciar inventario**, o
2. **Inventario → Vaciar**, o
3. **Resumen → Vaciar datos de ejemplo**.

Confirma que el resumen vuelve a “El sistema está limpio”.

---

## 6. Funcionalidades pantalla por pantalla

### 6.1 Resumen de exposición (`/`)

| Elemento | Qué hace |
| --- | --- |
| Cabecera | Muestra la organización, la fecha del último escaneo y una etiqueta si son datos de ejemplo. |
| KPIs | Críticos, total de activos, expuestos a Internet y componentes híbridos. Se recalculan con cada escaneo. |
| Readiness | Score de 0 a 100 con tres señales: visibilidad, agilidad y cobertura PQC. |
| Brecha prioritaria | Acceso directo al inventario filtrado por críticos. |
| Reloj regulatorio | Días hasta el primer plazo NIST y las tres fechas clave. |
| Distribución por prioridad | Cuántos activos hay en Crítico, Alto, Medio y Bajo, y su estado (pendiente, en migración, mitigado). |
| Mezcla de algoritmos | Familias detectadas: RSA, ECDSA, ECDH, Diffie-Hellman, SHA-1/MD5, 3DES/AES-128, AES-256. |
| Cola de prioridad | Top 8 por score, con acceso al detalle. |
| Escaneos recientes | Historial local de descubrimientos. |
| Por ambiente | Cobertura en Producción, Core bancario, Staging y Desarrollo. |
| Vaciar | Elimina todos los activos y el historial. |

### 6.2 Descubrimiento (`/descubrimiento`)

| Elemento | Qué hace |
| --- | --- |
| Organización | Guarda el nombre para todo el sistema. |
| Hosts | Lista de dominios o `host:puerto`, uno por línea. |
| Consola | Muestra el progreso, el algoritmo detectado y el score calculado. |
| Escanear | Llama al backend Python; si no responde en 6 segundos, usa el generador local. |
| Resultados | Tabla de los activos descubiertos en esa ejecución. |
| Ver en CBOM | Lleva al inventario. |
| Cargar ejemplo | Solo aparece si el inventario está vacío. |
| Vaciar inventario | Solo aparece si hay activos. |

**Qué detecta el motor real:** algoritmo de la llave pública del certificado (RSA o ECDSA), tamaño de llave, protocolo TLS y cifrado negociado. No descarga llaves privadas ni modifica nada.

**Límites honestos:** el motor actual inspecciona endpoints TLS. No analiza todavía repositorios de código, contenedores ni HSM reales. Eso está en la hoja de ruta del producto.

### 6.3 Inventario CBOM (`/inventario`)

| Elemento | Qué hace |
| --- | --- |
| Buscador | Busca por nombre, algoritmo, ubicación, propietario o tipo. |
| Filtro Ambiente | Producción, Core bancario, Staging, Desarrollo. |
| Filtro Prioridad | Crítico, Alto, Medio, Bajo. |
| Filtro Algoritmo | Se llena con los algoritmos realmente detectados. |
| Orden | Mayor o menor score. |
| Selección | Casillas por fila y por página. |
| Exportar CBOM | JSON CycloneDX 1.7 con propiedades criptográficas. |
| Exportar CSV | Hoja de cálculo con todas las columnas. |
| Detalle | Drawer lateral con score, factores y recomendación. |
| Paginación | 14 activos por página. |
| Vaciar | Borra todo el inventario. |

**Columnas del CSV:** ID, Activo, Tipo, Algoritmo, Tamaño, Ubicación, Ambiente, Sensibilidad, Vida_util_anos, Exposición, Criticidad_operativa, Score_riesgo, Prioridad, Propietario, Recomendación, Meta, Esfuerzo, Estado.

### 6.4 Hoja de ruta (`/hoja-de-ruta`)

| Elemento | Qué hace |
| --- | --- |
| KPIs | Número de fases, meses hasta 2030, críticos detectados y reducción objetivo. |
| Gantt | Seis fases con barras, años y línea de hoy. |
| Detalle de fase | Descripción, dueño, estándar, esfuerzo, entregables y dependencias. |
| Reglas del plan | Principios de migración. |
| Fechas NIST | Plazos regulatorios. |
| Iniciativas | Tabla filtrable por estado. |
| Exportar plan | CSV con las fases. |

La hoja de ruta es una **plantilla metodológica**. No pretende ser el plan exacto de tu empresa: sirve para explicar el orden correcto de una migración.

### 6.5 Informe ejecutivo (`/informe`)

| Elemento | Qué hace |
| --- | --- |
| Cabecera | Organización, fecha y etiqueta de ejemplo si aplica. |
| Diagnóstico | Totales, narrativa y Top 5 de riesgos. |
| Por qué ahora | HNDL, fechas NIST y concentración algorítmica. |
| La ruta | Resumen de las seis fases. |
| Decisión solicitada | Tres decisiones concretas para el consejo. |
| Metodología | Fórmula del score y pesos. |
| Imprimir / PDF | Abre el diálogo de impresión del navegador. |
| Compartir | Copia el enlace actual al portapapeles. |

Si el inventario está vacío, el informe muestra un estado vacío y no permite imprimir.

### 6.6 Cómo funciona (`/como-funciona`)

Es la guía integrada:

- Flujo de cuatro pasos: descubre, inventaría, prioriza, planea.
- Guion de pitch de tres minutos.
- Glosario: criptografía clásica, CBOM, PQC, HNDL.
- Módulos del MVP con enlaces.
- Botón **Recorrido interactivo** que lleva por las cinco pantallas.

### 6.7 Elementos globales

| Elemento | Dónde | Qué hace |
| --- | --- | --- |
| Barra lateral | Izquierda | Navegación, organización, estado del motor y conteo de activos. |
| Campana | Arriba a la derecha | Muestra hasta 3 activos críticos o altos del inventario. |
| Buscador global | Arriba o `Ctrl+K` / `⌘K` | Navega a módulos y acciones. |
| Recorrido guiado | Icono de ayuda | Tour de 5 pasos por las pantallas. |
| Responsive | Toda la app | En móvil la barra lateral se abre con el botón de menú. |

---

## 7. Atajos y comportamientos útiles

| Acción | Cómo |
| --- | --- |
| Abrir búsqueda global | `Ctrl+K` en Windows/Linux, `⌘K` en Mac |
| Cerrar un modal o drawer | `Esc` |
| Abrir detalle de un activo | Clic en la fila |
| Seleccionar toda la página | Casilla del encabezado |
| Exportar solo lo seleccionado | Marca filas y luego exporta |
| Volver a cero | Botón **Vaciar** en Descubrimiento o Inventario |
| Conservar datos entre recargas | No borres el almacenamiento del navegador |
| Borrar datos manualmente | Consola del navegador: `localStorage.clear()` y recarga |

---

## 8. Guion de exposición de 10–12 minutos

### 8.1 Antes de entrar al salón (checklist de 10 minutos)

1. Carga el 100 % de la laptop.
2. Abre las dos terminales:
   ```powershell
   cd "C:\Universidad\6to Semestre\Ubiora\scanner"
   python server.py
   ```
   ```powershell
   cd "C:\Universidad\6to Semestre\Ubiora"
   npm --prefix app run dev
   ```
3. Abre `http://localhost:5173`.
4. Verifica que el sistema esté **vacío**.
5. Ten a mano 3 dominios de respaldo:
   ```text
   github.com
   udg.mx
   google.com
   ```
6. Ten abierta esta guía y la de empresa en otra pestaña.
7. Prueba una vez el escaneo y luego **vacía el inventario**. Eso confirma que todo funciona y que la demo empieza limpia.
8. Desactiva notificaciones y modo oscuro automático.
9. Si el proyector cambia la resolución, revisa que la tabla se vea bien (tiene scroll horizontal).
10. Ten el PDF del proyecto en el escritorio por si preguntan por el documento.

### 8.2 Guion minuto a minuto

#### Minuto 0–1 — Gancho y problema

Pantalla: **Resumen vacío**.

Di:

> “¿Saben qué algoritmo criptográfico protege los datos de su banco? La mayoría de las organizaciones no lo sabe. No saben si usan RSA-2048, ECDSA o una mezcla, ni en qué sistemas. Sin ese inventario —el CBOM— la migración post-cuántica es imposible de planificar. Y el riesgo ya existe: se llama *harvest now, decrypt later*. Alguien puede copiar los datos cifrados hoy y descifrarlos cuando exista un computador cuántico.”

Muestra el estado vacío y di:

> “UBIORA arranca limpio a propósito. No hay una empresa ficticia precargada. Lo que vean ahora lo vamos a construir en vivo.”

#### Minuto 1–3 — Descubrimiento real

Ve a **Descubrimiento**.

Di:

> “Primero necesitamos saber qué hay. El motor abre una conexión TLS real, lee el certificado público y detecta el algoritmo y el tamaño de llave.”

Escribe la organización y 2–3 dominios. Pulsa **Escanear endpoints en vivo**.

Mientras corre, señala la consola:

> “Aquí ven el handshake. Si es RSA-2048, sabemos que es vulnerable a Shor. Si es ECDSA P-256, también es clásico. El motor calcula el score con sensibilidad, vida útil, exposición y criticidad.”

#### Minuto 3–5 — Inventario y CBOM

Pulsa **Ver en CBOM**.

Di:

> “Cada hallazgo se convierte en un activo del inventario CBOM, en formato CycloneDX 1.7, el estándar abierto que ya usa la industria.”

Haz 3 acciones rápidas:

1. Filtra por **Crítico**.
2. Abre un activo y muestra los cuatro factores y la recomendación.
3. Marca un activo y pulsa **Exportar CBOM (JSON)**.

> “El resultado no es una captura de pantalla: es un archivo legible por máquina que se puede auditar.”

#### Minuto 5–7 — Resumen y priorización

Vuelve al **Resumen**.

Di:

> “Con el inventario cargado, UBIORA calcula la postura completa: cuántos críticos hay, cuántos están expuestos a Internet, qué familias de algoritmos concentran el riesgo y cuál es la cola de prioridad.”

Señala:

- El **readiness**.
- El **reloj regulatorio** (2030).
- La **cola de prioridad**.

> “No todos los activos valen lo mismo. Un respaldo con 20 años de vida útil pesa más que un certificado de desarrollo. Por eso el score no es solo ‘¿es RSA?’.”

#### Minuto 7–9 — Hoja de ruta

Ve a **Hoja de ruta**.

Di:

> “El diagnóstico no sirve si no se convierte en un plan. La ruta tiene seis fases: primero se retira lo que ya está roto, después se crea agilidad criptográfica y al final se migran los sistemas centrales.”

Señala una fase y sus entregables. Menciona que es una **plantilla de referencia** alineada a NIST IR 8547.

#### Minuto 9–11 — Informe ejecutivo

Ve a **Informe**.

Di:

> “El CISO necesita un documento para el consejo, no una consola. El informe se genera con los datos reales del inventario y pide tres decisiones: aprobar la ruta, asignar dueños y autorizar el piloto.”

Pulsa **Imprimir / PDF** y muestra la vista de impresión. Cancela después.

#### Minuto 11–12 — Cierre

Di:

> “UBIORA no compite con IBM ni con las consultoras. Ellas venden migraciones enterprise. UBIORA vende el primer paso que nadie da: visibilidad y priorización, a un precio que una fintech mediana puede pagar. El mercado está vacío: solo el 9 % tiene una hoja de ruta y menos del 40 % tiene un inventario completo.”

Cierra con la frase:

> “No vendemos la migración. Vendemos el diagnóstico que la hace posible.”

### 8.3 Si te preguntan “¿y si no hay Internet?”

Responde:

> “El motor real necesita red, pero la aplicación tiene dos modos de respaldo: un generador local con la misma fórmula de riesgo y un catálogo de ejemplo que se carga solo si el usuario lo pide. El sistema nunca depende de datos precargados.”

Entonces pulsa **Cargar ejemplo** y muestra el flujo completo.

---

## 9. Versión corta de 5 minutos

Si el tiempo se reduce:

1. **Minuto 0–1:** problema + estado vacío + “lo construimos en vivo”.
2. **Minuto 1–2:** escaneo de 2 dominios.
3. **Minuto 2–3:** inventario, filtro crítico, abrir un activo, exportar JSON.
4. **Minuto 3–4:** resumen, readiness y reloj 2030.
5. **Minuto 4–5:** informe y cierre (“no vendemos migración, vendemos el diagnóstico”).

No muestres la hoja de ruta completa: solo di que existe y que está alineada a NIST.

---

## 10. Si algo falla durante la exposición

### El navegador no abre `localhost:5173`

- Verifica que la terminal siga corriendo `npm run dev`.
- Prueba `http://localhost:5173` (no `https`).
- Si el puerto está ocupado, Vite mostrará otro puerto; usa el que indique.
- Último recurso: `npm --prefix app run build` y luego `npm --prefix app run preview`.

### El escaneo dice “sin backend Python”

- Es normal si no iniciaste `scanner/server.py`.
- La app sigue funcionando con el generador local.
- Si quieres el modo real: abre otra terminal, ejecuta `cd scanner; python server.py` y vuelve a escanear.

### El backend no responde

- Comprueba `http://localhost:8080/api/health` en el navegador.
- Debe devolver `{"status": "online", ...}`.
- Si el puerto 8080 está ocupado, cierra el proceso o cambia el puerto en `scanner/server.py` y en la URL del fetch de `Discovery.tsx`.

### Un dominio no responde

- Algunos dominios bloquean conexiones desde Python o no tienen TLS en el puerto 443.
- Usa `github.com`, `google.com` o `udg.mx`.
- Si un host falla, el motor lo marca como error y la app puede continuar con los demás.

### El inventario está vacío después de escanear

- Revisa que el escaneo haya llegado al 100 %.
- Mira si la consola mostró “0 activos”.
- Prueba con otro dominio.
- Si usaste el backend y devolvió una lista vacía, la app no agrega nada; vuelve a intentar.

### Los datos desaparecieron al recargar

- La app guarda en `localStorage`. Si borraste datos del sitio o usaste modo incógnito, se pierden.
- No uses una ventana privada para la demo.

### El PDF sale cortado

- En el diálogo de impresión elige **Horizontal** si está disponible.
- Activa **Gráficos de fondo** para conservar los colores.
- Escala a 90–100 %.

### El proyector se ve pequeño

- Usa `Ctrl` + `+` para acercar el navegador.
- La tabla del inventario tiene scroll horizontal; no pasa nada si no cabe todo.

---

## 11. Preguntas del jurado y respuestas

**¿Esto es real o simulado?**
> El escaneo TLS es real cuando el backend de Python está activo: abre un socket, negocia TLS y lee el certificado. La normalización a CBOM y el scoring son nuestros. Si no hay backend, el navegador genera el mismo CBOM con la fórmula, y lo indica en la consola.

**¿Qué algoritmos detectan?**
> Principalmente el algoritmo de la llave pública del certificado: RSA (2048, 3072, etc.) y ECDSA. Además identificamos protocolo TLS y suite negociada. En la ruta del producto están SHA-1/MD5, DH y dependencias de código.

**¿Cómo calculan el riesgo?**
> Score de 0 a 100: sensibilidad del dato 30 %, vida útil 25 %, exposición 25 % y criticidad operativa 20 %. Se ajusta con un multiplicador según el algoritmo. El resultado se divide en Crítico (≥88), Alto (≥74), Medio (≥56) y Bajo.

**¿Por qué 2030?**
> NIST IR 8547 fija el 31 de diciembre de 2030 para migración de establecimiento de claves en sistemas federales de alto valor, 2031 para firmas y después de 2035 los algoritmos clásicos quedan prohibidos en los estándares NIST. Las empresas de la cadena de suministro se ven arrastradas.

**¿No es muy caro migrar?**
> Por eso UBIORA no vende la migración. Vende el diagnóstico y la priorización para que la empresa sepa qué migrar primero y no gaste en lo que no importa. El precio estimado es de $15,000–$25,000 MXN por diagnóstico y $3,000–$5,000 MXN mensuales de monitoreo.

**¿Qué los diferencia de IBM o SandboxAQ?**
> IBM y SandboxAQ son suites enterprise con contratos altos y equipos de implementación. UBIORA apunta a fintechs y bancos medianos de 50–500 empleados, con autoservicio, precio accesible y contexto regulatorio mexicano (CNBV + NIST).

**¿Qué pasa con ANKATech?**
> Es el competidor más relevante en LATAM, pero está en Colombia y su enfoque es orquestación y migración, no descubrimiento puro. Todavía no tiene presencia local en México. La ventana existe, pero tiene fecha.

**¿Ya tienen clientes?**
> Es un MVP académico. La validación planteada en el plan es de 10–15 entrevistas con CISOs/CTOs y 3 cartas de intención en la fase 0. El prototipo ya demuestra el flujo técnico completo.

**¿Qué es CycloneDX?**
> Un estándar abierto de OWASP para generar inventarios de componentes. La versión 1.7 incluye propiedades criptográficas, así que sirve como CBOM legible por máquina.

**¿Dónde se guardan los datos?**
> En el navegador, en `localStorage`. No hay backend de base de datos todavía. Es una decisión de MVP para que la demo sea reproducible sin infraestructura.

**¿Se puede usar en producción?**
> No en esta fase. Falta autenticación, persistencia real, análisis de repositorios y contenedores, integración con HSM y un backend multiusuario. El MVP demuestra el flujo y la propuesta de valor.

---

## 12. Checklist final

Antes de presentar:

- [ ] `npm install --prefix app` ejecutado sin errores.
- [ ] `python scanner/server.py` activo (opcional pero recomendado).
- [ ] `npm --prefix app run dev` activo.
- [ ] `http://localhost:5173` abre.
- [ ] El resumen muestra “El sistema está limpio”.
- [ ] Probaste un escaneo y luego vaciaste el inventario.
- [ ] Tienes 3 dominios de respaldo.
- [ ] Sabes dónde está el botón **Cargar ejemplo**.
- [ ] Probaste **Exportar CBOM** y **Exportar CSV**.
- [ ] Probaste **Imprimir / PDF**.
- [ ] Tienes este documento y el de empresa abiertos.
- [ ] Laptop cargada y notificaciones desactivadas.

Durante:

- [ ] Empieza reconocimiento que el sistema está vacío a propósito.
- [ ] Escanea en vivo.
- [ ] Muestra el inventario y abre un activo.
- [ ] Exporta el CBOM.
- [ ] Vuelve al resumen y explica los KPIs.
- [ ] Muestra la hoja de ruta como plantilla, no como dato de la empresa.
- [ ] Genera el informe.
- [ ] Cierra con “no vendemos migración, vendemos el diagnóstico”.

Después:

- [ ] Vacía el inventario si el equipo se queda en el salón.
- [ ] Cierra las terminales.
- [ ] Guarda el PDF del informe si lo generaste.

---

## 13. Apéndice técnico

### 13.1 Estructura del repositorio

```text
Ubiora/
├── app/                     Interfaz React + Vite + Tailwind
│   ├── src/
│   │   ├── components/      UI, gráficas, layout, tour
│   │   ├── data/            Modelo, estado y catálogo de ejemplo
│   │   ├── lib/             Utilidades y navegación
│   │   └── pages/           Resumen, descubrimiento, inventario, ruta, informe, guía
│   └── package.json
├── scanner/
│   ├── engine.py            Motor TLS + scoring + CBOM CycloneDX
│   └── server.py            API local en localhost:8080
├── docs/                    Documentación de producto e ingeniería
├── ProyectoFinal.pdf        Memoria original
├── GUIA_USO_Y_EXPOSICION.md Este documento
└── GUIA_EMPRESA_Y_PROYECTO.md Documento de empresa y negocio
```

### 13.2 Fórmula del score

```text
base = 0.30 × sensibilidad
     + 0.25 × min(100, vida_útil / 15 × 100)
     + 0.25 × exposición
     + 0.20 × (criticidad / 5 × 100)

score = round(base × multiplicador_algoritmo)
```

| Factor | Valores |
| --- | --- |
| Sensibilidad | Crítico 100 · Alto 72 · Medio 48 · Bajo 24 |
| Exposición | Internet 100 · Autenticado 62 · Interno 38 |
| Vida útil | Años que el dato debe permanecer secreto |
| Criticidad | 1 a 5 |

| Algoritmo | Multiplicador |
| --- | --- |
| RSA-1024, MD5, SHA-1, DH-1024 | 1.05 |
| RSA-2048, ECDSA, DH | 0.95 |
| ML-KEM, ML-DSA, híbrido | 0.35 |
| Otros | 0.75 |

Bandas: **Crítico ≥ 88**, **Alto ≥ 74**, **Medio ≥ 56**, **Bajo < 56**.

### 13.3 API del escáner

`POST http://localhost:8080/api/scan`

```json
{
  "org": "Fintech Demo MX",
  "targets": ["github.com", "udg.mx:443"]
}
```

Respuesta:

```json
{
  "status": "success",
  "count": 2,
  "assets": [ ... ],
  "cbom": { "bomFormat": "CycloneDX", "specVersion": "1.7", ... }
}
```

`GET http://localhost:8080/api/health`

```json
{ "status": "online", "engine": "UBIORA Python Engine v1.0" }
```

### 13.4 Comandos de verificación

```powershell
# Motor por consola, sin servidor
cd scanner
python engine.py

# Comprobar que compila
cd app
npm run build

# Revisar advertencias
npm run lint
```

### 13.5 Dónde tocar si quieres personalizar

| Quiero cambiar… | Archivo |
| --- | --- |
| Nombre por defecto de la organización | `app/src/data/scanContext.tsx` (`DEFAULT_ORG`) |
| Catálogo de ejemplo | `app/src/data/assets.ts` (`curated`, `makeGeneratedAssets`, `buildDemoAssets`) |
| Fases e iniciativas de la ruta | `app/src/data/roadmap.ts` |
| Texto de la guía interna | `app/src/pages/Guide.tsx` |
| Pasos del recorrido guiado | `app/src/components/tour/ProductTour.tsx` |
| Fórmula del score del motor | `scanner/engine.py` |
| Fórmula del score del navegador | `app/src/pages/Discovery.tsx` |
| URLs y puertos del escáner | `app/src/pages/Discovery.tsx` y `scanner/server.py` |

---

**Resumen para llevar:** instala una vez, abre dos terminales, escanea dos dominios, muestra inventario + exportación + resumen + informe, y cierra con la frase: *“No vendemos la migración; vendemos el diagnóstico que la hace posible.”*

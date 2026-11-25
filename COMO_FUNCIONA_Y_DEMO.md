# 🚀 UBIORA — Guía de Ejecución y Demostración en Vivo para Clase de Innovación

> ⚠️ **Documento histórico.** Algunas cifras y flujos de esta guía corresponden a versiones anteriores de la app (por ejemplo, el inventario precargado). La documentación vigente es:
> - [`GUIA_USO_Y_EXPOSICION.md`](GUIA_USO_Y_EXPOSICION.md) — instalación, uso completo y guiones de exposición.
> - [`GUIA_EMPRESA_Y_PROYECTO.md`](GUIA_EMPRESA_Y_PROYECTO.md) — la empresa y el proyecto explicados en simple.


Este documento detalla **cómo ejecutar el proyecto**, **cómo hacer la demostración en vivo frente al profesor y compañeros**, y **el sustento teórico del PDF (`ProyectoFinal.pdf`)** que respalda cada pantalla.

---

## 1. ¿Cómo poner en marcha el MVP?

El sistema cuenta con dos partes que trabajan integradas:
1. **La Aplicación Web (Frontend moderno React + Tailwind + Vite):** Panel de control profesional B2B.
2. **El Motor Real de Escaneo (Backend Python con Sockets TLS y Generador CBOM CycloneDX 1.7):** Conexión en vivo con servidores reales.

### Paso A: Iniciar el Motor de Escaneo Python (Opcional pero recomendado para demo en vivo)
Abre una terminal en la raíz del proyecto (`c:\Universidad\6to Semestre\Ubiora`) y ejecuta:
```bash
python scanner/server.py
```
> Verás el mensaje: `[*] Servidor de descubrimiento UBIORA activo en http://localhost:8080`.
> *(Nota: Si por alguna razón no inicias el backend Python, la app web cuenta con un analizador autónomo integrado que simula la inspección sin bloquearte).*

### Paso B: Iniciar la Aplicación Web
En otra terminal, entra a la carpeta `app` y ejecuta:
```bash
cd app
npm run dev
```
> Abre tu navegador en **`http://localhost:5173`**.

---

## 2. Flujo Recomendado de Demostración en Público (Guion de 3 a 5 Minutos)

Para evitar la apariencia de "un flujo simulado", sigue esta secuencia:

### ⏱ Minuto 1: Planteamiento del Problema Real (Ir a `/` - Resumen)
- **Qué decir:** *"Las empresas no saben qué criptografía usan internamente. Con la llegada de las computadoras cuánticas y los plazos fijados por el NIST (NIST IR 8547 que exige migración para 2030), los atacantes ya están aplicando 'Harvest Now, Decrypt Later' (robar datos cifrados hoy para descifrarlos después). Menos del 40% de las fintechs tiene un inventario criptográfico."*
- **Qué mostrar:** Muestra el KPI de **Preparación PQC (34/100)**, el conteo regresivo al deadline del NIST y la distribución de familias vulnerables (RSA y ECDSA).

### ⏱ Minuto 2: La Demostración Real en Vivo (Ir a `/descubrimiento`)
- **Qué decir:** *"UBIORA no es solo un diseño; cuenta con un motor de descubrimiento real por sockets TLS que analiza la infraestructura."*
- **Qué hacer en vivo:**
  1. En el panel de la derecha, donde dice **"Hosts / Endpoints a Escanear"**, escribe un host real de prueba o pide al profesor o a un compañero un dominio (por ejemplo: `google.com`, `udg.mx`, `github.com`).
  2. Haz clic en **"Escanear Endpoints en Vivo"**.
  3. Muestra cómo la consola realiza el handshake TLS, inspecciona la suite criptográfica (detecta `RSA-2048` o `ECDSA P-256`), aplica la fórmula matemática de riesgo y genera componentes para el inventario.
  4. Haz clic en **"Ver en CBOM"**.

### ⏱ Minuto 3: La Evidencia Técnica (Ir a `/inventario` - CBOM CycloneDX 1.7)
- **Qué decir:** *"Generamos un Cryptographic Bill of Materials (CBOM) bajo el estándar abierto CycloneDX 1.7 respaldado por OWASP."*
- **Qué hacer en vivo:**
  1. Muestra cómo el endpoint que acabas de escanear en vivo ya aparece indexado junto con el parque tecnológico.
  2. Filtra por **"Crítico"** o por algoritmo **"RSA-2048"**.
  3. Haz clic en una fila: se abrirá el drawer lateral detallando los **4 factores de riesgo** y la recomendación técnica concreta (ejemplo: migrar a `ML-KEM-768` o `ML-DSA-65`).
  4. Haz clic en **"Exportar CBOM (JSON)"**: se descargará el archivo oficial CycloneDX 1.7 para demostrar que es legible por herramientas de auditoría.

### ⏱ Minuto 4: Hoja de Ruta e Informe de Consejo (Ir a `/hoja-de-ruta` y `/informe`)
- **Qué decir:** *"No vendemos una migración de millones de dólares que nadie puede pagar; vendemos el diagnóstico y la hoja de ruta clara para priorizar qué migrar primero."*
- **Qué mostrar:**
  - En **Hoja de Ruta**, muestra las 6 fases planificadas hasta 2030 con sus responsables y estándares NIST.
  - En **Informe Ejecutivo**, haz clic en **"Imprimir / PDF"** para demostrar el documento final formal que se presenta ante el consejo de administración o CISO.

---

## 3. Respaldo Teórico del Proyecto (Respuestas para Preguntas del Profesor)

Si el profesor o jurado hace preguntas técnicas o de negocio, aquí tienes el sustento directo de `ProyectoFinal.pdf`:

| Pregunta / Tema | Respuesta con base en el documento |
|---|---|
| **¿Por qué UBIORA y no contratar a IBM o SandboxAQ?** | Las soluciones de IBM Guardium y SandboxAQ son suites Enterprise con contratos millonarios que una fintech mediana de 50 a 500 empleados en México no puede pagar. UBIORA ataca el primer paso desatendido: el descubrimiento y el CBOM a un precio accesible ($18,000 MXN diagnóstico inicial). |
| **¿Cuál es la fórmula del Score de Riesgo?** | `Score = (0.30 * Sensibilidad) + (0.25 * VidaUtil) + (0.25 * Exposicion) + (0.20 * CriticidadOperativa) * MultiplicadorAlgoritmo`. Si el algoritmo es clásico roto (RSA/DH), el riesgo es alto; si tiene perfil híbrido o PQC (ML-KEM), el riesgo se reduce drásticamente. |
| **¿Qué es HNDL ("Harvest Now, Decrypt Later")?** | La amenaza de que adversarios capturan tráfico cifrado hoy. Por eso, si un dato financiero o médico tiene una vida útil de 10 años, ya es vulnerable hoy aunque el ordenador cuántico llegue en 2030. |
| **¿Cuáles son los plazos del NIST IR 8547?** | - **31 de diciembre de 2030:** Migración completa a PQC para establecimiento de claves.<br>- **31 de diciembre de 2031:** Migración para firmas digitales.<br>- **Después de 2035:** Algoritmos clásicos prohibidos en estándares internacionales. |
| **¿Bajo qué estándar se estructura el inventario?** | CycloneDX 1.7 (estándar abierto de OWASP para CBOM con propiedades criptográficas nativas). |

---

## 4. Comandos de Verificación Rápida

- **Probar el escáner CLI directo por consola:**
  ```bash
  python scanner/engine.py
  ```
- **Compilar la app web:**
  ```bash
  cd app
  npm run build
  ```
- **Iniciar el servidor de desarrollo web:**
  ```bash
  cd app
  npm run dev
  ```

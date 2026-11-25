# UBIORA — La empresa y el proyecto explicados en lenguaje sencillo

> Este documento traduce **todo** el contenido de `ProyectoFinal.pdf` a lenguaje normal.
> Está pensado para que lo leas en 30–40 minutos y salgas sabiendo **qué es UBIORA, por qué existe, a quién le vende, cuánto cuesta y cómo se defiende frente a un jurado**.
>
> Documento hermano: [`GUIA_USO_Y_EXPOSICION.md`](GUIA_USO_Y_EXPOSICION.md) explica cómo instalar, usar y presentar la aplicación paso a paso.

---

## Índice

1. [Cómo leer este documento](#1-cómo-leer-este-documento)
2. [UBIORA en 60 segundos](#2-ubiora-en-60-segundos)
3. [El nombre y la identidad](#3-el-nombre-y-la-identidad)
4. [El equipo y quién hace qué](#4-el-equipo-y-quién-hace-qué)
5. [El problema explicado sin tecnicismos](#5-el-problema-explicado-sin-tecnicismos)
6. [Glosario mínimo (las 8 palabras que necesitas)](#6-glosario-mínimo-las-8-palabras-que-necesitas)
7. [Los números que sostienen el proyecto](#7-los-números-que-sostienen-el-proyecto)
8. [Los plazos regulatorios del NIST](#8-los-plazos-regulatorios-del-nist)
9. [Qué hace exactamente UBIORA](#9-qué-hace-exactamente-ubiora)
10. [Qué NO hace UBIORA (y por qué eso es bueno)](#10-qué-no-hace-ubiora-y-por-qué-eso-es-bueno)
11. [Cliente objetivo y por qué ese segmento](#11-cliente-objetivo-y-por-qué-ese-segmento)
12. [La competencia, capa por capa](#12-la-competencia-capa-por-capa)
13. [Diferenciación: los tres pilares](#13-diferenciación-los-tres-pilares)
14. [Modelo de negocio y precios](#14-modelo-de-negocio-y-precios)
15. [Proyección de ventas y punto de equilibrio](#15-proyección-de-ventas-y-punto-de-equilibrio)
16. [Inversión inicial y costos de operación](#16-inversión-inicial-y-costos-de-operación)
17. [Plan de desarrollo en 6 fases](#17-plan-de-desarrollo-en-6-fases)
18. [Herramientas y stack técnico](#18-herramientas-y-stack-técnico)
19. [Análisis FODA](#19-análisis-foda)
20. [Estrategia de comercialización](#20-estrategia-de-comercialización)
21. [Misión, visión y valores](#21-misión-visión-y-valores)
22. [Estructura organizacional](#22-estructura-organizacional)
23. [Cómo se conecta todo esto con la aplicación](#23-cómo-se-conecta-todo-esto-con-la-aplicación)
24. [Preguntas difíciles del jurado (y respuestas honestas)](#24-preguntas-difíciles-del-jurado-y-respuestas-honestas)
25. [Resumen de una página (elevator pitch)](#25-resumen-de-una-página-elevator-pitch)
26. [Tabla de cifras rápidas](#26-tabla-de-cifras-rápidas)

---

## 1. Cómo leer este documento

Hay tres niveles de lectura. Elige según el tiempo que tengas:

- **5 minutos:** lee la sección 2 (UBIORA en 60 segundos), la 5 (el problema) y la 25 (resumen de una página). Con eso puedes presentarte.
- **30 minutos:** lee todo en orden. Cada sección empieza con una idea en negritas y luego la desarrolla.
- **Antes de exponer:** repasa las secciones 7, 12, 13, 15 y 24. Ahí es donde el jurado suele apretar.

Convención: cuando algo es una **cifra del documento original**, va marcado como tal. Cuando es una **explicación mía para que lo entiendas**, va sin marca.

---

## 2. UBIORA en 60 segundos

**UBIORA es un software que le dice a una empresa qué criptografía está usando realmente, dónde la usa y qué tan urgente es cambiarla antes de que lleguen las computadoras cuánticas.**

Tres frases para tener claras:

1. **El problema:** las empresas casi nunca saben qué algoritmos de cifrado usan. No hay una lista. Y sin lista, no pueden planear la migración.
2. **La solución:** UBIORA escanea los sistemas, arma esa lista en un formato estándar llamado **CBOM**, le pone un **puntaje de riesgo** a cada hallazgo y entrega un **plan de acción priorizado**.
3. **El negocio:** se vende como SaaS B2B a fintechs y bancos medianos en México. Diagnóstico único + suscripción mensual de monitoreo.

**Frase para decir en voz alta:**

> “UBIORA no migra la criptografía de una empresa. Le da el mapa y el orden de prioridades para que pueda migrarla. Vendemos el primer paso que el 60% de las organizaciones todavía no ha dado.”

---

## 3. El nombre y la identidad

**UBIORA une “ubiquidad” y “aurora”.**

- **Ubiquidad** = estar en todas partes.
- **Aurora** = el inicio de algo nuevo, la luz que llega después de la oscuridad.

La metáfora del proyecto es:

> **“UBIORA ilumina lo que no se ve, en todas partes.”**

Es decir: la criptografía invisible que corre dentro de los sistemas de una empresa (certificados, librerías, configuraciones) y que nadie tiene mapeada. UBIORA la saca a la luz.

El logotipo es parte del entregable del PDF, pero en la aplicación web el logo vive en `app/src/components/brand/Logo.tsx`. No cambies la metáfora del nombre en la presentación: es lo que conecta el branding con el producto.

---

## 4. El equipo y quién hace qué

El proyecto tiene **dos integrantes**, con roles complementarios (producto + técnica). Esto es importante: el jurado valora que el equipo se complemente y no que los dos hagan lo mismo.

| Integrante | Rol | Responsabilidad principal |
| --- | --- | --- |
| **Carlos Fernando Rivera Leal** | Director General / Arquitecto de Producto | Visión estratégica, definición del producto, viabilidad del modelo de negocio, liderazgo de la memoria técnica y relación con el “cliente”. |
| **Alex Guillermo Martínez Martínez** | Ingeniero de Desarrollo / CTO | Diseño técnico del motor de descubrimiento y scoring, prototipo funcional, simulación, validación de detección de algoritmos. |

**Contexto académico:**

- Carrera: **Ingeniería en Computación**, **5º semestre**.
- Materia: **Innovación y Tecnología**.
- Profesor: **Rodrigo Antonio Campos Villarreal**.

**Cómo explicar el equipo si preguntan “¿son solo dos?”:**
> “Sí, y eso es coherente con la fase en la que estamos. Un producto de descubrimiento criptográfico se puede construir con dos perfiles: uno que entiende al cliente y el modelo de negocio, y otro que construye el motor. La contratación de ventas y soporte viene en la fase 5, cuando ya hay ingresos recurrentes que la financien.”

---

## 5. El problema explicado sin tecnicismos

### 5.1 La analogía del edificio

Imagina que heredas un edificio de 40 años. Nadie tiene los planos. No sabes qué cables son de alta tensión, cuáles están fuera de norma ni cuáles van a provocar un incendio. **Antes de remodelar, necesitas un levantamiento.** Eso es exactamente lo que pasa con la criptografía de una empresa.

Las empresas llevan décadas agregando sistemas: un servidor aquí, una librería allá, un certificado que alguien instaló en 2018 y ya nadie recuerda. Hoy no existe un plano de “qué cifrado usa cada cosa”.

Ese plano tiene nombre técnico: **CBOM** (*Cryptographic Bill of Materials*, “lista de materiales criptográficos”). Es a la criptografía lo que una lista de ingredientes es a un alimento.

### 5.2 Por qué ahora (y no hace cinco años)

Porque **ya hay fecha de caducidad para la criptografía clásica**:

- RSA, ECDSA y Diffie-Hellman son los algoritmos que protegen hoy casi todo: banca en línea, TLS de las páginas web, firmas digitales, VPNs.
- Una computadora cuántica suficientemente grande podría romperlos.
- El NIST (la autoridad de estándares de EE.UU.) ya publicó los **algoritmos post-cuánticos** que los reemplazan y un **calendario** para dejar de usar los viejos.
- Y existe el riesgo **HNDL** (“Harvest Now, Decrypt Later”): un atacante puede copiar hoy tus datos cifrados, guardarlos, y descifrarlos en 10 años cuando tenga el computador cuántico. **Por eso el riesgo no es futuro: es presente.**

### 5.3 Los cinco hechos que resumen el problema

1. **Parálisis por falta de inventario.** Casi nadie tiene la lista. Sin lista no hay plan.
2. **Brecha entre saber y hacer.** La gente ya sabe que la amenaza existe, pero sus sistemas no están listos.
3. **La visibilidad es el cuello de botella.** El problema no es “cómo migro”, es “ni siquiera sé qué tengo”.
4. **El riesgo ya es presente.** Los datos copiados hoy están en riesgo hoy.
5. **Los plazos son concretos.** No es “algún día”: hay años específicos.

Ese es el hueco que UBIORA ataca. **No vende migración; vende el inventario y la priorización que nadie ha hecho.**

---

## 6. Glosario mínimo (las 8 palabras que necesitas)

| Término | Qué significa en simple |
| --- | --- |
| **Criptografía** | Las matemáticas que protegen la información: cifrar datos, firmar documentos, verificar identidades. |
| **Algoritmo criptográfico** | La “receta” matemática específica que se usa para proteger algo. Ejemplos: RSA, ECDSA, Diffie-Hellman (DH), AES, SHA-256. |
| **Post-cuántico (PQC)** | Algoritmos nuevos, diseñados para resistir ataques de computadoras cuánticas. El NIST ya estandarizó varios. |
| **CBOM** | *Cryptographic Bill of Materials*. La lista completa de qué algoritmos usa una empresa, dónde y con qué criticidad. |
| **CycloneDX** | El formato abierto (JSON/XML) en el que se escribe un CBOM. Respaldado por OWASP y adoptado por IBM Research. Es el “PDF estándar” del inventario criptográfico. |
| **HNDL** | *Harvest Now, Decrypt Later*. Copiar datos cifrados hoy para descifrarlos cuando exista la computadora cuántica. |
| **NIST** | Instituto Nacional de Estándares y Tecnología de EE.UU. Define los estándares de criptografía del mundo. |
| **Scoring de riesgo** | Ponerle un número a cada hallazgo para saber qué arreglar primero. En UBIORA depende de: sensibilidad del dato, vida útil, exposición y criticidad operativa. |

**Truco para la exposición:** si el jurado es técnico, usa el término y luego la traducción. Si es de negocios, usa solo la traducción. Ejemplo: *“el CBOM, que es básicamente el inventario de qué cifrado usa la empresa”*.

---

## 7. Los números que sostienen el proyecto

Estas son las cifras del PDF. **Son la evidencia de que el problema es real y de que el mercado está vacío.** Memoriza al menos cuatro.

| Dato | Fuente (según el PDF) | Qué significa para UBIORA |
| --- | --- | --- |
| Solo **9%** de los líderes tiene una hoja de ruta definida para la migración post-cuántica; **30%** no ha tomado ninguna acción. | Bain & Company (febrero 2026) | El mercado está vacío. No compites contra IBM; compites contra la inacción. |
| Menos del **40%** de las grandes empresas ha hecho un inventario exhaustivo de sus algoritmos criptográficos. | Bain & Company | El primer paso (descubrimiento) es el que nadie ha dado. Ahí entras. |
| **91%** de las empresas carece de una hoja de ruta formal para migrar a PQC; **81%** cree que sus librerías criptográficas actuales no están listas. | Trusted Computing Group (1,500 profesionales, 2025–2026) | La gente entiende la amenaza, pero sus sistemas no están preparados. |
| **61%** de las organizaciones carece de visibilidad completa sobre sus sistemas criptográficos. | Gartner (enero 2026) | Tu producto resuelve exactamente eso. |
| Solo **30%** ha completado un inventario criptográfico. | IBM Institute for Business Value | Refuerza el dato anterior desde otra fuente. |
| **84%** cree que al menos algunos de sus datos cifrados ya están expuestos a HNDL; **39%** estima que la migración le tomará entre 3 y 5 años. | DigiCert (julio 2026, 1,001 tomadores de decisión) | La urgencia existe. No necesitas educar sobre la amenaza; necesitas dar la herramienta. |

**Cómo usar estos números en la exposición (sin leerlos como lista):**

> “Tres datos bastan. El 61% de las organizaciones no tiene visibilidad de su criptografía. Menos del 40% ha hecho el inventario. Y el 84% ya cree que sus datos están expuestos a ‘cosechar hoy, descifrar mañana’. El mercado no necesita otra consultora que explique la amenaza: necesita la herramienta que genere el inventario. Eso es UBIORA.”

---

## 8. Los plazos regulatorios del NIST

**NIST IR 8547, publicado el 27 de octubre de 2026**, establece tres fechas:

| Fecha | Qué pasa |
| --- | --- |
| **31 de diciembre de 2030** | Migración completa a PQC para **establecimiento de claves** en sistemas federales de alto valor de EE.UU. |
| **31 de diciembre de 2031** | Migración para **firmas digitales**. |
| **Después de 2035** | Algoritmos clásicos (**RSA, ECDSA, Diffie-Hellman**) **prohibidos** en los estándares del NIST. |

**Pregunta obvia del jurado: “Pero eso es de EE.UU., ¿a México le aplica?”**
Respuesta del PDF, en simple:

- Los plazos aplican formalmente a sistemas federales de EE.UU.
- Pero las empresas que **contratan con el gobierno de EE.UU.** o que están en su **cadena de suministro** se ven arrastradas.
- Y en México, la **CNBV** y la presión regulatoria financiera ya exigen estándares de seguridad que, tarde o temprano, se alinearán con NIST.
- Además, el riesgo HNDL no espera a la regulación: si tus datos se copian hoy, la fecha límite ya pasó para ellos.

**Frase corta:** *“La regulación es el empujón, pero el riesgo es el motivo.”*

---

## 9. Qué hace exactamente UBIORA

El producto tiene **tres módulos**. Es importante que los nombres coincidan con las pantallas de la app.

### Módulo 1 — Descubrimiento
- **Qué hace:** escanea configuraciones TLS, certificados, dependencias de código y contenedores para detectar qué algoritmos se usan (RSA, ECDSA, DH, etc.).
- **Entregable:** inventario crudo de activos criptográficos.
- **En la app:** pantalla **Descubrimiento** (`/descubrimiento`).

### Módulo 2 — Normalización y CBOM
- **Qué hace:** estructura los hallazgos en formato **CycloneDX**, el estándar abierto para CBOM.
- **Entregable:** archivo CBOM en JSON/XML, legible por máquina.
- **En la app:** pantalla **Inventario CBOM** (`/inventario`), que permite exportar el CBOM.

### Módulo 3 — Scoring y hoja de ruta
- **Qué hace:** aplica un score de riesgo basado en cuatro factores:
  1. **Sensibilidad del dato** (¿qué tan grave sería que se filtrara?).
  2. **Vida útil** (¿cuánto tiempo debe mantenerse secreto?).
  3. **Exposición del sistema** (¿está en internet o es interno?).
  4. **Criticidad operativa** (¿si se cae, se para el negocio?).
- **Entregable:** dashboard con el **top 10 de riesgos** y un plan de acción priorizado.
- **En la app:** **Resumen de exposición** (`/`), **Hoja de ruta** (`/hoja-de-ruta`) e **Informe ejecutivo** (`/informe`).

### El flujo completo, en una línea

> **Escanear → normalizar en CBOM → puntuar el riesgo → priorizar el plan → exportar el informe.**

Ese es el recorrido de la demo. Si te aprendes esa línea, puedes explicar la app entera señalando las pantallas en orden.

---

## 10. Qué NO hace UBIORA (y por qué eso es bueno)

Decir lo que **no** haces te da credibilidad. El PDF insiste en esto.

- **No ejecuta la migración.** No cambia los algoritmos ni reconfigura servidores. Entrega el plan para que el cliente (o un integrador) lo ejecute.
- **No es una consultora.** No vende horas-hombre; vende software de autoservicio.
- **No es una plataforma enterprise.** No compite con IBM Quantum Safe ni SandboxAQ en funcionalidad total; compite en accesibilidad.
- **No es un escáner de vulnerabilidades genérico.** No busca bugs de software: busca **algoritmos criptográficos**.

**Por qué es bueno:** te enfocas en el primer paso, que es el más desatendido y el más fácil de vender. La migración completa es un proyecto de años y de millones; el diagnóstico es una compra que un CISO puede autorizar este trimestre.

---

## 11. Cliente objetivo y por qué ese segmento

**Cliente inicial: fintechs y bancos medianos en México, de 50 a 500 empleados.**

¿Por qué ellos y no una empresa grande o una tienda pequeña?

| Característica del segmento | Por qué encaja con UBIORA |
| --- | --- |
| **Presión regulatoria creciente** | La CNBV los obliga a estándares de seguridad. Necesitan evidencia, no promesas. |
| **Datos de alta sensibilidad** | Manejan dinero e identidad. Una filtración es catastrófica. El HNDL les pega directo. |
| **Presupuesto insuficiente para enterprise** | No pueden pagar una licencia de IBM más un equipo de implementación. |
| **Decisor claro** | El comprador es el **CISO o CTO**. Una sola persona, no un comité de 12. |
| **Ciclo de venta corto** | 1 a 3 meses. Venta directa. |

**Escalabilidad:** hacia **LATAM** y otros sectores (**salud, manufactura avanzada**) se plantea **vía partners con consultoras de ciberseguridad**, no con una fuerza de ventas propia. Eso mantiene los costos bajos.

**Frase:** *“Empezamos por donde el dolor es más caro y la decisión es más rápida: la fintech mexicana mediana.”*

---

## 12. La competencia, capa por capa

El PDF divide el mercado en **tres capas**. UBIORA se posiciona en la **capa intermedia**: donde los gigantes no llegan y las startups locales aún no se consolidan.

### Capa 1 — Competidores directos globales (enterprise)

| Competidor | Qué hace | Modelo | Debilidad que UBIORA ataca |
| --- | --- | --- | --- |
| **IBM Quantum Safe** (Guardium + Explorer) | Escaneo de código, CBOM, proxy de red. Escaneó +47M de líneas de código y detectó +3,900 problemas criptográficos. | Enterprise, licencia anual alta + consultoría. | Inaccesible para fintechs medianas. Requiere equipo de implementación. |
| **SandboxAQ AQtive Guard** | Descubrimiento amplio, rotación de certificados vía ACME. Puntuación **6.21** en el PQC Discovery Index (banda “Established”). | Enterprise. | Mismo problema: costo y complejidad de adopción. |
| **ISARA** (vía Cefiros en Iberia/LATAM) | Gestión de postura criptográfica (CPM): descubrimiento, inventario, priorización, hoja de ruta. | Distribución vía mayoristas. | Entra a LATAM vía Cefiros, pero **sin presencia local en México**. |

### Capa 2 — Competidor directo en LATAM (el más relevante)

| Competidor | Qué hace | Estado | Debilidad que UBIORA ataca |
| --- | --- | --- | --- |
| **ANKATech** (Colombia) | **ANKASecure©**: orquestación *crypto-agile*, migración sin downtime. Ya tiene alianza con ITAC como distribuidor LATAM, entró a Cloud Security Alliance, Forbes Colombia los cubrió y apuntan al sector financiero. | **Pre-seed cerrado** (Carabela VC), aceleración en NYTechWeek 2026. | Su enfoque es **orquestación y migración**, no descubrimiento puro. **No tienen presencia local en México aún.** UBIORA puede ganar en el segmento fintech mexicana antes de que lleguen. |

### Capa 3 — Competidores indirectos (consultoras)

**Accenture, Deloitte y Capgemini** ofrecen servicios de migración PQC, pero **no venden una herramienta de autoservicio**. Su modelo es horas-hombre, no SaaS. Un diagnóstico de seis meses no le sirve a una fintech que necesita saber esto el próximo mes.

### La conclusión que tienes que decir

> **“No competimos contra IBM. Competimos contra la inacción de las fintechs mexicanas y contra el tiempo que ANKATech tarde en llegar a México. La ventana es real, pero tiene fecha de caducidad.”**

Esa frase es del PDF y es probablemente la mejor línea de toda la exposición.

---

## 13. Diferenciación: los tres pilares

UBIORA no vende “migración”. Vende **claridad accionable** para empresas que no pueden pagar IBM ni esperar seis meses a una consultora.

### Pilar 1 — El primer paso que nadie da
El 61% no tiene visibilidad y menos del 40% hizo inventario. **UBIORA no asume que el cliente ya tiene un CBOM: lo genera desde cero.** Esa es la diferencia con las herramientas que asumen que ya existe un inventario.

### Pilar 2 — Precio y adopción para el mercado medio
SaaS con niveles accesibles: **diagnóstico único** y **suscripción mensual** para monitoreo continuo. IBM y SandboxAQ requieren contratos enterprise que una fintech de 200 empleados no puede justificar.

### Pilar 3 — Localía y contexto regulatorio mexicano
**UBIORA habla el lenguaje de la CNBV, no solo el de NIST.** Entiende que una fintech mexicana necesita cumplir con regulación local mientras se alinea con estándares internacionales. ANKATech es colombiana; IBM es global sin foco local.

### Lo que NO es diferenciación (el PDF pide evitarlo explícitamente)

- ❌ **“Somos más baratos”** — sin datos de costo real es una promesa vacía.
- ❌ **“Usamos IA”** — todo el mundo lo dice; no distingue.
- ❌ **“Somos estudiantes”** — no es un argumento de venta.

Si te preguntan “¿por qué ustedes y no otro?”, responde con los **tres pilares**, nunca con esas tres frases.

---

## 14. Modelo de negocio y precios

El modelo es **SaaS B2B** con dos fuentes de ingreso:

| Producto | Precio | Naturaleza |
| --- | --- | --- |
| **Diagnóstico inicial** | **$15,000–$25,000 MXN** | Pago único (*one-time*). |
| **Monitoreo continuo** | **$3,000–$5,000 MXN / mes** | Suscripción (MRR = ingreso recurrente mensual). |

**Supuestos del PDF:**

- **Ciclo de venta:** 1 a 3 meses.
- **Decisor:** CISO o CTO.
- **Venta:** directa (los fundadores hacen la demo).

**Cómo lo explicaría en la exposición:**
> “El diagnóstico es la puerta de entrada: es un gasto que un CISO puede autorizar este trimestre porque resuelve un problema inmediato. El monitoreo mensual es lo que convierte ese cliente en ingreso recurrente. Primero vendemos el mapa; después vendemos el radar que lo mantiene actualizado.”

**¿Por qué el precio es razonable?** Compáralo con la alternativa: una consultora cobra un diagnóstico de seis meses en horas-hombre; IBM cobra licencia anual enterprise más implementación. UBIORA está en un rango que una fintech de 200 empleados puede aprobar sin consejo de administración.

---

## 15. Proyección de ventas y punto de equilibrio

### 15.1 Proyección conservadora por volumen (sección 10 del PDF)

Supuestos: diagnóstico $15,000–$25,000 MXN; monitoreo $3,000–$5,000 MXN/mes.

| Año | Clientes activos | Ingreso por diagnóstico | Ingreso recurrente (MRR × 12) | Ingreso total estimado |
| --- | --- | --- | --- | --- |
| **Año 1** | 3–5 | $45,000–$125,000 MXN | $0 (solo diagnósticos) | **$45,000–$125,000 MXN** |
| **Año 2** | 10–15 | $150,000–$375,000 MXN | $360,000–$900,000 MXN | **$510,000–$1,275,000 MXN** |
| **Año 3** | 25–35 | $375,000–$875,000 MXN | $900,000–$2,100,000 MXN | **$1,275,000–$2,975,000 MXN** |

### 15.2 Proyección por punto de equilibrio (sección 20 del PDF)

Supuestos: diagnóstico **$18,000 MXN**, suscripción **$4,000 MXN/mes**, costo fijo **$1,500 MXN/mes**.

| Año | Diagnósticos vendidos | Suscripciones activas | Ingreso total estimado |
| --- | --- | --- | --- |
| **Año 1** | 4 | 0 | **$72,000 MXN** |
| **Año 2** | 10 | 6 | $180,000 + $288,000 = **$468,000 MXN** |
| **Año 3** | 20 | 15 | $360,000 + $720,000 = **$1,080,000 MXN** |

### 15.3 El punto de equilibrio

> Con un diagnóstico de **$18,000 MXN** y un costo fijo mensual de **$1,500 MXN**, UBIORA alcanza el punto de equilibrio con **1 diagnóstico vendido cada 12 meses**.

En la práctica el equilibrio real llega cuando también se cubre el tiempo de los fundadores, pero **a nivel de costos operativos directos el umbral es mínimo**. Ese es el argumento: el producto es de costo marginal casi cero.

**Nota del PDF que vale la pena repetir:** *“El jurado valora más la lógica del modelo que la precisión del número.”* No te obsesiones con defender cada peso; defiende la **estructura**: costo fijo bajísimo, ingreso recurrente, ciclo de venta corto.

---

## 16. Inversión inicial y costos de operación

### 16.1 Inversión inicial (año 1)

| Concepto | Monto (MXN) | Notas |
| --- | --- | --- |
| Infraestructura (fases 0–3) | $0 | Open source + *free tier*. |
| Dominio y hosting de demo | $2,000–$4,000/año | Primer año. |
| PostgreSQL gestionado (producción) | $6,000/año | A partir de la fase 3. |
| Herramientas de diseño (logo, mockups) | $3,000–$5,000 | Pago único, opcional (puede hacerse internamente). |
| Constitución legal simulada | $0 | Documento académico; no requiere notaría real. |
| **Total estimado (año 1)** | **$11,000–$15,000 MXN** | Inversión mínima viable. |

**Fuentes de financiamiento posibles:** recursos propios (aportación de los socios), concursos de emprendimiento universitario, programas de incubación (ej. **incMTY**, **Startup México**) y, en fase posterior, ángeles inversionistas enfocados en ciberseguridad.

### 16.2 Costos de producción (mensuales)

| Concepto | Costo mensual | Notas |
| --- | --- | --- |
| Hosting (cloud) | $500–$1,500 MXN | PostgreSQL + servidor de aplicación. |
| Dominio y SSL | ~$200 MXN | Prorrateado anual. |
| Herramientas de desarrollo | $0 | Open source. |
| **Total** | **$700–$1,700 MXN/mes** | Estructura de costos fijos mínima. |

**Costo por cliente:** como es SaaS, el costo marginal por cliente adicional es **cercano a cero**. El costo real es el tiempo de soporte y onboarding: **2 a 4 horas por cliente nuevo** en la fase inicial.

**Frase:** *“Nuestro costo de infraestructura es el de un café al día. Eso es lo que nos permite vender a un precio que IBM no puede igualar sin canibalizar su modelo enterprise.”*

---

## 17. Plan de desarrollo en 6 fases

El PDF plantea **24 meses** de desarrollo, de la validación al producto comercial.

| Fase | Duración | Objetivo | Entregable | Criterio de salida |
| --- | --- | --- | --- | --- |
| **Fase 0 — Validación y definición** | Mes 1–2 | Confirmar que el problema es real y que el cliente pagaría por resolverlo. | Documento de validación con hallazgos de entrevistas, alcance definido y mockups. | **3 cartas de intención** o compromisos de piloto. |
| **Fase 1 — Motor de descubrimiento** | Mes 2–5 | Construir el escáner que detecta algoritmos vulnerables. | Escáner funcional con inventario crudo en JSON. | Detecta **al menos 20 algoritmos vulnerables** en un entorno de prueba controlado. |
| **Fase 2 — Normalización CBOM y scoring** | Mes 5–8 | Transformar el inventario crudo en inteligencia accionable. | Módulo CBOM + motor de scoring + matriz de priorización. | Genera un **CBOM válido** y un ranking coherente con la matriz. |
| **Fase 3 — Dashboard y hoja de ruta** | Mes 8–11 | Entregar una interfaz usable sin capacitación técnica profunda. | Dashboard funcional + generador de hoja de ruta en PDF. | Un cliente piloto usa el dashboard y entiende su hoja de ruta **sin asistencia**. |
| **Fase 4 — Pilotos con clientes** | Mes 11–15 | Validar en entornos reales y ajustar. | Casos de éxito documentados + versión ajustada. | **Al menos 2 clientes** dispuestos a pagar la versión comercial. |
| **Fase 5 — Producto comercial y expansión** | Mes 15–24 | Convertir UBIORA en un producto vendible y escalable. | Producto SaaS + API + primeros partners firmados. | **10–15 clientes activos**, MRR y primer partner firmado. |

**Actividades clave por fase (resumen):**

- **Fase 0:** entrevistas con **10–15 CISOs/CTOs** de fintechs y bancos medianos en México; definición del alcance del CBOM (qué algoritmos detectar, qué formatos); selección de CycloneDX; mockups del dashboard y del reporte de scoring.
- **Fase 1:** desarrollo en Python; escaneo de configuraciones TLS, certificados X.509, dependencias de código y contenedores; detección de RSA, ECDSA, DH, ECDH, SHA-1, MD5; salida en JSON.
- **Fase 2:** generación de CBOM en CycloneDX; scoring basado en sensibilidad, vida útil, exposición y criticidad; matriz crítico/alto/medio/bajo.
- **Fase 3:** dashboard web (Streamlit/Flask primero, React después); visualización del top 10; hoja de ruta en PDF (qué migrar primero, con qué estándar NIST y en qué orden).
- **Fase 4:** 3–5 pilotos con NDA y acceso controlado; iteración sobre falsos positivos, usabilidad y formatos de reporte.
- **Fase 5:** licenciamiento SaaS; integración con SIEM/GRC vía API; expansión a **Colombia y Chile** vía consultoras locales.

**Cómo defender la fase en la que estás:** la aplicación que presentas ya cubre buena parte de las fases 1 a 3 (escaneo, CBOM, scoring, dashboard, hoja de ruta e informe). Los pilotos (fase 4) son el siguiente paso real.

---

## 18. Herramientas y stack técnico

| Categoría | Requerimiento | Proveedor | Costo |
| --- | --- | --- | --- |
| Infraestructura | Servidor Linux de prueba (VM local o cloud) | Oracle Cloud Free Tier / AWS Free Tier | $0 |
| Lenguaje | Python 3.11+ | Open source | $0 |
| Librerías de escaneo | `cryptography`, `ssl`, `python-nmap` | PyPI | $0 |
| Generación de CBOM | `cyclonedx-python-lib` | PyPI / OWASP | $0 |
| Dashboard (fase inicial) | Streamlit o Flask | Open source | $0 |
| Dashboard (producto) | **React + Tailwind CSS** | Open source | $0 |
| Base de datos | SQLite (inicial) / **PostgreSQL** (producción) | Open source | $0–$500/mes |
| Documentación | LaTeX / Google Docs | Open source / Google | $0 |
| Control de versiones | GitHub | Free tier | $0 |
| CI/CD | GitHub Actions | Free tier | $0 |
| Hosting demo | Vercel / Render | Free tier | $0–$400/mes |
| Dominio | .com o .io | Namecheap / Cloudflare | ~$250/año |
| Equipo de cómputo | Laptops de desarrollo | Ya disponibles | $0 |

**Qué coincide con la app que presentas:** el frontend está en **React + Tailwind** (no Streamlit), el escáner real está en **Python** (`scanner/engine.py`) con API local en `scanner/server.py` (puerto 8080), y el CBOM se exporta en formato **CycloneDX**. Puedes decir: *“La fase 3 del plan ya está implementada en React, que era la meta de la versión de producto.”*

---

## 19. Análisis FODA

| | **Positivo** | **Negativo** |
| --- | --- | --- |
| **Interno** | **Fortalezas:** producto construible con costo casi nulo (open source); enfoque en el primer paso que nadie da (el CBOM); stack alineado con estándares abiertos (CycloneDX, NIST); equipo complementario: producto + técnica. | **Debilidades:** equipo de 2 personas sin experiencia comercial previa; sin cartera de clientes ni casos de éxito; producto en fase de diseño (sin prototipo funcional aún, según el PDF); marca desconocida en el mercado. |
| **Externo** | **Oportunidades:** mercado PQC proyectado de **USD 0.42B (2025) a USD 2.84B (2030)**, CAGR **46.2%**; solo el **22%** de las organizaciones ha avanzado en medidas resistentes a la computación cuántica; plazos regulatorios NIST (2030/2035); competidores enterprise inaccesibles para fintechs medianas. | **Amenazas:** ANKATech (Colombia) ya tiene producto y funding y puede llegar a México antes; ISARA ya tiene distribución en Iberia y LATAM vía Cefiros; competidores globales con equipos de ventas y marketing consolidados; presión de precio (los competidores pueden bajar costos para defender mercado). |

**Cómo presentar el FODA sin sonar débil:** no lo leas como lista. Di:

> “Nuestra fortaleza es que el producto cuesta casi nada construirlo y ataca el paso que nadie ha dado. Nuestra debilidad honesta es que aún no tenemos clientes ni marca. Nuestra amenaza real no es IBM: es que ANKATech llegue a México antes que nosotros. Todo el plan de fases está diseñado para ganar esa carrera.”

Si el prototipo ya funciona (que es tu caso), actualiza la debilidad del PDF: *“el PDF decía ‘sin prototipo funcional’; hoy ya hay uno, lo que reduce esa debilidad a la parte comercial.”* Decirlo tú demuestra madurez.

---

## 20. Estrategia de comercialización

Cuatro canales, con distinto costo y distinta métrica.

| Canal | Función | Costo | Métrica de éxito |
| --- | --- | --- | --- |
| **Venta directa (fundadores)** | Demos a CISOs/CTOs de fintechs y bancos medianos en **CDMX, Guadalajara y Monterrey**. | Tiempo. | 3 cartas de intención en fase 0. |
| **Partners con consultoras de ciberseguridad** | Ellas ya tienen la relación con el cliente; UBIORA les da la herramienta de descubrimiento que no tienen. | Comisión por *referral* (10–20%). | Primer partner firmado en fase 5. |
| **Contenido técnico** | LinkedIn y GitHub: publicar CBOM de ejemplo, hablar en meetups de ciberseguridad. | Bajo. | *Inbound leads* calificados. |
| **Integración vía API** | Integrarse con SIEM/GRC existentes para que UBIORA sea un módulo, no una plataforma separada. | Desarrollo. | Primer integrador en fase 5. |

**La lógica estratégica:** al principio vendes tú (porque nadie más puede explicar el producto). Después vendes a través de consultoras (porque ellas ya tienen la puerta abierta) y te vuelves un módulo dentro de herramientas que el cliente ya usa. **Ventas propias primero, partners después.**

---

## 21. Misión, visión y valores

| Elemento | Definición |
| --- | --- |
| **Misión** | Dar a las empresas la visibilidad criptográfica que necesitan para proteger sus datos frente a la amenaza cuántica, mediante una plataforma accesible que descubre, prioriza y traza la ruta de migración a estándares post-cuánticos. |
| **Visión** | Ser la plataforma de referencia en Latinoamérica para la gestión de riesgo criptográfico post-cuántico, y el punto de entrada que toda empresa mediana usa antes de migrar a PQC. |
| **Valores** | **Claridad:** traducimos lo complejo en decisiones accionables. **Accesibilidad:** la seguridad post-cuántica no debe ser un privilegio de las Fortune 500. **Rigor técnico:** cada hallazgo se basa en estándares verificables (NIST, CycloneDX). **Independencia:** no vendemos migración; vendemos el diagnóstico que la hace posible. |

**Truco:** el valor de **Independencia** es el más potente y el que menos se usa. Explícalo así:

> “No tenemos incentivo para inventar riesgos, porque no cobramos por migrarlos. Cobramos por diagnosticarlos. Eso nos hace creíbles.”

---

## 22. Estructura organizacional

| Rol | Responsabilidad | Funciones clave |
| --- | --- | --- |
| **Director General / Arquitecto de Producto** | Visión estratégica, producto, relación con clientes, viabilidad del negocio. | Definición de roadmap, entrevistas con clientes, diseño del scoring de riesgo, hoja de ruta de producto, liderazgo de la memoria y pitch. |
| **CTO / Ingeniero de Desarrollo** | Motor técnico, prototipo, validación de detección. | Desarrollo del escáner en Python, generación de CBOM (CycloneDX), implementación del scoring, dashboard, pruebas y documentación técnica. |

Es una estructura **plana y mínima**, coherente con una etapa pre-seed. La organización crece en la fase 5 con ventas y soporte, financiada por el MRR.

---

## 23. Cómo se conecta todo esto con la aplicación

Esta tabla te sirve para saltar del discurso de negocio a la demo sin perder el hilo.

| Concepto del PDF | Dónde se ve en la app | Qué decir mientras la muestras |
| --- | --- | --- |
| Módulo de Descubrimiento | **Descubrimiento** (`/descubrimiento`) | “Aquí está el escáner. Le doy un dominio y detecta los algoritmos que usa su TLS.” |
| Inventario crudo + CBOM CycloneDX | **Inventario CBOM** (`/inventario`) | “Todo esto se normaliza en un CBOM estándar, exportable en CycloneDX.” |
| Scoring (sensibilidad, vida útil, exposición, criticidad) | **Resumen de exposición** (`/`) y tabla de riesgos | “Cada hallazgo recibe un puntaje y aparece ordenado por criticidad.” |
| Top 10 y plan priorizado | **Hoja de ruta** (`/hoja-de-ruta`) | “El resultado no es una lista: es un plan por fases alineado a los plazos NIST.” |
| Entregable para el CISO/board | **Informe ejecutivo** (`/informe`) | “Este es el documento que el CISO lleva al comité. Se imprime o se exporta a PDF.” |
| Onboarding sin fricción | **Cómo funciona** (`/como-funciona`) | “El producto se explica solo; no requiere capacitación técnica profunda.” |

**Advertencia importante:** la app **arranca vacía** a propósito. Eso no es un bug, es una decisión de producto y una buena historia:

> “La app arranca sin datos porque así la usa un cliente real: primero escanea, y los datos aparecen. Si quieres ver el flujo completo sin escanear, hay un botón de ‘Cargar ejemplo’ que genera un conjunto de demostración. Pero el valor está en que el inventario nace de *tu* infraestructura, no de una plantilla.”

---

## 24. Preguntas difíciles del jurado (y respuestas honestas)

**“¿No es esto demasiado técnico para dos estudiantes de 5º semestre?”**
> “El prototipo ya escanea TLS real, genera un CBOM CycloneDX y puntúa el riesgo. No estamos prometiendo un producto terminado: estamos demostrando que la parte más difícil —el descubrimiento y el scoring— es construible, y ese es exactamente el criterio de salida de las fases 1 a 3.”

**“¿Qué pasa si IBM o SandboxAQ bajan de precio?”**
> “Podrían, pero su modelo entero está construido sobre contratos enterprise y equipos de implementación. Bajar a $18,000 pesos el diagnóstico canibaliza su negocio principal. Nosotros no competimos por funcionalidad: competimos por el segmento que ellos no atienden.”

**“¿Por qué no lo hace una consultora?”**
> “Porque una consultora vende horas y un diagnóstico de seis meses. Nosotros vendemos una herramienta de autoservicio que entrega el mismo primer paso en días. Y de hecho las consultoras son nuestro canal, no nuestro competidor: les damos la herramienta de descubrimiento que no tienen.”

**“¿ANKATech no los va a aplastar?”**
> “ANKATech hace orquestación y migración, no descubrimiento puro. Y no tiene presencia local en México. Nuestra ventana es ganar el segmento fintech mexicano antes de que lleguen, y por eso la fase 0 exige tres cartas de intención en dos meses.”

**“¿Cómo van a conseguir clientes sin experiencia comercial?”**
> “Venta directa de los fundadores en CDMX, Guadalajara y Monterrey, con un ciclo de 1 a 3 meses y como decisor al CISO o CTO. Después, partners con consultoras que ya tienen la relación. El plan no depende de tener un equipo de ventas desde el día uno.”

**“Esos números de mercado, ¿de dónde salen?”**
> “De fuentes citadas en el documento: Bain & Company (febrero 2026), Trusted Computing Group (1,500 profesionales), Gartner (enero 2026), IBM Institute for Business Value y DigiCert (julio 2026, 1,001 decisiones). No son estimaciones nuestras: son encuestas publicadas.”

**“¿Por qué el NIST les importa si son mexicanos?”**
> “Porque la cadena de suministro y la regulación financiera mexicana se alinean con NIST, y porque el riesgo HNDL no espera regulación: si copian tus datos hoy, la fecha límite ya pasó. Además hablamos el lenguaje de la CNBV, no solo el de NIST.”

**“¿El producto ya migra la criptografía?”**
> “No, y es intencional. Vendemos el mapa y el orden de prioridades, no la obra. Eso nos hace independientes: no tenemos incentivo para inflar riesgos porque no cobramos por migrarlos.”

**“¿Y si el computador cuántico tarda más de lo esperado?”**
> “Entonces el riesgo HNDL sigue existiendo igual, y la presión regulatoria también. Pero además nuestro producto tiene valor independiente: un inventario criptográfico sirve para auditorías, cumplimiento y gestión de certificados, con o sin cuántica.”

**“¿Cuál es el mayor riesgo del proyecto?”**
> “Que ANKATech llegue a México antes que nosotros. Por eso el criterio de salida de la fase 0 son cartas de intención, no código: necesitamos validar tracción comercial antes de invertir más meses en producto.”

---

## 25. Resumen de una página (elevator pitch)

**UBIORA** es una plataforma SaaS B2B que descubre qué criptografía usa realmente una empresa, la ordena en un inventario estándar (CBOM, formato CycloneDX) y prioriza el riesgo frente a la computadora cuántica.

**El problema:** el 61% de las organizaciones no tiene visibilidad de su criptografía y menos del 40% ha hecho el inventario. Sin inventario no hay migración posible. Y con el riesgo *harvest now, decrypt later*, los datos copiados hoy ya están en peligro.

**La solución:** escanear → normalizar en CBOM → puntuar el riesgo (sensibilidad, vida útil, exposición, criticidad) → entregar un plan priorizado y un informe ejecutivo. No migramos: damos el mapa.

**El cliente:** fintechs y bancos medianos de 50 a 500 empleados en México, con presión regulatoria y sin presupuesto enterprise.

**El modelo:** diagnóstico único de $15,000–$25,000 MXN + monitoreo de $3,000–$5,000 MXN/mes.

**La tracción posible:** punto de equilibrio con un diagnóstico cada 12 meses; año 1 de $72,000 MXN; año 3 de $1.08M MXN.

**La diferenciación:** el primer paso que nadie da, precio para el mercado medio y contexto regulatorio mexicano (CNBV + NIST).

**La ventana:** los plazos NIST (2030 claves, 2031 firmas, 2035 prohibición) y la ausencia de ANKATech en México. La ventana es real, pero tiene fecha de caducidad.

---

## 26. Tabla de cifras rápidas

Para memorizar antes de exponer. Si te aprendes esta tabla, puedes responder casi cualquier pregunta numérica.

| Cifra | Qué es |
| --- | --- |
| **9%** | Líderes con hoja de ruta post-cuántica definida (Bain). |
| **<40%** | Grandes empresas con inventario criptográfico exhaustivo (Bain). |
| **91%** | Empresas sin hoja de ruta formal PQC (Trusted Computing Group). |
| **81%** | Creen que sus librerías criptográficas no están listas. |
| **61%** | Sin visibilidad completa de sus sistemas criptográficos (Gartner). |
| **30%** | Ha completado un inventario criptográfico (IBM IBV). |
| **84%** | Cree que sus datos ya están expuestos a HNDL (DigiCert). |
| **39%** | Estima 3–5 años para migrar (DigiCert). |
| **22%** | Organizaciones que avanzaron en seguridad resistente a la cuántica. |
| **2030 / 2031 / 2035** | Plazos NIST: claves / firmas / prohibición de algoritmos clásicos. |
| **USD 0.42B → 2.84B (2025→2030)** | Mercado PQC, CAGR **46.2%**. |
| **50–500** | Empleados del cliente objetivo. |
| **$15k–$25k MXN** | Diagnóstico inicial. |
| **$3k–$5k MXN/mes** | Monitoreo. |
| **$11k–$15k MXN** | Inversión año 1. |
| **$700–$1,700 MXN/mes** | Costos fijos de operación. |
| **1 diagnóstico / 12 meses** | Punto de equilibrio operativo. |
| **24 meses** | Duración del plan completo (fases 0–5). |
| **2 integrantes** | Equipo actual. |

---

## Cierre: las cinco frases que no puedes olvidar

1. **“UBIORA ilumina lo que no se ve, en todas partes.”**
2. **“No vendemos migración; vendemos el inventario y la priorización que nadie ha hecho.”**
3. **“No competimos contra IBM; competimos contra la inacción.”**
4. **“La regulación es el empujón, pero el riesgo es el motivo.”**
5. **“La ventana es real, pero tiene fecha de caducidad.”**

Con esas cinco frases y la tabla de cifras rápidas, puedes sostener cualquier conversación sobre UBIORA.

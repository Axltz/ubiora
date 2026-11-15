# 01 · Producto y alcance

## 1. Resumen

UBIORA es una plataforma B2B que descubre, inventaría y prioriza el riesgo criptográfico post-cuántico de una organización. Su entregable principal no es una migración ejecutada, sino un **CBOM** (Cryptographic Bill of Materials) y una **hoja de ruta priorizada** que permite decidir qué migrar primero, con qué estándar y en qué orden.

El MVP demuestra el flujo completo con datos simulados: descubrimiento → normalización CBOM → scoring → hoja de ruta → informe ejecutivo.

## 2. Problema

Las organizaciones saben que la computación cuántica es una amenaza, pero no saben dónde está su criptografía. Los datos de la memoria del proyecto lo confirman:

- Solo el **9%** de los líderes tiene una hoja de ruta definida para la migración post-cuántica.
- Menos del **40%** de las grandes empresas ha completado un inventario criptográfico.
- El **61%** carece de visibilidad completa sobre sus sistemas criptográficos.
- El **84%** cree que parte de sus datos cifrados ya está expuesta a *harvest now, decrypt later*.

La migración es imposible de planear sin inventario. Ese es el primer paso que nadie está dando y el espacio que UBIORA ocupa.

## 3. Usuario objetivo

| Segmento | Descripción | Decisor |
| --- | --- | --- |
| Fintechs y bancos medianos en México | 50–500 empleados, datos de alta sensibilidad, presión regulatoria y presupuesto limitado para plataformas enterprise. | CISO / CTO |
| Consultoras de ciberseguridad | Ya tienen la relación con el cliente, pero no una herramienta de descubrimiento. | Socio / Director de seguridad |
| Sectores adyacentes | Salud, manufactura avanzada y empresas con cadena de suministro regulada. | CISO / CIO |

Para la demo se usa un cliente ficticio: **Cobalto Pay**, fintech de banca digital en México.

## 4. Propuesta de valor

> UBIORA convierte la criptografía invisible en una decisión ejecutable.

Tres pilares:

1. **Inventario desde cero.** No asumimos que el cliente ya tiene un CBOM; lo generamos.
2. **Priorización con contexto de negocio.** El riesgo no depende solo del algoritmo: importa la sensibilidad del dato, su vida útil, la exposición y la criticidad operativa.
3. **Localía y lenguaje regulatorio.** La plataforma conecta NIST con la realidad de la CNBV y del mercado mexicano.

## 5. Objetivos del MVP

| Objetivo | Cómo se demuestra |
| --- | --- |
| Explicar el problema en menos de 60 segundos | Landing interna / resumen de exposición con score y reloj regulatorio. |
| Mostrar que el inventario es el producto | Módulo CBOM con 1,284 componentes y exportación CycloneDX. |
| Hacer tangible el descubrimiento | Consola de escaneo con alcance configurable, progreso y hallazgos. |
| Convertir hallazgos en plan | Gantt 2026–2030 con fases, entregables y dependencias. |
| Entregar algo que el consejo pueda leer | Informe ejecutivo imprimible con decisiones solicitadas. |
| Verse como producto, no como prototipo | Sistema visual propio, tipografía auto-hospedada, interacciones y responsive. |

## 6. Alcance del MVP

### Incluido

- Dashboard de exposición con KPIs, tendencia, mezcla de algoritmos y cola de prioridad.
- Inventario de 1,284 componentes con búsqueda, filtros, orden, paginación y selección.
- Drawer de detalle por activo con ficha criptográfica y recomendación de migración.
- Flujo simulado de descubrimiento con configuración de alcance y consola en vivo.
- Hoja de ruta 2026–2030 con seis fases e iniciativas.
- Informe ejecutivo imprimible con metodología.
- Exportación de CBOM (JSON CycloneDX 1.7) y CSV.
- Búsqueda global y navegación responsive.

### Fuera de alcance (para esta entrega)

- Escáner real de TLS, certificados, repositorios o contenedores.
- Autenticación, multiusuario o persistencia en base de datos.
- Integración con SIEM/GRC, API pública o webhooks.
- Generación real de PDF en servidor (se usa la impresión del navegador).
- Cálculo de riesgo con datos productivos del cliente.
- Facturación, onboarding o panel de administración.

Estas capacidades se abordan en el [plan de entrega](07-plan-de-entrega-y-demo.md) como siguientes fases.

## 7. Principios de producto

1. **La claridad es la función.** Cada pantalla responde: qué está en riesgo, por qué y qué hago ahora.
2. **La evidencia manda.** Cada hallazgo se puede rastrear a un activo, una ubicación y una regla de scoring.
3. **No vendemos migración.** Vendemos el diagnóstico que la hace posible; el plan no ejecuta cambios en producción.
4. **Accesible no significa simple.** La profundidad técnica vive en el drawer y en el CBOM; la decisión vive en el resumen.
5. **Diseño con intención.** Nada de gradientes decorativos, glassmorphism genérico ni componentes de plantilla sin criterio.

## 8. Mensajes clave para la presentación

1. El problema no es la computación cuántica: es la **falta de inventario**.
2. UBIORA no compite con IBM ni con consultoras; compite contra la **inacción**.
3. El primer entregable es un **CBOM priorizado**, no una migración.
4. La ventana regulatoria ya empezó y la vida útil de los datos es el argumento más urgente.
5. El producto puede empezar como SaaS de diagnóstico y crecer hacia monitoreo continuo.

## 9. Criterio de éxito de la demo

La demo se considera exitosa si el jurado puede responder, al final de cinco minutos:

- ¿Qué algoritmos usa Cobalto Pay y cuáles son críticos?
- ¿Por qué un activo es más urgente que otro?
- ¿Qué se migra primero y con qué estándar?
- ¿Qué decisión se le está pidiendo al consejo?

# ADR-0001 · SPA con React + Vite en lugar de un framework con SSR

- **Estado:** Aceptada
- **Fecha:** Noviembre 2026
- **Contexto:** MVP académico de cinco rutas, sin backend y con datos simulados.

## Contexto

UBIORA es una aplicación interna de seguridad. No necesita SEO, renderizado en servidor ni marketing. La demo debe arrancar rápido en la laptop de un estudiante y el build debe ser pequeño.

El equipo evaluó Next.js como opción por defecto del ecosistema React.

## Decisión

Construir una SPA con **React 19 + Vite 8 + TypeScript**. El ruteo se resuelve con React Router 7 en el cliente. El despliegue es estático con fallback a `index.html`.

## Alternativas consideradas

| Alternativa | Motivo de descarte |
| --- | --- |
| Next.js (App Router) | Añade servidor, convenciones de SSR y complejidad de despliegue sin beneficio para una app interna sin SEO. |
| Remix | El modelo de loaders/server no aporta sin backend. |
| Astro | Excelente para contenido, innecesario para una app con estado interactivo denso. |

## Consecuencias

**Positivas**

- Arranque y build rápidos.
- Despliegue estático en cualquier CDN.
- Menos superficie de configuración.

**Negativas**

- El primer render depende de JavaScript.
- Hay que configurar el fallback de rutas en el hosting.
- Si el producto crece a SaaS público con landing y SSR, la decisión debe revisarse.

## Revisión

Reevaluar cuando exista autenticación, contenido público indexable o requisitos de SSR.

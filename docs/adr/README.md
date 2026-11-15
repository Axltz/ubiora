# Architecture Decision Records

Un ADR registra una decisión técnica con su contexto, las alternativas consideradas y las consecuencias. No describe el estado actual del código: explica **por qué** llegó ahí.

## Índice

| ID | Decisión | Estado | Fecha |
| --- | --- | --- | --- |
| [0001](0001-spa-react-vite.md) | SPA con React + Vite en lugar de un framework con SSR | Aceptada | 2026-11 |
| [0002](0002-design-tokens-tailwind.md) | Tailwind 4 con tokens propios en lugar de una librería de componentes | Aceptada | 2026-11 |
| [0003](0003-deterministic-client-data.md) | Datos simulados deterministas en cliente | Aceptada | 2026-11 |
| [0004](0004-custom-svg-charts.md) | Gráficas SVG a medida en lugar de una librería | Aceptada | 2026-11 |
| [0005](0005-portal-risk-drawer.md) | Drawer renderizado con `createPortal` | Aceptada | 2026-11 |
| [0006](0006-browser-print-pdf.md) | Impresión del navegador en lugar de generación de PDF | Aceptada | 2026-11 |

## Formato

Cada ADR usa la misma estructura:

```
# ADR-XXXX · Título
Estado · Fecha

## Contexto
## Decisión
## Alternativas consideradas
## Consecuencias
```

Cuando una decisión se reemplace, se crea un nuevo ADR y se marca el anterior como **Reemplazada por ADR-YYYY**. No se edita la historia de una decisión aceptada.

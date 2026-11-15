# ADR-0002 · Tailwind 4 con tokens propios en lugar de una librería de componentes

- **Estado:** Aceptada
- **Fecha:** Noviembre 2026
- **Contexto:** El requisito explícito era evitar una apariencia de “dashboard generado por IA”.

## Contexto

Las librerías de componentes (MUI, Ant, Chakra, shadcn con sus defaults) aceleran el desarrollo, pero imponen un lenguaje visual reconocible. El proyecto necesitaba una identidad propia: consola oscura, acento lima, tipografía monoespaciada para datos y un informe editorial claro.

## Decisión

Usar **Tailwind CSS 4** con tokens definidos en `@theme` dentro de `app/src/index.css` y un conjunto pequeño de primitivas propias (`Button`, `Badge`, `Panel`, `FilterSelect`). No se usa una librería de componentes.

## Alternativas consideradas

| Alternativa | Motivo de descarte |
| --- | --- |
| MUI / Ant Design | Look corporativo difícil de neutralizar; peso alto. |
| shadcn/ui | Excelente base, pero sus defaults se reconocen con facilidad y el proyecto requería una estética distinta. |
| CSS Modules puro | Más control, pero mucho más código repetido para utilidades. |
| Chakra | Tema propio posible, pero peso y API menos directa que Tailwind 4. |

## Consecuencias

**Positivas**

- Paleta, tipografía, radios y espaciado viven en un solo lugar.
- Los componentes se diseñan para el producto, no al revés.
- Bundle CSS pequeño (~62 kB, ~11 kB gzip).

**Negativas**

- Hay que mantener las primitivas a mano.
- No hay documentación de componentes generada (Storybook) en esta fase.
- Mayor riesgo de inconsistencias si el equipo crece sin revisión.

## Revisión

Si el equipo supera tres personas frontend, considerar Storybook o una página interna de componentes.

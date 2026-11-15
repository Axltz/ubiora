# ADR-0003 · Datos simulados deterministas en cliente

- **Estado:** Aceptada
- **Fecha:** Noviembre 2026
- **Contexto:** El MVP necesita 1,284 componentes sin backend ni base de datos.

## Contexto

Un dashboard de riesgo necesita volumen para demostrar filtros, paginación y agregados. Un archivo JSON con 1,284 registros completos sería difícil de mantener y de revisar en Git. Además, la demo debe ser reproducible: el mismo número de críticos y los mismos activos cada vez.

## Decisión

Generar el inventario en el cliente con un **generador congruencial lineal** de semilla fija (`0x2f6e2b1`), combinado con **27 registros curados** a mano. Los datos viven en [`app/src/data/assets.ts`](../../app/src/data/assets.ts).

## Alternativas consideradas

| Alternativa | Motivo de descarte |
| --- | --- |
| JSON estático de 1,284 registros | Archivo grande, difícil de mantener y de revisar. |
| Datos aleatorios en cada carga | Rompe la reproducibilidad de capturas, informe y demo. |
| Mock API (MSW) | Añade una capa que no se necesita sin backend. |
| Faker.js | Dependencia extra y datos menos coherentes con el dominio. |

## Consecuencias

**Positivas**

- Reproducibilidad total sin infraestructura.
- Volumen suficiente para demostrar la interfaz.
- Los casos narrados se mantienen arriba de la cola.

**Negativas**

- El inventario no representa un cliente real.
- El scoring está precalculado, no recalculado.
- La lógica de generación es código de demo y no debe reutilizarse en producción.

## Revisión

Reemplazar por el motor y la base de datos en la fase F1/F2 (ver [`../07-plan-de-entrega-y-demo.md`](../07-plan-de-entrega-y-demo.md)).

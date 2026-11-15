# ADR-0004 · Gráficas SVG a medida en lugar de una librería

- **Estado:** Aceptada
- **Fecha:** Noviembre 2026
- **Contexto:** El producto necesita un gauge, una gráfica de área, barras y sparklines.

## Contexto

Las librerías de gráficas (Recharts, Chart.js, ECharts, Nivo) resuelven el 80% de los casos, pero añaden peso, imponen estilos y producen visualizaciones fáciles de reconocer. El proyecto buscaba una estética de consola de seguridad con control total de cada trazo.

## Decisión

Implementar las cuatro visualizaciones con **SVG y React**, sin librería:

- `ReadinessGauge`: arco con gradiente y ticks.
- `ExposureChart`: área suavizada con Bézier y tooltip por hover.
- `AlgorithmBars`: barra apilada y desglose por familia.
- `Sparkline`: tendencia mínima en KPIs.

## Alternativas consideradas

| Alternativa | Motivo de descarte |
| --- | --- |
| Recharts | ~100 kB extra; difícil de estilizar más allá de sus defaults. |
| Chart.js | Canvas, menos accesible y menos integrado con React. |
| ECharts | Muy potente y muy pesado para cuatro gráficas simples. |
| D3 puro | Control total, pero más código y curva de aprendizaje sin beneficio. |

## Consecuencias

**Positivas**

- Control visual completo y consistencia con el sistema.
- Menor bundle y sin dependencias de visualización.
- Animaciones y tooltips a medida.

**Negativas**

- Hay que implementar accesibilidad, escalas y responsive a mano.
- No hay soporte inmediato para tipos de gráfica nuevos.
- El tooltip actual depende de `mousemove`; falta navegación por teclado.

## Revisión

Si se necesitan más de ocho visualizaciones o interacción avanzada (zoom, brushing), evaluar una librería headless como Visx.

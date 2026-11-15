# ADR-0005 · Drawer renderizado con `createPortal`

- **Estado:** Aceptada
- **Fecha:** Noviembre 2026
- **Contexto:** El drawer de detalle aparecía desplazado y fuera del viewport.

## Contexto

`RiskDrawer` usa `position: fixed` para ocupar el lado derecho de la pantalla. Las páginas usan la animación `animate-rise`, que aplica `transform: translateY(...)`. Un elemento con `transform` crea un **containing block** para descendientes con `position: fixed`: el drawer dejaba de posicionarse respecto al viewport y pasaba a hacerlo respecto al contenedor animado.

El síntoma era un panel con `y` negativo y altura mayor que la pantalla.

## Decisión

Renderizar el drawer con `createPortal(..., document.body)`. Así queda fuera del árbol transformado y `fixed` vuelve a referirse al viewport.

## Alternativas consideradas

| Alternativa | Motivo de descarte |
| --- | --- |
| Quitar `animate-rise` | Se perdía la entrada de página y el bug podía reaparecer con otra animación. |
| Usar `position: absolute` | Requiere un contenedor relativo a pantalla completa; más frágil. |
| Mover la animación solo a elementos internos | Funciona, pero es fácil de romper al añadir animaciones. |
| Librería de overlays (Radix) | Resolvería el problema, pero añade dependencia por un solo caso. |

## Consecuencias

**Positivas**

- El drawer se posiciona correctamente en todas las páginas.
- La solución es explícita y documentada.
- No se sacrifica la animación de entrada.

**Negativas**

- El drawer ya no hereda contexto visual del árbol de la página (no aplica aquí porque usa tokens globales).
- Requiere recordar que cualquier overlay nuevo debe portarse si vive dentro de un contenedor animado.

## Referencia

Implementación en [`app/src/components/RiskDrawer.tsx`](../../app/src/components/RiskDrawer.tsx).

# 08 · Guía de uso y recorrido guiado

## 1. Para qué existe esta guía

UBIORA es un producto de ciberseguridad, y su vocabulario puede volverse una barrera en la presentación. Esta capa de ayuda explica el sitio **sin asumir conocimientos de criptografía**: qué problema resuelve, en qué orden se lee cada pantalla y qué se puede decir en voz alta frente al grupo.

La ayuda vive dentro del producto, no en un PDF aparte:

| Punto de entrada | Qué hace |
| --- | --- |
| Pantalla [`/como-funciona`](../app/src/pages/Guide.tsx) | Explica el flujo, las cinco pantallas, un glosario mínimo y el guion de 60 segundos. |
| Recorrido guiado (`ProductTour`) | Lleva al usuario por las cinco pantallas con una tarjeta flotante, paso a paso. |
| Botón de ayuda del sidebar | Inicia el recorrido desde cualquier pantalla. |
| Command palette (`⌘K` / `Ctrl+K`) | Ofrece “¿Cómo funciona UBIORA?” e “Iniciar el recorrido guiado”. |
| Botón “Cómo funciona” en el resumen | Abre la guía completa. |

## 2. El flujo en lenguaje claro

El producto se explica en cuatro verbos, aunque la interfaz tenga cinco módulos:

1. **Descubre.** UBIORA busca la criptografía que la empresa usa sin saberlo: certificados, librerías, llaves y endpoints.
2. **Inventaría.** Cada hallazgo se guarda en el CBOM, la lista completa de componentes criptográficos.
3. **Prioriza.** El riesgo se calcula con el dato protegido, su vida útil, la exposición y la criticidad del sistema.
4. **Planea.** Los hallazgos se convierten en fases, responsables y fechas alineadas a los plazos del NIST.

El **informe ejecutivo** cierra el ciclo: traduce todo lo anterior en la decisión que se pide al consejo.

> Frase de presentación: “UBIORA no vende la migración completa; vende la visibilidad y la prioridad que la hacen posible.”

## 3. Las cinco pantallas

| Pantalla | Pregunta que responde | Qué mirar |
| --- | --- | --- |
| Resumen de exposición | ¿Qué tan expuestos estamos? | Score 34/100, 17 críticos y días restantes para 2030. |
| Descubrimiento | ¿De dónde salen los datos? | Iniciar el escaneo y ver la consola en vivo. |
| Inventario CBOM | ¿Qué componente es? | Filtrar por crítico y abrir una fila. |
| Hoja de ruta | ¿Cuándo lo migramos? | Seleccionar una fase y revisar dueño, estándar y riesgo. |
| Informe ejecutivo | ¿Qué decide el consejo? | Leer “Decisión solicitada”. |

## 4. Cómo funciona el recorrido guiado

El recorrido es un componente de React montado una sola vez en el árbol de la aplicación:

- [`ProductTour.tsx`](../app/src/components/tour/ProductTour.tsx) define los pasos y expone `useTour()` con `start()` y `stop()`.
- Cada paso declara su ruta, su icono, un título, una explicación y un consejo de presentación.
- Al avanzar, el proveedor navega a la ruta del paso mediante React Router, por lo que el usuario ve la pantalla real mientras lee la tarjeta.
- Al terminar, el recorrido cierra la tarjeta y lleva a `/como-funciona` para dejar la guía completa como referencia.
- `Esc` y el botón “Saltar” cierran el recorrido sin cambiar de pantalla.

### Estados y controles

| Control | Comportamiento |
| --- | --- |
| “Siguiente” | Avanza al siguiente paso y navega a su ruta. En el último paso se convierte en “Terminar”. |
| “Anterior” | Retrocede un paso; deshabilitado en el primero. |
| “Saltar” / `Esc` | Cierra la tarjeta y deja al usuario donde está. |
| “Terminar” | Cierra la tarjeta y abre la guía completa. |

La tarjeta se posiciona abajo a la derecha en escritorio y ocupa el ancho disponible en móvil. Usa `z-[75]`, por debajo del toast (`z-[100]`) y del drawer de riesgo (`z-[80]`), y lleva `no-print` para no aparecer al imprimir el informe.

## 5. Glosario mínimo incluido en la guía

La página `/como-funciona` define seis términos: criptografía, CBOM, PQC, RSA/ECDSA, vida útil del dato y *harvest now, decrypt later*. La intención es que cualquier persona pueda seguir la demo sin interrumpir para preguntar qué significa una sigla.

## 6. Guion de 60 segundos

| Tiempo | Idea |
| --- | --- |
| 00–15 | Las empresas usan criptografía en cientos de lugares que no están en ningún diagrama; la migración empieza con un inventario. |
| 15–30 | Cobalto Pay: 1,284 componentes, 17 críticos y 387 expuestos a Internet. |
| 30–45 | El riesgo se prioriza con sensibilidad del dato, vida útil, exposición y criticidad. |
| 45–60 | La hoja de ruta asigna fases y dueños; el informe pide una sola decisión: aprobar el primer paso. |

## 7. Criterios de aceptación de la ayuda

- Cualquier pantalla permite iniciar el recorrido en menos de dos clics.
- La guía se entiende sin haber leído el resto de la documentación.
- El recorrido no bloquea la navegación ni deja estados inconsistentes al salir.
- La ayuda no aparece en la versión impresa del informe.
- En móvil, la tarjeta no tapa los controles principales de la pantalla.

## 8. Limitaciones conocidas

- El recorrido recorre las pantallas en un orden fijo; no se adapta al estado de cada módulo.
- No hay persistencia de “recorrido completado” entre sesiones.
- La guía es estática: no incluye videos ni tooltips sobre elementos individuales de la interfaz.

# ADR-0006 · Impresión del navegador en lugar de generación de PDF

- **Estado:** Aceptada
- **Fecha:** Noviembre 2026
- **Contexto:** El informe ejecutivo debe poder entregarse como documento.

## Contexto

El módulo de informe necesita un entregable que el consejo pueda leer e imprimir. Generar un PDF en servidor requiere una dependencia (Puppeteer, Playwright, React-PDF) y un backend, que el MVP no tiene. La demo debe funcionar offline.

## Decisión

Construir el informe como HTML/CSS con estilos `@media print` y usar `window.print()` del navegador. El usuario elige “Guardar como PDF”.

Se definieron:

- `@page { size: A4; margin: 0 }`.
- Ocultamiento de `.no-print` (sidebar, topbar, controles).
- `break-inside: avoid` en secciones.
- Ancho completo y padding en milímetros para el papel.

## Alternativas consideradas

| Alternativa | Motivo de descarte |
| --- | --- |
| Puppeteer en servidor | Requiere backend y navegador headless; fuera de alcance. |
| React-PDF | Otra representación del documento, duplicación de estilos y dependencia. |
| jsPDF | Baja calidad tipográfica y mucho código para un layout editorial. |
| Servicio externo | Rompe la privacidad y el funcionamiento offline. |

## Consecuencias

**Positivas**

- Cero dependencias y cero backend.
- El mismo HTML sirve para pantalla e impresión.
- La tipografía y el layout se controlan con CSS.

**Negativas**

- El resultado varía según el navegador y los márgenes del usuario.
- No hay control de metadatos del PDF ni firma digital.
- La paginación depende del contenido y del motor de impresión.

## Revisión

Si el informe se convierte en un entregable recurrente, generar PDF en servidor con una plantilla dedicada y pruebas de paginación.

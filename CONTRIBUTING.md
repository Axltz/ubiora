# Contribuir a UBIORA

Este repositorio es la entrega académica del MVP. Las reglas siguientes mantienen el historial legible y el producto coherente.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Git.

## Puesta en marcha

```bash
git clone https://github.com/Axltz/ubiora.git
cd ubiora/app
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

## Estructura

```
app/                     Aplicación React + Vite
├── src/components/      UI, layout, charts y piezas compartidas
├── src/data/            Dominio simulado y hoja de ruta
├── src/lib/             Utilidades y configuración
└── src/pages/           Los cinco módulos
docs/                    Documentación de producto e ingeniería
docs/adr/                Decisiones de arquitectura
```

Antes de crear un archivo nuevo, revisa si ya existe una primitiva o un patrón aplicable en `components/ui` o `components/charts`.

## Comandos

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Typecheck + build de producción
npm run lint      # Oxlint
npm run preview   # Sirve el build
```

**Antes de abrir un pull request, `npm run build` debe pasar sin errores.**

## Convención de commits

Se usa un prefijo tipo Conventional Commits, con el alcance del módulo afectado:

```
<tipo>(<alcance>): <descripción en imperativo>
```

Tipos permitidos:

| Tipo | Uso |
| --- | --- |
| `feat` | Nueva capacidad visible para el usuario. |
| `fix` | Corrección de un defecto. |
| `docs` | Documentación. |
| `style` | Formato, sin cambio de comportamiento. |
| `refactor` | Reestructura sin cambiar comportamiento. |
| `perf` | Mejora de rendimiento. |
| `test` | Pruebas. |
| `chore` | Tooling, dependencias, configuración. |

Alcances usados en este repo: `design`, `data`, `overview`, `cbom`, `discovery`, `roadmap`, `report`, `docs`, `repo`.

Ejemplos del historial:

```
feat(cbom): add the cryptographic inventory explorer
feat(roadmap): visualize the migration plan
fix(ui): keep the risk drawer inside the viewport
docs: add the engineering documentation set
```

### Reglas

- Un commit = una intención coherente. No mezclar cambios de UI, datos y docs sin relación.
- Descripción en imperativo, en inglés o español, pero consistente con el historial existente.
- Cuerpo opcional para explicar el **por qué**, no el qué.
- No incluir `node_modules`, `dist` ni archivos locales.

## Ramas

- `main` es la rama de entrega.
- Para trabajo nuevo: `feat/<tema>`, `fix/<tema>`, `docs/<tema>`.
- Mantener la rama actualizada antes de abrir el PR.

## Estilo de código

- TypeScript estricto; evitar `any`.
- Componentes en PascalCase; utilidades en camelCase.
- Imports absolutos no configurados: usar rutas relativas.
- Tailwind para estilos; tokens del tema antes que colores arbitrarios.
- Textos de interfaz en español; identificadores y términos técnicos en inglés cuando sea natural.
- Comentarios solo cuando expliquen una decisión no obvia.

## UI

- Reutilizar `Button`, `Tag`, `Panel`, `FilterSelect` y `Toast`.
- No introducir una librería de componentes o gráficas sin un ADR.
- Cualquier overlay nuevo debe revisar el patrón de portal de `RiskDrawer`.
- Verificar 390 px, 768 px y 1440 px.
- Mantener la navegación por teclado y el foco visible.

## Datos

- Los cambios al generador deben preservar el determinismo y los conteos documentados (1,284 / 17).
- Si se cambia una cifra, actualizar README, docs y capturas afectadas.
- No agregar datos personales reales ni secretos.

## Documentación

- Toda decisión técnica relevante se registra en `docs/adr/`.
- Los documentos describen el MVP actual; marcar explícitamente lo simulado.
- Actualizar enlaces si se mueve un archivo.

## Checklist de pull request

- [ ] `npm run build` pasa.
- [ ] `npm run lint` no reporta errores nuevos.
- [ ] La ruta afectada funciona en desktop y móvil.
- [ ] No hay errores en la consola del navegador.
- [ ] Los conteos y el determinismo se mantienen.
- [ ] La documentación o el ADR correspondiente está actualizado.
- [ ] El commit sigue la convención.

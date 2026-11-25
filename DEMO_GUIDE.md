# Guía paso a paso – Demo limpio de Ubiora

> ⚠️ **Documento histórico.** La app ya no carga datos precargados: inicia vacía y permite cargar un ejemplo de forma explícita. Para la guía vigente usa:
> - [`GUIA_USO_Y_EXPOSICION.md`](GUIA_USO_Y_EXPOSICION.md) — uso completo y exposición.
> - [`GUIA_EMPRESA_Y_PROYECTO.md`](GUIA_EMPRESA_Y_PROYECTO.md) — contexto de empresa y proyecto.


## 1. Requisitos previos
- **Node.js** (v18 o superior) y **npm** instalados.
- **Python 3.11+** para el motor de escaneo.
- Acceso a Internet solo para instalar dependencias la primera vez.
- Git configurado con el remote `https://github.com/Axltz/ubiora`.

## 2. Preparar el repositorio (demo vacío)
```powershell
# Clonar (si no lo tienes) y entrar al proyecto
cd "c:\Universidad\6to Semestre"
git clone https://github.com/Axltz/ubiora.git
cd Ubiora

# Instalar dependencias del frontend (una sola vez)
npm install --prefix app
```
> El proyecto ya está configurado para iniciar **sin activos precargados**. La variable `initialAssets` en `app/src/data/scanContext.tsx` está vacía y no se cargan los datos de `assets.ts`.

## 3. Levantar el motor de escaneo (backend Python)
```powershell
# En una terminal diferente
python scanner/server.py
```
- El servidor escuchará en **http://localhost:8080/api/scan**.
- Si lo cierras, la UI usará el algoritmo de "fallback" que genera datos simulados en el navegador.

## 4. Iniciar la aplicación web (frontend)
```powershell
npm --prefix app run dev
```
- Abre el navegador en **http://localhost:5173**.
- Verás la pantalla de **Discovery** con los campos:
  - *Targets* (lista de hosts, una línea por host).
  - *Organización*.
  - Botón **Escanear**.

## 5. Ejecutar un escaneo en vivo
1. **Escribe los hosts** que quieres analizar (ejemplo):
   ```text
   api.mercadopago.com
   github.com
   nudg.mx
   banco.santander.com.mx
   ```
2. Pulsa **Escanear**.
3. La aplicación intenta conectar al motor Python. Si el servidor está activo, mostrará logs como:
   - `✓ Motor Python nativo conectado en localhost:8080`
   - `TLS handshake con <host>:443 → <algoritmo> (<tamaño>)`
4. Cuando termine, verás la tabla de resultados y los activos quedarán guardados en `localStorage` (persisten mientras no limpies el navegador).

## 6. Ver y filtrar los activos (Inventario)
- Navega a **Inventory**.
- Usa los filtros de *Entorno*, *Prioridad* y *Algoritmo* o la barra de búsqueda para refinar la lista.
- Los activos mostrados son **solo** los obtenidos en el escaneo actual (no hay datos pre‑cargados).

## 7. Exportar resultados
- **CBOM CycloneDX 1.7** → botón **Exportar CBOM** (descarga `ubiora-cbom-cyclonedx-1.7.json`).
- **CSV** → botón **Exportar CSV** (descarga `ubiora-inventario-cbom.csv`).

## 8. Resetear el demo (volver a cero)
- En la página **Discovery**, pulsa **Limpiar** (botón “Clear”).
- También puedes borrar el `localStorage` manualmente:
  ```javascript
  localStorage.removeItem('ubiora_custom_assets');
  ```
- Recarga la página y la tabla volverá a estar vacía.

## 9. Guardar los cambios en Git
```powershell
# Añadir el nuevo archivo de guía
git add DEMO_GUIDE.md
git commit -m "Add step‑by‑step demo guide for clean start"
git push origin main
```
El commit está ya disponible en la rama `main`.

## 10. Generar el PDF (opcional)
1. Abre `DEMO_GUIDE.md` en el **Editor** de Antigravity.
2. Usa la acción **Export → PDF** (o **Print → Save as PDF** del navegador) para obtener `DEMO_GUIDE.pdf`.
3. Distribuye el PDF a los asistentes de la clase.

---
### Resumen rápido para la presentación
| Acción | Comando | Resultado |
|--------|---------|----------|
| Levantar backend | `python scanner/server.py` | Servidor en `localhost:8080` |
| Levantar frontend | `npm --prefix app run dev` | UI en `http://localhost:5173` |
| Escanear | Ingresar hosts → **Escanear** | Tabla de activos en tiempo real |
| Exportar | Botones **Exportar CBOM / CSV** | Archivos `*.json` y `*.csv` |
| Resetear | Botón **Limpiar** o `localStorage.clear()` | Estado vacío nuevamente |

Con estos pasos tienes el demo **limpio**, listo para ser demostrado y reproducido por cualquier persona.

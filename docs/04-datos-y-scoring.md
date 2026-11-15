# 04 · Datos y scoring

## 1. Objetivo

Este documento explica cómo se construye el inventario de demostración, cómo se calcula la prioridad de cada activo y cómo se transforma en un CBOM exportable. La regla de oro: **cada número de la interfaz debe poder rastrearse hasta un registro o una regla**.

## 2. Modelo de datos

El contrato vive en [`app/src/data/types.ts`](../app/src/data/types.ts). Un `CryptoAsset` representa un componente criptográfico detectado.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Identificador estable (`CBOM-001`). Se usa como `bom-ref` en CycloneDX. |
| `name` | `string` | Nombre del servicio, certificado, llave o dependencia. |
| `kind` | `AssetKind` | Certificado TLS, endpoint, librería, contenedor, llave, firma, base de datos o secreto. |
| `algorithm` | `string` | Algoritmo detectado (`RSA-2048`, `ECDSA P-256`, `ML-KEM-768`, etc.). |
| `keySize` | `string` | Tamaño o parámetro de la llave. |
| `location` | `string` | Ruta, repositorio o nombre DNS donde vive. |
| `environment` | `Environment` | Producción, Core bancario, Staging o Desarrollo. |
| `sensitivity` | `Sensitivity` | Criticidad del dato protegido. |
| `shelfLife` | `number` | Años que el dato debe permanecer protegido. |
| `exposure` | `Exposure` | Internet, Autenticado o Interno. |
| `criticality` | `1–5` | Criticidad operativa del sistema. |
| `score` | `0–100` | Riesgo compuesto. |
| `priority` | `RiskLevel` | Crítico, Alto, Medio o Bajo, derivado del score. |
| `owner` | `string` | Equipo responsable. |
| `lastSeen` | ISO date | Última observación por el motor. |
| `recommendation` | `string` | Acción de migración sugerida. |
| `target` | `string` | Ventana objetivo (`Q2 2027`). |
| `effort` | `Effort` | Bajo, Medio o Alto. |
| `status` | `AssetStatus` | Pendiente, En migración o Mitigado. |

Los tipos auxiliares (`ScanRun`, `RoadmapPhase`, `RoadmapInitiative`) modelan ejecuciones de escaneo y el plan de migración.

## 3. Construcción del inventario

El inventario vive en [`app/src/data/assets.ts`](../app/src/data/assets.ts) y combina dos fuentes:

1. **27 registros curados.** Casos con nombre, contexto y recomendación escritos a mano: `ledger-signer`, `customer-vault`, `api.cobalto.mx`, `kyc-pipeline`, etc. Representan los activos que el jurado va a inspeccionar.
2. **1,257 registros generados.** Un generador con semilla fija produce el volumen necesario para demostrar filtros, paginación y agregados.

### 3.1 Generador determinista

```ts
let state = 0x2f6e2b1
const random = () => {
  state = (state * 1664525 + 1013904223) >>> 0
  return state / 0xffffffff
}
```

Es un generador congruencial lineal (LCG). La semilla `0x2f6e2b1` está fija, por lo que **cada carga produce exactamente los mismos 1,284 registros**. Esto permite que las capturas, el informe y la demo sean reproducibles.

El generador elige tipo de activo, ambiente ponderado (48% Producción, 20% Core bancario, 16% Staging, 16% Desarrollo), algoritmo según el tipo, sensibilidad, exposición, vida útil y estado. Los nombres se construyen con patrones por tipo (`auth-service-sdk`, `payments-api.cobalto.mx`, `token-service-key`, …).

### 3.2 Distribución resultante

| Métrica | Valor |
| --- | --- |
| Componentes totales | 1,284 |
| Críticos | 17 |
| Altos | 163 |
| Medios | 249 |
| Bajos | 855 |
| Expuestos a Internet | 387 |
| Producción | 609 |
| Core bancario | 265 |
| Propietarios distintos | 17 |

La distribución es intencionalmente realista: la mayoría de los componentes son de riesgo bajo o medio y una minoría concentra la urgencia. Un dashboard donde todo es rojo no sirve para priorizar.

## 4. Scoring de riesgo

### 4.1 Modelo conceptual

La interfaz comunica un score compuesto de cuatro factores:

| Factor | Peso | Qué mide |
| --- | --- | --- |
| Sensibilidad del dato | 30% | Impacto si el dato se compromete. |
| Vida útil del dato | 25% | Cuánto tiempo debe protegerse (relevante para *harvest now, decrypt later*). |
| Exposición | 25% | Internet, autenticado o interno. |
| Criticidad operativa | 20% | Dependencia del sistema en la operación. |

```
score = 0.30 · sensibilidad + 0.25 · vida_util + 0.25 · exposicion + 0.20 · criticidad
```

Cada factor se normaliza a 0–100 antes de ponderar:

```ts
const sensitivityWeight = { Crítico: 100, Alto: 72, Medio: 48, Bajo: 24 }
const exposureWeight = { Internet: 100, Autenticado: 62, Interno: 38 }
const shelfLifeScore = min(100, (shelfLife / 15) * 100)
const criticalityScore = (criticality / 5) * 100
```

### 4.2 Implementación en el MVP

**Importante:** en esta entrega el score de cada registro está **precalculado**, no se recalcula en tiempo de ejecución.

- Los 27 registros curados tienen un score asignado manualmente, coherente con su contexto (por ejemplo, `ledger-signer` = 97, `backup-vault` = 91).
- Los registros generados usan una heurística de distribución: `26 + random^1.8 · 59`, limitada a 86, para que los casos curados sigan siendo los más críticos.
- El drawer muestra el desglose de los cuatro factores como **explicación del modelo**, normalizando los valores del registro. No es un recálculo del score final.

Esta decisión mantiene la demo estable y permite que los casos narrados sean los que aparecen arriba. La fórmula se implementará en el motor real y se probará con casos de referencia. Está registrada como limitación en [`06-calidad-y-pruebas.md`](06-calidad-y-pruebas.md).

### 4.3 Bandas de prioridad

| Score | Prioridad | Interpretación |
| --- | --- | --- |
| ≥ 88 | Crítico | Decisión en el trimestre; riesgo regulatorio o de negocio alto. |
| 74–87 | Alto | Planificar en los próximos 12 meses. |
| 56–73 | Medio | Incluir en el segundo lote de migración. |
| < 56 | Bajo | Mantener, revisar rotación o retirar. |

La función `priorityFor(score)` es la única fuente de verdad para la banda.

## 5. Agregados

Los agregados se calculan una vez al cargar el módulo y se exportan como constantes:

- `stats`: totales por prioridad, exposición y ambiente.
- `algorithmFamilies`: agrupación por familia (RSA, ECDSA, ECDH, Diffie-Hellman, SHA-1/MD5, 3DES/AES-128, AES-256) con conteo y porcentaje.
- `environmentBreakdown`: distribución por ambiente.
- `topRisks`: los ocho primeros registros ordenados por score.
- `readiness`: score 34/100 y señales de visibilidad (78), agilidad (22) y cobertura PQC (11).
- `kpis`: valores derivados para el resumen y los días restantes al plazo NIST.

El orden global es `score` descendente y, en empate, nombre ascendente.

## 6. Exportación CBOM

### 6.1 JSON CycloneDX 1.7

[`app/src/pages/Inventory.tsx`](../app/src/pages/Inventory.tsx) construye el objeto en memoria:

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.7",
  "serialNumber": "urn:uuid:4f1c9f6a-...-cobalto-pay",
  "version": 1,
  "metadata": {
    "timestamp": "2026-11-14T...",
    "component": { "type": "application", "name": "Cobalto Pay", "version": "2026.11" },
    "tools": { "components": [{ "name": "UBIORA Discovery Engine", "version": "0.4.2" }] }
  },
  "components": [
    {
      "type": "cryptographic-asset",
      "bom-ref": "CBOM-001",
      "name": "ledger-signer",
      "cryptoProperties": {
        "assetType": "Firma de código",
        "algorithmProperties": {
          "name": "RSA-3072",
          "parameterSetIdentifier": "3072 bit",
          "executionEnvironment": "Core bancario"
        }
      },
      "properties": [
        { "name": "ubiora:risk-score", "value": "97" },
        { "name": "ubiora:priority", "value": "Crítico" },
        { "name": "ubiora:exposure", "value": "Interno" },
        { "name": "ubiora:shelf-life", "value": "15 years" }
      ]
    }
  ]
}
```

Se exporta la selección si existe; de lo contrario, el resultado filtrado actual.

> Nota: el objeto sigue la estructura de CycloneDX 1.7, pero no se valida contra el esquema oficial en esta fase. Es un archivo de demostración, no un BOM certificado.

### 6.2 CSV

Columnas: `id, activo, tipo, algoritmo, llave, ambiente, sensibilidad, exposicion, vida_util, score, prioridad, estado, propietario`. Se escapan comillas, se antepone BOM UTF-8 para Excel y se descarga en cliente.

## 7. Hoja de ruta como dato

[`app/src/data/roadmap.ts`](../app/src/data/roadmap.ts) define:

- **6 fases** con inicio/fin (`YYYY-MM`), estado, propietario, estándar, esfuerzo, reducción de riesgo acumulada, entregables y dependencias.
- **11 iniciativas** con trimestre, fase, impacto, esfuerzo, estándar y dependencia.
- **3 plazos NIST**: 2030 (establecimiento de claves), 2031 (firmas) y 2035 (prohibición de algoritmos clásicos).

El Gantt calcula posiciones con índices de mes (`año * 12 + mes - 1`) sobre una línea de tiempo de julio 2026 a diciembre 2030. La línea de “hoy” usa `DEMO_NOW` (14 nov 2026).

## 8. Privacidad y datos reales

- No hay datos de personas ni de empresas reales.
- No se realizan peticiones de red en runtime.
- Los archivos exportados se generan localmente y no se suben a ningún servicio.
- Para usar datos reales se requeriría autenticación, cifrado en reposo, control de acceso y un proceso de anonimización documentado.

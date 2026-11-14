# UBIORA

Plataforma B2B para descubrir, inventariar y priorizar riesgo criptográfico post-cuántico. UBIORA genera un **Cryptographic Bill of Materials (CBOM)**, calcula exposición por activo y convierte los hallazgos en una hoja de ruta de migración alineada a los estándares PQC del NIST.

Este repositorio contiene el MVP web que se presenta en la materia de Innovación y Tecnología.

## Estructura

```
.
├── app/                    # Aplicación React + Vite + TypeScript
├── docs/                   # Documentación de producto e ingeniería
├── ProyectoFinal.pdf       # Memoria del proyecto
└── README.md
```

## Desarrollo local

```bash
cd app
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

```bash
npm run build     # Build de producción
npm run preview   # Previsualización del build
```

## Estado

MVP funcional con datos simulados. El motor de descubrimiento, el scoring y la generación de CBOM están representados en la interfaz; la integración con el escáner real se plantea para la siguiente fase.

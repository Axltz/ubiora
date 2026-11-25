import {
  BookOpen,
  FileText,
  Gauge,
  PackageSearch,
  Radar,
  Route,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  shortLabel: string
  to: string
  icon: LucideIcon
  end?: boolean
  badge?: string
}

export type NavSection = {
  label: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    label: 'Operación',
    items: [
      { label: 'Resumen de exposición', shortLabel: 'Resumen', to: '/', icon: Gauge, end: true },
      { label: 'Descubrimiento', shortLabel: 'Descubrimiento', to: '/descubrimiento', icon: Radar },
      {
        label: 'Inventario CBOM',
        shortLabel: 'Inventario',
        to: '/inventario',
        icon: PackageSearch,
      },
    ],
  },
  {
    label: 'Acción',
    items: [
      { label: 'Hoja de ruta', shortLabel: 'Hoja de ruta', to: '/hoja-de-ruta', icon: Route },
      { label: 'Informe ejecutivo', shortLabel: 'Informe', to: '/informe', icon: FileText },
    ],
  },
  {
    label: 'Ayuda',
    items: [
      {
        label: 'Cómo funciona',
        shortLabel: 'Cómo funciona',
        to: '/como-funciona',
        icon: BookOpen,
      },
    ],
  },
]

export const pageMeta: Record<string, { title: string; eyebrow: string }> = {
  '/': { title: 'Resumen de exposición', eyebrow: 'Postura post-cuántica' },
  '/descubrimiento': { title: 'Descubrimiento', eyebrow: 'Motor de escaneo' },
  '/inventario': { title: 'Inventario CBOM', eyebrow: 'Superficie criptográfica' },
  '/hoja-de-ruta': { title: 'Hoja de ruta', eyebrow: 'Plan de migración' },
  '/informe': { title: 'Informe ejecutivo', eyebrow: 'Board brief' },
  '/como-funciona': { title: 'Cómo funciona', eyebrow: 'Guía de producto' },
}

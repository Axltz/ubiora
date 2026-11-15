import type { RiskLevel } from '../components/ui/Badge'

export type Environment = 'Producción' | 'Core bancario' | 'Staging' | 'Desarrollo'
export type Sensitivity = 'Crítico' | 'Alto' | 'Medio' | 'Bajo'
export type Exposure = 'Internet' | 'Autenticado' | 'Interno'
export type AssetKind =
  | 'Certificado TLS'
  | 'Endpoint TLS'
  | 'Librería'
  | 'Contenedor'
  | 'Llave de cifrado'
  | 'Firma de código'
  | 'Base de datos'
  | 'Secreto de aplicación'
export type AssetStatus = 'Pendiente' | 'En migración' | 'Mitigado'
export type Effort = 'Bajo' | 'Medio' | 'Alto'

export interface CryptoAsset {
  id: string
  name: string
  kind: AssetKind
  algorithm: string
  keySize: string
  location: string
  environment: Environment
  sensitivity: Sensitivity
  shelfLife: number
  exposure: Exposure
  criticality: number
  score: number
  priority: RiskLevel
  owner: string
  lastSeen: string
  recommendation: string
  target: string
  effort: Effort
  status: AssetStatus
}

export interface ScanRun {
  id: string
  target: string
  startedAt: string
  duration: string
  findings: number
  critical: number
  status: 'Completado' | 'Con alertas' | 'En curso'
}

export interface RoadmapPhase {
  id: string
  name: string
  description: string
  start: string
  end: string
  status: 'Completado' | 'En curso' | 'Planificado' | 'Bloqueado'
  owner: string
  standard: string
  effort: Effort
  riskReduction: number
  deliverables: string[]
  dependencies: string
}

export interface RoadmapInitiative {
  id: string
  title: string
  quarter: string
  owner: string
  phase: string
  impact: number
  effort: Effort
  status: 'Completado' | 'En curso' | 'Planificado'
  standard: string
  dependencies: string
}

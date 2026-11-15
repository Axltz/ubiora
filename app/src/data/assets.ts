import type { RiskLevel } from '../components/ui/Badge'
import type {
  AssetKind,
  AssetStatus,
  CryptoAsset,
  Environment,
  Exposure,
  Sensitivity,
  ScanRun,
} from './types'

export const DEMO_NOW = new Date('2026-11-14T09:30:00')

export const NIST_DEADLINE = new Date('2030-12-31T23:59:59')

function priorityFor(score: number): RiskLevel {
  if (score >= 88) return 'Crítico'
  if (score >= 74) return 'Alto'
  if (score >= 56) return 'Medio'
  return 'Bajo'
}

const curated: Omit<CryptoAsset, 'priority'>[] = [
  {
    id: 'CBOM-001',
    name: 'ledger-signer',
    kind: 'Firma de código',
    algorithm: 'RSA-3072',
    keySize: '3072 bit',
    location: 'core/banking/ledger-signer',
    environment: 'Core bancario',
    sensitivity: 'Crítico',
    shelfLife: 15,
    exposure: 'Interno',
    criticality: 5,
    score: 97,
    owner: 'Core Banking',
    lastSeen: '2026-11-14T08:42:00',
    recommendation:
      'Migrar la firma de transacciones a ML-DSA-65 en modo híbrido con ECDSA P-384. Mantener verificación dual durante 18 meses.',
    target: 'Q4 2027',
    effort: 'Alto',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-002',
    name: 'customer-vault',
    kind: 'Llave de cifrado',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'core/vault/customer-data',
    environment: 'Core bancario',
    sensitivity: 'Crítico',
    shelfLife: 10,
    exposure: 'Interno',
    criticality: 5,
    score: 95,
    owner: 'Data Security',
    lastSeen: '2026-11-14T08:42:00',
    recommendation:
      'Envolver la llave con ML-KEM-768 y planear re-encapsulación del vault. Los datos tienen vida útil mayor al plazo de 2030.',
    target: 'Q3 2027',
    effort: 'Alto',
    status: 'En migración',
  },
  {
    id: 'CBOM-003',
    name: 'api.cobalto.mx',
    kind: 'Certificado TLS',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'edge/mx-central/api-gateway',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 7,
    exposure: 'Internet',
    criticality: 5,
    score: 94,
    owner: 'Platform',
    lastSeen: '2026-11-14T08:41:00',
    recommendation:
      'Renovar con X25519MLKEM768 híbrido y TLS 1.3. El certificado actual expone el canal de originación de crédito.',
    target: 'Q1 2027',
    effort: 'Medio',
    status: 'En migración',
  },
  {
    id: 'CBOM-004',
    name: 'payments-gateway',
    kind: 'Endpoint TLS',
    algorithm: 'ECDSA P-256',
    keySize: '256 bit',
    location: 'prod/payments/gateway',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 7,
    exposure: 'Internet',
    criticality: 5,
    score: 92,
    owner: 'Payments',
    lastSeen: '2026-11-14T08:39:00',
    recommendation:
      'Migrar el intercambio de llaves a ML-KEM-768 híbrido y la autenticación mutua a ML-DSA-65.',
    target: 'Q2 2027',
    effort: 'Medio',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-005',
    name: 'backup-vault',
    kind: 'Llave de cifrado',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'core/backup/immutable-vault',
    environment: 'Core bancario',
    sensitivity: 'Crítico',
    shelfLife: 20,
    exposure: 'Interno',
    criticality: 5,
    score: 91,
    owner: 'Infrastructure',
    lastSeen: '2026-11-14T08:35:00',
    recommendation:
      'Prioridad máxima por vida útil de 20 años: los respaldos capturados hoy siguen expuestos en 2046. Re-cifrar con ML-KEM-768.',
    target: 'Q2 2027',
    effort: 'Alto',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-006',
    name: 'mobile-android',
    kind: 'Librería',
    algorithm: 'ECDSA P-256',
    keySize: '256 bit',
    location: 'app/android/cobalto-sdk',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 5,
    exposure: 'Internet',
    criticality: 4,
    score: 90,
    owner: 'Mobile',
    lastSeen: '2026-11-14T08:22:00',
    recommendation:
      'Actualizar el SDK a un proveedor criptográfico con ML-DSA-65 y rotar llaves embebidas en la siguiente release.',
    target: 'Q2 2027',
    effort: 'Medio',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-007',
    name: 'card-tokenization',
    kind: 'Secreto de aplicación',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'prod/cards/tokenization',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 8,
    exposure: 'Autenticado',
    criticality: 5,
    score: 89,
    owner: 'Cards',
    lastSeen: '2026-11-14T08:17:00',
    recommendation:
      'Reemplazar el esquema RSA-OAEP por ML-KEM-768 y revisar el almacenamiento de PAN tokenizado.',
    target: 'Q2 2027',
    effort: 'Alto',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-008',
    name: 'data-warehouse',
    kind: 'Base de datos',
    algorithm: '3DES',
    keySize: '168 bit',
    location: 'analytics/mx/warehouse',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 6,
    exposure: 'Interno',
    criticality: 4,
    score: 89,
    owner: 'Data Platform',
    lastSeen: '2026-11-14T08:11:00',
    recommendation:
      'Sustituir 3DES por AES-256-GCM y re-cifrar las tablas de clientes. 3DES está deprecado y no cumple política interna.',
    target: 'Q1 2027',
    effort: 'Medio',
    status: 'En migración',
  },
  {
    id: 'CBOM-009',
    name: 'auth-service',
    kind: 'Certificado TLS',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'prod/identity/auth-service',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 5,
    exposure: 'Internet',
    criticality: 5,
    score: 88,
    owner: 'Identity',
    lastSeen: '2026-11-14T08:04:00',
    recommendation:
      'Renovar el certificado con híbrido X25519MLKEM768. El servicio concentra autenticación de toda la banca digital.',
    target: 'Q1 2027',
    effort: 'Bajo',
    status: 'En migración',
  },
  {
    id: 'CBOM-010',
    name: 'settlement-worker',
    kind: 'Endpoint TLS',
    algorithm: 'DH-1024',
    keySize: '1024 bit',
    location: 'prod/settlement/worker',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 7,
    exposure: 'Autenticado',
    criticality: 4,
    score: 88,
    owner: 'Payments',
    lastSeen: '2026-11-14T07:58:00',
    recommendation:
      'Retirar Diffie-Hellman clásico y habilitar TLS 1.3 con ML-KEM-768. La longitud de 1024 bit es insuficiente incluso hoy.',
    target: 'Q1 2027',
    effort: 'Bajo',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-011',
    name: 'kyc-pipeline',
    kind: 'Contenedor',
    algorithm: 'SHA-1',
    keySize: '160 bit',
    location: 'prod/kyc/pipeline',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 5,
    exposure: 'Autenticado',
    criticality: 4,
    score: 88,
    owner: 'Compliance',
    lastSeen: '2026-11-14T07:51:00',
    recommendation:
      'Sustituir SHA-1 por SHA-256 en la cadena de verificación documental y regenerar los hashes almacenados.',
    target: 'Q4 2026',
    effort: 'Bajo',
    status: 'En migración',
  },
  {
    id: 'CBOM-012',
    name: 'openbanking-api',
    kind: 'Endpoint TLS',
    algorithm: 'ECDH P-256',
    keySize: '256 bit',
    location: 'edge/openbanking/api',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 5,
    exposure: 'Internet',
    criticality: 4,
    score: 88,
    owner: 'Partnerships',
    lastSeen: '2026-11-14T07:46:00',
    recommendation:
      'Adoptar ML-KEM-768 híbrido con ECDH P-256 como respaldo. Coordinar con los agregadores bancarios.',
    target: 'Q2 2027',
    effort: 'Medio',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-013',
    name: 'partner-webhook',
    kind: 'Endpoint TLS',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'prod/integrations/webhook',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 4,
    exposure: 'Internet',
    criticality: 4,
    score: 88,
    owner: 'Partnerships',
    lastSeen: '2026-11-14T07:42:00',
    recommendation:
      'Rotar a TLS 1.3 con ML-KEM-768 y firmar eventos con ML-DSA-65. Hay 34 partners conectados.',
    target: 'Q2 2027',
    effort: 'Medio',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-014',
    name: 'mobile-ios',
    kind: 'Librería',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'app/ios/cobalto-sdk',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 5,
    exposure: 'Internet',
    criticality: 4,
    score: 88,
    owner: 'Mobile',
    lastSeen: '2026-11-14T07:36:00',
    recommendation:
      'Actualizar el SDK y habilitar verificación híbrida. La versión actual fija RSA para el pinning de certificados.',
    target: 'Q2 2027',
    effort: 'Medio',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-015',
    name: 'internal-admin',
    kind: 'Certificado TLS',
    algorithm: 'ECDSA P-256',
    keySize: '256 bit',
    location: 'prod/admin/console',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 3,
    exposure: 'Autenticado',
    criticality: 4,
    score: 88,
    owner: 'Platform',
    lastSeen: '2026-11-14T07:31:00',
    recommendation:
      'Migrar a ML-DSA-65 y restringir el acceso a la consola administrativa por VPN con postura de dispositivo.',
    target: 'Q1 2027',
    effort: 'Bajo',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-016',
    name: 'legacy-sftp',
    kind: 'Endpoint TLS',
    algorithm: 'DH-1024',
    keySize: '1024 bit',
    location: 'prod/legacy/sftp-exchange',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 6,
    exposure: 'Autenticado',
    criticality: 4,
    score: 88,
    owner: 'Infrastructure',
    lastSeen: '2026-11-14T07:25:00',
    recommendation:
      'Plan de retiro del canal SFTP legado. Sustituir por API mTLS con ML-KEM-768 y llaves rotadas.',
    target: 'Q3 2027',
    effort: 'Alto',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-017',
    name: 'fraud-scoring',
    kind: 'Librería',
    algorithm: 'MD5',
    keySize: '128 bit',
    location: 'prod/risk/fraud-engine',
    environment: 'Producción',
    sensitivity: 'Crítico',
    shelfLife: 4,
    exposure: 'Interno',
    criticality: 4,
    score: 88,
    owner: 'Risk',
    lastSeen: '2026-11-14T07:19:00',
    recommendation:
      'Reemplazar MD5 por SHA-256 en la firma de features. El algoritmo ya no ofrece resistencia a colisiones.',
    target: 'Q4 2026',
    effort: 'Bajo',
    status: 'En migración',
  },
  {
    id: 'CBOM-018',
    name: 'notifications-service',
    kind: 'Certificado TLS',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'prod/messaging/notifications',
    environment: 'Producción',
    sensitivity: 'Alto',
    shelfLife: 2,
    exposure: 'Interno',
    criticality: 3,
    score: 84,
    owner: 'Platform',
    lastSeen: '2026-11-14T07:12:00',
    recommendation:
      'Renovar con híbrido X25519MLKEM768. Prioridad media por baja vida útil de los mensajes.',
    target: 'Q2 2027',
    effort: 'Bajo',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-019',
    name: 'reporting-db',
    kind: 'Base de datos',
    algorithm: 'AES-128-CBC',
    keySize: '128 bit',
    location: 'analytics/mx/reporting',
    environment: 'Producción',
    sensitivity: 'Alto',
    shelfLife: 3,
    exposure: 'Interno',
    criticality: 3,
    score: 82,
    owner: 'Data Platform',
    lastSeen: '2026-11-14T07:06:00',
    recommendation:
      'Migrar a AES-256-GCM. El cifrado simétrico no está amenazado por Shor, pero la llave es corta para datos regulados.',
    target: 'Q3 2027',
    effort: 'Bajo',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-020',
    name: 'inventory-api',
    kind: 'Endpoint TLS',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'prod/catalog/inventory',
    environment: 'Producción',
    sensitivity: 'Alto',
    shelfLife: 2,
    exposure: 'Autenticado',
    criticality: 3,
    score: 80,
    owner: 'Commerce',
    lastSeen: '2026-11-14T06:58:00',
    recommendation:
      'Habilitar TLS 1.3 híbrido y renovar el certificado en la ventana de mantenimiento de diciembre.',
    target: 'Q1 2027',
    effort: 'Bajo',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-021',
    name: 'support-portal',
    kind: 'Certificado TLS',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'edge/support/portal',
    environment: 'Producción',
    sensitivity: 'Alto',
    shelfLife: 2,
    exposure: 'Internet',
    criticality: 3,
    score: 78,
    owner: 'Customer Ops',
    lastSeen: '2026-11-14T06:51:00',
    recommendation:
      'Renovar el certificado con ML-KEM-768 híbrido y revisar la exposición de sesiones de soporte.',
    target: 'Q2 2027',
    effort: 'Bajo',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-022',
    name: 'hr-system',
    kind: 'Librería',
    algorithm: 'ECDSA P-256',
    keySize: '256 bit',
    location: 'corp/hr/employee-portal',
    environment: 'Staging',
    sensitivity: 'Medio',
    shelfLife: 3,
    exposure: 'Interno',
    criticality: 2,
    score: 74,
    owner: 'Corporate IT',
    lastSeen: '2026-11-14T06:44:00',
    recommendation:
      'Incluir en el segundo lote de migración. No maneja datos financieros, pero comparte el proveedor criptográfico.',
    target: 'Q4 2027',
    effort: 'Bajo',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-023',
    name: 'vendor-portal',
    kind: 'Endpoint TLS',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'edge/partners/vendor-portal',
    environment: 'Staging',
    sensitivity: 'Medio',
    shelfLife: 2,
    exposure: 'Internet',
    criticality: 2,
    score: 72,
    owner: 'Partnerships',
    lastSeen: '2026-11-14T06:37:00',
    recommendation:
      'Renovar en el siguiente ciclo. Aprovechar para retirar TLS 1.1 y deshabilitar cifrados CBC.',
    target: 'Q3 2027',
    effort: 'Bajo',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-024',
    name: 'secrets-manager',
    kind: 'Secreto de aplicación',
    algorithm: 'AES-256-GCM',
    keySize: '256 bit',
    location: 'core/security/secrets',
    environment: 'Producción',
    sensitivity: 'Alto',
    shelfLife: 5,
    exposure: 'Interno',
    criticality: 4,
    score: 64,
    owner: 'Security',
    lastSeen: '2026-11-14T06:30:00',
    recommendation:
      'Mantener. El algoritmo es resistente a Shor; revisar rotación trimestral y separación de dominios.',
    target: 'Q2 2028',
    effort: 'Bajo',
    status: 'Mitigado',
  },
  {
    id: 'CBOM-025',
    name: 'batch-exporter',
    kind: 'Contenedor',
    algorithm: 'SHA-1',
    keySize: '160 bit',
    location: 'prod/batch/reporting-export',
    environment: 'Producción',
    sensitivity: 'Medio',
    shelfLife: 2,
    exposure: 'Interno',
    criticality: 2,
    score: 61,
    owner: 'Data Platform',
    lastSeen: '2026-11-14T06:24:00',
    recommendation:
      'Sustituir SHA-1 por SHA-256. Cambio de bajo esfuerzo incluido en el sprint de hardening.',
    target: 'Q4 2026',
    effort: 'Bajo',
    status: 'En migración',
  },
  {
    id: 'CBOM-026',
    name: 'dev-sandbox',
    kind: 'Certificado TLS',
    algorithm: 'RSA-2048',
    keySize: '2048 bit',
    location: 'dev/sandbox/api',
    environment: 'Desarrollo',
    sensitivity: 'Bajo',
    shelfLife: 1,
    exposure: 'Autenticado',
    criticality: 1,
    score: 54,
    owner: 'Platform',
    lastSeen: '2026-11-14T06:12:00',
    recommendation:
      'Reemplazar por certificados efímeros de corta duración. No requiere migración PQC inmediata.',
    target: 'Q2 2028',
    effort: 'Bajo',
    status: 'Pendiente',
  },
  {
    id: 'CBOM-027',
    name: 'qa-fixtures',
    kind: 'Librería',
    algorithm: 'MD5',
    keySize: '128 bit',
    location: 'qa/fixtures/crypto',
    environment: 'Desarrollo',
    sensitivity: 'Bajo',
    shelfLife: 1,
    exposure: 'Interno',
    criticality: 1,
    score: 46,
    owner: 'QA',
    lastSeen: '2026-11-14T06:03:00',
    recommendation:
      'Eliminar fixtures con MD5 antes de la siguiente auditoría. Sin datos productivos asociados.',
    target: 'Q1 2027',
    effort: 'Bajo',
    status: 'Mitigado',
  },
]

const seedServices = [
  'auth-service',
  'ledger-core',
  'payments-api',
  'customer-profile',
  'kyc-worker',
  'risk-engine',
  'notifications',
  'statement-gen',
  'card-vault',
  'openbanking',
  'mobile-bff',
  'settlement',
  'treasury',
  'onboarding',
  'loan-origination',
  'sanctions-screening',
  'data-lake',
  'event-bus',
  'admin-console',
  'partner-hub',
  'reconciliation',
  'reporting-api',
  'audit-log',
  'secrets-proxy',
  'edge-gateway',
  'batch-runner',
  'support-console',
  'vendor-portal',
  'identity-broker',
  'token-service',
  'document-store',
  'pricing-engine',
]

const owners = [
  'Platform',
  'Payments',
  'Core Banking',
  'Identity',
  'Data Platform',
  'Mobile',
  'Risk',
  'Infrastructure',
  'Compliance',
  'Security',
]

const environments: Environment[] = ['Producción', 'Core bancario', 'Staging', 'Desarrollo']
const exposureOptions: Exposure[] = ['Internet', 'Autenticado', 'Interno']
const sensitivities: Sensitivity[] = ['Crítico', 'Alto', 'Medio', 'Bajo']
const shelfLifeOptions = [1, 2, 3, 4, 5, 7, 10, 15]
const kinds: AssetKind[] = [
  'Certificado TLS',
  'Endpoint TLS',
  'Librería',
  'Contenedor',
  'Llave de cifrado',
  'Firma de código',
  'Base de datos',
  'Secreto de aplicación',
]

const algorithmsByKind: Record<AssetKind, string[]> = {
  'Certificado TLS': ['RSA-2048', 'RSA-2048', 'ECDSA P-256', 'RSA-3072'],
  'Endpoint TLS': ['RSA-2048', 'ECDH P-256', 'DH-1024', 'RSA-2048'],
  Librería: ['RSA-2048', 'ECDSA P-256', 'SHA-1', 'MD5', 'AES-256-GCM'],
  Contenedor: ['RSA-2048', 'SHA-1', 'MD5', '3DES'],
  'Llave de cifrado': ['RSA-2048', '3DES', 'AES-256-GCM', 'AES-128-CBC'],
  'Firma de código': ['RSA-3072', 'ECDSA P-256', 'SHA-1'],
  'Base de datos': ['AES-256-GCM', '3DES', 'AES-128-CBC'],
  'Secreto de aplicación': ['AES-256-GCM', 'RSA-2048', '3DES'],
}

const recommendationFor = (algorithm: string) => {
  if (algorithm.startsWith('RSA')) {
    return 'Reemplazar RSA por ML-KEM-768 para establecimiento de claves y ML-DSA-65 para firma. Mantener validación dual durante la transición.'
  }
  if (algorithm.startsWith('ECDSA') || algorithm.startsWith('ECDH')) {
    return 'Adoptar el perfil híbrido X25519MLKEM768 y ML-DSA-65. Conservar ECDSA/ECDH como respaldo hasta 2030.'
  }
  if (algorithm.startsWith('DH')) {
    return 'Retirar Diffie-Hellman clásico. Habilitar TLS 1.3 con ML-KEM-768 híbrido y rotar parámetros.'
  }
  if (algorithm.startsWith('SHA') || algorithm === 'MD5') {
    return 'Sustituir por SHA-256 o SHA-3 y regenerar los valores almacenados. No requiere esperar al estándar PQC.'
  }
  if (algorithm === '3DES') {
    return 'Migrar a AES-256-GCM. 3DES está deprecado y no cumple la política de protección de datos.'
  }
  return 'Mantener AES-256-GCM, revisar la rotación de llaves y documentar el control en el CBOM.'
}

function makeGeneratedAssets(count: number): Omit<CryptoAsset, 'priority'>[] {
  let state = 0x2f6e2b1
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0xffffffff
  }
  const pick = <T,>(items: T[]) => items[Math.floor(random() * items.length)]
  const result: Omit<CryptoAsset, 'priority'>[] = []

  for (let index = 0; index < count; index += 1) {
    const kind = pick(kinds)
    const environmentRoll = random()
    const environment =
      environmentRoll < 0.48
        ? 'Producción'
        : environmentRoll < 0.68
          ? 'Core bancario'
          : environmentRoll < 0.84
            ? 'Staging'
            : 'Desarrollo'
    const service = pick(seedServices)
    const suffix = String(index + 28).padStart(3, '0')
    const algorithm = pick(algorithmsByKind[kind])
    const rawScore = 26 + Math.pow(random(), 1.8) * 59
    const score = Math.min(86, Math.round(rawScore))
    const sensitivity = environment === 'Core bancario' ? pick(sensitivities.slice(0, 2)) : pick(sensitivities)
    const exposure = environment === 'Desarrollo' ? pick(exposureOptions.slice(1)) : pick(exposureOptions)
    const shelfLife = pick(shelfLifeOptions)
    const criticality = Math.max(1, Math.min(5, Math.round(score / 18)))
    const statusRoll = random()
    const status: AssetStatus =
      score < 56 && statusRoll > 0.55
        ? 'Mitigado'
        : score >= 74 && statusRoll > 0.82
          ? 'En migración'
          : 'Pendiente'
    const nameSuffix =
      kind === 'Certificado TLS' || kind === 'Endpoint TLS'
        ? `${service}.cobalto.mx`
        : kind === 'Librería'
          ? `${service}-sdk`
          : kind === 'Contenedor'
            ? `${service}-container`
            : kind === 'Llave de cifrado'
              ? `${service}-key`
              : kind === 'Firma de código'
                ? `${service}-release`
                : kind === 'Base de datos'
                  ? `${service}-db`
                  : `${service}-secret`

    result.push({
      id: `CBOM-${String(index + 28).padStart(3, '0')}`,
      name: `${nameSuffix}-${suffix}`,
      kind,
      algorithm,
      keySize:
        algorithm.includes('3072')
          ? '3072 bit'
          : algorithm.includes('2048')
            ? '2048 bit'
            : algorithm.includes('1024')
              ? '1024 bit'
              : algorithm.includes('256')
                ? '256 bit'
                : algorithm.includes('168')
                  ? '168 bit'
                  : algorithm.includes('160')
                    ? '160 bit'
                    : '128 bit',
      location:
        kind === 'Librería' || kind === 'Firma de código'
          ? `github.com/cobalto/${service}`
          : `${environment === 'Core bancario' ? 'core' : environment === 'Producción' ? 'prod' : environment === 'Staging' ? 'staging' : 'dev'}/mx-central/${service}`,
      environment,
      sensitivity,
      shelfLife,
      exposure,
      criticality,
      score,
      owner: pick(owners),
      lastSeen: `2026-11-${String(13 + (index % 2)).padStart(2, '0')}T0${index % 9}:${String(index % 60).padStart(2, '0')}:00`,
      recommendation: recommendationFor(algorithm),
      target: score >= 74 ? `Q${1 + (index % 4)} 2027` : `Q${1 + (index % 4)} 2028`,
      effort: score >= 74 ? (kind === 'Certificado TLS' ? 'Bajo' : 'Medio') : 'Bajo',
      status,
    })
  }

  return result
}

const allAssets: CryptoAsset[] = [
  ...curated.map((asset) => ({ ...asset, priority: priorityFor(asset.score) })),
  ...makeGeneratedAssets(1284 - curated.length).map((asset) => ({
    ...asset,
    priority: priorityFor(asset.score),
  })),
].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))

export const assets = allAssets

export const stats = (() => {
  const total = assets.length
  const critical = assets.filter((asset) => asset.priority === 'Crítico').length
  const high = assets.filter((asset) => asset.priority === 'Alto').length
  const medium = assets.filter((asset) => asset.priority === 'Medio').length
  const low = assets.filter((asset) => asset.priority === 'Bajo').length
  const internet = assets.filter((asset) => asset.exposure === 'Internet').length
  const prod = assets.filter((asset) => asset.environment === 'Producción').length
  const core = assets.filter((asset) => asset.environment === 'Core bancario').length
  const owners = new Set(assets.map((asset) => asset.owner)).size

  return { total, critical, high, medium, low, internet, prod, core, owners }
})()

export const readiness = {
  score: 34,
  previous: 36,
  label: 'Cripto-agilidad inicial',
  description:
    'La organización ya tiene inventario, pero la mayoría de los sistemas críticos dependen de RSA o ECDSA sin una ruta híbrida validada.',
  signals: [
    { label: 'Visibilidad', value: 78, note: '1,284 componentes indexados' },
    { label: 'Agilidad', value: 22, note: '3 de 14 servicios con abstracción criptográfica' },
    { label: 'Cobertura PQC', value: 11, note: '142 componentes con perfil híbrido' },
  ],
}

export const algorithmFamilies = (() => {
  const palette: Record<string, string> = {
    RSA: 'var(--color-danger)',
    ECDSA: 'var(--color-warn)',
    ECDH: 'var(--color-lilac)',
    'Diffie-Hellman': 'var(--color-sky)',
    'SHA-1 / MD5': 'var(--color-acid)',
    '3DES / AES-128': '#b9c2bb',
    'AES-256': '#6f7a71',
  }
  const family = (algorithm: string) => {
    if (algorithm.startsWith('RSA')) return 'RSA'
    if (algorithm.startsWith('ECDSA')) return 'ECDSA'
    if (algorithm.startsWith('ECDH')) return 'ECDH'
    if (algorithm.startsWith('DH')) return 'Diffie-Hellman'
    if (algorithm.startsWith('SHA') || algorithm === 'MD5') return 'SHA-1 / MD5'
    if (algorithm === '3DES' || algorithm === 'AES-128-CBC') return '3DES / AES-128'
    return 'AES-256'
  }
  const counts = new Map<string, number>()
  assets.forEach((asset) => {
    const key = family(asset.algorithm)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })
  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      share: Math.round((count / assets.length) * 100),
      color: palette[name] ?? '#6f7a71',
    }))
    .sort((a, b) => b.count - a.count)
})()

export const environmentBreakdown = (() => {
  const counts = new Map<Environment, number>()
  assets.forEach((asset) => counts.set(asset.environment, (counts.get(asset.environment) ?? 0) + 1))
  return environments.map((name) => ({
    name,
    count: counts.get(name) ?? 0,
    share: Math.round(((counts.get(name) ?? 0) / assets.length) * 100),
  }))
})()

export const exposureTrend = [
  { month: 'Dic', findings: 1820, critical: 24 },
  { month: 'Ene', findings: 1776, critical: 24 },
  { month: 'Feb', findings: 1801, critical: 23 },
  { month: 'Mar', findings: 1734, critical: 22 },
  { month: 'Abr', findings: 1688, critical: 22 },
  { month: 'May', findings: 1695, critical: 21 },
  { month: 'Jun', findings: 1622, critical: 21 },
  { month: 'Jul', findings: 1578, critical: 20 },
  { month: 'Ago', findings: 1516, critical: 19 },
  { month: 'Sep', findings: 1472, critical: 19 },
  { month: 'Oct', findings: 1398, critical: 18 },
  { month: 'Nov', findings: 1284, critical: 17 },
]

export const recentScans: ScanRun[] = [
  {
    id: 'SCN-0842',
    target: 'Producción · 42 endpoints',
    startedAt: '2026-11-14T08:38:00',
    duration: '4m 12s',
    findings: 1284,
    critical: 17,
    status: 'Completado',
  },
  {
    id: 'SCN-0841',
    target: 'Core bancario · repositorios',
    startedAt: '2026-11-13T22:10:00',
    duration: '6m 48s',
    findings: 312,
    critical: 8,
    status: 'Con alertas',
  },
  {
    id: 'SCN-0840',
    target: 'Contenedores · staging',
    startedAt: '2026-11-13T16:25:00',
    duration: '2m 31s',
    findings: 187,
    critical: 2,
    status: 'Completado',
  },
  {
    id: 'SCN-0839',
    target: 'Certificados · edge global',
    startedAt: '2026-11-12T09:05:00',
    duration: '1m 56s',
    findings: 96,
    critical: 3,
    status: 'Completado',
  },
]

export const topRisks = assets.slice(0, 8)

export const kpis = {
  readiness: readiness.score,
  readinessDelta: readiness.score - readiness.previous,
  critical: stats.critical,
  criticalDelta: 3,
  exposed: stats.internet,
  total: stats.total,
  daysToDeadline: Math.ceil((NIST_DEADLINE.getTime() - DEMO_NOW.getTime()) / 86_400_000),
  lastScan: '14 nov 2026 · 08:42',
}

export const activityFeed = [
  {
    title: 'Certificado rotado en api.cobalto.mx',
    detail: 'RSA-2048 → híbrido X25519MLKEM768',
    time: 'hace 18 min',
    tone: 'acid',
  },
  {
    title: 'Nuevo hallazgo en kyc-pipeline',
    detail: 'SHA-1 detectado en cadena de verificación',
    time: 'hace 2 h',
    tone: 'warn',
  },
  {
    title: 'Alcance de escaneo ampliado',
    detail: 'Se añadieron 12 repositorios de Core bancario',
    time: 'hace 6 h',
    tone: 'sky',
  },
]

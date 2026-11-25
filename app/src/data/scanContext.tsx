import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { demoAssets, priorityFor } from './assets'
import type { CryptoAsset, ScanRun } from './types'

const ASSETS_KEY = 'ubiora.assets.v1'
const ORG_KEY = 'ubiora.org.v1'
const SCANS_KEY = 'ubiora.scans.v1'
const DEMO_KEY = 'ubiora.demo.v1'

const DEFAULT_ORG = 'Mi organización'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Almacenamiento bloqueado o lleno: la sesión sigue funcionando en memoria.
  }
}

function normalizeAsset(asset: CryptoAsset): CryptoAsset {
  return { ...asset, priority: priorityFor(asset.score) }
}

interface ScanMeta {
  target?: string
  duration?: string
}

interface WorkspaceContextType {
  /** Activos que el usuario ha descubierto, cargado manualmente o desde el catálogo de ejemplo. */
  assets: CryptoAsset[]
  /** Alias histórico usado por las pantallas. */
  allAssets: CryptoAsset[]
  customAssets: CryptoAsset[]
  scans: ScanRun[]
  orgName: string
  isDemo: boolean
  lastScan: ScanRun | null
  addScanResults: (results: CryptoAsset[], meta?: ScanMeta) => void
  addAsset: (asset: CryptoAsset) => void
  removeAsset: (id: string) => void
  setOrgName: (name: string) => void
  loadDemo: () => void
  clearAll: () => void
  /** Alias de clearAll para el botón «Restablecer» del descubrimiento. */
  clearCustom: () => void
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  assets: [],
  allAssets: [],
  customAssets: [],
  scans: [],
  orgName: DEFAULT_ORG,
  isDemo: false,
  lastScan: null,
  addScanResults: () => {},
  addAsset: () => {},
  removeAsset: () => {},
  setOrgName: () => {},
  loadDemo: () => {},
  clearAll: () => {},
  clearCustom: () => {},
})

export function RealScanProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<CryptoAsset[]>(() =>
    readJson<CryptoAsset[]>(ASSETS_KEY, []).map(normalizeAsset),
  )
  const [scans, setScans] = useState<ScanRun[]>(() => readJson<ScanRun[]>(SCANS_KEY, []))
  const [orgName, setOrgNameState] = useState<string>(() => readJson<string>(ORG_KEY, DEFAULT_ORG))
  const [isDemo, setIsDemo] = useState<boolean>(() => readJson<boolean>(DEMO_KEY, false))

  useEffect(() => writeJson(ASSETS_KEY, assets), [assets])
  useEffect(() => writeJson(SCANS_KEY, scans), [scans])
  useEffect(() => writeJson(ORG_KEY, orgName), [orgName])
  useEffect(() => writeJson(DEMO_KEY, isDemo), [isDemo])

  const addScanResults = useCallback(
    (results: CryptoAsset[], meta?: ScanMeta) => {
      const normalized = results.map(normalizeAsset)

      setAssets((previous) => {
        const merged = normalized.filter(
          (next) =>
            !previous.some(
              (current) =>
                current.id === next.id ||
                current.name.toLowerCase() === next.name.toLowerCase(),
            ),
        )
        return [...merged, ...previous].sort(
          (a, b) => b.score - a.score || a.name.localeCompare(b.name),
        )
      })

      if (normalized.length > 0) {
        const critical = normalized.filter((asset) => asset.priority === 'Crítico').length
        const scan: ScanRun = {
          id: `SCN-${String(Date.now()).slice(-6)}`,
          target: meta?.target ?? `${normalized.length} activos descubiertos`,
          startedAt: new Date().toISOString(),
          duration: meta?.duration ?? '—',
          findings: normalized.length,
          critical,
          status: critical > 0 ? 'Con alertas' : 'Completado',
        }
        setScans((previous) => [scan, ...previous].slice(0, 12))
      }
    },
    [],
  )

  const addAsset = useCallback((asset: CryptoAsset) => {
    setAssets((previous) => {
      if (previous.some((current) => current.id === asset.id)) return previous
      return [normalizeAsset(asset), ...previous].sort(
        (a, b) => b.score - a.score || a.name.localeCompare(b.name),
      )
    })
  }, [])

  const removeAsset = useCallback((id: string) => {
    setAssets((previous) => previous.filter((asset) => asset.id !== id))
  }, [])

  const setOrgName = useCallback((name: string) => {
    setOrgNameState(name.trim() || DEFAULT_ORG)
  }, [])

  const clearAll = useCallback(() => {
    setAssets([])
    setScans([])
    setIsDemo(false)
  }, [])

  const loadDemo = useCallback(() => {
    setAssets([...demoAssets])
    setIsDemo(true)
    setScans([
      {
        id: `SCN-${String(Date.now()).slice(-6)}`,
        target: 'Catálogo de ejemplo · 1,284 componentes',
        startedAt: new Date().toISOString(),
        duration: '4m 12s',
        findings: demoAssets.length,
        critical: demoAssets.filter((asset) => asset.priority === 'Crítico').length,
        status: 'Con alertas',
      },
    ])
  }, [])

  const value = useMemo(
    () => ({
      assets,
      allAssets: assets,
      customAssets: assets,
      scans,
      orgName,
      isDemo,
      lastScan: scans[0] ?? null,
      addScanResults,
      addAsset,
      removeAsset,
      setOrgName,
      loadDemo,
      clearAll,
      clearCustom: clearAll,
    }),
    [assets, scans, orgName, isDemo, addScanResults, addAsset, removeAsset, setOrgName, loadDemo, clearAll],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useRealScan() {
  return useContext(WorkspaceContext)
}

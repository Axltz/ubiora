import { useState } from 'react'
import {
  createContext,
  useContext,
} from 'react'
import type { CryptoAsset } from './types'
import { assets as initialAssets } from './assets'

interface RealScanContextType {
  customAssets: CryptoAsset[]
  allAssets: CryptoAsset[]
  addScanResults: (results: CryptoAsset[]) => void
  clearCustom: () => void
}

const RealScanContext = createContext<RealScanContextType>({
  customAssets: [],
  allAssets: initialAssets,
  addScanResults: () => {},
  clearCustom: () => {},
})

export function RealScanProvider({ children }: { children: React.ReactNode }) {
  const [customAssets, setCustomAssets] = useState<CryptoAsset[]>(() => {
    try {
      const saved = localStorage.getItem('ubiora_custom_assets')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const addScanResults = (results: CryptoAsset[]) => {
    setCustomAssets((prev) => {
      // Evitar duplicados por id o name
      const filtered = prev.filter((p) => !results.some((r) => r.id === p.id || r.name === p.name))
      const next = [...results, ...filtered]
      try {
        localStorage.setItem('ubiora_custom_assets', JSON.stringify(next))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }

  const clearCustom = () => {
    setCustomAssets([])
    try {
      localStorage.removeItem('ubiora_custom_assets')
    } catch {}
  }

  const allAssets = [...customAssets, ...initialAssets]

  return (
    <RealScanContext.Provider value={{ customAssets, allAssets, addScanResults, clearCustom }}>
      {children}
    </RealScanContext.Provider>
  )
}

export function useRealScan() {
  return useContext(RealScanContext)
}

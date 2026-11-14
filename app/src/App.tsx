import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { CommandPaletteProvider } from './components/ui/CommandPalette'
import { ToastProvider } from './components/ui/Toast'
import { Overview } from './pages/Overview'
import { Discovery } from './pages/Discovery'
import { Inventory } from './pages/Inventory'
import { Roadmap } from './pages/Roadmap'
import { Report } from './pages/Report'

export default function App() {
  return (
    <ToastProvider>
      <CommandPaletteProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Overview />} />
            <Route path="descubrimiento" element={<Discovery />} />
            <Route path="inventario" element={<Inventory />} />
            <Route path="hoja-de-ruta" element={<Roadmap />} />
            <Route path="informe" element={<Report />} />
            <Route path="*" element={<Overview />} />
          </Route>
        </Routes>
      </CommandPaletteProvider>
    </ToastProvider>
  )
}

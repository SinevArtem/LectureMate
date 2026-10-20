import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FullscreenProvider, useFullscreen } from './context/FullscreenContext'
import { AppHeader } from './components/layout/AppHeader'
import { Dashboard } from './pages/Dashboard'
import { SolvePage } from './pages/SolvePage'
import { LibraryPage } from './pages/LibraryPage'

function AppShell() {
  const { isFullscreen } = useFullscreen()

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      {/* Скрываем через CSS — компонент остаётся в дереве */}
      <div className={isFullscreen ? 'hidden' : ''}>
        <AppHeader />
      </div>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/solve" element={<SolvePage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <FullscreenProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </FullscreenProvider>
  )
}
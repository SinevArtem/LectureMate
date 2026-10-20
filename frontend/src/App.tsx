import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/layout/AppHeader'
import { Dashboard } from './pages/Dashboard'
import { SolvePage } from './pages/SolvePage'
import { LibraryPage } from './pages/LibraryPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-bg text-text">
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/solve" element={<SolvePage />} />
            <Route path="/library" element={<LibraryPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
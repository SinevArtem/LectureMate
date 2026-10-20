import { createContext, useContext, useState, type ReactNode } from 'react'

interface FullscreenContextValue {
  isFullscreen: boolean
  enter: () => void
  exit: () => void
  toggle: () => void
}

const FullscreenContext = createContext<FullscreenContextValue | null>(null)

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const value: FullscreenContextValue = {
    isFullscreen,
    enter: () => setIsFullscreen(true),
    exit: () => setIsFullscreen(false),
    toggle: () => setIsFullscreen((v) => !v),
  }

  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  )
}

export function useFullscreen() {
  const ctx = useContext(FullscreenContext)
  if (!ctx) throw new Error('useFullscreen must be used within FullscreenProvider')
  return ctx
}
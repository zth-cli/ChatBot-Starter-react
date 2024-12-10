import { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  toggleCollapse: () => void
  setIsCollapsed: (isCollapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev)
  }
  const SidebarContextValue = useMemo(
    () => ({ isCollapsed, toggleCollapse, setIsCollapsed }),
    [isCollapsed]
  )
  return <SidebarContext.Provider value={SidebarContextValue}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

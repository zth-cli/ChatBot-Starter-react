import { Button } from '../ui/button'
import { useSidebar } from './SidebarProvider'
import { PanelLeft } from 'lucide-react'
export const SidebarToggle = () => {
  const { toggleCollapse } = useSidebar()
  return (
    <Button variant="outline" size="icon" className="md:px-2 size-9" onClick={toggleCollapse}>
      <PanelLeft className="size-5" />
    </Button>
  )
}

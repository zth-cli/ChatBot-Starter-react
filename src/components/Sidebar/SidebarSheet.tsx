import { Sidebar } from './Sidebar'
import { useSidebar } from './SidebarProvider'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export function SidebarSheet() {
  const { isCollapsed, toggleCollapse } = useSidebar()
  return (
    <Sheet open={!isCollapsed} onOpenChange={toggleCollapse}>
      <SheetContent side="left" className="p-0 w-[--sidebar-width]">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

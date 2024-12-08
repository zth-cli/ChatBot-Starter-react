import { Outlet } from 'react-router'
import { useSidebar } from '@/components/Sidebar/SidebarProvider'
import { Sidebar, SidebarSheet } from '@/components/Sidebar'
const layout = () => {
  const { md } = useResponsive()
  const { isCollapsed } = useSidebar()

  return (
    <>
      <div className="group flex w-full h-screen" data-collapsible={isCollapsed ? 'offcanvas' : ''}>
        <div className="hidden md:block group">
          <div className="translate-[width] duration-200 ease-linear h-full w-0 md:w-[--sidebar-width] group-data-[collapsible=offcanvas]:w-0 relative bg-primary/5">
            {/* 侧边栏 */}
            <Sidebar />
          </div>
        </div>
        <main className="flex-1 h-full">
          <Outlet />
        </main>
      </div>
      {!md && <SidebarSheet />}
    </>
  )
}

export default layout

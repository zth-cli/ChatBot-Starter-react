import { SidebarToggle } from '@/components/Sidebar/SidebarToggle'
import { UserNav } from '@/components/UserNav'
export const ChatHeader = () => {
  return (
    <header className="flex justify-between sticky top-0 bg-background py-1.5 items-center px-2 md:px-5 gap-2">
      <SidebarToggle />
      <UserNav />
    </header>
  )
}

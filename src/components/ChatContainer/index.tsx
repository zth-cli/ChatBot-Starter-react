import { cn } from '@/lib/utils'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'

interface ChatContainerProps {
  isWorkspace?: boolean
  onWorkspaceChange?: (isWorkspace: boolean) => void
  children?: ReactNode
  workspace?: ReactNode
}
export function ChatContainer({
  isWorkspace = false,
  children,
  workspace,
  onWorkspaceChange
}: ChatContainerProps) {
  const { md } = useResponsive()
  const showChat = md || !isWorkspace

  return (
    <div className="flex w-full h-full">
      <div
        className={cn(
          'transition-all duration-200',
          isWorkspace ? 'flex-1 h-full bg-muted overflow-y-auto' : 'w-0'
        )}>
        {workspace}
      </div>
      {showChat && (
        <div className={cn('h-full bg-background', isWorkspace ? 'w-[min(450px,100%)]' : 'w-full')}>
          {children}
        </div>
      )}
    </div>
  )
}

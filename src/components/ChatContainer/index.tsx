import { cn } from '@/lib/utils'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import { Button } from '../ui/button'
import { ChevronLeft } from 'lucide-react'

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
          'flex flex-col',
          isWorkspace ? 'flex-1 h-full bg-muted overflow-y-auto' : 'w-0'
        )}>
        <div className="h-12 px-2 flex items-center bg-background border-b">
          <Button variant="ghost" size="icon" onClick={() => onWorkspaceChange?.(false)}>
            <ChevronLeft className="!size-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">{workspace}</div>
      </div>
      {showChat && (
        <div className={cn('h-full bg-background', isWorkspace ? 'w-[min(450px,100%)]' : 'w-full')}>
          {children}
        </div>
      )}
    </div>
  )
}

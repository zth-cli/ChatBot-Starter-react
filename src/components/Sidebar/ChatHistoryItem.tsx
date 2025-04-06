import { ChatHistory } from '@/chatbot/types'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'

interface ChatHistoryItemProps {
  item: ChatHistory
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}
export function ChatHistoryItem({ item, className, onClick, children }: ChatHistoryItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'justify-start rounded-xl border-none cursor-pointer',
        '!h-8 hover:bg-gray-200/60',
        'group/item text-gray-500 hover:text-gray-500',
        'flex items-center',
        className
      )}>
      <MessageSquare className="mr-2 h-4 w-4" />
      <span className="truncate flex-1 text-left mr-2">{item?.name}</span>
      <div className="flex-shrink-0 size-4 opacity-0 group-hover/item:opacity-100 transition-opacity">
        {children}
      </div>
    </div>
  )
}

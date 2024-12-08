import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage, MessageStatus } from '@/chatbot/main/types'

interface RefreshProps {
  item: ChatMessage
  title?: string
  onClick?: () => void
}

export const Refresh = ({ item, title = '', ...rest }: RefreshProps) => {
  return (
    <div className="flex items-center cursor-pointer flex-1" {...rest}>
      <RotateCcw
        className={cn('h-4 w-4', item.status === MessageStatus.STREAMING && 'animate-spin')}
      />
      {title && <span className="ml-2">{title}</span>}
    </div>
  )
}

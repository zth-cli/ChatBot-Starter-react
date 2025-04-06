import { cn } from '@/lib/utils'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChatMessage } from '@/chatbot/types'

interface ThumbsUpOrDownProps {
  message: ChatMessage
}

export const ThumbsUpOrDown: React.FC<ThumbsUpOrDownProps> = ({ message }) => {
  const [status, setStatus] = useState(message.likeStatus)

  const handleClick = (newStatus: 1 | -1) => {
    // 如果值相同则设置为0，否则设置为新状态
    const updatedStatus = newStatus === status ? 0 : newStatus
    setStatus(updatedStatus)
    message.likeStatus = updatedStatus
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="outline-none">
            <ThumbsUp
              className={cn('w-4 h-4', status === 1 && 'text-primary')}
              onClick={() => handleClick(1)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>喜欢</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="outline-none">
            <ThumbsDown
              className={cn('w-4 h-4', status === -1 && 'text-primary')}
              onClick={() => handleClick(-1)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>不喜欢</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}

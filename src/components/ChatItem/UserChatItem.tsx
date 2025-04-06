import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/useChatStore'
import { FileTags } from './FileTags'
import { Del } from './ActionBar'
import { Copy } from '@/components/Copy'
import { ChatMessage } from '@/chatbot/types'

interface UserChatItemProps {
  item: ChatMessage
}

export const UserChatItem: React.FC<UserChatItemProps> = ({ item }) => {
  const { removeChatMessageById } = useChatStore()
  return (
    <div className="w-full flex flex-col items-end group/chat">
      <div className="flex items-center h-fit relative">
        <div className="flex flex-col items-end">
          {/* 附件显示 */}
          {item.attachments && item.attachments.length > 0 && (
            <FileTags attachments={item.attachments} />
          )}
          <div
            className={cn(
              'text-sm sm:text-base',
              'px-4 py-2 rounded-xl',
              'bg-primary text-primary-foreground',
              'break-words whitespace-pre-wrap',
              'max-w-[300px] md:max-w-[450px]'
            )}>
            {item.content}
          </div>
        </div>
      </div>
      <div className="text-xs opacity-0 group-hover/chat:opacity-100 text-black/50 dark:text-foreground">
        <div
          className={cn(
            'rounded flex gap-2 items-center cursor-pointer mt-2 opacity-0 group-hover/chat:opacity-100'
          )}>
          <Copy content={item.content} />
          <Del onClick={() => removeChatMessageById(item.id)} />
        </div>
      </div>
    </div>
  )
}

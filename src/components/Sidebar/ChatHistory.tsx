import { useMemo } from 'react'
import { ChatHistoryItem } from './ChatHistoryItem'
import { ChatHistoryMoreItem } from './ChatHistoryMoreItem'

interface ChatHistoryProps {
  isCollapsed?: boolean
  chatHistoryList: any[]
  currentChatId?: string | string[]
  onSwitchChat: (id: string) => void
  onMoreAction: (type: string, id: string) => void
}

export function ChatHistory({
  chatHistoryList,
  currentChatId,
  onSwitchChat,
  onMoreAction
}: ChatHistoryProps) {
  const groupedChatHistory = useMemo(() => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    const groups = {
      today: {
        label: '今天',
        chats: [] as any[]
      },
      yesterday: {
        label: '昨天',
        chats: [] as any[]
      },
      lastWeek: {
        label: '最近7天',
        chats: [] as any[]
      },
      older: {
        label: '更早',
        chats: [] as any[]
      }
    }

    chatHistoryList.forEach(chat => {
      const chatDate = new Date(chat.createTime)
      if (isSameDay(chatDate, today)) {
        groups.today.chats.push(chat)
      } else if (isSameDay(chatDate, yesterday)) {
        groups.yesterday.chats.push(chat)
      } else if (chatDate >= lastWeek) {
        groups.lastWeek.chats.push(chat)
      } else {
        groups.older.chats.push(chat)
      }
    })

    return Object.values(groups).filter(group => group.chats.length > 0)
  }, [chatHistoryList])

  function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  return (
    <div className="flex-1 overflow-auto py-2">
      <div className="space-y-2 px-2">
        {groupedChatHistory.length > 0 ? (
          groupedChatHistory.map(group => (
            <div key={group.label}>
              <div className="px-2 py-1.5">
                <span className="text-xs text-muted-foreground">{group.label}</span>
              </div>

              {group.chats.map(chat => (
                <ChatHistoryItem
                  key={chat.id}
                  item={chat}
                  className={chat.id === currentChatId ? 'bg-primary/10' : ''}
                  onClick={() => onSwitchChat(chat.id)}>
                  <ChatHistoryMoreItem onSelect={type => onMoreAction(type, chat.id)} />
                </ChatHistoryItem>
              ))}
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-400 pl-3 pt-4">您的会话记录会出现在这里</div>
        )}
      </div>
    </div>
  )
}

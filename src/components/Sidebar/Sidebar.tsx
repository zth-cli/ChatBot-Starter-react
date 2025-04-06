import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router'
import { ChatHistory } from './ChatHistory'
import { NewChatButton } from './NewChatButton'
import { useSidebar } from './SidebarProvider'
import { useChatStore } from '@/stores/useChatStore'
export function Sidebar() {
  const { chatHistoryList, currentChatHistory, deleteChatHistory, getChatHistoryById } =
    useChatStore()
  const navigate = useNavigate()
  const { isCollapsed } = useSidebar()

  const handleMoreAction = (type: string, id: string) => {
    if (type === 'delete') {
      deleteChatHistory(id, () => {
        navigate('/')
      })
    }
  }

  const handleSwitchChat = (id: string) => {
    getChatHistoryById(id)
    navigate(`/chat/${id}`)
  }

  return (
    <aside
      className={cn(
        // 基础样式
        'fixed inset-y-0 z-10 h-full border-r',
        'transition-[left,right,width] ease-linear duration-200',
        // 响应式显示
        'flex',
        // 宽度控制
        'w-[--sidebar-width] left-0',
        'group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
      )}>
      <div className="flex h-full w-full flex-col">
        {/* 顶部标题栏 */}
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Bot className="h-5 w-5" />
            {!isCollapsed && <span>Chatbot</span>}
          </h2>
          <NewChatButton />
        </div>

        {/* 聊天历史列表 */}
        <ChatHistory
          isCollapsed={isCollapsed}
          chatHistoryList={chatHistoryList}
          currentChatId={currentChatHistory?.id}
          onMoreAction={handleMoreAction}
          onSwitchChat={handleSwitchChat}
        />
      </div>
    </aside>
  )
}

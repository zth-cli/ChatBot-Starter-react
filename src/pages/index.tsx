import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Bot, MessageCircle } from 'lucide-react'
import { useChat } from '@/chatbot'
import { useNavigate } from 'react-router'
import { ChatContainer } from '@/components/ChatContainer'
import { ChatHeader } from '@/components/ChatHeader'
import { ChatTextArea } from '@/components/ChatTextArea'
import { useChatStore } from '@/stores/useChatStore'
import { Head } from '@/components/Head'

export default function IndexPage() {
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const { sendMessage } = useChat()

  const { insertNewChatHistory } = useChatStore()

  // 开始一个新会话
  const startNewChat = () => {
    if (!message) return
    insertNewChatHistory()
    sendMessage(message)
    navigate(`/chat`)
  }

  return (
    <>
      <Head title="首页" description="与 AI 助手进行对话" keywords="AI, 聊天, 对话" />
      <div className="flex w-full h-full">
        <ChatContainer>
          <div className={cn('flex flex-col h-full bg-background w-full')}>
            <ChatHeader />
            <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
              <div className="w-full mx-auto max-w-3xl px-4 text-center leading-8">
                <p className="flex items-center justify-center gap-x-3 mb-5">
                  <Bot className="size-10" /> + <MessageCircle className="size-10" />
                </p>

                <p>
                  使用 react18 + shadcn/ui + tailwindcss
                  和人工智能软件开发工具包构建的聊天机器人模板。
                </p>
                <p>在客户端使用 "useChat" 钩子，以创建无缝的聊天体验。</p>
              </div>
            </div>
            <div className="flex items-end mx-auto px-4 bg-background pb-4 md:pb-12 gap-2 w-full md:max-w-3xl">
              <ChatTextArea
                value={message}
                onChange={setMessage}
                onSend={startNewChat}
                loading={false}
              />
            </div>
          </div>
        </ChatContainer>
      </div>
    </>
  )
}

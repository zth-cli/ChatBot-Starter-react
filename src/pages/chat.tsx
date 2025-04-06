import { ChatContainer } from '@/components/ChatContainer'
import { ChatTextArea } from '@/components/ChatTextArea'
import { ChatMessages } from '@/components/ChatMessages'
import { ChatHeader } from '@/components/ChatHeader'
import { useSidebar } from '@/components/Sidebar'
import { useChatStore } from '@/stores/useChatStore'
import { useChat } from '@/chatbot'
import { Head } from '@/components/Head'

export default () => {
  const params = useParams()
  const { currentChatMessages, currentChatHistory, getChatHistoryById } = useChatStore()
  const [message, setMessage] = useState('')

  // 更新 url 的 chatId
  useEffect(() => {
    if (currentChatHistory?.id) {
      const newUrl = `/chat/${currentChatHistory?.id}${window.location.search}`
      window.history.replaceState(null, '', newUrl)
    }
  }, [currentChatHistory?.id])

  useEffect(() => {
    getChatHistoryById(params?.chatId || '')
  }, [getChatHistoryById, params?.chatId])

  const { sendMessage, stopStream, regenerateMessage } = useChat()
  const sendUserMessage = () => {
    sendMessage(message)
    setMessage('')
  }

  const [isWorkspace, setIsWorkspace] = useState(false)
  const { setIsCollapsed } = useSidebar()
  useEffect(() => {
    if (isWorkspace) {
      setIsCollapsed(true)
    }
    return () => {
      setIsCollapsed(false)
    }
  }, [isWorkspace, setIsCollapsed])

  return (
    <>
      <Head title="当前聊天" description="与 AI 助手进行对话" keywords="AI, 聊天, 对话" />
      <div className="flex w-full h-full">
        <ChatContainer
          isWorkspace={isWorkspace}
          onWorkspaceChange={setIsWorkspace}
          workspace={<p>工作台</p>}
        >
          <div className="flex flex-col h-full bg-background w-full">
            <ChatHeader />
            <div className="flex flex-col min-w-0 gap-6 flex-1 pt-4">
              <ChatMessages
                messages={currentChatMessages}
                onRegenerateMessage={({ index }) => regenerateMessage?.(index)}
              />
            </div>
            <div className="flex items-end mx-auto px-4 lg:px-0 bg-background p-4 md:pb-10 gap-2 w-full md:max-w-3xl">
              <ChatTextArea
                setIsWorkspace={setIsWorkspace}
                value={message}
                onChange={setMessage}
                onSend={sendUserMessage}
                onStop={stopStream}
                loading={currentChatHistory?.loading}
              />
            </div>
          </div>
        </ChatContainer>
      </div>
    </>
  )
}

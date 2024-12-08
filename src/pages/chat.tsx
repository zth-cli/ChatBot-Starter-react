import { ChatContainer } from '@/components/ChatContainer'
import { ChatTextArea } from '@/components/ChatTextArea'
import { ChatMessages } from '@/components/ChatMessages'
import { ChatHeader } from '@/components/ChatHeader'
import { useSidebar } from '@/components/Sidebar'
import { useChatStore } from '@/stores/useChatStore'
import { useChat } from '@/chatbot'

export default () => {
  const params = useParams()
  const { currentChatMessages, currentChatHistory, getChatHistoryById } = useChatStore()
  const [message, setMessage] = useState('')
  useEffect(() => {
    getChatHistoryById(params?.chatId || '')
  }, [params?.chatId])

  const { sendMessage, stopStream, regenerateMessage } = useChat()
  const [isWorkspace, setIsWorkspace] = useState(false)
  const { isCollapsed } = useSidebar()

  return (
    <div className="flex w-full h-full">
      <ChatContainer
        isWorkspace={isWorkspace}
        onWorkspaceChange={setIsWorkspace}
        workspace={<p>工作台</p>}>
        <div className="flex flex-col h-full bg-background w-full">
          <ChatHeader />
          <div className="flex flex-col min-w-0 gap-6 flex-1 pt-4">
            <ChatMessages
              messages={currentChatMessages}
              onRegenerateMessage={({ index }) => regenerateMessage(index)}
            />
          </div>
          <div className="flex items-end mx-auto px-4 lg:px-0 bg-background p-4 md:pb-10 gap-2 w-full md:max-w-3xl">
            <ChatTextArea
              value={message}
              onChange={setMessage}
              onSend={() => sendMessage(message)}
              onStop={stopStream}
              loading={currentChatHistory?.loading}
            />
          </div>
        </div>
      </ChatContainer>
    </div>
  )
}

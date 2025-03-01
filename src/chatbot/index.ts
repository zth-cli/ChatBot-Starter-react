import { ChatCore } from './main'
import { useCallback, useMemo } from 'react'
import { useChatStore } from '@/stores/useChatStore'
import { ChatApiClient, ChatPayload } from './main/ChatApiClient'
import { ChatSessionManager } from './main/ChatSessionManager'

import {
  ChatConfig,
  ChatMessage,
  ChatHistory,
  MessageHandler,
  MessageStatus,
  UseChatHookFn
} from './main/types'

// 默认配置常量
const DEFAULT_CONFIG: ChatConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  streamResponse: false,
  typingDelay: {
    min: 10,
    max: 20
  }
}
// 初始聊天历史状态
const createInitialChatHistory = (): ChatHistory => ({
  id: crypto.randomUUID(),
  children: [],
  loading: false,
  name: '新会话',
  createTime: new Date().toISOString(),
  updateTime: new Date().toISOString(),
  userId: '1',
  isFavorite: false,
  isTemp: true
})
// 创建新消息
const createMessage = (role: 'user' | 'assistant', content: string): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  status: role === 'user' ? MessageStatus.COMPLETE : MessageStatus.PENDING,
  date: new Date().toISOString(),
  ...(role === 'assistant' && { toolCalls: [], toolResults: [], likeStatus: 0 })
})

export const useChat: UseChatHookFn = () => {
  const sessionManagerRef = useRef<ChatSessionManager<ChatCore> | null>(null)
  const chatStore = useChatStore()
  const currentChat = useMemo(() => {
    console.log('currentChat', chatStore.currentChatHistory)
    return chatStore.currentChatHistory || createInitialChatHistory()
  }, [chatStore.currentChatHistory])
  // API客户端初始化
  const baseUrl = import.meta.env.DEV ? '/api' : ''
  const apiClient = useMemo(
    () =>
      new ChatApiClient(
        `${baseUrl}/llm/skillCenter/plugin/chat/openai/formdata`,
        import.meta.env.VITE_API_KEY || '61c36ab3c518418b916a6ffc2190d170'
      ),
    [baseUrl]
  )

  // 消息处理器
  const createMessageHandler = useCallback(
    (chatId: string): MessageHandler => ({
      onCreate: () => {
        chatStore.updateChatHistoryStatusById(chatId, true)
        const newMessage = createMessage('assistant', '')
        chatStore.insertChatMessage(newMessage)
        return newMessage
      },
      onToken: message => {
        chatStore.updateCurrentChatMessage(message)
      },
      onComplete: message => {
        chatStore.updateCurrentChatMessage(message)
        chatStore.updateChatHistoryStatusById(chatId, false)
        sessionManagerRef.current?.cleanupSession(chatId)
      },
      onError: (message, error) => {
        console.error('Chat error:', error)
        chatStore.updateCurrentChatMessage({ ...message, status: MessageStatus.ERROR })
        chatStore.updateChatHistoryStatusById(chatId, false)
        sessionManagerRef.current?.cleanupSession(chatId)
      },
      onStop: message => {
        chatStore.updateCurrentChatMessage({ ...message, status: MessageStatus.STOP })
        chatStore.updateChatHistoryStatusById(chatId, false)
        sessionManagerRef.current?.cleanupSession(chatId)
      }
    }),
    [chatStore]
  )

  const createChatCore = useCallback(
    () => new ChatCore(DEFAULT_CONFIG, createMessageHandler(currentChat.id!), apiClient),
    [apiClient, createMessageHandler, currentChat.id]
  )

  useEffect(() => {
    if (!sessionManagerRef.current) {
      sessionManagerRef.current = new ChatSessionManager<ChatCore>(createChatCore)
    }
  }, [createChatCore])

  const addUserMessage = useCallback(
    (content: string) => {
      const newMessage = createMessage('user', content)
      chatStore.insertChatMessage(newMessage)
    },
    [chatStore]
  )

  const clearHistory = useCallback(() => {
    chatStore.resetChat()
  }, [chatStore])

  const sendMessage = useCallback(
    async (message: string) => {
      try {
        const chatId = currentChat?.id
        if (!chatId) return

        addUserMessage(message)
        const chatCore = await sessionManagerRef.current?.getSession(chatId)

        apiClient.setApiClientHeaders({
          ChatToken: import.meta.env.VITE_CHAT_TOKEN || '2d3689d3-8a12-49e6-a1e6-4b8069465551'
        })

        await chatCore?.sendMessage<ChatPayload>({
          chatFlowId: import.meta.env.VITE_CHAT_FLOW_ID,
          messages: [{ role: 'user', content: message }]
        })
      } catch (error) {
        console.error('Failed to send message:', error)
        chatStore.updateChatHistoryStatusById(currentChat.id!, false)
      }
    },
    [currentChat?.id, addUserMessage, apiClient, chatStore]
  )
  const regenerateMessage = useCallback(
    async (index: number) => {
      const chatId = currentChat?.id
      if (!chatId) return

      const messages = chatStore.currentChatMessages
      // 检查索引是否有效
      if (index < 0 || index >= messages.length) return

      // 获取指定索引位置的消息和它的前一条消息
      const targetMessage = messages[index]
      const previousMessage = index > 0 ? messages[index - 1] : null

      // 确保目标消息是助手消息，且前一条是用户消息
      if (targetMessage.role === 'assistant' && previousMessage?.role === 'user') {
        // 删除targetMessage
        messages.splice(index, 1)

        // 重新发送用户消息
        const userMessage = previousMessage.content
        const chatCore = await sessionManagerRef.current?.getSession(chatId)
        apiClient.setApiClientHeaders({
          ChatToken: import.meta.env.VITE_CHAT_TOKEN
        })
        await chatCore?.sendMessage<ChatPayload>({
          chatFlowId: import.meta.env.VITE_CHAT_FLOW_ID,
          messages: [{ role: 'user', content: userMessage }]
        })
      }
    },
    [currentChat?.id, chatStore, apiClient]
  )

  const stopStream = useCallback(async () => {
    try {
      const chatId = currentChat?.id
      if (!chatId) return

      const chatCore = await sessionManagerRef.current?.getSession(chatId)
      await chatCore?.stopStream()
      chatStore.updateChatHistoryStatusById(chatId, false)
    } catch (error) {
      console.error('Failed to stop stream:', error)
      chatStore.updateChatHistoryStatusById(currentChat.id!, false)
    }
  }, [currentChat?.id, chatStore])

  return {
    sendMessage,
    stopStream,
    clearHistory,
    regenerateMessage
  }
}

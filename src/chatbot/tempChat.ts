import { ChatCore } from './main'
import { useState, useCallback, useMemo } from 'react'
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
  createTime: '',
  updateTime: ''
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
  const [currentChat, setCurrentChat] = useState<ChatHistory>(createInitialChatHistory())

  // API客户端初始化
  const baseUrl = import.meta.env.DEV ? '/api' : ''
  const apiClient = useMemo(
    () =>
      new ChatApiClient(
        `${baseUrl}/llm/skillCenter/plugin/chat/openai/formdata`,
        import.meta.env.VITE_API_KEY || '61c36ab3c518418b916a6ffc2190d170'
      ),
    []
  )

  // 消息更新处理
  const updateMessage = useCallback(
    (messageId: string, updater: (message: ChatMessage) => ChatMessage) => {
      setCurrentChat(prev => {
        const index = prev.children.findIndex(m => m.id === messageId)
        if (index === -1) return prev

        const newMessages = [...prev.children]
        newMessages[index] = updater(newMessages[index])
        return { ...prev, children: newMessages }
      })
    },
    []
  )

  // 消息处理器
  const createMessageHandler = useCallback(
    (chatId: string): MessageHandler => ({
      onCreate: () => {
        setCurrentChat(prev => ({ ...prev, loading: true }))
        const newMessage = createMessage('assistant', '')
        setCurrentChat(prev => ({
          ...prev,
          children: [...prev.children, newMessage]
        }))
        return newMessage
      },
      onToken: message => updateMessage(message.id, () => message),
      onComplete: message => {
        updateMessage(message.id, () => message)
        setCurrentChat(prev => ({ ...prev, loading: false }))
        sessionManager.cleanupSession(chatId)
      },
      onError: (message, error) => {
        console.error('Chat error:', error)
        updateMessage(message.id, prev => ({ ...prev, status: MessageStatus.ERROR }))
        setCurrentChat(prev => ({ ...prev, loading: false }))
        sessionManager.cleanupSession(chatId)
      },
      onStop: message => {
        updateMessage(message.id, prev => ({ ...prev, status: MessageStatus.STOP }))
        setCurrentChat(prev => ({ ...prev, loading: false }))
        sessionManager.cleanupSession(chatId)
      }
    }),
    [updateMessage]
  )

  const createChatCore = useCallback(
    () => new ChatCore(DEFAULT_CONFIG, createMessageHandler(currentChat.id), apiClient),
    [apiClient, createMessageHandler, currentChat.id]
  )

  const sessionManager = useMemo(
    () => new ChatSessionManager<ChatCore>(createChatCore),
    [createChatCore]
  )

  const addUserMessage = useCallback((content: string) => {
    const newMessage = createMessage('user', content)
    setCurrentChat(prev => ({
      ...prev,
      children: [...prev.children, newMessage]
    }))
  }, [])

  const clearHistory = useCallback(() => {
    setCurrentChat(createInitialChatHistory())
  }, [])

  const sendMessage = useCallback(
    async (message: string) => {
      try {
        const chatId = currentChat.id
        if (!chatId) return

        addUserMessage(message)
        const chatCore = await sessionManager.getSession(chatId)

        apiClient.setApiClientHeaders({
          ChatToken: import.meta.env.VITE_CHAT_TOKEN || '27ecabac-764e-4132-b4d2-fa50b7ec1b65'
        })

        await chatCore.sendMessage<ChatPayload>({
          chatFlowId: import.meta.env.VITE_CHAT_FLOW_ID,
          messages: [{ role: 'user', content: message }]
        })
      } catch (error) {
        console.error('Failed to send message:', error)
        setCurrentChat(prev => ({ ...prev, loading: false }))
      }
    },
    [currentChat.id, addUserMessage, sessionManager, apiClient]
  )

  const stopStream = useCallback(async () => {
    try {
      const chatId = currentChat.id
      if (!chatId) return

      const chatCore = await sessionManager.getSession(chatId)
      await chatCore.stopStream()
      setCurrentChat(prev => ({ ...prev, loading: false }))
    } catch (error) {
      console.error('Failed to stop stream:', error)
      setCurrentChat(prev => ({ ...prev, loading: false }))
    }
  }, [currentChat.id, sessionManager])

  return {
    sendMessage,
    stopStream,
    chatHistory: currentChat,
    clearHistory,
    isLoading: currentChat.loading
  }
}

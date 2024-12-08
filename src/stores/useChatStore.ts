import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatHistory, ChatMessage } from '@/chatbot/main/types'

interface ChatStore {
  // 状态
  chatHistoryList: ChatHistory[]
  currentChatHistory: ChatHistory | null
  currentChatMessages: ChatMessage[]

  // 方法
  init: () => Promise<void>
  getChatHistoryList: () => Promise<void>
  getChatHistoryById: (id?: string) => ChatHistory | null
  insertNewChatHistory: () => void
  insertChatMessage: (message: ChatMessage) => void
  resetChat: () => void
  deleteChatHistory: (id: string, cb?: () => void) => void
  updateChatHistoryStatusById: (id: string, status: boolean) => void
  updateCurrentChatMessage: (message: Partial<ChatMessage> & { id: string }) => void
  removeChatMessageById: (id: string) => void
}

const CHAT_KEY = 'chat-history-list1'

const createDefaultChatHistory = (): ChatHistory => {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: '新对话1',
    createTime: now,
    updateTime: now,
    userId: '1',
    isFavorite: false,
    isTemp: true,
    loading: false,
    children: []
  }
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      chatHistoryList: [],
      currentChatHistory: null,
      currentChatMessages: [],

      // 方法实现
      init: async () => {
        await get().getChatHistoryList()
      },
      // 获取对话列表
      getChatHistoryList: async () => {
        try {
          set({ chatHistoryList: get().chatHistoryList ?? [] })
        } catch (error) {
          console.error('获取对话列表失败:', error)
          set({ chatHistoryList: [] })
        }
      },

      // 插入新对话,同时更新当前对话
      insertNewChatHistory: () => {
        const newChat = createDefaultChatHistory()
        set(state => ({
          currentChatHistory: newChat,
          currentChatMessages: newChat.children,
          chatHistoryList: [newChat, ...state.chatHistoryList]
        }))
      },
      // 根据id获取对话,同时更新当前对话
      getChatHistoryById: (id?: string) => {
        if (!id) return null
        const history = get().chatHistoryList.find(item => item.id === id) || null
        if (history) {
          set({
            currentChatHistory: history,
            currentChatMessages: history.children
          })
        }
        return history
      },
      // 插入消息,同时更新当前对话
      insertChatMessage: (message: ChatMessage) => {
        set(state => ({
          currentChatMessages: [...state.currentChatMessages, message]
        }))

        // 同时更新 chatHistoryList 中的对应聊天记录
        if (get().currentChatHistory) {
          set(state => ({
            chatHistoryList: state.chatHistoryList.map(chat =>
              chat.id === state.currentChatHistory?.id
                ? { ...chat, children: [...state.currentChatMessages, message] }
                : chat
            )
          }))
        }
      },
      // 重置当前对话
      resetChat: () => {
        set({
          currentChatMessages: [],
          currentChatHistory: null
        })
      },
      // 根据id删除对话
      deleteChatHistory: (id: string, cb?: () => void) => {
        set(state => {
          const newList = state.chatHistoryList.filter(item => item.id !== id)
          const shouldReset = state.currentChatHistory?.id === id

          return {
            chatHistoryList: newList,
            ...(shouldReset
              ? {
                  currentChatHistory: null,
                  currentChatMessages: []
                }
              : {})
          }
        })
        cb?.()
      },
      // 更新对话状态
      updateChatHistoryStatusById: (id: string, status: boolean) => {
        set(state => ({
          currentChatHistory: state.currentChatHistory
            ? { ...state.currentChatHistory, loading: status }
            : null,
          chatHistoryList: state.chatHistoryList.map(chat =>
            chat.id === id ? { ...chat, loading: status } : chat
          )
        }))
      },
      // 更新当前对话的消息
      updateCurrentChatMessage: (message: Partial<ChatMessage> & { id: string }) => {
        set(state => {
          const newMessages = state.currentChatMessages.map(msg =>
            msg.id === message.id ? { ...msg, ...message } : msg
          )

          return {
            currentChatMessages: newMessages,
            chatHistoryList: state.chatHistoryList.map(chat =>
              chat.id === state.currentChatHistory?.id ? { ...chat, children: newMessages } : chat
            )
          }
        })
      },
      // 根据id删除消息
      removeChatMessageById: (id: string) => {
        try {
          set(state => {
            const newMessages = state.currentChatMessages.filter(msg => msg.id !== id)

            return {
              currentChatMessages: newMessages,
              chatHistoryList: state.chatHistoryList.map(chat =>
                chat.id === state.currentChatHistory?.id ? { ...chat, children: newMessages } : chat
              )
            }
          })
        } catch (error) {
          console.error('删除消息失败:', error)
        }
      }
    }),
    {
      name: CHAT_KEY,
      storage: {
        getItem: name => {
          const str = localStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: name => localStorage.removeItem(name)
      },
      // 可选：部分状态不进行持久化
      partialize: (state: ChatStore) => {
        const { chatHistoryList } = state
        return {
          chatHistoryList
          // 不持久化 currentChatHistory 和 currentChatMessages
        } as ChatStore
      }
    }
  )
)

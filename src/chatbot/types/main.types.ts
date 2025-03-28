export type Role = 'user' | 'assistant' | 'system' | 'tool'

/**
 * @description 历史对话
 */
export interface ChatHistory {
  /**
   * @description: 会话id
   */
  id: string
  /**
   * @description: 是否为临时会话
   */
  isTemp?: boolean
  /**
   * @description: 加载状态
   */
  loading?: boolean
  /**
   * @description: 会话名称
   */
  name: string
  /**
   * @description: 用户标识， 可选
   */
  userId?: string
  /**
   * @description: 会话创建时间
   */
  createTime: string
  /**
   * @description: 会话更新时间
   */
  updateTime: string
  /**
   * @description: 会话消息列表
   */
  children: ChatMessage[]
  /**
   * @description: 是否收藏
   */
  isFavorite?: boolean
  /**
   * @description: 是否置顶
   */
  pinned?: boolean
}

export interface ChatMessage {
  id: string
  role: Role
  /**
   * @description: 消息内容
   */
  content: string
  /**
   * @description: 思考内容
   */
  thinkContent?: string
  status: MessageStatus
  date: string
  toolCalls?: any
  toolResults?: ToolResult
  parentMessageId?: string
  retryCount?: number
  /**
   * @description: 用于展示引用(附件，链接等)
   */
  quotes?: Quote
  /**
   * @description: 是否已阅读
   */
  isRead?: boolean
  /**
   * @description: 推荐问题
   */
  suggestMessage?: {
    loading: boolean
    data: string[]
  }
  /**
   * @description: 点赞点踩状态 0: 未点赞未点踩 1: 已点赞 -1: 已点踩
   */
  likeStatus?: 0 | 1 | -1
}

export type Quote = {
  type: 'file' | 'link'
  data: any[]
}

export enum MessageStatus {
  PENDING = 1,
  STREAMING = 2,
  COMPLETE = 3,
  ERROR = 4,
  STOP = 5
}
export type ToolCall = {
  id?: string
  type?: any
  function: {
    name: string
    arguments?: string
  }
}

export interface ToolResult {
  toolCallId: string
  result: any
  ui?: any
}

export interface ChatSession {
  id: string
  controller: AbortController
  currentMessage: ChatMessage | null
  isLoading: boolean
  retryCount: number
  startTime: number
  lastError?: Error
}

export interface MessageHandler {
  onCreate: () => ChatMessage
  onReasoningContent?: (message: ChatMessage) => Promise<void> | void
  onToolCall?: (message: ChatMessage, toolCalls: ToolCall[]) => Promise<void> | void
  onToken: (message: ChatMessage) => Promise<void> | void
  onComplete: (message: ChatMessage) => Promise<void> | void
  onStop: (message: ChatMessage) => Promise<void> | void
  onError: (message: ChatMessage, error: Error) => Promise<void> | void
}

export interface ChatConfig {
  maxRetries: number
  retryDelay: number
  streamResponse: boolean // 控制是否逐字显示
  typingDelay: {
    min: number
    max: number
  }
}

export interface ApiResponse {
  id: string
  choices: Array<{
    delta?: {
      content?: string
      tool_calls?: ToolCall[]
    }
    finish_reason?: string
  }>
}
export interface ImageMessage {
  text?: string
  type?: string
  image_url?: {
    detail: string
    url: string
  }
}
export interface MessageType {
  content: string | ImageMessage[] | undefined
  name?: string
  tool_call_id?: any
  role: Role
}
export type UseChatParams = {
  /**
   * @description 滚动到底部
   */
  scrollToBottom?: () => void
  tools?: any
}
export type ChatHook = {
  /**
   * @description 发送消息
   */
  sendMessage: (params?: any) => void
  /**
   * @description 停止流
   */
  stopStream: (params?: any) => void

  regenerateMessage?: (index: number) => void
}
export type UseChatHookFn = (params?: UseChatParams) => ChatHook

export interface UploadFileInfo {
  id: string
  name: string
  batchId?: string | null
  percentage?: number | null
  status?: 'pending' | 'uploading' | 'finished' | 'removed' | 'error'
  url?: string | null
  file?: File | null
  thumbnailUrl?: string | null
  type?: string | null
  fullPath?: string | null
  size?: number
}
export type BuiltinType =
  | 'markdown'
  | 'image'
  | 'table'
  | 'video'
  | 'audio'
  | 'file'
  | 'sql'
  | 'link'
  | 'page'
  | 'action'
  | 'knowledge'
  | 'search-engine'
  | 'article'
  | 'bar-chart'
  | 'line-chart'
  | 'pie-chart'
  | 'area-chart'
export type PluginType = 'standalone' | BuiltinType

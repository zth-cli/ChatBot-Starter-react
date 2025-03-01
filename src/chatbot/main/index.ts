import { ChatConfig, MessageHandler, ChatMessage, MessageStatus, ToolCall } from './types'
import { StreamProcessor } from './StreamProcessor'
import { ChatApiClient } from './ChatApiClient'
import { NetworkError } from './ChatError'
import { sleep } from './helper'

const DEFAULT_CONFIG: ChatConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  streamResponse: false,
  typingDelay: {
    min: 10,
    max: 20
  }
}
export class ChatCore {
  private currentMessage: ChatMessage | undefined
  private controller: AbortController
  private retryCount: number = 0
  private streamProcessor: StreamProcessor

  constructor(
    private config: ChatConfig,
    private messageHandler: MessageHandler,
    private apiClient: ChatApiClient
  ) {
    // 合并默认配置
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.controller = new AbortController()
    this.streamProcessor = new StreamProcessor({
      onStart: () => this.handleStart(),
      onToken: token => this.handleToken(token),
      onToolCall: toolCalls => this.handleToolCall(toolCalls),
      onFinish: fullText => this.handleFinish(fullText),
      onError: error => this.handleError(error)
    })
  }

  async sendMessage<T extends { messages: any[]; [x: string]: any }>(
    message: T,
    isRetry: boolean = false
  ): Promise<void> {
    if (!isRetry) {
      this.currentMessage = this.messageHandler.onCreate()
    }
    this.controller = new AbortController()

    try {
      const response = await this.apiClient.createChatStream(message, this.controller.signal)

      if (!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }

      await this.streamProcessor.processStream(response)
    } catch (error) {
      await this.handleError(error)

      // 重试逻辑
      if (error.retryable && this.retryCount < this.config.maxRetries) {
        this.retryCount++
        await this.retry(message)
      }
    }
  }
  // 方法设置当前消息
  public setCurrentMessage(message: ChatMessage): void {
    this.currentMessage = message
  }
  private async retry<T extends { messages: any[]; [x: string]: any }>(message: T): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay))
    return this.sendMessage(message, true)
  }

  private handleStart(): void {
    this.logInfo('开始处理消息')
  }

  private async handleToken(token: string): Promise<void> {
    if (!this.currentMessage) return
    this.currentMessage.status = MessageStatus.STREAMING
    await this.appendTokenWithDelay(token)
  }

  private async appendTokenWithDelay(token: string) {
    const chars = token.split('')
    if (this.config.streamResponse) {
      // 逐字显示
      for (const char of chars) {
        this.currentMessage!.content += char
        await this.messageHandler.onToken(this.currentMessage!)
        await sleep(
          Math.random() * (this.config.typingDelay.max - this.config.typingDelay.min) +
            this.config.typingDelay.min,
          this.controller.signal
        )
      }
    } else {
      // 直接显示完整内容
      this.currentMessage!.content += token
      await this.messageHandler.onToken(this.currentMessage!)
    }
  }

  private async handleToolCall(toolCalls: ToolCall[]): Promise<void> {
    if (!this.currentMessage) return

    this.currentMessage = {
      ...this.currentMessage,
      toolCalls: [...toolCalls]
    }

    this.messageHandler?.onToolCall?.(this.currentMessage, toolCalls)
  }

  private async handleFinish(fullText: string): Promise<void> {
    if (!this.currentMessage) return

    const completedMessage = {
      ...this.currentMessage,
      status: MessageStatus.COMPLETE,
      content: fullText
    }
    await this.messageHandler.onComplete(completedMessage)
    this.reset()
  }

  private async handleError(error: Error): Promise<void> {
    this.logError(`处理错误: ${error.message}`, error)
    if (!this.currentMessage) return

    const errorMessage = {
      ...this.currentMessage,
      status: MessageStatus.ERROR
    }

    await this.messageHandler.onError(errorMessage, error)
  }

  async stopStream(): Promise<void> {
    if (this.currentMessage) {
      const stopMessage = {
        ...this.currentMessage,
        status: MessageStatus.STOP
      }
      await this.messageHandler.onStop(stopMessage)
      this.controller.abort()
      this.reset()
    }
  }

  private reset(): void {
    this.currentMessage = undefined
    this.retryCount = 0
  }

  private logInfo(message: string): void {
    console.log(`[ChatCore] ${message}`)
  }

  private logError(message: string, error?: Error): void {
    console.error(`[ChatCore] ${message}`, error)
  }
}

import { ToolCall, StreamProcessorHandlers } from '../types'

/**
 * 基础流处理器抽象类
 */
export abstract class BaseStreamProcessor {
  protected fullText = ''
  protected currentToolCalls: ToolCall[] = []
  protected buffer = ''
  protected isFinished = false
  protected isReasoning = false

  constructor(protected handlers: StreamProcessorHandlers) {}

  abstract createTransformStream(): TransformStream<string, string>
  /**
   * 重置处理器状态
   */
  public reset() {
    this.fullText = ''
    this.currentToolCalls = []
    this.buffer = ''
    this.isFinished = false
  }
  protected async handleStart() {
    await this.handlers.onStart?.()
  }

  protected async handleError(error: any) {
    await this.handlers.onError?.(error)
  }

  protected async handleFinish() {
    if (!this.isFinished) {
      this.isFinished = true
      await this.handlers.onFinish?.(this.fullText)
    }
  }

  protected async handleToken(content: string) {
    // 如果包含了<think>，则是开始推理，触发handleReasoningContent，知道遇到</think>，推理结束
    if (content.includes('<think>')) {
      this.isReasoning = true
    } else if (content.includes('</think>')) {
      this.isReasoning = false
    }
    if (!this.isReasoning) {
      this.fullText += content
      await this.handlers.onToken?.(content)
    } else if (this.isReasoning) {
      this.fullText = ''
      content = content.replace('<think>', '').replace('</think>', '')
      await this.handleReasoningContent(content)
    }
  }

  protected async handleReasoningContent(content: string) {
    await this.handlers.onReasoningContent?.(content)
  }

  protected async handleToolCall(toolCalls: ToolCall[]) {
    this.currentToolCalls = [...this.currentToolCalls, ...toolCalls]
    await this.handlers.onToolCall?.(this.currentToolCalls)
  }
}

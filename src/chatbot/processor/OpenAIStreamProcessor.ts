import { BaseStreamProcessor } from './BaseStreamProcessor'
import { OpenAIStreamChunk } from '../types'

export class OpenAIStreamProcessor extends BaseStreamProcessor {
  createTransformStream(): TransformStream<string, string> {
    return new TransformStream({
      start: async () => await this.handleStart(),
      transform: async (chunk: string, controller) => {
        try {
          this.buffer += chunk
          const lines = this.buffer.split('\n')
          this.buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim().startsWith('data:')) continue
            const jsonStr = line.replace('data:', '').trim()

            if (jsonStr === '[DONE]') {
              await this.handleFinish()
              return
            }

            try {
              const json: OpenAIStreamChunk = JSON.parse(jsonStr)
              const { choices } = json

              if (!choices || choices.length === 0) continue

              const { delta } = choices[0]
              // 处理文本内容
              if (delta.content) {
                await this.handleToken(delta.content)
              } // 处理工具调用
              else if (delta.tool_calls) {
                await this.handleToolCall(delta.tool_calls)
              }
              // 处理推理内容
              else if (delta.reasoning_content) {
                await this.handleReasoningContent(delta.reasoning_content)
              }
            } catch (parseError) {
              console.warn('OpenAI JSON parse error:', parseError)
              continue
            }
          }
          controller.enqueue(chunk)
        } catch (error) {
          await this.handleError(error)
          controller.error(error)
        }
      }
    })
  }
}

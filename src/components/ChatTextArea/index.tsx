import { useRef, useEffect } from 'react'
import { Box, Paperclip, Send } from 'lucide-react'
import { StopIcon } from './StopIcon'
import { Button } from '@/components/ui/button'

interface ChatTextAreaProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onStop?: () => void
  loading?: boolean
}

export function ChatTextArea({
  value,
  onChange,
  onSend,
  onStop,
  loading = false
}: ChatTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (!e.ctrlKey) {
        // 普通 Enter 发送消息
        if (value.trim()) {
          onSend()
          e.preventDefault()
        }
      } else {
        // Ctrl+Enter 插入换行
        e.preventDefault()
        const start = e.currentTarget.selectionStart
        const end = e.currentTarget.selectionEnd
        const newValue = value.substring(0, start) + '\n' + value.substring(end)
        onChange(newValue)

        // 将光标位置移到换行后
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1
          }
        })
      }
    }
  }

  // 处理发送按钮点击
  const handleSend = () => {
    if (loading) {
      onStop?.()
    } else {
      if (!value.trim()) return
      onSend()
    }
  }

  // 组件挂载时聚焦
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  return (
    <div className="relative w-full">
      <div className="w-full flex flex-col rounded-xl border shadow-sm overflow-hidden bg-neutral-50">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full max-h-[160px] min-h-[40px] p-4 border-0 resize-none outline-none bg-transparent placeholder:text-gray-300 text-sm overflow-y-auto"
          placeholder="输入问题"
        />
        <div className="flex items-center gap-1 justify-end pr-2 pb-2">
          <Button
            variant="ghost"
            title="工作台"
            size="icon"
            className="text-gray-400 hover:text-gray-600">
            <Box className="!size-5" />
          </Button>
          <Button
            variant="ghost"
            title="附件"
            size="icon"
            className="text-gray-400 hover:text-gray-600">
            <Paperclip className="!size-5" />
          </Button>
          <Button
            disabled={!value && !loading}
            variant="ghost"
            title="发送"
            size="icon"
            className="text-gray-400 hover:text-gray-600"
            onClick={handleSend}>
            {!loading ? <Send className="!size-5" /> : <StopIcon className="!size-8" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

import { useRef, useEffect, useMemo } from 'react'
import ChatLoadingDots from '@/components/ChatLoadingDots'
import ChatItem from '@/components/ChatItem'
import { ChatMessage } from '@/chatbot/main/types'
import { FloatButton } from './FloatButton'
import { VList, VListHandle } from 'virtua'

interface ChatMessagesProps {
  messages: ChatMessage[]
  onRegenerateMessage?: (params: { index: number }) => void
  onClickSuggest?: (item: string) => void
}

export const ChatMessages = ({
  messages,
  onRegenerateMessage,
  onClickSuggest
}: ChatMessagesProps) => {
  const listRef = useRef<VListHandle>(null)
  const [isAtBottom, setIsAtBottom] = useState(false)

  const msgLength = useMemo(() => messages.length - 1, [messages])

  const isLastMessageAssistant = useMemo(() => {
    if (messages.length === 0) return false
    return messages[msgLength].role === 'assistant'
  }, [messages, msgLength])

  // 监听消息变化,自动滚动到底部
  useEffect(() => {
    if (listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToIndex(messages.length - 1, {
          align: 'end'
        })
      }, 0)
    }
  }, [messages[msgLength]?.content])

  const scrollToBottom = () => {
    listRef.current?.scrollToIndex(messages.length - 1, { align: 'end' })
  }
  const handleScroll = () => {
    if (!listRef.current) return
    const { scrollOffset, viewportSize, scrollSize } = listRef.current
    if (scrollOffset + viewportSize >= scrollSize) {
      setIsAtBottom(true)
    } else {
      setIsAtBottom(false)
    }
  }

  const renderItems = useMemo(() => {
    return messages.map((item, index) => (
      <div key={index} className="w-full mx-auto max-w-3xl px-4 mb-6">
        {item.role === 'user' && <ChatItem.User item={item} />}
        {item.role === 'assistant' && (
          <ChatItem.AI
            item={item}
            loading={ChatLoadingDots}
            onRegenerateMessage={() => onRegenerateMessage?.({ index })}
            onClickSuggest={onClickSuggest}
            needRefresh={isLastMessageAssistant && msgLength === index}
            showSuggest={isLastMessageAssistant && msgLength === index}
            showActionAlways={isLastMessageAssistant && msgLength === index}
          />
        )}
        {index === msgLength && <div className="shrink-0 min-w-[24px] min-h-[24px]" />}
      </div>
    ))
  }, [isLastMessageAssistant, messages, msgLength, onClickSuggest, onRegenerateMessage])
  return (
    <div className="h-full relative">
      <VList ref={listRef} className="h-full" onScroll={handleScroll}>
        {renderItems}
      </VList>
      {!isAtBottom && (
        <FloatButton
          onClick={() => listRef.current?.scrollToIndex(messages.length - 1, { align: 'end' })}
        />
      )}
    </div>
  )
}

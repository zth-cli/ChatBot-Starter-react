import { SuggestMessage } from './SuggestMessage'
import { Separator } from '@/components/ui/separator'
import { useChatStore } from '@/stores/useChatStore'
import { CopyX, MoreActions, Refresh, MoreActionItem } from './ActionBar'
import { cn } from '@/lib/utils'
import { ThumbsUpOrDown } from './ThumbsUpOrDown'
import { ChatMessage, MessageStatus } from '@/chatbot/main/types'
import { useMemo } from 'react'
import { RenderMarkdown } from '../RenderMarkdown'
import MarkdownParser from '@/mdParser/MarkdownParser'

interface AIChatItemProps {
  item: ChatMessage
  loading?: React.ComponentType
  render?: () => React.ReactNode
  needRefresh?: boolean
  showSuggest?: boolean
  showActionAlways?: boolean
  onRegenerateMessage?: () => void
  onClickSuggest?: (item: string) => void
}

export const AIChatItem: React.FC<AIChatItemProps> = ({
  item,
  loading: LoadingComponent,
  render,
  needRefresh = false,
  showSuggest = true,
  showActionAlways = false,
  onRegenerateMessage,
  onClickSuggest
}) => {
  // 是否是插件类型
  const isPlugin = useMemo(() => Boolean(item?.toolCalls?.type), [item?.toolCalls?.type])
  // 状态判断
  const isPending = useMemo(() => item.status === MessageStatus.PENDING, [item.status])
  const isLoading = useMemo(() => item.status === MessageStatus.STREAMING, [item.status])
  const { removeChatMessageById } = useChatStore()
  const handleSelect = (action: MoreActionItem) => {
    switch (action.value) {
      case 'copy':
        break
      case 'regenerate':
        break
      case 'delete':
        removeChatMessageById(item.id)
        break
    }
  }

  const renderActions = () => {
    if (isLoading) return null

    return (
      <div
        className={cn(
          'text-xs text-black/50 dark:text-foreground',
          !showActionAlways ? 'opacity-0 group-hover/ai:opacity-100' : 'opacity-100'
        )}>
        <div className="rounded flex gap-4 items-center cursor-pointer mt-2">
          {needRefresh && <Refresh item={item} onClick={onRegenerateMessage} />}
          <CopyX id={item.id} />
          <MoreActions item={item} onSelect={handleSelect} />
          <Separator orientation="vertical" className="h-3" />
          <ThumbsUpOrDown message={item} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-start group/ai gap-2">
      {render?.()}
      {isPlugin && <p>插件</p>}
      {item.content ? (
        <MarkdownParser markdown={item.content} loading={isLoading} />
      ) : (
        // <RenderMarkdown data={item.content} id={item.id} loading={isLoading} />
        <span className="text-sm text-black/50 dark:text-foreground"></span>
      )}
      {isPending && LoadingComponent && <LoadingComponent />}
      {renderActions()}
      {showSuggest && (
        <SuggestMessage
          list={item.suggestMessage?.data}
          loading={item.suggestMessage?.loading ? LoadingComponent : undefined}
          onClickSuggest={onClickSuggest}
        />
      )}
    </div>
  )
}

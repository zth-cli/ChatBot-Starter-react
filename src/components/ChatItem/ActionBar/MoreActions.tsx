import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'
import { CopyX, Del, Refresh } from '.'
import { ChatMessage } from '@/chatbot/main/types'

export type MoreActionItem = {
  name: string
  icon: React.ComponentType<any>
  shortcut?: string
  value: string
}

interface MoreActionsProps {
  item: ChatMessage
  list?: MoreActionItem[]
  onSelect: (item: MoreActionItem) => void
}

export const MoreActions = ({
  item,
  onSelect,
  list = [
    // {
    //   icon: Refresh,
    //   name: '重新生成',
    //   value: 'regenerate'
    // },
    // {
    //   icon: CopyX,
    //   name: '复制',
    //   value: 'copy'
    // },
    {
      icon: Del,
      name: '删除',
      value: 'delete'
    }
  ]
}: MoreActionsProps) => {
  const handleSelect = (item: MoreActionItem) => {
    onSelect(item)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal className={cn('h-4 w-4')} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuGroup>
          {list.map((actionItem, i) => (
            <DropdownMenuItem key={i} onSelect={() => handleSelect(actionItem)}>
              <actionItem.icon item={item} title={actionItem.name} />
              <DropdownMenuShortcut>{actionItem?.shortcut}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

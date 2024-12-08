import { Ellipsis } from 'lucide-react'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

interface Option {
  value: string
  label: string
  disabled?: boolean
  variant?: string
}

interface ChatHistoryMoreItemProps {
  options?: Option[]
  onSelect: (value: string) => void
  children?: React.ReactNode
}

const defaultOptions = [
  {
    value: 'top',
    label: '置顶',
    disabled: true
  },
  {
    value: 'edit',
    label: '编辑',
    disabled: true
  },
  {
    value: 'delete',
    label: '删除',
    variant: 'destructive'
  }
]

export function ChatHistoryMoreItem({
  options = defaultOptions,
  onSelect,
  children
}: ChatHistoryMoreItemProps) {
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleSelect = (framework: Option) => {
    setOpen(false)
    if (framework.variant === 'destructive') {
      setDeleteDialogOpen(true)
    } else {
      onSelect(framework.value)
    }
  }

  const handleDelete = () => {
    setDeleteDialogOpen(false)
    onSelect('delete')
  }

  return (
    <>
      <Popover>
        <PopoverTrigger>{children || <Ellipsis size={16} />}</PopoverTrigger>
        <PopoverContent className="w-[140px] p-0" align="end">
          <Command>
            <CommandList>
              <CommandGroup>
                {options.map(framework => (
                  <CommandItem
                    key={framework.value}
                    className={
                      framework.variant === 'destructive'
                        ? 'hover:!bg-red-200 !text-destructive'
                        : ''
                    }
                    disabled={framework.disabled}
                    value={framework.value}
                    onSelect={() => handleSelect(framework)}>
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogTrigger asChild />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除吗？</AlertDialogTitle>
            <AlertDialogDescription>此操作将删除当前对话, 请谨慎操作</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

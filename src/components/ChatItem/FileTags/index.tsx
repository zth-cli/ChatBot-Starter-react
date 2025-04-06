import { cn } from '@/lib'
import { TagItem } from './TagItem'
import { UploadFileInfo } from '@/chatbot/types'

interface FileTagsProps {
  attachments?: (UploadFileInfo & { size?: number })[]
}

export const FileTags: React.FC<FileTagsProps> = ({ attachments = [] }) => {
  return (
    <div
      className={cn(
        'relative grid gap-x-2 gap-y-2 max-w-full mb-2',
        attachments?.length < 3
          ? `grid-cols-${attachments?.length}`
          : 'lg:grid-cols-3 md:grid-cols-2 grid-cols-1'
      )}>
      {attachments?.map(item => <TagItem key={item.id} fileInfo={item} showClose={false} />)}
    </div>
  )
}

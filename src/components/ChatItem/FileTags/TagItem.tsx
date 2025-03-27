import { MimeType, ImageMimeTypes } from '@/chatbot/constants/mimeTypes'
import { X } from 'lucide-react'
import { cn, isFileOrBlobInstance } from '@/lib'
import { UploadFileInfo } from '@/chatbot/types'
import { useEffect, useMemo, useState } from 'react'

interface TagItemProps {
  fileInfo: UploadFileInfo & { size?: number }
  showClose?: boolean
  onClose?: (event: any) => void
}

export const TagItem: React.FC<TagItemProps> = ({
  fileInfo = {
    id: '',
    name: '',
    type: '',
    url: '',
    size: 0,
    file: null
  },
  showClose = true,
  onClose
}) => {
  const [base64Url, setBase64Url] = useState<string | ArrayBuffer | null>('')

  const isImageType = useMemo(() => {
    return ImageMimeTypes.includes(fileInfo.type as MimeType)
  }, [fileInfo.type])

  const getFileType = (file: UploadFileInfo) => {
    const type = file.type?.split('/')[1]
    switch (type) {
      case 'vnd.ms-excel':
        return 'xlsx'
      case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'xlsx'
      case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'docx'
      case 'msword':
        return 'docx'
      default:
        return type
    }
  }

  const icon = useMemo(
    () => new URL(`./icons/${getFileType(fileInfo)}.png`, import.meta.url).href,
    [fileInfo]
  )

  const fileSize = useMemo(() => {
    const size = fileInfo.file?.size || fileInfo?.size || 0
    if (size && size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)}KB`
    }
    return `${(size / 1024 / 1024).toFixed(2)}MB`
  }, [fileInfo])

  useEffect(() => {
    if (isImageType) {
      if (isFileOrBlobInstance(fileInfo.file)) {
        const reader = new FileReader()
        reader.onload = e => {
          setBase64Url(e.target!.result)
        }
        if (fileInfo.file instanceof File) {
          reader.readAsDataURL(fileInfo.file)
        }
      } else if (fileInfo.file) {
        setBase64Url(fileInfo.file)
      }
    }
  }, [isImageType, fileInfo.file])

  return (
    <div
      className={cn(
        'relative flex items-start gap-2 cursor-pointer bg-black/5 dark:bg-neutral-900 rounded-lg',
        isImageType ? 'p-1' : 'p-3 py-2'
      )}
    >
      {isImageType ? (
        <img src={base64Url as string} alt="" className="w-14 aspect-square rounded-lg" />
      ) : (
        <>
          <div className="w-[25px]">
            <img preview-disabled width="25" src={icon} color="transparent" alt="" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <p className="line-clamp-1 w-28 sm:w-32 text-xs font-bold" title={fileInfo.name}>
              {fileInfo.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {getFileType(fileInfo)?.toUpperCase()},{fileSize}
            </p>
          </div>
        </>
      )}
      {showClose && (
        <p
          onClick={onClose}
          className="absolute right-[-4px] top-[-4px] bg-red-500 rounded-full text-white"
        >
          <X className="w-3 h-3" />
        </p>
      )}
    </div>
  )
}

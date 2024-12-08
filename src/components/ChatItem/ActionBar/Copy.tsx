import { Copy } from '@/components/Copy'

interface CopyXProps {
  id: string
  title?: string
}
export const CopyX: React.FC<CopyXProps> = ({ id }) => {
  const [content, setContent] = useState('')
  useEffect(() => {
    const container = document.getElementById(`md_container_${id}`)
    setContent(container?.textContent || '')
  }, [id])
  return <Copy content={content} />
}

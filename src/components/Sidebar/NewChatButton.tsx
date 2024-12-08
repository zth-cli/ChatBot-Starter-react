import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import { useChatStore } from '@/stores/useChatStore'

export function NewChatButton() {
  const navigate = useNavigate()
  const { resetChat } = useChatStore()

  const newChat = () => {
    resetChat()
    navigate('/')
  }

  return (
    <Button variant="ghost" size="sm" className="ml-auto" onClick={newChat}>
      <Plus className="h-4 w-4" />
    </Button>
  )
}

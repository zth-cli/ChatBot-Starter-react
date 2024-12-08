import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Settings, Sun, Moon, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function UserNav() {
  const userInfo = {
    userName: 'rzx007',
    department: ''
  }
  const { theme, setThemeMode } = useTheme()
  const router = useNavigate()

  useEffect(() => {
    document.body.className = theme
  }, [])

  const Icons = theme === 'dark' ? Moon : Sun

  const actions = {
    logout: () => {
      router('/')
    },
    settings: () => {
      alert('settings')
    }
  }

  const handleSelect = (action: keyof typeof actions) => {
    actions[action]()
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setThemeMode(newTheme)
    document.body.className = newTheme
  }

  const avatarUrl = 'https://github.com/shadcn.png'

  if (!userInfo.userName) {
    return (
      <Button size="sm" className="rounded-xl px-4">
        登录
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="h-7 w-7">
          <AvatarImage className="rounded-full object-cover" src={avatarUrl} alt="@avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-56')} align="start" alignOffset={12}>
        <DropdownMenuLabel className="font-normal flex">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo.userName || '无名'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo.department || '未知部门'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleSelect('settings')}>
            <Settings className="mr-2 h-4 w-4" />
            设置
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTheme}>
          <Icons className="mr-2 w-5 h-5" />
          主题
          <DropdownMenuShortcut>Ctrl + K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect('logout')}>
          <LogOut className="ml-1 mr-2 h-4 w-4" />
          登出
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

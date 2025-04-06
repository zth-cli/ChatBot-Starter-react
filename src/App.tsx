import { Route, RouteObject, Routes } from 'react-router'
// import AuthRoute from './router/AuthRoute'
import { useChatStore } from '@/stores/useChatStore'
import { HelmetProvider } from 'react-helmet-async' // 设置页面标题,SEO
import { SidebarProvider } from '@/components/Sidebar/SidebarProvider'
import { router } from './router'
import './App.css'

function App() {
  const { init } = useChatStore()

  // 初始化聊天记录
  useEffect(() => {
    init()
  }, [init])

  const RouteAuthFun = useCallback((routeList: RouteObject[]) => {
    return routeList.map(item => {
      return (
        <Route path={item.path} element={item.element} key={item.path}>
          {/* 递归调用*/}
          {item?.children && RouteAuthFun(item.children)}
        </Route>
      )
    })
  }, [])

  return (
    <HelmetProvider>
      <SidebarProvider>
        <Routes>{RouteAuthFun(router)}</Routes>
      </SidebarProvider>
    </HelmetProvider>
  )
}

export default App

import { Route, RouteObject, Routes } from 'react-router'
import AuthRoute from './router/AuthRoute'
import { useChatStore } from '@/stores/useChatStore'
import { SidebarProvider } from '@/components/Sidebar/SidebarProvider'
import { router } from './router'
import './App.css'

function App() {
  const { init } = useChatStore()

  useEffect(() => {
    init()
  }, [])

  const RouteAuthFun = useCallback((routeList: RouteObject[]) => {
    return routeList.map(item => {
      return (
        <Route path={item.path} element={item.element} key={item.path}>
          {/* 递归调用，因为可能存在多级的路由 */}
          {item?.children && RouteAuthFun(item.children)}
        </Route>
      )
    })
  }, [])

  return (
    <SidebarProvider>
      <Routes>{RouteAuthFun(router)}</Routes>
    </SidebarProvider>
  )
}

export default App

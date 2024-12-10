import lazyLoad from '@/router/utils/lazyLoad'
import Layout from '@/layouts/default'
import NotFound from '@/pages/error'
import { RouteObject } from 'react-router'

const router: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: lazyLoad(lazy(() => import('@/pages'))) },
      { path: '/chat/:chatId?', element: lazyLoad(lazy(() => import('@/pages/chat'))) }
    ]
  },
  { path: '*', element: <NotFound /> }
]
export { router }

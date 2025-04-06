import { matchRoutes, useLocation, useNavigate } from 'react-router'
import { router } from '.'

const AuthRoute = ({ children }: any) => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = sessionStorage.getItem('access_token') || ''
  const matchedRoutes = matchRoutes(router, location)
  const isExist = matchedRoutes?.some(item => item.pathname == location.pathname)
  useEffect(() => {
    if (token === '') {
      console.error('token 过期，请重新登录!')
      navigate('/login')
    }
    // 这里判断条件是：token 存在并且是匹配到路由并且是已经登录的状态
    if (token && isExist) {
      // 如果你已经登录了，但是你通过浏览器里直接访问login的话不允许直接跳转到login路由，必须通过logout来控制退出登录或者是token过期返回登录界面
      navigate(location.pathname)
    }
  }, [isExist, location.pathname, navigate, token])

  return children
}
export default AuthRoute

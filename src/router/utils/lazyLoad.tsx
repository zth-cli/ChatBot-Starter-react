import { Suspense } from 'react'

/**
 * @description 路由懒加载HOC
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */
const lazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Comp />
    </Suspense>
  )
}

export default lazyLoad

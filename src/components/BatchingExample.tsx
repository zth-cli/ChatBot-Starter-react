function BatchingExample() {
  console.log('1.开始渲染')
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    // 这些更新会被批处理，只会触发一次重新渲染
    setCount(c => c + 1)
    setFlag(f => !f)

    console.log('count:', count) // 打印 0（更新前的值）
  }, []) // 空依赖数组，只在组件挂载时执行一次

  useEffect(() => {
    console.log('更新后的count:', count)
  }, [count])

  console.log('2.组件渲染中') // 初始渲染 + 批量更新后的渲染，共打印两次

  return (
    <div>
      Count: {count}, Flag: {String(flag)}
    </div>
  )
}
export default BatchingExample

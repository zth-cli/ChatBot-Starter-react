const LoadingDots = () => {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-black/50 dark:bg-foreground animate-fade"
          style={{ animationDelay: `${(i - 1) * 0.2}s` }}
        />
      ))}
    </div>
  )
}

export default LoadingDots

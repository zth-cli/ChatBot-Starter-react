import { useRef, useState, useEffect } from 'react'
import { Mic } from 'lucide-react'
import { useAudioRecorder } from './useAudioRecorder'

interface MobileAudioRecorderProps {
  sendAudio: (audio: Blob) => Promise<void>
  pressDelay?: number
}

export function MobileAudioRecorder({ sendAudio, pressDelay = 500 }: MobileAudioRecorderProps) {
  const {
    isRecording,
    canRecord,
    checkRecordingAvailability,
    startRecording,
    stopRecording,
    processAudio
  } = useAudioRecorder()

  const [isWaiting, setIsWaiting] = useState(false)
  const [isMoveOut, setIsMoveOut] = useState(false)
  const [tipText, setTipText] = useState('长按说话')
  const pressTimer = useRef<number | null>(null)

  // 初始化检查录音可用性
  useEffect(() => {
    checkRecordingAvailability()
  }, [checkRecordingAvailability])

  const clearPressTimer = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!canRecord) return

    setIsWaiting(true)
    setTipText('请继续按住...')

    pressTimer.current = window.setTimeout(() => {
      setIsWaiting(false)
      setIsMoveOut(false)
      setTipText('松开发送')
      startRecording()
    }, pressDelay)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isRecording) {
      if (isWaiting) {
        clearPressTimer()
        setIsWaiting(false)
        setTipText('长按说话')
      }
      return
    }

    const touch = e.touches[0]
    const element = e.target as HTMLElement
    const rect = element.getBoundingClientRect()

    const isInside =
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom

    setIsMoveOut(!isInside)
    setTipText(isInside ? '松开发送' : '松开取消')
  }

  const handleTouchEnd = async () => {
    clearPressTimer()

    if (isWaiting) {
      setIsWaiting(false)
      setTipText('长按说话')
      return
    }

    if (!isRecording) return

    const blob = await stopRecording()
    if (blob && !isMoveOut) {
      const wavBlob = await processAudio(blob)
      if (wavBlob) {
        await sendAudio(wavBlob)
      }
    }

    setTipText('长按说话')
    setIsMoveOut(false)
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}>
        <div
          className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200
            ${isRecording || isWaiting ? 'bg-primary scale-150' : 'bg-primary/80'}
            ${!canRecord && 'opacity-50 !cursor-not-allowed'}
          `}>
          <Mic className={`size-8 ${isRecording || isWaiting ? 'text-white' : 'text-white/90'}`} />
        </div>

        {/* 等待动画 */}
        {isWaiting && (
          <div className="absolute inset-0 rounded-full border-4 border-primary">
            <div
              className="absolute inset-0 rounded-full border-4 border-primary/30"
              style={{
                animation: `waiting-circle ${pressDelay}ms linear`
              }}
            />
          </div>
        )}

        {/* 录音动画波纹 */}
        {isRecording && !isMoveOut && (
          <div className="absolute inset-0 rounded-full">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border border-primary/30 animate-ping"
                style={{
                  animationDelay: `${(i - 1) * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 提示文本 */}
      <span
        className={`mt-3 text-sm transition-colors ${isMoveOut ? 'text-red-500' : 'text-muted-foreground'}`}>
        {canRecord ? tipText : '录音权限未开启或者设备不支持'}
      </span>
    </div>
  )
}

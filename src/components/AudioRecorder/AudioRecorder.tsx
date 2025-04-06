import { useAudioRecorder } from './useAudioRecorder'
import { Mic, Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import './AudioRecorder.css'

interface AudioRecorderProps {
  sendAudio: (audio: Blob) => Promise<void>
  cancelAudio?: () => void
}

const WAVE_COUNT = 4

export function AudioRecorder({ sendAudio, cancelAudio }: AudioRecorderProps) {
  const {
    isRecording,
    isLoading,
    canRecord,
    title,
    checkRecordingAvailability,
    startRecording,
    stopRecording,
    processAudio,
    setIsLoading
  } = useAudioRecorder()

  // 初始化检查录音可用性
  useEffect(() => {
    console.log('checkRecordingAvailability')
    checkRecordingAvailability()
  }, [checkRecordingAvailability])

  const sendAudioToAPI = async (blob: Blob) => {
    if (!blob) return
    setIsLoading(true)
    try {
      const wavBlob = await processAudio(blob)
      if (wavBlob) {
        await sendAudio?.(wavBlob)
      }
    } catch (error) {
      console.error('处理音频时出错:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelLoading = () => {
    setIsLoading(false)
    cancelAudio?.()
  }

  const handleClick = async () => {
    if (!isLoading) {
      if (isRecording) {
        const blob = await stopRecording()
        if (blob) {
          sendAudioToAPI(blob)
        }
      } else {
        startRecording()
      }
    } else {
      cancelLoading()
    }
  }

  return (
    <div
      className={`
        p-2 relative transition-all duration-200 hover:bg-primary/5  hover:dark:bg-white/10
        rounded-xl cursor-pointer flex items-center justify-center
        ${(isRecording || isLoading) && 'bg-primary/10 hover:bg-primary/10'}
        ${!canRecord && 'text-foreground/20 !cursor-not-allowed'}
      `}
      title={title}
      onClick={() => canRecord && handleClick()}>
      {!isLoading ? (
        isRecording ? (
          <div className="flex items-center justify-center gap-1 size-5">
            {Array.from({ length: WAVE_COUNT }).map((_, i) => (
              <div
                key={i}
                className="wave-bar bg-primary"
                style={{
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        ) : (
          <Mic className="size-5" />
        )
      ) : (
        <Loader2 className="size-5 animate-spin" />
      )}
    </div>
  )
}

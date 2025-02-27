import { useState, useCallback, useMemo } from 'react'
import { AudioConverter } from './audioConverter'
import { AudioRecorderService } from './audioRecorder'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [canRecord, setCanRecord] = useState(false)

  const audioRecorder = useMemo(() => new AudioRecorderService(), [])
  const audioConverter = useMemo(() => AudioConverter.getInstance(), [])

  const checkRecordingAvailability = useCallback(async () => {
    const canRecordStatus = await audioRecorder.canRecord()
    setCanRecord(canRecordStatus)
    if (!canRecordStatus) {
      console.warn('无法进行录音，可能是因为浏览器不支持或未授权')
    }
    return canRecordStatus
  }, [audioRecorder])

  const startRecording = useCallback(async () => {
    try {
      await audioRecorder.startRecording()
      setIsRecording(true)
    } catch (error) {
      console.error('开始录音失败:', error)
    }
  }, [audioRecorder])

  const stopRecording = useCallback(async () => {
    try {
      const blob = await audioRecorder.stopRecording()
      setAudioBlob(blob)
      setIsRecording(false)
      return blob
    } catch (error) {
      console.error('停止录音失败:', error)
      return null
    }
  }, [audioRecorder])

  const processAudio = useCallback(
    async (blob: Blob) => {
      try {
        return await audioConverter.webmToWav(blob)
      } catch (error) {
        console.error('处理音频时出错:', error)
        return null
      }
    },
    [audioConverter]
  )

  const title = useMemo(() => {
    return isLoading ? '点击取消' : isRecording ? '正在录音' : '点击录音'
  }, [isLoading, isRecording])

  return {
    isRecording,
    audioBlob,
    isLoading,
    canRecord,
    title,
    checkRecordingAvailability,
    startRecording,
    stopRecording,
    processAudio,
    setIsLoading
  }
}

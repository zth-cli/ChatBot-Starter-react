export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null
  private chunks: Blob[] = []
  private stream: MediaStream | null = null

  async canRecord(): Promise<boolean> {
    // 检查是否支持必要的 API
    if (!navigator?.mediaDevices?.getUserMedia) {
      return false
    }

    try {
      // 尝试获取麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // 获取成功后立即停止所有轨道
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      return false
    }
  }
  async startRecording(): Promise<void> {
    try {
      this.chunks = []
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(this.stream)

      this.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          this.chunks.push(event.data)
        }
      }

      this.mediaRecorder.start()
    } catch (error) {
      console.error('访问麦克风失败:', error)
      throw new Error('无法访问麦克风')
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('录音器未初始化'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' })
        this.chunks = []
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop())
          this.stream = null
        }
        resolve(blob)
      }

      this.mediaRecorder.stop()
    })
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording'
  }
}

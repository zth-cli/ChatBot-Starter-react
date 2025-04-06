/**
 * 音频转换器类 - 用于处理音频格式转换
 * 使用单例模式确保只创建一个AudioContext实例
 */
export class AudioConverter {
  private static instance: AudioConverter
  private audioContext: AudioContext

  /**
   * 私有构造函数，初始化AudioContext
   * 支持标准AudioContext和webkit前缀版本
   */
  private constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  /**
   * 获取AudioConverter的单例实例
   * @returns AudioConverter实例
   */
  public static getInstance(): AudioConverter {
    if (!AudioConverter.instance) {
      AudioConverter.instance = new AudioConverter()
    }
    return AudioConverter.instance
  }

  /**
   * 将WebM格式音频转换为WAV格式
   * @param webmBlob WebM格式的Blob对象
   * @returns 转换后的WAV格式Blob对象
   * @throws 如果转换过程中发生错误
   */
  public async webmToWav(webmBlob: Blob): Promise<Blob> {
    try {
      const arrayBuffer = await webmBlob.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      return await this.audioBufferToWav(audioBuffer)
    } catch (error) {
      console.error('音频转换失败:', error)
      throw new Error('音频转换失败')
    }
  }

  /**
   * 将AudioBuffer转换为WAV格式
   * @param buffer 要转换的AudioBuffer对象
   * @returns WAV格式的Blob对象
   */
  private async audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
    // 设置WAV格式参数
    const numberOfChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const format = 1 // PCM格式
    const bitDepth = 16 // 位深度

    const bytesPerSample = bitDepth / 8
    const blockAlign = numberOfChannels * bytesPerSample

    // 合并所有声道的数据
    const data = new Float32Array(buffer.length * numberOfChannels)
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      for (let i = 0; i < buffer.length; i++) {
        data[i * numberOfChannels + channel] = channelData[i]
      }
    }

    // 将音频数据转换为16位整数格式
    const dataLength = data.length * bytesPerSample
    const buffer16Bit = new Int16Array(data.length)

    for (let i = 0; i < data.length; i++) {
      const s = Math.max(-1, Math.min(1, data[i]))
      buffer16Bit[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }

    // 创建WAV文件缓冲区
    const wavBuffer = new ArrayBuffer(44 + dataLength)
    const view = new DataView(wavBuffer)

    // 写入WAV文件头
    this.writeString(view, 0, 'RIFF') // RIFF标识
    view.setUint32(4, 36 + dataLength, true) // 文件大小
    this.writeString(view, 8, 'WAVE') // WAVE标识
    this.writeString(view, 12, 'fmt ') // fmt 块标识
    view.setUint32(16, 16, true) // fmt 块大小
    view.setUint16(20, format, true) // 音频格式
    view.setUint16(22, numberOfChannels, true) // 声道数
    view.setUint32(24, sampleRate, true) // 采样率
    view.setUint32(28, sampleRate * blockAlign, true) // 字节率
    view.setUint16(32, blockAlign, true) // 块对齐
    view.setUint16(34, bitDepth, true) // 位深度
    this.writeString(view, 36, 'data') // data块标识
    view.setUint32(40, dataLength, true) // 数据大小

    // 写入音频数据
    const offset = 44
    for (let i = 0; i < buffer16Bit.length; i++) {
      view.setInt16(offset + i * 2, buffer16Bit[i], true)
    }

    return new Blob([wavBuffer], { type: 'audio/wav' })
  }

  /**
   * 将字符串写入DataView
   * @param view DataView对象
   * @param offset 写入位置的偏移量
   * @param string 要写入的字符串
   */
  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
}

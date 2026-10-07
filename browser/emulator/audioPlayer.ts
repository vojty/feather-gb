import type { Clock } from './framePacer'

const CHANNELS_COUNT = 2

// Buffered audio (s) the dynamic rate control aims for (half-full buffer), also the lead after an underrun
const TARGET_LATENCY = 0.06
// Less buffered audio (s) than this is treated as an underrun
const UNDERRUN_LATENCY = 0.02
// Chunks are dropped above this buffered audio (s), a last resort
const MAX_LATENCY = 0.2
// Max playback rate adjustment of the dynamic rate control (0.5%), inaudible as a pitch change
const MAX_RATE_DELTA = 0.005
// Smoothing factor of the measured buffer level, it jumps by a chunk worth of samples on every chunk
const BUFFER_LEVEL_SMOOTHING = 0.1

/**
 * Plays audio chunks produced by the emulator.
 *
 * 1. Every chunk is scheduled right after the previous one, `scheduledUntil` is the end of the
 *    last one. The buffered audio = `scheduledUntil - currentTime`.
 * 2. Underrun (the buffer ran dry): the schedule restarts TARGET_LATENCY ahead and the underrun is
 *    reported, so the frame pacer won't catch up the missed time (that would only add latency).
 * 3. Dynamic rate control (https://near.sh/articles/audio/dynamic-rate-control): the chunk is
 *    played at `speed * (1 ± MAX_RATE_DELTA)`, faster when the buffer is above TARGET_LATENCY and
 *    slower when it's below, so the buffer level settles there instead of drifting. `speed` is the
 *    emulation speed relative to the real GB (e.g. 1.0046 when synced to a 60 Hz display).
 * 4. Chunks are dropped when the buffer is above MAX_LATENCY.
 */
export class AudioPlayer {
  // Emulation speed relative to the real GB, i.e. how fast samples are produced
  speed = 1

  private readonly context = new AudioContext()
  private scheduledUntil = 0
  private smoothedBufferLevel = TARGET_LATENCY
  private underrun = false

  private readonly audioClock: Clock = { id: 'audio', now: () => this.context.currentTime }
  private readonly performanceClock: Clock = {
    id: 'performance',
    now: () => performance.now() / 1000,
  }

  // The audio hardware clock, or the performance clock when audio isn't running yet
  get clock(): Clock {
    return this.context.state === 'running' ? this.audioClock : this.performanceClock
  }

  // Safari only starts audio from a user gesture, so this has to be called from a click handler
  // https://gist.github.com/kus/3f01d60569eeadefe3a1
  warmup() {
    const source = this.context.createBufferSource()
    source.buffer = this.context.createBuffer(1, 1, this.context.sampleRate)
    source.connect(this.context.destination)
    source.start(0)
    void this.context.resume()
  }

  reset() {
    this.scheduledUntil = 0
    this.underrun = false
  }

  // `samples` are interleaved stereo samples, copied, so they can be reused after the call
  play(samples: Float32Array, sampleRate: number) {
    let bufferLevel = this.scheduledUntil - this.context.currentTime
    if (bufferLevel < UNDERRUN_LATENCY) {
      this.restartSchedule()
      bufferLevel = TARGET_LATENCY
    } else if (bufferLevel > MAX_LATENCY) {
      return
    }

    const source = this.context.createBufferSource()
    source.buffer = this.createAudioBuffer(samples, sampleRate)
    source.playbackRate.value = this.getPlaybackRate(bufferLevel)
    source.connect(this.context.destination)
    source.start(this.scheduledUntil)
    this.scheduledUntil += source.buffer.duration / source.playbackRate.value
  }

  // Returns whether an underrun happened since the last call
  takeUnderrun(): boolean {
    const { underrun } = this
    this.underrun = false
    return underrun
  }

  private restartSchedule() {
    this.scheduledUntil = this.context.currentTime + TARGET_LATENCY
    this.smoothedBufferLevel = TARGET_LATENCY
    this.underrun = true
  }

  private getPlaybackRate(bufferLevel: number): number {
    this.smoothedBufferLevel += BUFFER_LEVEL_SMOOTHING * (bufferLevel - this.smoothedBufferLevel)
    // 0 = empty, 0.5 = at TARGET_LATENCY, 1 = full
    const fillLevel = clamp(this.smoothedBufferLevel / (2 * TARGET_LATENCY), 0, 1)
    return this.speed * (1 - MAX_RATE_DELTA + 2 * fillLevel * MAX_RATE_DELTA)
  }

  // WebAudio resamples the buffer if the context runs at a different sample rate
  private createAudioBuffer(samples: Float32Array, sampleRate: number): AudioBuffer {
    const frameCount = samples.length / CHANNELS_COUNT
    const buffer = this.context.createBuffer(CHANNELS_COUNT, frameCount, sampleRate)
    for (let channel = 0; channel < CHANNELS_COUNT; channel += 1) {
      const channelData = buffer.getChannelData(channel)
      for (let i = 0; i < frameCount; i += 1) {
        channelData[i] = samples[i * CHANNELS_COUNT + channel]
      }
    }
    return buffer
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

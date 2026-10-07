import { RefreshRateMonitor } from './refreshRateMonitor'

// Max difference between the display and GB frame rates for vsync pacing, the audio is resampled
// by the same ratio (1% = ~17 cents of pitch shift)
const VSYNC_TOLERANCE = 0.01
// Max emulated time owed to real time, so the emulator won't fast-forward after the tab was hidden
const MAX_CATCH_UP_SECONDS = 0.1

// Source of real time in seconds, `id` changes when the source changes
export type Clock = { id: string; now: () => number }

export type GbTiming = { cpuClockSpeed: number; cyclesPerFrame: number }

type VsyncTiming = { vsyncsPerFrame: number; speed: number }

/**
 * Decides when to run emulator frames, `advance` is called on every requestAnimationFrame.
 *
 * 1. Measure the display refresh rate from the rAF timestamps.
 * 2. Pick a pacing mode:
 *    - vsync: the refresh rate is within VSYNC_TOLERANCE of a multiple of the GB frame rate
 *      (60 Hz, 120 Hz, ...). Every refresh adds 1 / vsyncsPerFrame of a GB frame, so frames are
 *      evenly spaced and video is smooth. The emulation runs slightly off the real GB speed
 *      (`speed`), the audio player compensates it by resampling.
 *    - clock: any other refresh rate (144 Hz, VRR, still measuring). Adds the real time passed
 *      on `clock`, the emulation runs exactly at the real GB speed.
 * 3. Both modes add to one cycle budget (emulated cycles owed to real time). A frame is due once
 *    at least half of it is owed. Executed frames subtract their real length, so a long LCD-off
 *    frame makes the budget negative and the next frames wait for real time to catch up.
 * 4. After a stall (dropped frames, busy page) the owed time is caught up, unless `skipCatchUp`
 *    is called because the audio already ran dry.
 */
export class FramePacer {
  // Emulation speed relative to the real GB
  speed = 1

  private readonly refreshRateMonitor = new RefreshRateMonitor()
  private readonly gbFrameRate: number
  private readonly maxBudget: number
  private mode: 'vsync' | 'clock' | undefined
  private clock: Clock | undefined
  private lastClockTime = 0
  private budget = 0
  private catchUpSkipped = false

  constructor(
    private readonly timing: GbTiming,
    private readonly getClock: () => Clock,
  ) {
    this.gbFrameRate = timing.cpuClockSpeed / timing.cyclesPerFrame
    this.maxBudget = MAX_CATCH_UP_SECONDS * timing.cpuClockSpeed
  }

  // Adds the emulated cycles owed since the previous display refresh, `timestamp` is from rAF (ms)
  advance(timestamp: number) {
    const refreshes = this.refreshRateMonitor.addTimestamp(timestamp)
    const vsyncTiming = this.getVsyncTiming()

    let owedCycles: number
    if (vsyncTiming) {
      this.speed = vsyncTiming.speed
      this.setMode('vsync')
      owedCycles = (refreshes / vsyncTiming.vsyncsPerFrame) * this.timing.cyclesPerFrame
    } else {
      this.speed = 1
      this.setMode('clock')
      owedCycles = this.clockSecondsPassed() * this.timing.cpuClockSpeed
    }

    if (this.catchUpSkipped) {
      // The gap which caused the skip may be reported only now, after the skip
      this.catchUpSkipped = false
      owedCycles = Math.min(owedCycles, this.timing.cyclesPerFrame)
    }
    this.budget = Math.min(this.budget + owedCycles, this.maxBudget)
  }

  isFrameDue(): boolean {
    return this.budget >= this.timing.cyclesPerFrame / 2
  }

  // `cycles` = the real length of the executed frame (returned by run_frame)
  onFrameExecuted(cycles: number) {
    this.budget -= cycles
  }

  // Forgets the owed time, including a gap reported by the next `advance`, used when catching up
  // makes no sense anymore (audio already ran dry)
  skipCatchUp() {
    this.budget = Math.min(this.budget, 0)
    this.catchUpSkipped = true
  }

  private getVsyncTiming(): VsyncTiming | null {
    const { refreshRate } = this.refreshRateMonitor
    if (!refreshRate) {
      return null
    }

    const vsyncsPerFrame = Math.round(refreshRate / this.gbFrameRate)
    const speed = refreshRate / vsyncsPerFrame / this.gbFrameRate
    if (vsyncsPerFrame < 1 || Math.abs(speed - 1) > VSYNC_TOLERANCE) {
      return null
    }
    return { vsyncsPerFrame, speed }
  }

  private clockSecondsPassed(): number {
    const clock = this.getClock()
    if (clock.id !== this.clock?.id) {
      // Clock source changed, its time is not comparable with the previous one
      this.clock = clock
      this.lastClockTime = clock.now()
      console.debug(`Pacing: ${clock.id} clock`)
    }

    const time = clock.now()
    const passed = time - this.lastClockTime
    this.lastClockTime = time
    return passed
  }

  private setMode(mode: 'vsync' | 'clock') {
    if (this.mode === mode) {
      return
    }
    this.mode = mode
    if (mode === 'vsync') {
      this.clock = undefined
      console.debug(
        `Pacing: vsync, ${this.refreshRateMonitor.refreshRate?.toFixed(2)} Hz, speed ${this.speed.toFixed(4)}`,
      )
    }
  }
}

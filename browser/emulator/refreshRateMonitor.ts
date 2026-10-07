// Number of requestAnimationFrame intervals the refresh rate is averaged over (~2 s at 60 Hz)
const WINDOW_SIZE = 120

/**
 * Measures the display refresh interval from requestAnimationFrame timestamps.
 *
 * 1. Keep the last WINDOW_SIZE intervals between timestamps.
 * 2. The median interval is the nominal refresh interval, every interval is converted to a whole
 *    number of refreshes with it (a dropped frame = 2 refreshes, jittery 8 + 25 ms = 0 + 2 refreshes).
 * 3. The precise interval = total time / total refreshes, so neither dropped frames nor timestamp
 *    jitter skew it.
 */
export class RefreshRateMonitor {
  private lastTimestamp: number | undefined
  private intervals: number[] = []
  private interval: number | undefined

  // Records a timestamp (ms), returns how many refreshes passed since the previous one
  addTimestamp(timestamp: number): number {
    const previous = this.lastTimestamp
    this.lastTimestamp = timestamp
    if (previous === undefined) {
      return 1
    }

    this.intervals.push(timestamp - previous)
    if (this.intervals.length > WINDOW_SIZE) {
      this.intervals.shift()
    }
    this.interval = this.measureInterval()

    return this.interval ? Math.round((timestamp - previous) / this.interval) : 1
  }

  // Refresh rate (Hz), undefined until enough timestamps are collected
  get refreshRate(): number | undefined {
    return this.interval ? 1000 / this.interval : undefined
  }

  private measureInterval(): number | undefined {
    if (this.intervals.length < WINDOW_SIZE) {
      return undefined
    }

    const nominal = median(this.intervals)
    let totalTime = 0
    let totalRefreshes = 0
    for (const interval of this.intervals) {
      totalTime += interval
      totalRefreshes += Math.round(interval / nominal)
    }
    return totalRefreshes > 0 ? totalTime / totalRefreshes : undefined
  }
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

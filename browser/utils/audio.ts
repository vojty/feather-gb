let initialized = false

export function warmupAudio(audioContext: AudioContext) {
  if (initialized) {
    return
  }
  initialized = true
  // https://gist.github.com/kus/3f01d60569eeadefe3a1

  // Safari cannot start async audio
  // Warmup audio on RUN button click

  // Create empty buffer
  const buffer = audioContext.createBuffer(1, 1, audioContext.sampleRate)
  const source = audioContext.createBufferSource()
  source.buffer = buffer
  // Connect to output (speakers)
  source.connect(audioContext.destination)
  // Play sound
  source.start(0)
  audioContext.resume()
}

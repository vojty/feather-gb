import { useLocalStorage } from '@rehooks/local-storage'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import type { WebEmulator } from '../../../gb-web/pkg'
import { memory } from '../../../gb-web/pkg/gb_web_bg.wasm'
import { InputContextProvider } from '../../context/InputContext'
import { useInputHandler } from '../../hooks/useInputHandler'
import { useWasmModule, type WasmModule } from '../../hooks/useWasmModule'
import { AudioPlayer } from '../../emulator/audioPlayer'
import { FramePacer } from '../../emulator/framePacer'
import type { Rom, Theme } from '../../types'
import { FullscreenLoader } from '../common/FullscreenLoader'
import { DISPLAY_HEIGHT, DISPLAY_WIDTH, GameBoy } from '../gameboy/GameBoy'
import { Zoom } from '../gameboy/Zoom'
import { Backbutton } from '../play/BackButton'
import { Cartridges } from '../play/Cartridges'
import { FpsCounter } from '../play/FpsCounter'
import { OpenButton } from '../play/UploadButton'

const DEFAULT_ZOOM = 1.5

const INITIAL_DISPLAY_COLOR = '#6D7C00'

type Props = {
  wasmModule: WasmModule
  ctx: CanvasRenderingContext2D
  bytes?: Uint8Array
  running: boolean
  soundEnabled: boolean
}

const audioPlayer = new AudioPlayer()

const RGB_BYTES = 3
const RGBA_BYTES = 4

function renderFrame(emulator: WebEmulator, ctx: CanvasRenderingContext2D) {
  const pixelsCount = DISPLAY_WIDTH * DISPLAY_HEIGHT
  const source = new Uint8Array(
    memory.buffer,
    emulator.get_canvas_data_pointer(),
    pixelsCount * RGB_BYTES,
  )
  const imageData = ctx.createImageData(DISPLAY_WIDTH, DISPLAY_HEIGHT)
  const target = imageData.data

  for (let pixel = 0; pixel < pixelsCount; pixel += 1) {
    const sourceOffset = pixel * RGB_BYTES
    const targetOffset = pixel * RGBA_BYTES
    target[targetOffset] = source[sourceOffset]
    target[targetOffset + 1] = source[sourceOffset + 1]
    target[targetOffset + 2] = source[sourceOffset + 2]
    target[targetOffset + 3] = 255 // alpha
  }
  ctx.putImageData(imageData, 0, 0)
}

function initScreen(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = INITIAL_DISPLAY_COLOR
  ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT)
}

// Helper component so we don't have to deal with nullable values in parent components
function DeviceHandler(props: Props) {
  const { bytes, wasmModule, running, ctx, soundEnabled } = props
  const emulator = useRef<WebEmulator>(undefined)
  const registerInputs = useInputHandler()

  // Init screen color
  useEffect(() => {
    initScreen(ctx)
  }, [ctx])

  // Called by the emulator whenever its audio buffer is full
  const onAudioBuffer = useCallback(
    (bufferPointer: number) => {
      const samples = new Float32Array(
        memory.buffer,
        bufferPointer,
        wasmModule.get_audio_buffer_size(),
      )
      audioPlayer.play(samples, wasmModule.get_audio_sample_rate())
    },
    [wasmModule],
  )

  // Create emulator on cartridge load
  useEffect(() => {
    if (!bytes) {
      return
    }

    const cartridge = new wasmModule.WebCartridge(bytes)
    audioPlayer.reset()
    emulator.current = new wasmModule.WebEmulator(cartridge, () => {})
    initScreen(ctx)

    registerInputs(emulator.current)
  }, [ctx, bytes, wasmModule, registerInputs])

  useEffect(() => {
    emulator.current?.set_audio_buffer_callback(soundEnabled ? onAudioBuffer : () => {})
    // bytes - a new emulator is created on cartridge load
  }, [soundEnabled, onAudioBuffer, bytes])

  // Main loop, runs on every display refresh while running
  useEffect(() => {
    const e = emulator.current
    if (!e || !running) {
      return
    }

    const pacer = new FramePacer(
      {
        cpuClockSpeed: wasmModule.get_cpu_clock_speed(),
        cyclesPerFrame: wasmModule.get_cycles_per_frame(),
      },
      () => audioPlayer.clock,
    )

    const loop = (timestamp: number) => {
      // 1. Find out how much emulation is owed since the previous refresh
      pacer.advance(timestamp)
      audioPlayer.speed = pacer.speed

      // 2. Run the owed frames, the emulator passes audio to the audio player meanwhile
      let frameExecuted = false
      while (pacer.isFrameDue()) {
        pacer.onFrameExecuted(e.run_frame())
        frameExecuted = true

        // 3. Audio ran dry (e.g. the page stalled) and restarted with a fresh lead, catching up
        //    the missed time would only add latency
        if (audioPlayer.takeUnderrun()) {
          pacer.skipCatchUp()
        }
      }

      // 4. Show the latest frame
      if (frameExecuted) {
        renderFrame(e, ctx)
      }
      frameId = window.requestAnimationFrame(loop)
    }
    let frameId = window.requestAnimationFrame(loop)

    return () => window.cancelAnimationFrame(frameId)
  }, [running, ctx, wasmModule])

  return null
}

export function Play() {
  const [zoom, setZoom] = useLocalStorage('zoom', DEFAULT_ZOOM)
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound_enabled', false)
  const [running, setRunning] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()
  const [rom, setRom] = useState<Rom | null>(null)

  const theme: Theme = { zoom }
  const wasmModule = useWasmModule()

  const onRunningToggle = () => {
    audioPlayer.warmup()
    setRunning((wasRunning) => {
      // on -> off
      if (wasRunning) {
        return false
      }

      // off -> on
      if (!wasRunning && rom) {
        return true
      }

      // off -> on without data => off
      return false
    })
  }

  // Just another null check
  const setRef = useCallback((ref: HTMLCanvasElement | null) => {
    if (!ref) {
      return
    }
    setCtx((prevCtx) => {
      if (prevCtx) {
        return prevCtx
      }
      const newCtx = ref.getContext('2d')
      if (!newCtx) {
        return prevCtx
      }
      return newCtx
    })
  }, [])

  const onCartridgeLoad = useCallback((loadedRom: Rom) => {
    setRunning(false)
    setRom(loadedRom)
  }, [])

  if (!wasmModule) {
    return <FullscreenLoader />
  }

  return (
    <div className="select-none">
      <InputContextProvider>
        <ThemeProvider theme={theme}>
          <div className="grid grid-cols-3 justify-between items-center mx-2 pt-2">
            <Backbutton />
            <Zoom zoom={zoom} onChange={setZoom} />
            <div className="justify-end">
              <FpsCounter />
            </div>
          </div>
          <GameBoy running={running} ref={setRef} />
          {ctx && (
            <DeviceHandler
              bytes={rom?.bytes}
              wasmModule={wasmModule}
              running={running}
              soundEnabled={soundEnabled}
              ctx={ctx}
            />
          )}

          <div className="mt-2 flex justify-center items-center text-xs">
            <button
              className="mx-2 border rounded-sm px-1 py-1"
              type="button"
              onClick={onRunningToggle}
            >
              {running ? 'Stop' : 'Run'}
            </button>

            <OpenButton className="mx-2 border rounded-sm px-1 py-1" onLoad={onCartridgeLoad}>
              Upload ROM
            </OpenButton>

            <label className="flex justify-center items-center" htmlFor="soundEnableCheckbox">
              <input
                id="soundEnableCheckbox"
                className="mr-1"
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.currentTarget.checked)}
              />
              Enable sound
            </label>
          </div>

          {rom?.custom && <div className="mt-2 flex justify-center text-xs">{rom.name}</div>}

          <div className="mt-2 flex justify-center text-xs">
            <Cartridges selectedName={rom?.name} onCartridgeLoad={onCartridgeLoad} />
          </div>

          <div className="mt-2 flex text-center justify-center text-xs">
            <div>
              <p>Select one of the available demos or upload your custom *.gb file and press Run</p>
              <p>
                The test ROMs are available in{' '}
                <Link className="underline" to="/debug">
                  debug mode
                </Link>
                . You can see the test results{' '}
                <Link className="underline" to="/test-results">
                  here
                </Link>
                .
              </p>
            </div>
          </div>
        </ThemeProvider>
      </InputContextProvider>
    </div>
  )
}

export default Play

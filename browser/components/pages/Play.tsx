import { ThemeProvider } from 'styled-components'
import { useLocalStorage } from '@rehooks/local-storage'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { GameBoy, DISPLAY_HEIGHT, DISPLAY_WIDTH } from '../gameboy/GameBoy'
import { Zoom } from '../gameboy/Zoom'

import { Rom, Theme } from '../../types'
import { Backbutton } from '../play/BackButton'
import { Cartridges } from '../play/Cartridges'
import { OpenButton } from '../play/UploadButton'
import { useWasmModule, WasmModule } from '../../hooks/useWasmModule'
import { useInputHandler } from '../../hooks/useInputHandler'
import { FullscreenLoader } from '../common/FullscreenLoader'
import { range } from '../../utils/std'
import { memory } from '../../../gb-web/pkg/index_bg.wasm'
import { WebEmulator } from '../../../gb-web/pkg'
import { InputContextProvider } from '../../context/InputContext'
import { FpsCounter } from '../play/FpsCounter'

const DEFAULT_ZOOM = 1.5

const INITIAL_DISPLAY_COLOR = '#6D7C00'

type Props = {
  wasmModule: WasmModule
  ctx: CanvasRenderingContext2D
  bytes?: Uint8Array
  running: boolean
  soundEnabled: boolean
}

const audioContext = new AudioContext({
  sampleRate: 44100
})

function renderFrame(emulator: WebEmulator, ctx: CanvasRenderingContext2D) {
  const canvasDataPointer = emulator.get_canvas_data_pointer()
  const imageData = ctx.createImageData(DISPLAY_WIDTH, DISPLAY_HEIGHT)

  const canvasData = new Uint8Array(
    memory.buffer,
    canvasDataPointer,
    DISPLAY_WIDTH * DISPLAY_HEIGHT * 3
  )

  range(0, DISPLAY_HEIGHT).forEach((y) => {
    range(0, DISPLAY_WIDTH).forEach((x) => {
      const source_offset = (y * DISPLAY_WIDTH + x) * 3
      const target_offset = (y * DISPLAY_WIDTH + x) * 4

      imageData.data[target_offset] = canvasData[source_offset]
      imageData.data[target_offset + 1] = canvasData[source_offset + 1]
      imageData.data[target_offset + 2] = canvasData[source_offset + 2]
      imageData.data[target_offset + 3] = 255 // alpha
    })
  })
  ctx.putImageData(imageData, 0, 0)
}

function initScreen(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = INITIAL_DISPLAY_COLOR
  ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT)
}

const CHANNELS_COUNT = 2

// Helper component so we don't have to deal with nullable values in parent components
function DeviceHandler(props: Props) {
  const { bytes, wasmModule, running, ctx, soundEnabled } = props
  const emulator = useRef<WebEmulator>()
  const currentAudioSeconds = useRef(0)
  const loopId = useRef(0)
  const registerInputs = useInputHandler()

  // Init screen color
  useEffect(() => {
    initScreen(ctx)
  }, [ctx])

  const onAudioBufferCallback = useCallback((bufferPtr: number) => {
    const BUFFER_SIZE = wasmModule.get_audio_buffer_size()

    const audioData = new Float32Array(memory.buffer, bufferPtr, BUFFER_SIZE)

    const frameCount = audioData.length / CHANNELS_COUNT
    const audioBuffer = audioContext.createBuffer(
      CHANNELS_COUNT,
      frameCount,
      audioContext.sampleRate
    )
    for (let channel = 0; channel < CHANNELS_COUNT; channel++) {
      let nowBuffering = audioBuffer.getChannelData(channel)
      for (let i = 0; i < frameCount; i++) {
        // audio data frames are interleaved
        nowBuffering[i] = audioData[i * CHANNELS_COUNT + channel]
      }
    }
    const audioSource = audioContext.createBufferSource()
    audioSource.buffer = audioBuffer
    audioSource.connect(audioContext.destination)

    // taken from here https://github.com/Powerlated/OptimeGB/blob/master/src/core/audioplayer.ts#L91-L94
    // TODO after some time, the game gets audio delay
    // Reset time if close to buffer underrun
    if (currentAudioSeconds.current <= audioContext.currentTime + 0.02) {
      currentAudioSeconds.current = audioContext.currentTime + 0.06
    }
    audioSource.start(currentAudioSeconds.current)
    currentAudioSeconds.current +=
      BUFFER_SIZE / CHANNELS_COUNT / audioContext.sampleRate
  }, [])

  // Create emulator on cartridge load
  useEffect(() => {
    if (!bytes) {
      return
    }

    const cartridge = new wasmModule.WebCartridge(bytes)
    currentAudioSeconds.current = 0
    emulator.current = new wasmModule.WebEmulator(cartridge, () => {})
    initScreen(ctx)

    registerInputs(emulator.current)
  }, [bytes, wasmModule, registerInputs])

  useEffect(() => {
    const e = emulator.current
    if (!e) {
      return
    }

    e.set_audio_buffer_callback(soundEnabled ? onAudioBufferCallback : () => {})
  }, [emulator.current, soundEnabled, onAudioBufferCallback])

  // Handle stop/start
  useEffect(() => {
    const e = emulator.current
    if (!e) {
      return
    }

    if (running) {
      const loop = () => {
        e.run_frame()
        renderFrame(e, ctx)
        loopId.current = window.requestAnimationFrame(loop)
      }
      loop()
    } else {
      window.cancelAnimationFrame(loopId.current)
    }
  }, [running])

  return null
}

export function Play() {
  const [zoom, setZoom] = useLocalStorage('zoom', DEFAULT_ZOOM)
  const [soundEnabled, setSoundEnabled] = useLocalStorage(
    'sound_enabled',
    false
  )
  const [running, setRunning] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()
  const [rom, setRom] = useState<Rom | null>(null)

  const theme: Theme = { zoom }
  const wasmModule = useWasmModule()

  const onRunningToggle = () => {
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
      return null
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

  const onCartridgeLoad = (rom: Rom) => {
    setRunning(false)
    setRom(rom)
  }

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
              className="mx-2 border rounded px-1 py-1"
              onClick={onRunningToggle}>
              {running ? 'Stop' : 'Run'}
            </button>

            <OpenButton
              className="mx-2 border rounded px-1 py-1"
              onLoad={onCartridgeLoad}>
              Upload ROM
            </OpenButton>

            <label className="flex justify-center items-center">
              <input
                className="mr-1"
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.currentTarget.checked)}
              />
              Enable sound
            </label>
          </div>

          {rom?.custom && (
            <div className="mt-2 flex justify-center text-xs">{rom.name}</div>
          )}

          <div className="mt-2 flex justify-center text-xs">
            <Cartridges
              selectedName={rom?.name}
              onCartridgeLoad={onCartridgeLoad}
            />
          </div>

          <div className="mt-2 flex text-center justify-center text-xs">
            <div>
              <p>
                Select one of available demos or upload your custom *.gb file
                and press Run
              </p>
              <p>
                Test ROMs are available in{' '}
                <Link className="underline" to="/debug">
                  debug mode
                </Link>{' '}
                or see{' '}
                <Link className="underline" to="/test-results">
                  the test results
                </Link>
              </p>
            </div>
          </div>
        </ThemeProvider>
      </InputContextProvider>
    </div>
  )
}

export default Play

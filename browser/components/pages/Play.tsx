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

const DEFAULT_ZOOM = 1.5

const INITIAL_DISPLAY_COLOR = '#6D7C00'

type Props = {
  wasmModule: WasmModule
  ctx: CanvasRenderingContext2D
  bytes?: Uint8Array
  running: boolean
}

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

// Helper component so we don't have to deal with nullable values in parent components
function DeviceHandler(props: Props) {
  const { bytes, wasmModule, running, ctx } = props
  const emulator = useRef<WebEmulator>()
  const loopId = useRef(0)
  const registerInputs = useInputHandler()

  // Init screen color
  useEffect(() => {
    initScreen(ctx)
  }, [ctx])

  // Create emulator on cartridge load
  useEffect(() => {
    if (!bytes) {
      return
    }
    const cartridge = new wasmModule.WebCartridge(bytes)
    emulator.current = new wasmModule.WebEmulator(cartridge)
    initScreen(ctx)

    const cleanup = registerInputs(emulator.current)
    return cleanup
  }, [bytes, wasmModule, registerInputs])

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
    <InputContextProvider>
      <ThemeProvider theme={theme}>
        <Backbutton />
        <Zoom zoom={zoom} onChange={setZoom} />
        <GameBoy running={running} ref={setRef} />
        {ctx && (
          <DeviceHandler
            bytes={rom?.bytes}
            wasmModule={wasmModule}
            running={running}
            ctx={ctx}
          />
        )}

        <div className="mt-2 flex justify-center text-xs">
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
              Select one of available demos or upload your custom *.gb file and
              press Run
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
  )
}

export default Play

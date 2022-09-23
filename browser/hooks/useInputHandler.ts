import { useCallback, useContext, useEffect, useRef } from 'react'

import { JsKeys, WebEmulator } from '../../gb-web/pkg'
import { InputContext } from '../context/InputContext'

const keysMap: { [key in string]: JsKeys } = {
  ArrowDown: JsKeys.ArrowDown,
  ArrowUp: JsKeys.ArrowUp,
  ArrowLeft: JsKeys.ArrowLeft,
  ArrowRight: JsKeys.ArrowRight,
  // AWSD
  KeyD: JsKeys.ArrowRight,
  KeyA: JsKeys.ArrowLeft,
  KeyW: JsKeys.ArrowUp,
  KeyS: JsKeys.ArrowDown,

  KeyJ: JsKeys.A,
  KeyX: JsKeys.A,
  KeyK: JsKeys.B,
  KeyC: JsKeys.B,
  KeyB: JsKeys.Start,
  KeyN: JsKeys.Select
}

/**
 * Hook for binding keys to current instance of emulator
 */
export function useInputHandler() {
  const { onKeyDown, onKeyUp, input } = useContext(InputContext)
  const emulatorRef = useRef<WebEmulator | null>()

  // Propagate collected inputs to emulator
  useEffect(() => {
    Object.values(keysMap).forEach((key) => {
      if (input.includes(key)) {
        emulatorRef.current?.on_key_down(key)
      } else {
        emulatorRef.current?.on_key_up(key)
      }
    })
  }, [input])

  // Store pressed keyboard keys to context
  useEffect(() => {
    const onWindowKeyDown = (event: KeyboardEvent) => {
      const key = keysMap[event.code]
      if (key !== undefined) {
        onKeyDown(key)
      }
    }

    const onWindowKeyUp = (event: KeyboardEvent) => {
      const key = keysMap[event.code]
      if (key !== undefined) {
        onKeyUp(key)
      }
    }

    window.addEventListener('keydown', onWindowKeyDown)
    window.addEventListener('keyup', onWindowKeyUp)

    return () => {
      window.removeEventListener('keydown', onWindowKeyDown)
      window.removeEventListener('keyup', onWindowKeyUp)
    }
  }, [])

  const register = useCallback((emulator: WebEmulator) => {
    emulatorRef.current = emulator
  }, [])

  return register
}

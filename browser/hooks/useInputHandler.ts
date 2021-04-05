import { useCallback, useContext } from 'react'
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
  const { onKeyDown, onKeyUp } = useContext(InputContext)

  const register = useCallback((emulator: WebEmulator) => {
    const onWindowKeyDown = (event: KeyboardEvent) => {
      const key = keysMap[event.code]
      if (key !== undefined) {
        emulator.on_key_down(key)
        onKeyDown(key)
      }
    }

    const onWindowKeyUp = (event: KeyboardEvent) => {
      const key = keysMap[event.code]
      if (key !== undefined) {
        emulator.on_key_up(key)
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

  return register
}

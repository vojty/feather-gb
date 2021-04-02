import { useCallback, useContext } from 'react'
import { JSKeys, WebEmulator } from '../../gb-web/pkg'
import { InputContext } from '../context/InputContext'

const keysMap: { [key in string]: JSKeys } = {
  ArrowDown: JSKeys.ArrowDown,
  ArrowUp: JSKeys.ArrowUp,
  ArrowLeft: JSKeys.ArrowLeft,
  ArrowRight: JSKeys.ArrowRight,
  // AWSD
  KeyD: JSKeys.ArrowRight,
  KeyA: JSKeys.ArrowLeft,
  KeyW: JSKeys.ArrowUp,
  KeyS: JSKeys.ArrowDown,

  KeyJ: JSKeys.A,
  KeyX: JSKeys.A,
  KeyK: JSKeys.B,
  KeyC: JSKeys.B,
  KeyB: JSKeys.Start,
  KeyN: JSKeys.Select
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

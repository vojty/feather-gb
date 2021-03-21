import { useEffect, useState } from 'react'
import type { WebEmulator, WebCartridge } from '../../gb-web/pkg/index'

export type WasmModule = {
  WebEmulator: typeof WebEmulator
  WebCartridge: typeof WebCartridge
}

export function useWasmModule() {
  const [wasmModule, setWasmModule] = useState<WasmModule | null>(null)

  useEffect(() => {
    import('../../gb-web/pkg/index')
      .then((wasm) => {
        wasm.init()
        setWasmModule({
          WebEmulator: wasm.WebEmulator,
          WebCartridge: wasm.WebCartridge
        })
      })
      .catch(console.error)
  }, [])

  return wasmModule
}

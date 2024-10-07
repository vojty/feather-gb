import { useEffect, useState } from 'react'

import type * as Module from '../../gb-web/pkg'

export type WasmModule = typeof Module

export function useWasmModule() {
  const [wasmModule, setWasmModule] = useState<WasmModule | null>(null)

  useEffect(() => {
    import('../../gb-web/pkg')
      .then((wasm) => {
        wasm.init()
        setWasmModule(wasm)
      })
      .catch(console.error)
  }, [])

  return wasmModule
}

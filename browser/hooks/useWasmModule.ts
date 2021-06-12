import { useEffect, useState } from 'react'
import * as Module from '../../gb-web/pkg/index'

export type WasmModule = typeof Module

export function useWasmModule() {
  const [wasmModule, setWasmModule] = useState<WasmModule | null>(null)

  useEffect(() => {
    import('../../gb-web/pkg/index')
      .then((wasm) => {
        wasm.init()
        setWasmModule(wasm)
      })
      .catch(console.error)
  }, [])

  return wasmModule
}

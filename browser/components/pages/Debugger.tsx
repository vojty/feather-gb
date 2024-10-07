import { useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import type { WebHandle } from '../../../debugger-web/pkg'
import { roms } from '../../romsList'

const CANVAS_ID = 'debugger'

const Canvas = styled.canvas`
  margin-right: auto;
  margin-left: auto;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

/* Egui specific */
const GlobalStyle = createGlobalStyle`
  body {
    /* Background color for what is not covered by the egui canvas,
    or where the egui canvas is translucent. */
    background: #404040;
  }
  html {
    /* Remove touch delay: */
    touch-action: manipulation;
  }
  /* Allow canvas to fill entire web page: */
  html,
  body {
      overflow: hidden;
      margin: 0 !important;
      padding: 0 !important;
  }
`

export function Debugger() {
  useEffect(() => {
    let appHandler: WebHandle | null = null
    const loadDebugger = async () => {
      try {
        const app = await import('../../../debugger-web/pkg')
        const canvas = document.getElementById(CANVAS_ID)
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
          throw new Error('Canvas not found')
        }
        appHandler = await app.start(canvas, roms)
      } catch (error) {
        console.error(error)
      }
    }

    loadDebugger()

    return () => {
      appHandler?.stop_web()
      appHandler?.free()
    }
  }, [])

  return (
    <>
      <GlobalStyle />
      <Canvas id={CANVAS_ID} />
    </>
  )
}

export default Debugger

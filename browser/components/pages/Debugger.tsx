import { useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { roms } from '../../romsList'

const CANVAS_ID = 'debugger'

const Canvas = styled.canvas`
  margin-right: auto;
  margin-left: auto;
  display: block;
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
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
    import('../../../debugger-web/pkg/index')
      .then((app) => {
        app.start(CANVAS_ID, roms)
      })
      .catch(console.error)
  }, [])

  return (
    <>
      <GlobalStyle />
      <Canvas id={CANVAS_ID} />
    </>
  )
}

export default Debugger

import { Link } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { useLocalStorage } from '@rehooks/local-storage'

import { GameBoy } from './gameboy/GameBoy'
import { Zoom } from './gameboy/Zoom'

import { Theme } from '../types'
import { Backbutton } from './BackButton'

const DEFAULT_ZOOM = 1.5

export function Standalone() {
  const [zoom, setZoom] = useLocalStorage('zoom', DEFAULT_ZOOM)
  const theme: Theme = { zoom }

  return (
    <ThemeProvider theme={theme}>
      <Backbutton />
      <Zoom zoom={zoom} onChange={setZoom} />
      <GameBoy />

      <p className="mt-2 text-center">
        Work in progress, you can use{' '}
        <Link className="underline" to="/debug">
          debugger
        </Link>{' '}
        with preloaded ROMs for now.
      </p>
    </ThemeProvider>
  )
}

export default Standalone

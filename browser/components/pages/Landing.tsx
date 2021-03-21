import { Link } from 'react-router-dom'
import styled from 'styled-components'

import GameboyLogo from '../../assets/images/gameboy.svg'
import Feather from '../../assets/images/feather.svg'

const Nintendo = styled.span`
  font-size: 30px;
`

const GameBoy = styled.span`
  font-size: 56px;
`

const Section = styled(Link)`
  font-size: 2em;

  &:hover {
    text-decoration: underline;
  }
`

export function Landing() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Feather className="mb-20" height={50} width={50} />
      <div className="flex items-baseline">
        <span className="text-xl mr-3">Just another</span>
        <Nintendo className="font-pretendo mr-2">Nintendo</Nintendo>
        <GameBoy className="font-gills-sans font-bold italic">
          GAME&nbsp;BOY
        </GameBoy>
        <span className="text-xl ml-3">emulator</span>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4 items-center">
        <Section className="text-right" to="/play">
          Play
        </Section>
        <GameboyLogo height={100} />
        <Section className="text-left" to="/debug">
          Debug
        </Section>
      </div>
    </div>
  )
}

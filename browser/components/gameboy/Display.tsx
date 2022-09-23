import { ReactNode } from 'react'

import { Styled } from './GameBoy.styled'

type Props = {
  children: ReactNode
  enabled?: boolean
}

export function Display(props: Props) {
  return (
    <Styled.Display>
      <Styled.DisplayTop>
        <Styled.DisplayLine width="25%" />
        <Styled.DisplayHeaderText>DOT MATRIX WITH STEREO SOUND</Styled.DisplayHeaderText>
        <Styled.DisplayLine width="12%" />
      </Styled.DisplayTop>

      <Styled.DisplayContent>
        <Styled.Battery>
          <Styled.BatteryIndicator enabled={props.enabled} />
          BATTERY
        </Styled.Battery>

        <Styled.Screen>
          {props.children}
          <Styled.ScreenOverlay />
        </Styled.Screen>
      </Styled.DisplayContent>
    </Styled.Display>
  )
}

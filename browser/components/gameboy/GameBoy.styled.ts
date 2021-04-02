import styled, { css, ThemedStyledProps } from 'styled-components'

import { Theme } from '../../types'

const SCREEN_PADDING_LEFT = 45
const SCREEN_PADDING_TOP = 23

const BATTERY_FONT_SIZE = 6
const INDICATOR_SIZE = 9
const GAMEBOY_TEXT_SIZE = 20
const NINTENDO_TEXT_SIZE = 13
const AB_SIZE = 36
const BUTTONS_ROTATE_ANGLE = 25
const ARROW_SIZE = 26

const TEXT_COLOR = '#393C81'
const AB_COLOR = '#8A205E'

function zoom<P, T extends Theme>(value: number) {
  return (props: ThemedStyledProps<P, T>) => `${props.theme.zoom * value}px`
}

function activeButtonEffect() {
  return css`
    filter: brightness(80%);
  `
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`

const Device = styled.div`
  display: inline-block;
  margin: 10px;
  background: #eee;
  border-radius: 10px 10px 60px 10px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: ${zoom(20)};
  color: ${TEXT_COLOR};
  position: relative;
`

const Display = styled.div`
  background-color: #777;
  border-radius: ${zoom(7)} ${zoom(7)} ${zoom(40)} ${zoom(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`

const DisplayTop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${zoom(SCREEN_PADDING_TOP)};
  font-size: ${zoom(BATTERY_FONT_SIZE)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${zoom(8)} 0;
`

const DisplayHeaderText = styled.div`
  flex: 0 0 auto;
  margin: 0 ${zoom(5)};
`

const DisplayContent = styled.div`
  display: flex;
  margin-right: ${zoom(SCREEN_PADDING_LEFT)};
  padding-bottom: ${zoom(SCREEN_PADDING_TOP)};
`

const DisplayLine = styled.div<{ width: string }>`
  flex: 1 1 ${(props) => props.width};
  height: ${zoom(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${zoom(2 * 3)} 0 #283593;
  margin-top: -${zoom(2 * 3)};
`

const Screen = styled.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
`

const ScreenOverlay = styled.div`
  position: absolute;
  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const BatteryIndicator = styled.div<{ enabled?: boolean }>`
  background-color: ${(props) => (props.enabled ? `#f00` : '#000')};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${zoom(INDICATOR_SIZE)};
  width: ${zoom(INDICATOR_SIZE)};
  border-radius: ${(props) => (props.theme.zoom * INDICATOR_SIZE) / 2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`

const Battery = styled.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${zoom(SCREEN_PADDING_LEFT)};
  font-size: ${zoom(BATTERY_FONT_SIZE)};
  margin-bottom: 80px;
`

const NintendoText = styled.div`
  letter-spacing: 1px;
  font-size: ${zoom(NINTENDO_TEXT_SIZE)};
`

const GameBoyText = styled.div`
  margin-left: ${zoom(2)};
  font-size: ${zoom(GAMEBOY_TEXT_SIZE)};
`

const TradeMarkText = styled.div`
  font-size: ${zoom(6)};
`

const CircleButton = styled.div<{ $pressed: boolean }>`
  background-color: ${AB_COLOR};
  height: ${zoom(AB_SIZE)};
  width: ${zoom(AB_SIZE)};
  border-radius: ${zoom(AB_SIZE / 2)};

  ${(props) => props.$pressed && activeButtonEffect()}
`

const CircleButtonWrapper = styled.div`
  position: relative;
`

const BaseButton = styled.div`
  font-size: ${zoom(12)};
  letter-spacing: ${zoom(1)};
`

const ButtonText = styled(BaseButton)<{ $spacing: number }>`
  margin-top: ${(props) => zoom(props.$spacing)};
`

const ButtonsAB = styled.div`
  display: inline-flex;
  margin-top: ${zoom(10)};
  margin-right: -${zoom(12)};
  transform: rotate(-${BUTTONS_ROTATE_ANGLE}deg);
  padding: ${zoom(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${zoom(AB_SIZE)};

  > * + * {
    margin-left: ${zoom(18)};
  }

  ${ButtonText} {
    bottom: -${zoom(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`

const WideButtonContainer = styled.div`
  transform: rotate(-${BUTTONS_ROTATE_ANGLE}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

const WideButtonWrapper = styled.div`
  border-radius: ${zoom((9 + 2 * 5) / 2)};
  background-color: #dfdfdf;
  padding: ${zoom(5)};
`

const WideButton = styled.div<{ $pressed: boolean }>`
  background-color: #868a8d;
  width: ${zoom(38)};
  height: ${zoom(9)};
  border-radius: ${zoom(9 / 2)};
  ${(props) => props.$pressed && activeButtonEffect()}
`

const ButtonsStartSelect = styled.div`
  display: flex;
  margin-left: ${zoom(80)};
  margin-top: ${zoom(30)};
  margin-bottom: ${zoom(40)};
  ${WideButtonContainer} + ${WideButtonContainer} {
    margin-left: ${zoom(7)};
  }
`

const Arrows = styled.div``

export enum ArrowOrientation {
  HORIZONTAL,
  VERTICAL
}

const ArrowsLine = styled.div`
  display: flex;
  justify-content: center;
`

const ArrowStripe = styled.div`
  width: ${zoom(2)};
  height: 80%;
  background-color: #353535;
  margin: ${zoom(2)};
  border-radius: ${zoom(5)};
`

const BaseArrow = styled.div`
  position: relative;
  height: ${zoom(ARROW_SIZE)};
  width: ${zoom(ARROW_SIZE)};
  background-color: #1b1d1d;
`

const BaseFunctionArrow = styled(BaseArrow)<{
  $orientation: ArrowOrientation
  $pressed: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${(props) =>
    props.$orientation === ArrowOrientation.VERTICAL ? 'row' : 'column'};

  ${ArrowStripe} {
    ${(props) => props.$pressed && activeButtonEffect()}

    ${(props) =>
      props.$orientation === ArrowOrientation.VERTICAL
        ? css`
            width: ${zoom(3)};
            height: 60%;
          `
        : css`
            height: ${zoom(3)};
            width: 60%;
          `};
  }
`

const ArrowLeft = styled(BaseFunctionArrow)`
  border-radius: ${zoom(5)} 0 0 ${zoom(5)};
`
const ArrowUp = styled(BaseFunctionArrow)`
  border-radius: ${zoom(5)} ${zoom(5)} 0 0;
`
const ArrowRight = styled(BaseFunctionArrow)`
  border-radius: 0 ${zoom(5)} ${zoom(5)} 0;
`
const ArrowDown = styled(BaseFunctionArrow)`
  border-radius: 0 0 ${zoom(5)} ${zoom(5)};
`
const ArrowCenter = styled(BaseArrow)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${zoom(ARROW_SIZE - 7)};
    width: ${zoom(ARROW_SIZE - 7)};
    background-color: #353535;
    border-radius: 100%;
  }
`

const Controls = styled.div`
  display: flex;
  margin-top: ${zoom(35)};
`

const Speaker = styled.div`
  height: ${zoom(48)};
  width: ${zoom(5)};
  background-color: #a7a49f;
  border-radius: ${zoom(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`

const Speakers = styled.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${zoom(19)};
  right: ${zoom(15)};

  ${Speaker} + ${Speaker} {
    margin-left: ${zoom(8)};
  }
`

export const Styled = {
  Wrapper,
  Device,
  Display,
  DisplayTop,
  DisplayHeaderText,
  DisplayContent,
  DisplayLine,
  Screen,
  ScreenOverlay,
  Battery,
  BatteryIndicator,
  NintendoText,
  GameBoyText,
  TradeMarkText,
  Controls,
  ButtonsAB,
  CircleButtonWrapper,
  CircleButton,
  ButtonText,
  ButtonsStartSelect,
  WideButton,
  WideButtonWrapper,
  WideButtonContainer,
  Arrows,
  ArrowsLine,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowCenter,
  ArrowStripe,
  Speakers,
  Speaker
}

import { type ForwardedRef, forwardRef } from 'react'

import { JsKeys } from '../../../gb-web/pkg'
import { useInput } from '../../hooks/useInput'
import { useTheme } from '../../hooks/useTheme'
import { Display } from './Display'
import { ArrowOrientation, Styled } from './GameBoy.styled'

export const DISPLAY_WIDTH = 160
export const DISPLAY_HEIGHT = 144

function GameBoyComponent(
  { running }: { running: boolean },
  ref: ForwardedRef<HTMLCanvasElement | null>,
) {
  const { zoom } = useTheme()
  const { input, onKeyDown, onKeyUp } = useInput()

  const pressedA = input.includes(JsKeys.A)
  const pressedB = input.includes(JsKeys.B)
  const pressedStart = input.includes(JsKeys.Start)
  const pressedSelect = input.includes(JsKeys.Select)
  const pressedLeft = input.includes(JsKeys.ArrowLeft)
  const pressedRight = input.includes(JsKeys.ArrowRight)
  const pressedUp = input.includes(JsKeys.ArrowUp)
  const pressedDown = input.includes(JsKeys.ArrowDown)

  // The whole styling is kinda ugly and pixel-perfect but I don't care, I love it https://www.youtube.com/watch?v=UxxajLWwzqY
  return (
    <Styled.Wrapper>
      <Styled.Device>
        <Display enabled={running}>
          <canvas
            ref={ref}
            style={{
              display: 'block', // prevents wierd margin
              imageRendering: 'pixelated',
              zoom,
            }}
            height={DISPLAY_HEIGHT}
            width={DISPLAY_WIDTH}
          />
        </Display>

        <div className="flex items-baseline">
          <Styled.NintendoText className="font-pretendo">
            Nintendo
          </Styled.NintendoText>
          <Styled.GameBoyText className="font-gills-sans font-medium italic">
            GAME&nbsp;BOY
          </Styled.GameBoyText>
          <Styled.TradeMarkText className="font-bold">TM</Styled.TradeMarkText>
        </div>

        <Styled.Controls>
          <Styled.Arrows>
            <Styled.ArrowsLine>
              <Styled.ArrowUp
                // TODO memoize?
                onPointerDown={() => onKeyDown(JsKeys.ArrowUp)}
                onPointerUp={() => onKeyUp(JsKeys.ArrowUp)}
                $orientation={ArrowOrientation.HORIZONTAL}
                $pressed={pressedUp}
              >
                <Styled.ArrowStripe />
                <Styled.ArrowStripe />
                <Styled.ArrowStripe />
              </Styled.ArrowUp>
            </Styled.ArrowsLine>
            <Styled.ArrowsLine>
              <Styled.ArrowLeft
                onPointerDown={() => onKeyDown(JsKeys.ArrowLeft)}
                onPointerUp={() => onKeyUp(JsKeys.ArrowLeft)}
                $orientation={ArrowOrientation.VERTICAL}
                $pressed={pressedLeft}
              >
                <Styled.ArrowStripe />
                <Styled.ArrowStripe />
                <Styled.ArrowStripe />
              </Styled.ArrowLeft>
              <Styled.ArrowCenter />
              <Styled.ArrowRight
                onPointerDown={() => onKeyDown(JsKeys.ArrowRight)}
                onPointerUp={() => onKeyUp(JsKeys.ArrowRight)}
                $orientation={ArrowOrientation.VERTICAL}
                $pressed={pressedRight}
              >
                <Styled.ArrowStripe />
                <Styled.ArrowStripe />
                <Styled.ArrowStripe />
              </Styled.ArrowRight>
            </Styled.ArrowsLine>
            <Styled.ArrowsLine>
              <Styled.ArrowDown
                onPointerDown={() => onKeyDown(JsKeys.ArrowDown)}
                onPointerUp={() => onKeyUp(JsKeys.ArrowDown)}
                $orientation={ArrowOrientation.HORIZONTAL}
                $pressed={pressedDown}
              >
                <Styled.ArrowStripe />
                <Styled.ArrowStripe />
                <Styled.ArrowStripe />
              </Styled.ArrowDown>
            </Styled.ArrowsLine>
          </Styled.Arrows>

          <div className="ml-auto">
            <Styled.ButtonsAB className=" font-nes">
              <Styled.CircleButtonWrapper>
                <Styled.CircleButton
                  onPointerDown={() => onKeyDown(JsKeys.B)}
                  onPointerUp={() => onKeyUp(JsKeys.B)}
                  $pressed={pressedB}
                />
                <Styled.ButtonText $spacing={10}>B</Styled.ButtonText>
              </Styled.CircleButtonWrapper>

              <Styled.CircleButtonWrapper>
                <Styled.CircleButton
                  onPointerDown={() => onKeyDown(JsKeys.A)}
                  onPointerUp={() => onKeyUp(JsKeys.A)}
                  $pressed={pressedA}
                />
                <Styled.ButtonText $spacing={10}>A</Styled.ButtonText>
              </Styled.CircleButtonWrapper>
            </Styled.ButtonsAB>
          </div>
        </Styled.Controls>

        <Styled.ButtonsStartSelect className="font-nes">
          <Styled.WideButtonContainer>
            <Styled.WideButtonWrapper>
              <Styled.WideButton
                onPointerDown={() => onKeyDown(JsKeys.Select)}
                onPointerUp={() => onKeyUp(JsKeys.Select)}
                $pressed={pressedSelect}
              />
            </Styled.WideButtonWrapper>
            <Styled.ButtonText $spacing={1}>SELECT</Styled.ButtonText>
          </Styled.WideButtonContainer>
          <Styled.WideButtonContainer>
            <Styled.WideButtonWrapper>
              <Styled.WideButton
                onPointerDown={() => onKeyDown(JsKeys.Start)}
                onPointerUp={() => onKeyUp(JsKeys.Start)}
                $pressed={pressedStart}
              />
            </Styled.WideButtonWrapper>
            <Styled.ButtonText $spacing={1}>START</Styled.ButtonText>
          </Styled.WideButtonContainer>
        </Styled.ButtonsStartSelect>

        <Styled.Speakers>
          <Styled.Speaker />
          <Styled.Speaker />
          <Styled.Speaker />
          <Styled.Speaker />
          <Styled.Speaker />
          <Styled.Speaker />
        </Styled.Speakers>
      </Styled.Device>
    </Styled.Wrapper>
  )
}

export const GameBoy = forwardRef(GameBoyComponent)

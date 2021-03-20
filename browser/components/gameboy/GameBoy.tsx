import { useEffect, useRef } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { Display } from './Display'
import { Styled } from './GameBoy.styled'

const DISPLAY_WIDTH = 160
const DISPLAY_HEIGHT = 144

const INITIAL_DISPLAY_COLOR = '#6D7C00'

export function GameBoy() {
  const { zoom } = useTheme()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) {
      return
    }
    const ctx = el.getContext('2d')
    if (!ctx) {
      return
    }
    ctx.fillStyle = INITIAL_DISPLAY_COLOR
    ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT)
  }, [])

  // The whole styling is kinda ugly and pixel-perfect but I don't care, I love it https://www.youtube.com/watch?v=UxxajLWwzqY
  return (
    <Styled.Wrapper>
      <Styled.Device>
        <Display enabled={false}>
          <canvas
            ref={canvasRef}
            style={{
              display: 'block', // prevents wierd margin
              imageRendering: 'pixelated',
              zoom
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
              <Styled.ArrowUp />
            </Styled.ArrowsLine>
            <Styled.ArrowsLine>
              <Styled.ArrowLeft />
              <Styled.ArrowCenter />
              <Styled.ArrowRight />
            </Styled.ArrowsLine>
            <Styled.ArrowsLine>
              <Styled.ArrowDown />
            </Styled.ArrowsLine>
          </Styled.Arrows>

          <div className="ml-auto">
            <Styled.ButtonsAB className=" font-nes">
              <Styled.CircleButton>
                <Styled.ButtonText $spacing={10}>B</Styled.ButtonText>
              </Styled.CircleButton>

              <Styled.CircleButton>
                <Styled.ButtonText $spacing={10}>A</Styled.ButtonText>
              </Styled.CircleButton>
            </Styled.ButtonsAB>
          </div>
        </Styled.Controls>

        <Styled.ButtonsStartSelect className="font-nes">
          <Styled.WideButtonContainer>
            <Styled.WideButton />
            <Styled.ButtonText $spacing={1}>SELECT</Styled.ButtonText>
          </Styled.WideButtonContainer>
          <Styled.WideButtonContainer>
            <Styled.WideButton />
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

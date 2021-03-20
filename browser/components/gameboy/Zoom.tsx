import styled from 'styled-components'

type Props = {
  zoom: number
  onChange: (zoom: number) => void
}

const FONT_SIZE = '14px'

const Styled = {
  Icon: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,
  Wrapper: styled.div`
    font-size: ${FONT_SIZE};
    margin: 5px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  Value: styled.div`
    margin: 0 5px;
  `
}

export function Zoom(props: Props) {
  const { zoom, onChange } = props

  return (
    <Styled.Wrapper>
      <Styled.Icon>
        <div
          style={{ fontSize: FONT_SIZE }}
          onClick={() => onChange(Math.max(1, zoom - 0.5))}>
          -
        </div>
      </Styled.Icon>
      <Styled.Value>Zoom: {zoom.toFixed(1)}</Styled.Value>
      <Styled.Icon>
        <div
          style={{ fontSize: FONT_SIZE }}
          onClick={() => onChange(Math.min(zoom + 0.5, 5))}>
          +
        </div>
      </Styled.Icon>
    </Styled.Wrapper>
  )
}

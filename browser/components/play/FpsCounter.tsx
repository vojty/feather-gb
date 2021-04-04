import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const FONT_SIZE = 12

const CANVAS_HEIGHT = 20
const CANVAS_WIDTH = 30

const SAMPLES_COUNT = 64

const Container = styled.span`
  font-size: ${FONT_SIZE}px;
`

const Canvas = styled.canvas`
  display: inline-block;
`

const times: number[] = []

export function FpsCounter() {
  const lastTime = useRef(window.performance.now())
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loopId = useRef(0)

  useEffect(() => {
    function loop() {
      loopId.current = window.requestAnimationFrame(() => {
        const now = window.performance.now()
        const diff = now - lastTime.current
        lastTime.current = now
        const currentFps = Math.round(1000 / diff)

        times.push(currentFps)
        if (times.length > SAMPLES_COUNT) {
          times.shift()
        }

        const fps = Math.round(times.reduce((a, b) => a + b) / times.length)
        const context = canvasRef.current?.getContext('2d')
        if (context) {
          context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
          context.textBaseline = 'middle'
          context.font = `12px Arial`
          context.fillText(fps.toString(), 1, CANVAS_HEIGHT / 2 + 1)
        }

        loop()
      })
    }

    loop()

    return () => window.cancelAnimationFrame(loopId.current)
  }, [])

  return (
    <Container className="flex items-center justify-end">
      Average FPS:{' '}
      <Canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} />
    </Container>
  )
}

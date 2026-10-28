import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

const WIDTH = 480
const HEIGHT = 310
const createBricks = () => Array.from({ length: 32 }, (_, index) => ({ x: 22 + (index % 8) * 56, y: 28 + Math.floor(index / 8) * 24, alive: true }))

export default function BrickbreakerGame({ onCreditDelta }: { onCreditDelta: (delta: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paddle = useRef(200)
  const ball = useRef({ x: 240, y: 245, dx: 3, dy: -3 })
  const bricks = useRef(createBricks())
  const keys = useRef({ left: false, right: false })
  const won = useRef(false)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [message, setMessage] = useState('Focus the game, press Start, and steer with arrows or A/D.')

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let frame = 0

    const draw = () => {
      context.fillStyle = '#07060a'; context.fillRect(0, 0, WIDTH, HEIGHT)
      context.strokeStyle = 'rgba(228,178,206,.12)'; context.strokeRect(.5, .5, WIDTH - 1, HEIGHT - 1)
      bricks.current.forEach((brick, index) => { if (brick.alive) { context.fillStyle = index % 2 ? '#e4b2ce' : '#b07c4f'; context.fillRect(brick.x, brick.y, 48, 15) } })
      context.fillStyle = '#f8f7f9'; context.fillRect(paddle.current, 286, 82, 9)
      context.fillStyle = '#f2c8df'; context.fillRect(ball.current.x - 5, ball.current.y - 5, 10, 10)
    }

    const loop = () => {
      if (keys.current.left) paddle.current = Math.max(0, paddle.current - 6)
      if (keys.current.right) paddle.current = Math.min(WIDTH - 82, paddle.current + 6)
      if (running) {
        const next = ball.current
        next.x += next.dx; next.y += next.dy
        if (next.x <= 5 || next.x >= WIDTH - 5) next.dx *= -1
        if (next.y <= 5) next.dy *= -1
        if (next.dy > 0 && next.y >= 278 && next.y <= 294 && next.x >= paddle.current && next.x <= paddle.current + 82) { next.dy = -Math.abs(next.dy); next.dx += (next.x - paddle.current - 41) * .015 }
        for (const brick of bricks.current) {
          if (brick.alive && next.x >= brick.x && next.x <= brick.x + 48 && next.y >= brick.y && next.y <= brick.y + 15) {
            brick.alive = false; next.dy *= -1; setScore((value) => value + 10); break
          }
        }
        if (!won.current && bricks.current.every((brick) => !brick.alive)) { won.current = true; onCreditDelta(1); setRunning(false); setMessage('Brick field cleared. Machine integrity restored. +1 credit.') }
        if (next.y > HEIGHT) {
          setLives((value) => { const remaining = value - 1; if (remaining <= 0) { setRunning(false); setMessage('No signal remaining. Restart the field.') }; return remaining })
          ball.current = { x: 240, y: 245, dx: 3, dy: -3 }
        }
      }
      draw(); frame = window.requestAnimationFrame(loop)
    }
    loop()
    return () => window.cancelAnimationFrame(frame)
  }, [onCreditDelta, running])

  const key = (event: KeyboardEvent, pressed: boolean) => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { keys.current.left = pressed; event.preventDefault() }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { keys.current.right = pressed; event.preventDefault() }
  }

  const reset = () => {
    bricks.current = createBricks(); won.current = false; paddle.current = 200; ball.current = { x: 240, y: 245, dx: 3, dy: -3 }
    setScore(0); setLives(3); setRunning(false); setMessage('Fresh brick field ready.')
  }

  return <section className="game-shell brickbreaker-game" tabIndex={0} onKeyDown={(event) => key(event, true)} onKeyUp={(event) => key(event, false)} aria-label="Brickbreaker game. Use left and right arrows or A and D to move the paddle.">
    <header><div><p>LUCIOS ARCADE // IMPACT CHAMBER</p><h2>Brickbreaker</h2></div><strong>{score} pts // {lives} lives</strong></header>
    <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} aria-label={`Brick field. Score ${score}, ${lives} lives.`} />
    <p className="game-status" aria-live="polite">{message}</p>
    <div className="game-controls"><button onClick={() => { setRunning((value) => !value); setMessage(running ? 'Paused.' : 'Ball released.') }}>{running ? 'Pause' : 'Start'}</button><button onClick={reset}>Restart</button></div>
  </section>
}

import { useEffect, useRef, useState } from 'react'

const SIZE = 12
const START = [{ x: 5, y: 6 }, { x: 4, y: 6 }, { x: 3, y: 6 }]
type Point = { x: number; y: number }

const randomFood = (snake: Point[]) => {
  const free = Array.from({ length: SIZE * SIZE }, (_, index) => ({ x: index % SIZE, y: Math.floor(index / SIZE) }))
    .filter((cell) => !snake.some((segment) => segment.x === cell.x && segment.y === cell.y))
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 }
}

export default function SnakeGame({ onCreditDelta }: { onCreditDelta: (delta: number) => void }) {
  const [snake, setSnake] = useState(START)
  const [food, setFood] = useState(() => randomFood(START))
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Press an arrow key or WASD to begin.')
  const direction = useRef<Point>({ x: 1, y: 0 })
  const nextDirection = useRef<Point>({ x: 1, y: 0 })

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setSnake((current) => {
      direction.current = nextDirection.current
      const head = { x: current[0].x + direction.current.x, y: current[0].y + direction.current.y }
      const hitWall = head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE
      const hitSelf = current.some((segment) => segment.x === head.x && segment.y === head.y)
      if (hitWall || hitSelf) {
        setRunning(false)
        setMessage('Signal lost. Restart to grow another snake.')
        return current
      }
      const ate = head.x === food.x && head.y === food.y
      const next = [head, ...current.slice(0, ate ? current.length : -1)]
      if (ate) {
        setScore((value) => { const next = value + 10; if (next % 50 === 0) onCreditDelta(1); return next })
        setFood(randomFood(next))
      }
      return next
    }), 135)
    return () => window.clearInterval(timer)
  }, [food, onCreditDelta, running])

  const steer = (x: number, y: number) => {
    if (direction.current.x + x === 0 && direction.current.y + y === 0) return
    nextDirection.current = { x, y }
  }

  const reset = () => {
    setSnake(START)
    setFood(randomFood(START))
    setScore(0)
    direction.current = { x: 1, y: 0 }
    nextDirection.current = { x: 1, y: 0 }
    setMessage('Fresh signal ready.')
    setRunning(false)
  }

  return (
    <section className="game-shell snake-game" tabIndex={0} aria-label="Snake game. Use arrow keys or WASD to steer."
      onKeyDown={(event) => {
        const controls: Record<string, Point> = { ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 } }
        const move = controls[event.key]
        if (move) {
          event.preventDefault()
          steer(move.x, move.y)
          if (!running) { setRunning(true); setMessage('Signal moving.') }
        }
      }}>
      <header><div><p>LUCIOS ARCADE // SIGNAL SERPENT</p><h2>Snake</h2></div><strong>Score {score}</strong></header>
      <div className="snake-board" role="img" aria-label={`Snake board. Score ${score}.`}>
        {Array.from({ length: SIZE * SIZE }, (_, index) => {
          const x = index % SIZE
          const y = Math.floor(index / SIZE)
          const segment = snake.findIndex((part) => part.x === x && part.y === y)
          const className = segment === 0 ? 'snake-head' : segment > 0 ? 'snake-body' : food.x === x && food.y === y ? 'snake-food' : ''
          return <i className={className} key={index} />
        })}
      </div>
      <p className="game-status" aria-live="polite">{message}</p>
      <div className="game-controls"><button onClick={() => { setRunning((value) => !value); setMessage(running ? 'Paused.' : 'Signal moving.') }}>{running ? 'Pause' : 'Start'}</button><button onClick={reset}>Restart</button></div>
    </section>
  )
}

import { useCallback, useEffect, useState } from 'react'

const WIDTH = 10
const HEIGHT = 15
const SHAPES = [
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]],
] as const
type Piece = { shape: readonly (readonly [number, number])[]; x: number; y: number }

const emptyBoard = () => Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(false) as boolean[])
const newPiece = (): Piece => ({ shape: SHAPES[Math.floor(Math.random() * SHAPES.length)], x: 3, y: 0 })

export default function StackfallGame({ onCreditDelta }: { onCreditDelta: (delta: number) => void }) {
  const [board, setBoard] = useState(emptyBoard)
  const [piece, setPiece] = useState(newPiece)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Stack blocks and clear complete rows.')

  const collides = useCallback((candidate: Piece) => candidate.shape.some(([dx, dy]) => {
    const x = candidate.x + dx
    const y = candidate.y + dy
    return x < 0 || x >= WIDTH || y >= HEIGHT || (y >= 0 && board[y][x])
  }), [board])

  const lockPiece = useCallback(() => {
    const next = board.map((row) => [...row])
    piece.shape.forEach(([dx, dy]) => { if (piece.y + dy >= 0) next[piece.y + dy][piece.x + dx] = true })
    const remaining = next.filter((row) => !row.every(Boolean))
    const cleared = HEIGHT - remaining.length
    if (cleared) onCreditDelta(cleared)
    const clearedBoard = [...Array.from({ length: cleared }, () => Array(WIDTH).fill(false) as boolean[]), ...remaining]
    const incoming = newPiece()
    setBoard(clearedBoard)
    setScore((value) => value + cleared * cleared * 100 + 5)
    if (incoming.shape.some(([dx, dy]) => clearedBoard[incoming.y + dy][incoming.x + dx])) {
      setRunning(false); setMessage('Stack overflow. Restart the machine.')
    } else {
      setPiece(incoming); setMessage(cleared ? `${cleared} row${cleared > 1 ? 's' : ''} cleared.` : 'Piece locked.')
    }
  }, [board, onCreditDelta, piece])

  const drop = useCallback(() => {
    const next = { ...piece, y: piece.y + 1 }
    if (collides(next)) lockPiece()
    else setPiece(next)
  }, [collides, lockPiece, piece])

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(drop, 520)
    return () => window.clearInterval(timer)
  }, [drop, running])

  const move = (dx: number) => {
    const next = { ...piece, x: piece.x + dx }
    if (!collides(next)) setPiece(next)
  }

  const rotate = () => {
    const rotated = piece.shape.map(([x, y]) => [-y, x] as const)
    const minX = Math.min(...rotated.map(([x]) => x))
    const next = { ...piece, shape: rotated.map(([x, y]) => [x - minX, y] as const) }
    if (!collides(next)) setPiece(next)
  }

  const reset = () => { setBoard(emptyBoard()); setPiece(newPiece()); setScore(0); setRunning(false); setMessage('Fresh stack ready.') }
  const active = new Set(piece.shape.map(([dx, dy]) => `${piece.x + dx}-${piece.y + dy}`))

  return <section className="game-shell stackfall-game" tabIndex={0} aria-label="Stackfall game. Use arrow keys to move and rotate blocks."
    onKeyDown={(event) => {
      if (event.key === 'ArrowLeft') move(-1)
      else if (event.key === 'ArrowRight') move(1)
      else if (event.key === 'ArrowUp') rotate()
      else if (event.key === 'ArrowDown') drop()
      else return
      event.preventDefault()
    }}>
    <header><div><p>LUCIOS ARCADE // GRAVITY STACK</p><h2>Stackfall</h2></div><strong>Score {score}</strong></header>
    <div className="stackfall-board" role="img" aria-label={`Falling block grid. Score ${score}.`}>
      {board.flatMap((row, y) => row.map((filled, x) => <i className={active.has(`${x}-${y}`) ? 'stack-active' : filled ? 'stack-fixed' : ''} key={`${x}-${y}`} />))}
    </div>
    <p className="game-status" aria-live="polite">{message}</p>
    <div className="game-controls"><button onClick={() => setRunning((value) => !value)}>{running ? 'Pause' : 'Start'}</button><button onClick={reset}>Restart</button></div>
  </section>
}

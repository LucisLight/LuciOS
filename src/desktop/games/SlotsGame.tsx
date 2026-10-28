import { useEffect, useRef, useState } from 'react'

const SYMBOLS = ['7', '★', '◆', '●', '♟']
const PAYOUTS: Record<string, number> = { '7': 100, '★': 70, '◆': 50, '●': 30, '♟': 20 }
const SPIN_COST = 5
const PAYLINES = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [0, 6, 12, 8, 4], [10, 6, 2, 8, 14]]
const randomGrid = () => Array.from({ length: 15 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])

type SlotsGameProps = {
  credits: number
  onCreditDelta: (delta: number) => void
}

export default function SlotsGame({ credits, onCreditDelta }: SlotsGameProps) {
  const [grid, setGrid] = useState(randomGrid)
  const [spinning, setSpinning] = useState(false)
  const [message, setMessage] = useState('Each spin costs 5 credits. Five matching symbols on a horizontal or diagonal payline pays.')
  const timer = useRef<number | null>(null)
  const reelTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    if (reelTimer.current !== null) window.clearInterval(reelTimer.current)
  }, [])

  const spin = () => {
    if (spinning) return
    if (credits < SPIN_COST) { setMessage('Insufficient credits. The machine requires 5.'); return }
    setSpinning(true)
    onCreditDelta(-SPIN_COST)
    setMessage('Reels turning…')
    reelTimer.current = window.setInterval(() => setGrid(randomGrid()), 90)
    timer.current = window.setTimeout(() => {
      if (reelTimer.current !== null) window.clearInterval(reelTimer.current)
      const result = randomGrid()
      setGrid(result)
      const winningLines = PAYLINES.filter((line) => line.every((index) => result[index] === result[line[0]]))
      const prize = winningLines.reduce((total, line) => total + PAYOUTS[result[line[0]]], 0)
      if (prize) onCreditDelta(prize)
      setMessage(prize ? `${winningLines.length} payline${winningLines.length > 1 ? 's' : ''}! You won ${prize} credits.` : 'No completed payline. Try another spin.')
      setSpinning(false)
    }, 900)
  }

  return <section className="game-shell slots-game">
    <header><div><p>LUCIOS ARCADE // FIVE-REEL ENGINE</p><h2>Lucky Circuit</h2></div><strong>{credits} credits</strong></header>
    <div className={`slots-grid${spinning ? ' is-spinning' : ''}`} aria-label={`Slot result: ${grid.join(', ')}`}>
      {grid.map((symbol, index) => <i key={index}>{symbol}</i>)}
    </div>
    <div className="slot-paytable"><strong>Five across or diagonal pays</strong><span>77777 +100</span><span>★★★★★ +70</span><span>◆◆◆◆◆ +50</span><span>●●●●● +30</span><span>♟♟♟♟♟ +20</span></div>
    <p className="game-status" aria-live="polite">{message}</p>
    <div className="game-controls"><button onClick={spin} disabled={spinning || credits < SPIN_COST}>{spinning ? 'Spinning…' : 'Spin // 5 credits'}</button></div>
  </section>
}

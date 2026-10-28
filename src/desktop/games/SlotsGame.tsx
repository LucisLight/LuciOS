import { useEffect, useRef, useState } from 'react'

const SYMBOLS = ['7', '★', '◆', '●', '♟']
const PAYOUTS: Record<string, number> = { '7': 50, '★': 35, '◆': 25, '●': 15, '♟': 10 }
const SPIN_COST = 5
const randomGrid = () => Array.from({ length: 9 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])

type SlotsGameProps = {
  credits: number
  onCreditDelta: (delta: number) => void
}

export default function SlotsGame({ credits, onCreditDelta }: SlotsGameProps) {
  const [grid, setGrid] = useState(randomGrid)
  const [spinning, setSpinning] = useState(false)
  const [message, setMessage] = useState('Each spin costs 5 credits. Three matching symbols across a row pays.')
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
      const winningRows = [0, 3, 6].filter((start) => result[start] === result[start + 1] && result[start] === result[start + 2])
      const prize = winningRows.reduce((total, start) => total + PAYOUTS[result[start]], 0)
      if (prize) onCreditDelta(prize)
      setMessage(prize ? `${winningRows.length} payline${winningRows.length > 1 ? 's' : ''}! You won ${prize} credits.` : 'No completed payline. Try another spin.')
      setSpinning(false)
    }, 900)
  }

  return <section className="game-shell slots-game">
    <header><div><p>LUCIOS ARCADE // THREE-LINE ENGINE</p><h2>Lucky Circuit</h2></div><strong>{credits} credits</strong></header>
    <div className={`slots-grid${spinning ? ' is-spinning' : ''}`} aria-label={`Slot result: ${grid.join(', ')}`}>
      {grid.map((symbol, index) => <i key={index}>{symbol}</i>)}
    </div>
    <div className="slot-paytable"><strong>Three across pays</strong><span>777 +50</span><span>★★★ +35</span><span>◆◆◆ +25</span><span>●●● +15</span><span>♟♟♟ +10</span></div>
    <p className="game-status" aria-live="polite">{message}</p>
    <div className="game-controls"><button onClick={spin} disabled={spinning || credits < SPIN_COST}>{spinning ? 'Spinning…' : 'Spin // 5 credits'}</button></div>
  </section>
}

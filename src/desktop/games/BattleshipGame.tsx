import { useState } from 'react'

const SIZE = 6
const SHIPS = [3, 2, 2]
const keyOf = (x: number, y: number) => `${x}-${y}`

function createFleet() {
  const occupied = new Set<string>()
  for (const length of SHIPS) {
    let placed = false
    while (!placed) {
      const horizontal = Math.random() > .5
      const x = Math.floor(Math.random() * (horizontal ? SIZE - length + 1 : SIZE))
      const y = Math.floor(Math.random() * (horizontal ? SIZE : SIZE - length + 1))
      const cells = Array.from({ length }, (_, index) => keyOf(x + (horizontal ? index : 0), y + (horizontal ? 0 : index)))
      if (cells.every((cell) => !occupied.has(cell))) { cells.forEach((cell) => occupied.add(cell)); placed = true }
    }
  }
  return occupied
}

export default function BattleshipGame({ onCreditDelta }: { onCreditDelta: (delta: number) => void }) {
  const [enemyFleet, setEnemyFleet] = useState(createFleet)
  const [playerFleet, setPlayerFleet] = useState(createFleet)
  const [enemyShots, setEnemyShots] = useState<Set<string>>(() => new Set())
  const [playerShots, setPlayerShots] = useState<Set<string>>(() => new Set())
  const [message, setMessage] = useState('Select a coordinate in enemy waters.')
  const [finished, setFinished] = useState(false)

  const fire = (cell: string) => {
    if (finished || playerShots.has(cell)) return
    const nextPlayerShots = new Set(playerShots).add(cell)
    setPlayerShots(nextPlayerShots)
    const hit = enemyFleet.has(cell)
    const playerWon = [...enemyFleet].every((shipCell) => nextPlayerShots.has(shipCell))
    if (playerWon) { setMessage('Enemy fleet destroyed. LuciOS controls the channel. +1 credit.'); onCreditDelta(1); setFinished(true); return }

    const choices = Array.from({ length: SIZE * SIZE }, (_, index) => keyOf(index % SIZE, Math.floor(index / SIZE))).filter((target) => !enemyShots.has(target))
    const response = choices[crypto.getRandomValues(new Uint32Array(1))[0] % choices.length]
    const nextEnemyShots = new Set(enemyShots).add(response)
    setEnemyShots(nextEnemyShots)
    if ([...playerFleet].every((shipCell) => nextEnemyShots.has(shipCell))) { setMessage('Your fleet was sunk. Rebuild and return fire.'); setFinished(true); return }
    setMessage(`${hit ? 'Direct hit' : 'Miss'} at ${cell.replace('-', ', ')}. Enemy returned ${playerFleet.has(response) ? 'a hit' : 'a miss'}.`)
  }

  const reset = () => {
    setEnemyFleet(createFleet()); setPlayerFleet(createFleet())
    setEnemyShots(new Set()); setPlayerShots(new Set())
    setMessage('Fleets randomized. Select a coordinate.'); setFinished(false)
  }

  const board = (owner: 'player' | 'enemy') => {
    const shots = owner === 'enemy' ? playerShots : enemyShots
    const fleet = owner === 'enemy' ? enemyFleet : playerFleet
    return <div className="battle-board" aria-label={`${owner} ocean grid`}>
      {Array.from({ length: SIZE * SIZE }, (_, index) => {
        const x = index % SIZE
        const y = Math.floor(index / SIZE)
        const cell = keyOf(x, y)
        const shot = shots.has(cell)
        const ship = fleet.has(cell)
        const className = shot ? ship ? 'battle-hit' : 'battle-miss' : owner === 'player' && ship ? 'battle-ship' : ''
        return owner === 'enemy'
          ? <button className={className} onClick={() => fire(cell)} disabled={shot || finished} aria-label={`Fire at column ${x + 1}, row ${y + 1}${shot ? ship ? ': hit' : ': miss' : ''}`} key={cell}>{shot ? ship ? '×' : '·' : ''}</button>
          : <i className={className} aria-hidden="true" key={cell}>{shot ? ship ? '×' : '·' : ''}</i>
      })}
    </div>
  }

  return <section className="game-shell battleship-game">
    <header><div><p>LUCIOS ARCADE // COMPACT FLEET</p><h2>Fleet Destroyer</h2></div><button onClick={reset}>New fleets</button></header>
    <div className="battle-layout"><div><h3>Your fleet</h3>{board('player')}</div><div><h3>Enemy waters</h3>{board('enemy')}</div></div>
    <p className="game-status" aria-live="polite">{message}</p>
  </section>
}

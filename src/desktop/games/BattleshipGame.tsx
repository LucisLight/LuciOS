import { useState, type DragEvent } from 'react'

const SIZE = 7
const SHIPS = [
  { id: 'cruiser', name: 'Cruiser', length: 3 },
  { id: 'scout', name: 'Scout', length: 2 },
  { id: 'skimmer', name: 'Skimmer', length: 2 },
]
type PlacedShip = { id: string; x: number; y: number; vertical: boolean }
const keyOf = (x: number, y: number) => `${x}-${y}`
const cellsFor = (ship: PlacedShip) => {
  const length = SHIPS.find((candidate) => candidate.id === ship.id)?.length ?? 0
  return Array.from({ length }, (_, index) => keyOf(ship.x + (ship.vertical ? 0 : index), ship.y + (ship.vertical ? index : 0)))
}

function createEnemyFleet() {
  const occupied = new Set<string>()
  for (const ship of SHIPS) {
    let placed = false
    while (!placed) {
      const vertical = Math.random() > .5
      const x = Math.floor(Math.random() * (vertical ? SIZE : SIZE - ship.length + 1))
      const y = Math.floor(Math.random() * (vertical ? SIZE - ship.length + 1 : SIZE))
      const cells = cellsFor({ id: ship.id, x, y, vertical })
      if (cells.every((cell) => !occupied.has(cell))) { cells.forEach((cell) => occupied.add(cell)); placed = true }
    }
  }
  return occupied
}

export default function BattleshipGame({ onCreditDelta }: { onCreditDelta: (delta: number) => void }) {
  const [enemyFleet, setEnemyFleet] = useState(createEnemyFleet)
  const [placements, setPlacements] = useState<Record<string, PlacedShip>>({})
  const [vertical, setVertical] = useState<Record<string, boolean>>({ cruiser: false, scout: false, skimmer: false })
  const [selected, setSelected] = useState<string | null>('cruiser')
  const [enemyShots, setEnemyShots] = useState<Set<string>>(() => new Set())
  const [playerShots, setPlayerShots] = useState<Set<string>>(() => new Set())
  const [phase, setPhase] = useState<'setup' | 'battle'>('setup')
  const [message, setMessage] = useState('Drag each ship onto your field. Rotate before placing if needed.')
  const [finished, setFinished] = useState(false)
  const playerFleet = new Set(Object.values(placements).flatMap(cellsFor))

  const placeShip = (id: string, x: number, y: number) => {
    const candidate = { id, x, y, vertical: vertical[id] }
    const cells = cellsFor(candidate)
    const otherCells = new Set(Object.values(placements).filter((ship) => ship.id !== id).flatMap(cellsFor))
    const valid = cells.length > 0 && cells.every((cell) => {
      const [cellX, cellY] = cell.split('-').map(Number)
      return cellX < SIZE && cellY < SIZE && !otherCells.has(cell)
    })
    if (!valid) { setMessage('That placement overlaps another ship or leaves the field.'); return }
    setPlacements((current) => ({ ...current, [id]: candidate }))
    setSelected(SHIPS.find((ship) => !placements[ship.id] && ship.id !== id)?.id ?? null)
    setMessage(`${SHIPS.find((ship) => ship.id === id)?.name} placed. Deploy when all ships are ready.`)
  }

  const rotateShip = (id: string) => {
    setVertical((current) => ({ ...current, [id]: !current[id] }))
    setPlacements((current) => { const next = { ...current }; delete next[id]; return next })
    setSelected(id)
    setMessage(`${id} rotated ${vertical[id] ? 'horizontal' : 'vertical'}; place it again.`)
  }

  const fire = (cell: string) => {
    if (finished || playerShots.has(cell)) return
    const nextPlayerShots = new Set(playerShots).add(cell)
    setPlayerShots(nextPlayerShots)
    if ([...enemyFleet].every((shipCell) => nextPlayerShots.has(shipCell))) {
      setMessage('Enemy fleet destroyed. +1 credit.'); onCreditDelta(1); setFinished(true); return
    }
    const choices = Array.from({ length: SIZE * SIZE }, (_, index) => keyOf(index % SIZE, Math.floor(index / SIZE))).filter((target) => !enemyShots.has(target))
    const response = choices[crypto.getRandomValues(new Uint32Array(1))[0] % choices.length]
    const nextEnemyShots = new Set(enemyShots).add(response)
    setEnemyShots(nextEnemyShots)
    if ([...playerFleet].every((shipCell) => nextEnemyShots.has(shipCell))) { setMessage('Your fleet was destroyed. Rebuild and return fire.'); setFinished(true); return }
    setMessage(`${enemyFleet.has(cell) ? 'Direct hit' : 'Miss'}. Enemy returned ${playerFleet.has(response) ? 'a hit' : 'a miss'}.`)
  }

  const reset = () => {
    setEnemyFleet(createEnemyFleet()); setPlacements({}); setSelected('cruiser')
    setEnemyShots(new Set()); setPlayerShots(new Set()); setPhase('setup'); setFinished(false)
    setMessage('Drag each ship onto your field. Rotate before placing if needed.')
  }

  const playerBoard = <div className="battle-board player-deployment" aria-label="Your fleet deployment grid">
    {Array.from({ length: SIZE * SIZE }, (_, index) => {
      const x = index % SIZE; const y = Math.floor(index / SIZE); const cell = keyOf(x, y)
      const shot = enemyShots.has(cell); const ship = playerFleet.has(cell)
      return <button className={shot ? ship ? 'battle-hit' : 'battle-miss' : ship ? 'battle-ship' : ''} disabled={phase === 'battle'}
        onClick={() => selected && placeShip(selected, x, y)} onDragOver={(event) => event.preventDefault()}
        onDrop={(event: DragEvent) => placeShip(event.dataTransfer.getData('text/plain'), x, y)}
        aria-label={`Column ${x + 1}, row ${y + 1}${ship ? ', occupied' : ''}`} key={cell}>{shot ? ship ? '×' : '·' : ''}</button>
    })}
  </div>

  return <section className="game-shell battleship-game">
    <header><div><p>LUCIOS ARCADE // COMPACT FLEET</p><h2>Fleet Destroyer</h2></div><button onClick={reset}>New fleets</button></header>
    {phase === 'setup' ? <div className="fleet-setup">
      <div><h3>Your field</h3>{playerBoard}</div>
      <aside className="ship-tray"><h3>Ship rack</h3>{SHIPS.map((ship) => <div className={selected === ship.id ? 'is-selected' : ''} key={ship.id}>
        <button draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', ship.id)} onClick={() => setSelected(ship.id)}>{ship.name} // {ship.length} {placements[ship.id] ? '✓' : ''}</button>
        <button onClick={() => rotateShip(ship.id)}>Rotate {vertical[ship.id] ? '↕' : '↔'}</button>
      </div>)}<button className="deploy-fleet" disabled={Object.keys(placements).length !== SHIPS.length} onClick={() => { setPhase('battle'); setSelected(null); setMessage('Fleet deployed. Select a coordinate in enemy waters.') }}>Deploy fleet</button></aside>
    </div> : <div className="battle-layout"><div><h3>Your fleet</h3>{playerBoard}</div><div><h3>Enemy waters</h3><div className="battle-board">
      {Array.from({ length: SIZE * SIZE }, (_, index) => { const x = index % SIZE; const y = Math.floor(index / SIZE); const cell = keyOf(x, y); const shot = playerShots.has(cell); const hit = enemyFleet.has(cell)
        return <button className={shot ? hit ? 'battle-hit' : 'battle-miss' : ''} onClick={() => fire(cell)} disabled={shot || finished} aria-label={`Fire at column ${x + 1}, row ${y + 1}`} key={cell}>{shot ? hit ? '×' : '·' : ''}</button> })}
    </div></div></div>}
    <p className="game-status" aria-live="polite">{message}</p>
  </section>
}

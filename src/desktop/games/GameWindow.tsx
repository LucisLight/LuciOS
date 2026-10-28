import BattleshipGame from './BattleshipGame'
import BrickbreakerGame from './BrickbreakerGame'
import SnakeGame from './SnakeGame'
import StackfallGame from './StackfallGame'
import SlotsGame from './SlotsGame'

type GameWindowProps = { appId: string; credits: number; onCreditDelta: (delta: number) => void }

export default function GameWindow({ appId, credits, onCreditDelta }: GameWindowProps) {
  if (appId === 'snake') return <SnakeGame onCreditDelta={onCreditDelta} />
  if (appId === 'stackfall') return <StackfallGame onCreditDelta={onCreditDelta} />
  if (appId === 'fleet-destroyer') return <BattleshipGame onCreditDelta={onCreditDelta} />
  if (appId === 'brickbreaker') return <BrickbreakerGame onCreditDelta={onCreditDelta} />
  if (appId === 'slots') return <SlotsGame credits={credits} onCreditDelta={onCreditDelta} />
  return null
}

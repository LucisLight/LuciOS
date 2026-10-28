import type { EvilBootPhase } from './useEvilBoot'

type EvilLuciLoaderProps = {
  phase: EvilBootPhase
  progress: number
}

const skullPositions = [16, 37, 61, 84]

export default function EvilLuciLoader({ phase, progress }: EvilLuciLoaderProps) {
  if (phase !== 'loading') return null

  return (
    <section className="evil-loader" role="dialog" aria-modal="true" aria-labelledby="evil-loader-title">
      <div className="evil-loader-window">
        <p className="evil-loader-kicker">UNAUTHORIZED KERNEL // HIDDEN CHANNEL</p>
        <h2 id="evil-loader-title">EvilLuciOS</h2>
        <div className="evil-progress-track" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
          {skullPositions.map((position) => (
            <span className="evil-skull" style={{ left: `${position}%` }} key={position}>
              ☠
              <b className={progress >= position ? 'is-lit' : ''} />
              <b className={progress >= position + 3 ? 'is-lit' : ''} />
            </span>
          ))}
        </div>
        <div
          className="evil-progress-copy"
          role="progressbar"
          aria-label="EvilLuciOS startup progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <span>{String(Math.round(progress)).padStart(2, '0')}%</span>
          <span>{progress < 34 ? 'Corrupting mirrors' : progress < 72 ? 'Waking shadow kernel' : 'Opening forbidden interface'}</span>
        </div>
      </div>
    </section>
  )
}

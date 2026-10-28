import { useCallback, useEffect, useState } from 'react'

export const EVIL_BOOT_DURATION = 14_000
export type EvilBootPhase = 'idle' | 'loading' | 'active'

export function useEvilBoot() {
  const [phase, setPhase] = useState<EvilBootPhase>('idle')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (phase !== 'loading') return

    const startedAt = performance.now()
    const timer = window.setInterval(() => {
      const elapsed = Math.min(performance.now() - startedAt, EVIL_BOOT_DURATION)
      setProgress((elapsed / EVIL_BOOT_DURATION) * 100)
    }, 50)
    const completion = window.setTimeout(() => {
      setProgress(100)
      setPhase('active')
    }, EVIL_BOOT_DURATION)

    return () => {
      window.clearInterval(timer)
      window.clearTimeout(completion)
    }
  }, [phase])

  const start = useCallback(() => {
    setProgress(0)
    setPhase((current) => current === 'idle' ? 'loading' : current)
  }, [])

  const reset = useCallback(() => {
    setProgress(0)
    setPhase('idle')
  }, [])

  return { phase, progress, start, reset }
}

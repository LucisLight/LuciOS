import { useRef, useState, type FormEvent } from 'react'

type ShellTerminalProps = {
  onEvilLuci: () => void
  evilActive: boolean
}

const INPUT_LIMIT = 24
const RATE_WINDOW = 8_000
const RATE_LIMIT = 8
const MIN_INTERVAL = 250

export default function ShellTerminal({ onEvilLuci, evilActive }: ShellTerminalProps) {
  const [command, setCommand] = useState('')
  const [status, setStatus] = useState('Type help to mount the command guide.')
  const [showHelp, setShowHelp] = useState(false)
  const submissions = useRef<number[]>([])

  const submitCommand = (event: FormEvent) => {
    event.preventDefault()
    const now = performance.now()
    submissions.current = submissions.current.filter((time) => now - time < RATE_WINDOW)
    const lastSubmission = submissions.current.at(-1) ?? -Infinity

    if (submissions.current.length >= RATE_LIMIT || now - lastSubmission < MIN_INTERVAL) {
      setStatus('Input throttled. Let the interface cool down before trying again.')
      return
    }

    submissions.current.push(now)
    const normalized = command.trim().toLowerCase()
    setCommand('')

    if (!normalized) return
    if (normalized.length > INPUT_LIMIT || !/^[a-z]+$/.test(normalized)) {
      setStatus('Rejected: commands may contain lowercase letters only.')
      return
    }

    if (normalized === 'help') {
      setShowHelp(true)
      setStatus('Help mounted in the right-side panel.')
      return
    }

    if (normalized === 'evilluci') {
      setStatus(evilActive ? 'EvilLuciOS is already awake.' : 'Hidden override accepted. Beginning sealed boot sequence…')
      if (!evilActive) onEvilLuci()
      return
    }

    setStatus(`Command not found: ${normalized}`)
  }

  return (
    <div className="command-screen command-terminal" aria-label="LuciOS allowlisted command interface">
      <section className="command-console" aria-label="Command input">
        <p><span>LuciOS kernel</span> sealed command channel</p>
        <p>parser_mode ....................... <b>allowlist</b></p>
        <p>network_access .................... <b>none</b></p>
        <p>command_output .................... <b>text only</b></p>
        <div className="command-log" role="status" aria-live="polite">{status}</div>
        <form onSubmit={submitCommand} className="command-form">
          <label htmlFor="shell-command">luci@lucios:~$</label>
          <input
            id="shell-command"
            value={command}
            onChange={(event) => setCommand(event.target.value.slice(0, INPUT_LIMIT))}
            maxLength={INPUT_LIMIT}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-describedby="shell-security-note"
          />
          <button type="submit">Run</button>
        </form>
        <small id="shell-security-note">Local simulation. No operating-system, filesystem, or network access.</small>
      </section>

      <aside className={`command-help${showHelp ? ' is-visible' : ''}`} aria-live="polite">
        {showHelp ? (
          <>
            <p>LUCIOS COMMAND GUIDE</p>
            <h3>Available commands</h3>
            <dl><dt>help</dt><dd>Displays this guide and usage instructions.</dd></dl>
            <h3>Instructions</h3>
            <ol>
              <li>Enter one command at the prompt.</li>
              <li>Commands are not case-sensitive.</li>
              <li>Press Enter or select Run.</li>
            </ol>
            <p className="command-help-note">Unknown input is displayed as plain text and never executed.</p>
          </>
        ) : <p>Run <strong>help</strong> to display instructions here.</p>}
      </aside>
    </div>
  )
}

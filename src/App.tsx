import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import './App.css'

type ColorVisionMode = 'standard' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

const colorVisionOptions: { value: ColorVisionMode; label: string }[] = [
  { value: 'standard', label: 'Standard colors' },
  { value: 'protanopia', label: 'Protanopia (red)' },
  { value: 'deuteranopia', label: 'Deuteranopia (green)' },
  { value: 'tritanopia', label: 'Tritanopia (blue-yellow)' },
  { value: 'achromatopsia', label: 'Achromatopsia (monochrome)' },
]

type Project = {
  id: string
  eyebrow: string
  title: string
  summary: string
  role: string
  decisions: string[]
  outcome: string
  technologies: string[]
  evidenceUrl?: string
  evidenceLabel: string
}

const projects: Project[] = [
  {
    id: 'corvusdesk',
    eyebrow: 'Full-stack application',
    title: 'CorvusDesk',
    summary:
      'A local service-request tracking system that helps support teams create, assign, update, close, reopen, sort, and review tickets across their full lifecycle.',
    role:
      'Full-stack developer on the CorvusDesk development team, working across the React interface, Spring Boot services, MongoDB data, and ticket workflow.',
    decisions: [
      'Separated the React frontend from a Spring Boot REST backend.',
      'Added clearance-based visibility for Admin, Manager, Network, Phone, and General owners.',
      'Preserved comments and request history so closed and reopened tickets retain context.',
    ],
    outcome:
      'The working build supports owner management, ticket creation, search, filtering, sorting, comments, history, closure, deletion, and reopening. The project strengthened my understanding of full-stack state, access rules, testing, and maintainable component boundaries.',
    technologies: ['Java', 'Spring Boot', 'React', 'MongoDB', 'JavaScript', 'Jest'],
    evidenceUrl: 'https://github.com/LucisLight/CorvusDesk',
    evidenceLabel: 'View CorvusDesk source and documentation',
  },
  {
    id: 'battleship',
    eyebrow: 'Collaborative Java project',
    title: 'Battleship Game',
    summary:
      'A console-based player-versus-computer Battleship game with fleet setup, coordinate validation, randomized computer behavior, alternating turns, and win detection.',
    role:
      'Collaborative Java developer and one of three listed authors. I contributed to a shared gameplay class that coordinates setup, ship placement, turns, board display, hit detection, and victory logic.',
    decisions: [
      'Used coordinate validation to keep player input inside a 10-by-10 board.',
      'Prevented ships from overlapping or extending beyond the board during placement.',
      'Kept the opponent fleet hidden while still displaying hits and misses after each turn.',
    ],
    outcome:
      'The result is a playable command-line game with manual fleet placement and randomized AI placement and targeting. It reinforced collaborative coding, object-oriented design, input validation, and breaking a game loop into testable responsibilities.',
    technologies: ['Java', 'Object-oriented design', 'Collections', 'Input validation'],
    evidenceUrl: 'https://github.com/LucisLight/Battleship-Game',
    evidenceLabel: 'View the Battleship repository',
  },
  {
    id: 'lucios',
    eyebrow: 'Portfolio experience',
    title: 'LuciOS',
    summary:
      'This portfolio is designed as an original mechanical-futurist operating system: steampunk structure, pastel-pink holograms, pixel details, and direct access to professional evidence.',
    role:
      'Designer, content owner, and frontend developer. I defined the interaction concept, requirements, accessibility priorities, project architecture, and visual direction before building the React experience.',
    decisions: [
      'Kept a conventional portfolio path so the presentation never blocks the content.',
      'Used a reusable overhead app rail and single display model instead of a complex window manager.',
      'Designed motion as progressive enhancement with reduced-motion and mobile fallbacks.',
    ],
    outcome:
      'The submission edition establishes a responsive, accessible portfolio and a reusable design system with an interactive startup sequence, prototype desktop shell, and shared draggable-window system. Future releases can connect the applications, pixel-shadow hand, terminal valve, and richer project media without rewriting the professional content.',
    technologies: ['React', 'TypeScript', 'Vite', 'CSS', 'Accessible HTML'],
    evidenceLabel: 'You are viewing the working project',
  },
]

const skillGroups = [
  {
    title: 'Systems & support',
    items: ['Active Directory', 'Windows 7–11', 'Linux administration', 'Office 365', 'Hardware repair', 'Imaging & deployment'],
  },
  {
    title: 'Networking & security',
    items: ['Network troubleshooting', 'Firewall fundamentals', 'Infrastructure planning', 'Linux security', 'Device administration', 'Technical escalation'],
  },
  {
    title: 'Development',
    items: ['Java', 'JavaScript', 'React', 'Spring Boot', 'MongoDB', 'HTML & CSS', 'Git & GitHub'],
  },
  {
    title: 'Professional practice',
    items: ['Ticket lifecycle management', 'Documentation', 'Customer support', 'Team leadership', 'Inventory control', 'Process improvement'],
  },
]

const certifications = [
  'CompTIA A+',
  'CompTIA Network+',
  'CompTIA Security+',
  'CompTIA Linux+',
  'CompTIA CySA+',
  'Microsoft Networking, Cloud & Security Fundamentals',
]

const BOOT_DURATION = 7000

type BootStall = {
  start: number
  duration: number
}

function createBootStalls(): BootStall[] {
  return [
    { start: 850 + Math.random() * 450, duration: 420 + Math.random() * 420 },
    { start: 2700 + Math.random() * 500, duration: 520 + Math.random() * 480 },
    { start: 4800 + Math.random() * 450, duration: 360 + Math.random() * 420 },
  ]
}

const desktopFolderPool = [
  'Brass Notes',
  'Ghost Files',
  'Packet Garden',
  'Night Shift',
  'Loose Screws',
  'Pink Archive',
  'Signal Maps',
  'Velvet Engine',
  'Field Kit',
  'Unsorted Stars',
]

const desktopApps = [
  { id: 'arc-mail', name: 'Arc Mail', mark: 'AM' },
  { id: 'clockwork', name: 'Clockwork', mark: 'CW' },
  { id: 'signal', name: 'Signal', mark: 'SG' },
  { id: 'vault', name: 'Vault', mark: 'VT' },
  { id: 'muse', name: 'Muse', mark: 'MS' },
  { id: 'shell', name: 'Shell', mark: '>_' },
]

const desktopFolderSlots = [
  { x: 7, y: 9 },
  { x: 29, y: 18 },
  { x: 57, y: 8 },
  { x: 78, y: 30 },
  { x: 12, y: 61 },
  { x: 42, y: 57 },
  { x: 69, y: 68 },
]

type DesktopFolder = {
  id: string
  label: string
  x: number
  y: number
  rotation: number
}

function createDesktopFolders() {
  const labels = [...desktopFolderPool].sort(() => Math.random() - 0.5).slice(0, 5)
  const slots = [...desktopFolderSlots].sort(() => Math.random() - 0.5).slice(0, 5)

  return labels.map((label, index): DesktopFolder => ({
    id: `${label}-${index}`,
    label,
    x: slots[index].x + (Math.random() * 4 - 2),
    y: slots[index].y + (Math.random() * 4 - 2),
    rotation: Math.random() * 5 - 2.5,
  }))
}

type DesktopWindowKind = 'shell' | 'folder' | 'document'

type DesktopWindowState = {
  id: string
  kind: DesktopWindowKind
  title: string
  x: number
  y: number
  z: number
  folderId?: string
}

type DraggableWindowProps = {
  windowState: DesktopWindowState
  children: ReactNode
  onClose: (id: string) => void
  onFocus: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
}

function DraggableWindow({ windowState, children, onClose, onFocus, onMove }: DraggableWindowProps) {
  const frameRef = useRef<HTMLElement>(null)
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const moveWithinViewport = (x: number, y: number) => {
    const width = frameRef.current?.offsetWidth ?? 420
    const height = frameRef.current?.offsetHeight ?? 320
    onMove(
      windowState.id,
      Math.min(Math.max(8, x), Math.max(8, window.innerWidth - width - 8)),
      Math.min(Math.max(8, y), Math.max(8, window.innerHeight - height - 8)),
    )
  }

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = frameRef.current?.getBoundingClientRect()
    if (!bounds) return
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const drag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const activeDrag = dragRef.current
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) return
    moveWithinViewport(event.clientX - activeDrag.offsetX, event.clientY - activeDrag.offsetY)
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
    setIsDragging(false)
  }

  return (
    <section
      className={`desktop-window desktop-window-${windowState.kind}${isDragging ? ' is-dragging' : ''}`}
      data-window-id={windowState.id}
      ref={frameRef}
      style={{ left: windowState.x, top: windowState.y, zIndex: windowState.z }}
      aria-labelledby={`${windowState.id}-title`}
      onPointerDown={() => onFocus(windowState.id)}
    >
      <div
        className="window-titlebar"
        tabIndex={0}
        onPointerDown={beginDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(event) => {
          const distance = event.shiftKey ? 40 : 12
          if (event.key === 'ArrowLeft') moveWithinViewport(windowState.x - distance, windowState.y)
          else if (event.key === 'ArrowRight') moveWithinViewport(windowState.x + distance, windowState.y)
          else if (event.key === 'ArrowUp') moveWithinViewport(windowState.x, windowState.y - distance)
          else if (event.key === 'ArrowDown') moveWithinViewport(windowState.x, windowState.y + distance)
          else if (event.key === 'Escape') onClose(windowState.id)
          else return
          event.preventDefault()
        }}
        aria-label={`${windowState.title} window. Drag to move, use arrow keys to reposition, or press Escape to close.`}
      >
        <span aria-hidden="true">{windowState.kind === 'folder' ? '▰' : windowState.kind === 'document' ? '▤' : '■'}</span>
        <strong id={`${windowState.id}-title`}>{windowState.title}</strong>
        <small>{windowState.kind === 'shell' ? 'read-only' : windowState.kind}</small>
        <button
          className="window-close"
          type="button"
          aria-label={`Close ${windowState.title}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onClose(windowState.id)}
        >
          ×
        </button>
      </div>
      {children}
    </section>
  )
}

function App() {
  const resumeUrl = `${import.meta.env.BASE_URL}Luci-Crow-Technology-Resume.pdf`
  const powerButtonRef = useRef<HTMLButtonElement>(null)
  const bootOverlayRef = useRef<HTMLElement>(null)
  const desktopRef = useRef<HTMLElement>(null)
  const shellAppRef = useRef<HTMLButtonElement>(null)
  const windowZRef = useRef(20)
  const [isBooting, setIsBooting] = useState(false)
  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
  const [desktopWindows, setDesktopWindows] = useState<DesktopWindowState[]>([])
  const [bootProgress, setBootProgress] = useState(0)
  const [desktopFolders, setDesktopFolders] = useState(createDesktopFolders)
  const [colorVisionMode, setColorVisionMode] = useState<ColorVisionMode>(() => {
    const savedMode = window.localStorage.getItem('lucios-color-vision')
    return colorVisionOptions.some((option) => option.value === savedMode)
      ? savedMode as ColorVisionMode
      : 'standard'
  })

  useEffect(() => {
    document.documentElement.dataset.colorVision = colorVisionMode
    window.localStorage.setItem('lucios-color-vision', colorVisionMode)
  }, [colorVisionMode])

  useEffect(() => {
    if (!isBooting) return

    const previousOverflow = document.body.style.overflow
    const startedAt = performance.now()
    const stalls = createBootStalls()
    const totalStallTime = stalls.reduce((total, stall) => total + stall.duration, 0)
    const activeLoadTime = BOOT_DURATION - totalStallTime

    document.body.style.overflow = 'hidden'
    bootOverlayRef.current?.focus()

    const progressTimer = window.setInterval(() => {
      const elapsed = Math.min(performance.now() - startedAt, BOOT_DURATION)
      const pausedTime = stalls.reduce((total, stall) => {
        if (elapsed <= stall.start) return total
        return total + Math.min(elapsed - stall.start, stall.duration)
      }, 0)
      const activeElapsed = Math.max(0, elapsed - pausedTime)
      setBootProgress(Math.min(100, (activeElapsed / activeLoadTime) * 100))
    }, 60)

    const completionTimer = window.setTimeout(() => {
      setBootProgress(100)
      setIsDesktopOpen(true)
      setIsBooting(false)
      window.requestAnimationFrame(() => desktopRef.current?.focus({ preventScroll: true }))
    }, BOOT_DURATION)

    return () => {
      window.clearInterval(progressTimer)
      window.clearTimeout(completionTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [isBooting])

  const bootStatus = bootProgress < 18
    ? 'Waking mechanical core'
    : bootProgress < 46
      ? 'Aligning drive gears'
      : bootProgress < 76
        ? 'Charging interface rails'
        : 'Opening LuciOS'

  const focusDesktopWindow = (id: string) => {
    const z = ++windowZRef.current
    setDesktopWindows((windows) => windows.map((desktopWindow) => (
      desktopWindow.id === id ? { ...desktopWindow, z } : desktopWindow
    )))
  }

  const moveDesktopWindow = (id: string, x: number, y: number) => {
    setDesktopWindows((windows) => windows.map((desktopWindow) => (
      desktopWindow.id === id ? { ...desktopWindow, x, y } : desktopWindow
    )))
  }

  const closeDesktopWindow = (id: string) => {
    setDesktopWindows((windows) => windows.filter((desktopWindow) => desktopWindow.id !== id))
    if (id === 'shell') {
      window.requestAnimationFrame(() => shellAppRef.current?.focus({ preventScroll: true }))
    }
  }

  const openDesktopWindow = (windowState: Omit<DesktopWindowState, 'z'>) => {
    const z = ++windowZRef.current
    setDesktopWindows((windows) => {
      const existing = windows.find((desktopWindow) => desktopWindow.id === windowState.id)
      if (existing) {
        return windows.map((desktopWindow) => (
          desktopWindow.id === windowState.id ? { ...desktopWindow, z } : desktopWindow
        ))
      }
      return [...windows, { ...windowState, z }]
    })
    window.requestAnimationFrame(() => {
      const titlebar = document.querySelector<HTMLElement>(`[data-window-id="${windowState.id}"] .window-titlebar`)
      titlebar?.focus({ preventScroll: true })
    })
  }

  const centeredWindowPosition = (width: number, height: number, cascade = 0) => ({
    x: Math.max(12, (window.innerWidth - width) / 2 + cascade),
    y: Math.max(12, (window.innerHeight - height) / 2 + cascade),
  })

  const openShell = () => {
    const size = Math.min(500, window.innerWidth - 32, window.innerHeight - 48)
    openDesktopWindow({
      id: 'shell',
      kind: 'shell',
      title: 'Command interface',
      ...centeredWindowPosition(size, size),
    })
  }

  const openFolder = (folder: DesktopFolder) => {
    const width = Math.min(370, window.innerWidth - 32)
    const height = Math.min(280, window.innerHeight - 48)
    openDesktopWindow({
      id: `folder-${folder.id}`,
      kind: 'folder',
      title: folder.label,
      folderId: folder.id,
      ...centeredWindowPosition(width, height, 24),
    })
  }

  const openDocument = (folder: DesktopFolder) => {
    const width = Math.min(470, window.innerWidth - 32)
    const height = Math.min(360, window.innerHeight - 48)
    openDesktopWindow({
      id: `document-${folder.id}`,
      kind: 'document',
      title: `${folder.label}.txt`,
      folderId: folder.id,
      ...centeredWindowPosition(width, height, 48),
    })
  }

  if (isDesktopOpen) {
    return (
      <div className="lucios-desktop">
        <a className="skip-link" href="#desktop-main">Skip to LuciOS desktop</a>

        <header className="desktop-header">
          <div className="desktop-brand">
            <span className="desktop-brand-mark" aria-hidden="true">LC</span>
            <span><strong>LuciOS</strong><small>Desktop prototype // session 01</small></span>
          </div>
          <div className="desktop-header-status" aria-label="LuciOS prototype status">
            <span><i aria-hidden="true" /> Core online</span>
            <button
              type="button"
              className="desktop-exit"
              onClick={() => {
                setDesktopWindows([])
                setIsDesktopOpen(false)
                window.requestAnimationFrame(() => powerButtonRef.current?.focus())
              }}
            >
              <span className="power-glyph" aria-hidden="true" />
              Portfolio
            </button>
          </div>
        </header>

        <nav className="desktop-rail" aria-label="Prototype applications">
          <span className="desktop-rail-label">App rail</span>
          <div className="desktop-rail-track" aria-hidden="true" />
          <div className="desktop-apps">
            {desktopApps.map((app) => {
              const isShell = app.id === 'shell'
              return (
              <button
                type="button"
                className={`desktop-app${isShell ? ' desktop-app-ready' : ''}`}
                disabled={!isShell}
                onClick={isShell ? openShell : undefined}
                ref={isShell ? shellAppRef : undefined}
                key={app.id}
                title={isShell ? 'Open the locked command interface' : 'Prototype app — not connected yet'}
              >
                <span aria-hidden="true">{app.mark}</span>
                <strong>{app.name}</strong>
                <small>{isShell ? 'ready' : 'offline'}</small>
              </button>
              )
            })}
          </div>
        </nav>

        <main
          className="desktop-workspace"
          id="desktop-main"
          tabIndex={-1}
          ref={desktopRef}
          aria-label="LuciOS desktop workspace"
        >
          <section className="desktop-folders" aria-label="Desktop folders">
            <div className="folder-scatter">
              {desktopFolders.map((folder, index) => (
                <button
                  className="desktop-folder"
                  type="button"
                  onClick={() => openFolder(folder)}
                  aria-label={`Open ${folder.label} folder`}
                  key={folder.id}
                  style={{
                    left: `${folder.x}%`,
                    top: `${folder.y}%`,
                    transform: `rotate(${folder.rotation}deg)`,
                  }}
                >
                  <span className="folder-shape" aria-hidden="true"><i>{String(index + 1).padStart(2, '0')}</i></span>
                  <strong>{folder.label}</strong>
                  <small>folder</small>
                </button>
              ))}
            </div>
          </section>

          <aside
            className="desktop-intake-machine"
            role="img"
            aria-label="Application intake machine. Hand interface is not connected yet."
          >
            <div className="machine-funnel machine-funnel-top" aria-hidden="true"><i /></div>
            <div className="machine-funnel machine-funnel-side" aria-hidden="true"><i /></div>
            <div className="machine-body" aria-hidden="true">
              <span className="machine-rivet machine-rivet-one" />
              <span className="machine-rivet machine-rivet-two" />
              <span className="machine-rivet machine-rivet-three" />
              <span className="machine-rivet machine-rivet-four" />
              <span className="machine-slot" />
              <span className="machine-gear machine-gear-large">✦</span>
              <span className="machine-gear machine-gear-small">✦</span>
              <strong>APP INTAKE</strong>
              <small>HAND PORT // STANDBY</small>
            </div>
            <div className="machine-feet" aria-hidden="true"><i /><i /></div>
          </aside>

          {desktopWindows.map((desktopWindow) => {
            const folder = desktopFolders.find((candidate) => candidate.id === desktopWindow.folderId)
            return (
              <DraggableWindow
                windowState={desktopWindow}
                onClose={closeDesktopWindow}
                onFocus={focusDesktopWindow}
                onMove={moveDesktopWindow}
                key={desktopWindow.id}
              >
                {desktopWindow.kind === 'shell' && (
                  <div className="command-screen" aria-label="Command interface preview. Input is disabled.">
                    <p><span>LuciOS kernel</span> prototype channel</p>
                    <p>mounting /desktop ................ <b>ok</b></p>
                    <p>hand_interface ................... <b>pending</b></p>
                    <p>command_input .................... <b>locked</b></p>
                    <div className="command-seal">
                      <strong>INPUT LOCKED</strong>
                      <span>Command module not connected yet.</span>
                    </div>
                    <p className="command-prompt" aria-hidden="true">luci@lucios:~$ <i /></p>
                  </div>
                )}

                {desktopWindow.kind === 'folder' && folder && (
                  <div className="folder-window-body">
                    <p className="window-path">luci://desktop/{folder.label.toLowerCase().replaceAll(' ', '-')}</p>
                    <button className="text-document-icon" type="button" onClick={() => openDocument(folder)}>
                      <span aria-hidden="true">TXT</span>
                      <strong>manifest.txt</strong>
                      <small>Text document</small>
                    </button>
                  </div>
                )}

                {desktopWindow.kind === 'document' && folder && (
                  <article className="document-window-body">
                    <p className="document-kicker">LuciOS text viewer // read only</p>
                    <h2>{folder.label}</h2>
                    <p>This document belongs to the <strong>{folder.label}</strong> folder.</p>
                    <p>The folder and file system are currently a visual prototype. Nothing here writes to disk, collects visitor input, or connects to the command interface.</p>
                    <p className="document-note">Future content can replace this note without changing the reusable window system.</p>
                  </article>
                )}
              </DraggableWindow>
            )
          })}
        </main>

        <footer className="desktop-footer">
          <span>LUCIOS // EXPERIMENTAL DESKTOP</span>
          <span>Folders contain prototype files; unlit applications remain placeholders.</span>
        </footer>
      </div>
    )
  }

  return (
    <div className="site-shell" id="top" aria-busy={isBooting}>
      <a className="skip-link" href="#main-content">Skip to portfolio content</a>

      {isBooting && (
        <section
          className="boot-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="boot-title"
          aria-describedby="boot-status"
          tabIndex={-1}
          ref={bootOverlayRef}
        >
          <div className="boot-console">
            <p className="boot-kicker">System start // portfolio interface</p>
            <h2 id="boot-title">LuciOS</h2>
            <div className="boot-drive" aria-hidden="true">
              <div className="boot-progress-fill" style={{ width: `${bootProgress}%` }} />
              <span className="boot-gear boot-gear-one">✦</span>
              <span className="boot-gear boot-gear-two">✦</span>
              <span className="boot-gear boot-gear-three">✦</span>
            </div>
            <div
              className="boot-progress"
              role="progressbar"
              aria-label="LuciOS startup progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(bootProgress)}
            >
              <span>{String(Math.round(bootProgress)).padStart(2, '0')}%</span>
              <span id="boot-status" aria-live="polite">{bootStatus}</span>
            </div>
          </div>
        </section>
      )}

      <header className="topbar" aria-label="LuciOS header">
        <a className="wordmark" href="#top" aria-label="LuciOS home">
          <span className="wordmark-mark" aria-hidden="true">LC</span>
          <span>
            <strong>LuciOS</strong>
            <small>Professional portfolio / v1.1</small>
          </span>
        </a>
        <div className="topbar-tools">
          <button
            className="power-button"
            type="button"
            onClick={() => {
              setBootProgress(0)
              setDesktopFolders(createDesktopFolders())
              setDesktopWindows([])
              setIsBooting(true)
            }}
            disabled={isBooting}
            aria-label="Start the LuciOS interface"
            ref={powerButtonRef}
          >
            <span className="power-glyph" aria-hidden="true" />
            <span>Start LuciOS</span>
          </button>
          <label className="vision-setting" htmlFor="color-vision-mode">
            <span>Color vision</span>
            <select
              id="color-vision-mode"
              value={colorVisionMode}
              onChange={(event) => setColorVisionMode(event.target.value as ColorVisionMode)}
            >
              {colorVisionOptions.map((option) => (
                <option value={option.value} key={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <div className="system-status" aria-label="System status: portfolio online">
            <span className="status-light" aria-hidden="true" /> portfolio online
          </div>
        </div>
      </header>

      <nav className="app-rail" aria-label="Portfolio sections">
        <div className="rail-track" aria-hidden="true" />
        {[
          ['about', 'About'],
          ['projects', 'Projects'],
          ['skills', 'Skills'],
          ['resume', 'Resume'],
          ['contact', 'Contact'],
          ['reflection', 'Reflection'],
        ].map(([target, label], index) => (
          <a className="rail-tag" href={`#${target}`} key={target}>
            <span aria-hidden="true">0{index + 1}</span>
            {label}
          </a>
        ))}
      </nav>

      <main id="main-content">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Technology portfolio of Luci Crow</p>
            <h1 id="hero-title">The portfolio<br /><em>is the interface.</em></h1>
            <p className="hero-lede">
              Explore seven years of hands-on IT experience, security-focused training, and software projects built to solve practical problems.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">Explore projects</a>
              <a className="button secondary" href={resumeUrl} target="_blank" rel="noreferrer">Open resume</a>
            </div>
          </div>

          <div className="hero-machine" aria-hidden="true">
            <div className="machine-pipe pipe-top" />
            <div className="machine-screen">
              <span className="screen-label">LUCILIGHT // PROFILE</span>
              <strong>IT + SOFTWARE<br />+ SECURITY</strong>
              <span className="cursor-block" />
            </div>
            <div className="machine-pipe pipe-right" />
            <div className="gear gear-one">✦</div>
            <div className="gear gear-two">✦</div>
          </div>
        </section>

        <section className="quick-proof" aria-label="Professional highlights">
          <div><strong>7+</strong><span>years in information technology</span></div>
          <div><strong>5</strong><span>current CompTIA certifications</span></div>
          <div><strong>3</strong><span>featured technical projects</span></div>
          <div><strong>AA</strong><span>accessibility-minded design target</span></div>
        </section>

        <section className="content-section about-grid" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="eyebrow">01 / Professional introduction</p>
            <h2 id="about-title">About Luci</h2>
          </div>
          <div className="panel prose-panel">
            <p>
              I’m Luci Crow, a Computer Science student at Skagit Valley College with professional experience spanning end-user support, networking, system deployment, hardware repair, Active Directory, and technical operations. Over seven years in information technology, I have worked as a technician, network specialist, engineering specialist, help-desk technician, domain administrator, and senior support technician. Those roles taught me how to diagnose problems methodically, communicate clearly with users, and carry an issue through to a reliable resolution.
            </p>
            <p>
              My current interests connect cybersecurity, systems administration, networking, and full-stack software development. I enjoy building tools that make technical work easier to understand and manage, especially when practical infrastructure knowledge can improve the design. My long-term goal is to move into a security-focused technology role where I can combine my certifications with deeper hands-on experience while continuing to grow as a developer and problem solver.
            </p>
          </div>
        </section>

        <section className="content-section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">02 / Featured work</p>
              <h2 id="projects-title">Projects with evidence</h2>
            </div>
            <p>Real repositories, documented decisions, and honest outcomes. No simulated project claims.</p>
          </div>

          <div className="projects-list">
            {projects.map((project, index) => (
              <article className="project-card" id={project.id} key={project.id}>
                <div className="project-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
                <div className="project-body">
                  <p className="eyebrow">{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <div className="project-detail-grid">
                    <div>
                      <h4>My role</h4>
                      <p>{project.role}</p>
                    </div>
                    <div>
                      <h4>Decisions that mattered</h4>
                      <ul>
                        {project.decisions.map((decision) => <li key={decision}>{decision}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="project-outcome">
                    <h4>Outcome & lessons</h4>
                    <p>{project.outcome}</p>
                  </div>
                  <ul className="tech-list" aria-label={`${project.title} technologies`}>
                    {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                  {project.evidenceUrl ? (
                    <a className="evidence-link" href={project.evidenceUrl} target="_blank" rel="noreferrer">
                      {project.evidenceLabel}<span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <a className="evidence-link current-project" href="#top">
                      {project.evidenceLabel}<span aria-hidden="true">↑</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading">
            <p className="eyebrow">03 / Skills and tools</p>
            <h2 id="skills-title">Practical range, honestly represented</h2>
          </div>
          <div className="skills-grid">
            {skillGroups.map((group) => (
              <article className="skill-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="cert-strip">
            <strong>Certifications</strong>
            <ul>{certifications.map((certification) => <li key={certification}>{certification}</li>)}</ul>
          </div>
        </section>

        <section className="content-section resume-grid" id="resume" aria-labelledby="resume-title">
          <div className="section-heading">
            <p className="eyebrow">04 / Resume and links</p>
            <h2 id="resume-title">The conventional route is always open.</h2>
            <p className="section-intro">No animation or custom interface is required to reach the essentials.</p>
          </div>
          <div className="panel resume-panel">
            <span className="document-mark" aria-hidden="true">PDF</span>
            <div>
              <h3>Luci Crow — Technology Resume</h3>
              <p>Professional experience, education, certifications, and technical competencies.</p>
              <div className="inline-actions">
                <a className="button primary" href={resumeUrl} target="_blank" rel="noreferrer">Preview resume</a>
                <a className="text-link" href={resumeUrl} download>Download PDF</a>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section contact-section" id="contact" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow">05 / Contact</p>
            <h2 id="contact-title">Let’s solve something difficult.</h2>
            <p>I’m interested in opportunities connecting support, systems, networking, security, and software.</p>
          </div>
          <address className="contact-links">
            <a href="mailto:lucileecrow@gmail.com"><span>Email</span>lucileecrow@gmail.com</a>
            <a href="tel:+13605426335"><span>Phone</span>(360) 542-6335</a>
            <a href="https://github.com/LucisLight" target="_blank" rel="noreferrer"><span>GitHub</span>github.com/LucisLight</a>
            <p><span>Location</span>Sedro-Woolley, Washington</p>
          </address>
        </section>

        <section className="content-section reflection-section" id="reflection" aria-labelledby="reflection-title">
          <div className="section-heading">
            <p className="eyebrow">06 / Reflection</p>
            <h2 id="reflection-title">Why this portfolio exists</h2>
          </div>
          <div className="panel prose-panel reflection-copy">
            <p>
              I chose to build a personal React website because it gives me direct control over both the professional content and the experience around it. GitHub also lets reviewers see the work behind the finished portfolio instead of only seeing a template. CorvusDesk best represents my current abilities because it combines a React frontend, Spring Boot backend, MongoDB data, access levels, ticket history, filtering, sorting, and testing in one practical help-desk system. It connects my software development work with the support environments I already understand professionally.
            </p>
            <p>
              In future versions, I want to expand LuciOS with a reusable pixel-shadow hand, a mechanical application conveyor, richer screenshots and code explanations, and a safe simulated terminal. I would also like to continue improving performance, responsive behavior, and accessibility as the visual system becomes more animated. This portfolio supports my career goals by putting my certifications, IT experience, technical judgment, and software projects in one public place that employers can explore without needing access to a private system or classroom submission.
            </p>
          </div>
        </section>
      </main>

      <a className="back-to-top" href="#top" aria-label="Back to the top of the portfolio">
        <span aria-hidden="true">↑</span>
        Back to top
      </a>

      <footer>
        <p><strong>LuciOS</strong> — designed and built by Luci Crow.</p>
        <p>Color-vision settings are saved only in this browser.</p>
      </footer>
    </div>
  )
}

export default App

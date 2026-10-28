import type { RefObject } from 'react'
import DraggableDesktopFolder from './DraggableDesktopFolder'
import DraggableWindow from './DraggableWindow'
import EvilLuciLoader from './EvilLuciLoader'
import ShellTerminal from './ShellTerminal'
import type { EvilBootPhase } from './useEvilBoot'
import { corruptLabel } from './corruption'
import GameWindow from './games/GameWindow'
import { gameAppIds } from './games/gameRegistry'
import { desktopApps, type AppTransfer, type DesktopApp, type DesktopFolder, type DesktopWindowState, type WindowEjection } from './model'

type LuciOSDesktopProps = {
  desktopRef: RefObject<HTMLElement | null>
  machineFunnelRef: RefObject<HTMLDivElement | null>
  machineOutputRef: RefObject<HTMLDivElement | null>
  desktopFolders: DesktopFolder[]
  desktopWindows: DesktopWindowState[]
  appTransfer: AppTransfer | null
  windowEjection: WindowEjection | null
  machineProgress: number
  resumeUrl: string
  onExit: () => void
  onLaunchApp: (app: DesktopApp, launcher: HTMLButtonElement) => void
  onOpenFolder: (folder: DesktopFolder) => void
  onMoveFolder: (id: string, x: number, y: number) => void
  onOpenDocument: (folder: DesktopFolder) => void
  onCloseWindow: (id: string) => void
  onFocusWindow: (id: string) => void
  onMoveWindow: (id: string, x: number, y: number) => void
  evilPhase: EvilBootPhase
  evilProgress: number
  onEvilLuci: () => void
  credits: number
  onCreditDelta: (delta: number) => void
}

export default function LuciOSDesktop({
  desktopRef, machineFunnelRef, machineOutputRef, desktopFolders, desktopWindows,
  appTransfer, windowEjection, machineProgress, resumeUrl, onExit, onLaunchApp,
  onOpenFolder, onMoveFolder, onOpenDocument, onCloseWindow, onFocusWindow, onMoveWindow,
  evilPhase, evilProgress, onEvilLuci,
  credits, onCreditDelta,
}: LuciOSDesktopProps) {
  const evilActive = evilPhase === 'active'
  return (
        <div className={`lucios-desktop${evilActive ? ' evil-mode' : ''}`}>
          <a className="skip-link" href="#desktop-main">Skip to LuciOS desktop</a>
  
          <header className="desktop-header">
            <div className="desktop-brand">
              <span className="desktop-brand-mark" aria-hidden="true">LC</span>
              <span><strong>{evilActive ? 'EvilLuciOS' : 'LuciOS'}</strong><small>{evilActive ? 'Shadow kernel // awakened' : 'Desktop prototype // session 01'}</small></span>
            </div>
            <div className="desktop-header-status" aria-label="LuciOS prototype status">
              <span className="credit-counter">¢ {credits} credits</span>
              <span><i aria-hidden="true" /> Core online</span>
              <button
                type="button"
                className="desktop-exit"
                onClick={onExit}
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
                const isCarried = appTransfer?.appId === app.id
                  && ['gripping', 'carrying', 'dropping'].includes(appTransfer.phase)
                return (
                <button
                  type="button"
                  className={`desktop-app desktop-app-ready${isCarried ? ' is-transferring' : ''}`}
                  disabled={Boolean(appTransfer || windowEjection)}
                  onClick={(event) => onLaunchApp(app, event.currentTarget)}
                  data-app-id={app.id}
                  key={app.id}
                  title={`Send ${app.name} through the application intake machine`}
                >
                  <span aria-hidden="true">{app.mark}</span>
                  <strong>{evilActive ? corruptLabel(app.name) : app.name}</strong>
                  <small>{evilActive ? 'corrupted' : 'ready'}</small>
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
                  <DraggableDesktopFolder
                    folder={folder}
                    index={index}
                    workspaceRef={desktopRef}
                    onOpen={onOpenFolder}
                    onMove={onMoveFolder}
                    corrupted={evilActive}
                    key={folder.id}
                  />
                ))}
              </div>
            </section>
  
            <aside
              className={`desktop-intake-machine${machineProgress > 0 ? ' is-processing' : ''}${appTransfer?.phase === 'dropping' ? ' is-receiving' : ''}${windowEjection ? ' is-ejecting' : ''}`}
              aria-label="Application intake machine"
            >
              <div className="machine-funnel machine-funnel-top" aria-hidden="true" ref={machineFunnelRef}><i /></div>
              <div className="machine-funnel machine-funnel-side" aria-hidden="true" ref={machineOutputRef}><i /></div>
              <div className="machine-body" aria-hidden="true">
                <span className="machine-rivet machine-rivet-one" />
                <span className="machine-rivet machine-rivet-two" />
                <span className="machine-rivet machine-rivet-three" />
                <span className="machine-rivet machine-rivet-four" />
                <span
                  className="machine-slot"
                  role="progressbar"
                  aria-label={appTransfer ? `Processing ${appTransfer.appName}` : 'Application processor idle'}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={machineProgress}
                >
                  <i style={{ width: `${machineProgress}%` }} />
                </span>
                <span className="machine-gear machine-gear-large">✦</span>
                <span className="machine-gear machine-gear-small">✦</span>
                <strong>APP INTAKE</strong>
                <small>{machineProgress > 0 ? `PROCESSING // ${machineProgress}%` : 'HAND PORT // READY'}</small>
              </div>
              <div className="machine-feet" aria-hidden="true"><i /><i /></div>
            </aside>
  
            {desktopWindows.map((desktopWindow) => {
              const folder = desktopFolders.find((candidate) => candidate.id === desktopWindow.folderId)
              return (
                <DraggableWindow
                  windowState={desktopWindow}
                  onClose={onCloseWindow}
                  onFocus={onFocusWindow}
                  onMove={onMoveWindow}
                  key={desktopWindow.id}
                >
                  {desktopWindow.kind === 'shell' && (
                    <ShellTerminal onEvilLuci={onEvilLuci} evilActive={evilPhase !== 'idle'} />
                  )}
  
                  {desktopWindow.kind === 'app' && (() => {
                    const app = desktopApps.find((candidate) => candidate.id === desktopWindow.appId)
                    if (!app) return null

                    if (gameAppIds.includes(app.id)) return <GameWindow appId={app.id} credits={credits} onCreditDelta={onCreditDelta} />
  
                    if (app.id === 'vault') return (
                      <div className="vault-window-body">
                        <header className="vault-window-heading">
                          <span aria-hidden="true">VT</span>
                          <div>
                            <p className="app-window-kicker">LuciOS evidence vault // live links</p>
                            <h2>Professional archive</h2>
                            <p>Resume, source repositories, and original planning documents.</p>
                          </div>
                        </header>
                        <div className="vault-files">
                          <a href={resumeUrl} target="_blank" rel="noreferrer">
                            <span aria-hidden="true">PDF</span><strong>Technology Resume</strong><small>Open downloadable PDF</small>
                          </a>
                          <a href="https://github.com/LucisLight" target="_blank" rel="noreferrer">
                            <span aria-hidden="true">GH</span><strong>GitHub Profile</strong><small>View public work</small>
                          </a>
                          <a href="https://github.com/LucisLight/CorvusDesk" target="_blank" rel="noreferrer">
                            <span aria-hidden="true">CD</span><strong>CorvusDesk</strong><small>Source and documentation</small>
                          </a>
                          <a href="https://github.com/LucisLight/Battleship-Game" target="_blank" rel="noreferrer">
                            <span aria-hidden="true">BS</span><strong>Battleship Game</strong><small>Java project source</small>
                          </a>
                          <a href="https://github.com/LucisLight/LuciOS" target="_blank" rel="noreferrer">
                            <span aria-hidden="true">OS</span><strong>LuciOS Source</strong><small>Portfolio repository</small>
                          </a>
                          <a href="https://github.com/LucisLight/LuciOS/tree/main/documentation/original-package" target="_blank" rel="noreferrer">
                            <span aria-hidden="true">DOC</span><strong>Original Documentation</strong><small>Complete v1.1 planning package</small>
                          </a>
                        </div>
                        <div className="vault-window-status"><i aria-hidden="true" /> Six verified public destinations mounted.</div>
                      </div>
                    )
  
                    return (
                      <div className="app-window-body">
                        <span aria-hidden="true">{app.mark}</span>
                        <p className="app-window-kicker">LuciOS module // prototype output</p>
                        <h2>{app.name}</h2>
                        <p>{app.description}</p>
                        <div className="app-window-status"><i aria-hidden="true" /> Module frame loaded. Internal tools are not connected yet.</div>
                      </div>
                    )
                  })()}
  
                  {desktopWindow.kind === 'folder' && folder && (
                    <div className="folder-window-body">
                      <p className="window-path">luci://desktop/{folder.label.toLowerCase().replaceAll(' ', '-')}</p>
                      <button className="text-document-icon" type="button" onClick={() => onOpenDocument(folder)}>
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
  
          {appTransfer && (
            <div
              className={`pixel-hand phase-${appTransfer.phase}`}
              style={{ left: appTransfer.x, top: appTransfer.y }}
              aria-hidden="true"
            >
              <span className="pixel-hand-arm" />
              <span className="pixel-hand-wrist" />
              <span className="pixel-hand-palm" />
              <span className="pixel-finger pixel-finger-one" />
              <span className="pixel-finger pixel-finger-two" />
              <span className="pixel-finger pixel-finger-three" />
              <span className="pixel-finger pixel-thumb" />
              <span className="hand-payload">
                <i>{appTransfer.appMark}</i>
                <strong>{appTransfer.appName}</strong>
              </span>
            </div>
          )}
  
          {windowEjection && (
            <div
              className={`window-cartridge phase-${windowEjection.phase}`}
              style={{ left: windowEjection.x, top: windowEjection.y }}
              aria-hidden="true"
            >
              <span className="cartridge-rivet cartridge-rivet-one" />
              <span className="cartridge-rivet cartridge-rivet-two" />
              <i>{windowEjection.appMark}</i>
              <strong>{windowEjection.appName}</strong>
              <small>WINDOW OUTPUT</small>
            </div>
          )}
  
          <p className="sr-only" role="status" aria-live="polite">
            {windowEjection
              ? `Machine is ejecting the ${windowEjection.appName} window.`
              : appTransfer?.phase === 'processing'
              ? `Machine processing ${appTransfer.appName}: ${machineProgress} percent.`
              : appTransfer
                ? `Pixel hand is moving ${appTransfer.appName} to the application intake machine.`
                : 'Application intake machine ready.'}
          </p>

          <EvilLuciLoader phase={evilPhase} progress={evilProgress} />
  
          <footer className="desktop-footer">
            <span>LUCIOS // EXPERIMENTAL DESKTOP</span>
            <span>Drag folders to rearrange; rail apps route through the intake machine.</span>
          </footer>
        </div>
  )
}

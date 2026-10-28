import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import LuciOSDesktop from './desktop/LuciOSDesktop'
import { useEvilBoot } from './desktop/useEvilBoot'
import PortfolioPage from './portfolio/PortfolioPage'
import { colorVisionOptions, type ColorVisionMode } from './data/portfolio'
import {
  BOOT_DURATION, createBootStalls, createDesktopFolders, waitFor,
  type AppTransfer, type DesktopApp, type DesktopFolder, type DesktopWindowState, type WindowEjection,
} from './desktop/model'

function App() {
  const evilBoot = useEvilBoot()
  const resumeUrl = `${import.meta.env.BASE_URL}Luci-Crow-Technology-Resume.pdf`
  const powerButtonRef = useRef<HTMLButtonElement>(null)
  const bootOverlayRef = useRef<HTMLElement>(null)
  const desktopRef = useRef<HTMLElement>(null)
  const machineFunnelRef = useRef<HTMLDivElement>(null)
  const machineOutputRef = useRef<HTMLDivElement>(null)
  const transferRunRef = useRef(0)
  const isTransferActiveRef = useRef(false)
  const windowZRef = useRef(20)
  const [isBooting, setIsBooting] = useState(false)
  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
  const [desktopWindows, setDesktopWindows] = useState<DesktopWindowState[]>([])
  const [appTransfer, setAppTransfer] = useState<AppTransfer | null>(null)
  const [windowEjection, setWindowEjection] = useState<WindowEjection | null>(null)
  const [machineProgress, setMachineProgress] = useState(0)
  const [credits, setCredits] = useState(100)
  const [bootProgress, setBootProgress] = useState(0)
  const [desktopFolders, setDesktopFolders] = useState(createDesktopFolders)
  const [colorVisionMode, setColorVisionMode] = useState<ColorVisionMode>(() => {
    const savedMode = window.localStorage.getItem('lucios-color-vision')
    return colorVisionOptions.some((option) => option.value === savedMode)
      ? savedMode as ColorVisionMode
      : 'standard'
  })
  const adjustCredits = useCallback((delta: number) => setCredits((current) => Math.max(0, current + delta)), [])

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

  const resizeDesktopWindow = (id: string, x: number, y: number, width: number, height: number) => {
    setDesktopWindows((windows) => windows.map((desktopWindow) => (
      desktopWindow.id === id ? { ...desktopWindow, x, y, width, height } : desktopWindow
    )))
  }

  const closeDesktopWindow = (id: string) => {
    setDesktopWindows((windows) => windows.filter((desktopWindow) => desktopWindow.id !== id))
    const launcherId = id === 'shell' ? 'shell' : id.startsWith('app-') ? id.slice(4) : null
    if (launcherId) window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-app-id="${launcherId}"]`)?.focus({ preventScroll: true })
    })
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

  const ejectedWindowPosition = (width: number, height: number, center?: { x: number; y: number }) => {
    if (!center) return centeredWindowPosition(width, height, 32)
    return {
      x: Math.min(Math.max(12, center.x - width / 2), Math.max(12, window.innerWidth - width - 12)),
      y: Math.min(Math.max(12, center.y - height / 2), Math.max(12, window.innerHeight - height - 12)),
    }
  }

  const openShell = (origin?: { x: number; y: number }) => {
    const width = Math.min(760, window.innerWidth - 32)
    const height = Math.min(500, window.innerHeight - 48)
    openDesktopWindow({
      id: 'shell',
      kind: 'shell',
      title: 'Command interface',
      width,
      height,
      ...ejectedWindowPosition(width, height, origin),
    })
  }

  const openPrototypeApp = (app: DesktopApp, origin?: { x: number; y: number }) => {
    if (app.id === 'shell') {
      openShell(origin)
      return
    }

    const isGame = ['snake', 'stackfall', 'fleet-destroyer', 'brickbreaker', 'slots'].includes(app.id)
    const width = Math.min(isGame ? 720 : app.id === 'vault' ? 680 : 460, window.innerWidth - 32)
    const height = Math.min(isGame ? 600 : app.id === 'vault' ? 470 : 340, window.innerHeight - 48)
    openDesktopWindow({
      id: `app-${app.id}`,
      kind: 'app',
      title: app.name,
      appId: app.id,
      width,
      height,
      ...ejectedWindowPosition(width, height, origin),
    })
  }

  const launchDesktopApp = async (app: DesktopApp, launcher: HTMLButtonElement) => {
    if (isTransferActiveRef.current) return
    isTransferActiveRef.current = true

    const funnel = machineFunnelRef.current?.getBoundingClientRect()
    const source = launcher.getBoundingClientRect()
    if (!funnel) {
      openPrototypeApp(app)
      isTransferActiveRef.current = false
      return
    }

    const runId = ++transferRunRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = (milliseconds: number) => reducedMotion ? Math.max(40, milliseconds * .12) : milliseconds
    const stillRunning = () => transferRunRef.current === runId
    const appX = source.left + source.width / 2
    const appY = source.top + source.height / 2
    const funnelX = funnel.left + funnel.width / 2
    const funnelY = funnel.top + funnel.height * .22

    setMachineProgress(0)
    setAppTransfer({
      appId: app.id,
      appName: app.name,
      appMark: app.mark,
      phase: 'entering',
      x: window.innerWidth + 150,
      y: appY,
    })

    await waitFor(duration(80))
    if (!stillRunning()) return
    setAppTransfer((transfer) => transfer ? { ...transfer, phase: 'reaching', x: appX, y: appY } : null)

    await waitFor(duration(720))
    if (!stillRunning()) return
    setAppTransfer((transfer) => transfer ? { ...transfer, phase: 'gripping' } : null)

    await waitFor(duration(360))
    if (!stillRunning()) return
    setAppTransfer((transfer) => transfer ? { ...transfer, phase: 'carrying', x: funnelX, y: funnelY } : null)

    await waitFor(duration(1150))
    if (!stillRunning()) return
    setAppTransfer((transfer) => transfer ? { ...transfer, phase: 'dropping' } : null)

    await waitFor(duration(360))
    if (!stillRunning()) return
    setMachineProgress(8)
    setAppTransfer((transfer) => transfer ? {
      ...transfer,
      phase: 'exiting',
      x: window.innerWidth + 160,
      y: Math.max(70, funnelY - 60),
    } : null)

    await waitFor(duration(620))
    if (!stillRunning()) return
    setAppTransfer((transfer) => transfer ? { ...transfer, phase: 'processing' } : null)

    const progressStops = [
      { value: 24, pause: 360 },
      { value: 41, pause: 470 },
      { value: 68, pause: 310 },
      { value: 83, pause: 430 },
      { value: 100, pause: 340 },
    ]
    for (const progress of progressStops) {
      await waitFor(duration(progress.pause))
      if (!stillRunning()) return
      setMachineProgress(progress.value)
    }

    await waitFor(duration(240))
    if (!stillRunning()) return

    const output = machineOutputRef.current?.getBoundingClientRect()
    const outputOrigin = output ? {
      x: Math.max(110, output.left - 82),
      y: output.top + output.height / 2,
    } : undefined

    if (output && outputOrigin) {
      setWindowEjection({
        appName: app.name,
        appMark: app.mark,
        phase: 'loaded',
        x: output.left + 12,
        y: output.top + output.height / 2,
      })
      await waitFor(duration(70))
      if (!stillRunning()) return
      setWindowEjection((ejection) => ejection ? { ...ejection, phase: 'spitting', ...outputOrigin } : null)
      await waitFor(duration(620))
      if (!stillRunning()) return
      setWindowEjection((ejection) => ejection ? { ...ejection, phase: 'unfolding' } : null)
      await waitFor(duration(560))
      if (!stillRunning()) return
    }

    openPrototypeApp(app, outputOrigin)
    setMachineProgress(0)
    setAppTransfer(null)
    setWindowEjection(null)
    isTransferActiveRef.current = false
  }

  const openFolder = (folder: DesktopFolder) => {
    const width = Math.min(370, window.innerWidth - 32)
    const height = Math.min(280, window.innerHeight - 48)
    openDesktopWindow({
      id: `folder-${folder.id}`,
      kind: 'folder',
      title: folder.label,
      folderId: folder.id,
      width,
      height,
      ...centeredWindowPosition(width, height, 24),
    })
  }

  const moveDesktopFolder = (id: string, x: number, y: number) => {
    setDesktopFolders((folders) => folders.map((folder) => (
      folder.id === id ? { ...folder, x, y, rotation: 0 } : folder
    )))
  }

  const openDocument = (folder: DesktopFolder) => {
    const width = Math.min(470, window.innerWidth - 32)
    const height = Math.min(360, window.innerHeight - 48)
    openDesktopWindow({
      id: `document-${folder.id}`,
      kind: 'document',
      title: `${folder.label}.txt`,
      folderId: folder.id,
      width,
      height,
      ...centeredWindowPosition(width, height, 48),
    })
  }

  const exitDesktop = () => {
    transferRunRef.current += 1
    isTransferActiveRef.current = false
    setAppTransfer(null)
    setWindowEjection(null)
    setMachineProgress(0)
    setDesktopWindows([])
    evilBoot.reset()
    setIsDesktopOpen(false)
    window.requestAnimationFrame(() => powerButtonRef.current?.focus())
  }

  const startDesktop = () => {
    transferRunRef.current += 1
    isTransferActiveRef.current = false
    setBootProgress(0)
    setDesktopFolders(createDesktopFolders())
    setDesktopWindows([])
    setAppTransfer(null)
    setWindowEjection(null)
    setMachineProgress(0)
    evilBoot.reset()
    setCredits(100)
    setIsBooting(true)
  }

  if (isDesktopOpen) return <LuciOSDesktop
    desktopRef={desktopRef} machineFunnelRef={machineFunnelRef} machineOutputRef={machineOutputRef}
    desktopFolders={desktopFolders} desktopWindows={desktopWindows} appTransfer={appTransfer}
    windowEjection={windowEjection} machineProgress={machineProgress} resumeUrl={resumeUrl}
    onExit={exitDesktop} onLaunchApp={launchDesktopApp} onOpenFolder={openFolder}
    onMoveFolder={moveDesktopFolder} onOpenDocument={openDocument} onCloseWindow={closeDesktopWindow}
    onFocusWindow={focusDesktopWindow} onMoveWindow={moveDesktopWindow} onResizeWindow={resizeDesktopWindow}
    evilPhase={evilBoot.phase} evilProgress={evilBoot.progress} onEvilLuci={evilBoot.start}
    credits={credits} onCreditDelta={adjustCredits}
  />

  return <PortfolioPage
    resumeUrl={resumeUrl} isBooting={isBooting} bootProgress={bootProgress} bootStatus={bootStatus}
    bootOverlayRef={bootOverlayRef} powerButtonRef={powerButtonRef} colorVisionMode={colorVisionMode}
    onColorVisionModeChange={setColorVisionMode} onStart={startDesktop}
  />
}

export default App

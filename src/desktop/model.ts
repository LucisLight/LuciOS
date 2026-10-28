export const BOOT_DURATION = 7000

type BootStall = {
  start: number
  duration: number
}

export function createBootStalls(): BootStall[] {
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

export const desktopApps = [
  { id: 'snake', name: 'Snake', mark: 'SN', description: 'A compact signal-serpent arcade module.' },
  { id: 'stackfall', name: 'Stackfall', mark: 'SF', description: 'An original falling-block gravity stack.' },
  { id: 'fleet-destroyer', name: 'Fleet Destroyer', mark: 'FD', description: 'A compact naval strategy game with randomized fleets.' },
  { id: 'brickbreaker', name: 'Brickbreaker', mark: 'BR', description: 'A paddle-driven impact chamber full of breakable bricks.' },
  { id: 'slots', name: 'Lucky Circuit', mark: '$', description: 'A three-line slot engine powered by LuciOS credits.' },
  { id: 'vault', name: 'Vault', mark: 'VT', description: 'A sealed storage interface prepared for protected portfolio artifacts.' },
  { id: 'shell', name: 'Shell', mark: '>_', description: 'The locked LuciOS command interface.' },
]

export type DesktopApp = (typeof desktopApps)[number]

const desktopFolderSlots = [
  { x: 7, y: 9 },
  { x: 29, y: 18 },
  { x: 57, y: 8 },
  { x: 78, y: 30 },
  { x: 12, y: 61 },
  { x: 42, y: 57 },
  { x: 69, y: 68 },
]

export type DesktopFolder = {
  id: string
  label: string
  x: number
  y: number
  rotation: number
}

export function createDesktopFolders() {
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

type DesktopWindowKind = 'shell' | 'folder' | 'document' | 'app'

export type DesktopWindowState = {
  id: string
  kind: DesktopWindowKind
  title: string
  x: number
  y: number
  z: number
  folderId?: string
  appId?: string
}

type HandPhase = 'entering' | 'reaching' | 'gripping' | 'carrying' | 'dropping' | 'processing' | 'exiting'

export type AppTransfer = {
  appId: string
  appName: string
  appMark: string
  phase: HandPhase
  x: number
  y: number
}

type EjectionPhase = 'loaded' | 'spitting' | 'unfolding'

export type WindowEjection = {
  appName: string
  appMark: string
  phase: EjectionPhase
  x: number
  y: number
}

export function waitFor(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds))
}

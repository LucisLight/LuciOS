import { useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import type { DesktopFolder } from './model'
import { corruptLabel } from './corruption'

type DraggableDesktopFolderProps = {
  folder: DesktopFolder
  index: number
  workspaceRef: RefObject<HTMLElement | null>
  onOpen: (folder: DesktopFolder) => void
  onMove: (id: string, x: number, y: number) => void
  corrupted?: boolean
}

function DraggableDesktopFolder({ folder, index, workspaceRef, onOpen, onMove, corrupted = false }: DraggableDesktopFolderProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null)
  const didDragRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const moveWithinWorkspace = (x: number, y: number) => {
    const workspace = workspaceRef.current?.getBoundingClientRect()
    const button = buttonRef.current
    if (!workspace || !button) return
    const maxX = Math.max(0, 100 - (button.offsetWidth / workspace.width) * 100)
    const maxY = Math.max(0, 100 - (button.offsetHeight / workspace.height) * 100)
    onMove(folder.id, Math.min(Math.max(0, x), maxX), Math.min(Math.max(0, y), maxY))
  }

  const beginDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: folder.x,
      originY: folder.y,
    }
    didDragRef.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const dragFolder = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    const workspace = workspaceRef.current?.getBoundingClientRect()
    if (!drag || !workspace || drag.pointerId !== event.pointerId) return
    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (!didDragRef.current && Math.hypot(deltaX, deltaY) < 5) return
    didDragRef.current = true
    setIsDragging(true)
    moveWithinWorkspace(drag.originX + (deltaX / workspace.width) * 100, drag.originY + (deltaY / workspace.height) * 100)
  }

  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    dragRef.current = null
    setIsDragging(false)
  }

  return (
    <button
      className={`desktop-folder${isDragging ? ' is-dragging' : ''}`}
      type="button"
      ref={buttonRef}
      onPointerDown={beginDrag}
      onPointerMove={dragFolder}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={(event) => {
        if (didDragRef.current) {
          event.preventDefault()
          didDragRef.current = false
          return
        }
        onOpen(folder)
      }}
      onKeyDown={(event) => {
        const distance = event.shiftKey ? 5 : 1.5
        if (event.key === 'ArrowLeft') moveWithinWorkspace(folder.x - distance, folder.y)
        else if (event.key === 'ArrowRight') moveWithinWorkspace(folder.x + distance, folder.y)
        else if (event.key === 'ArrowUp') moveWithinWorkspace(folder.x, folder.y - distance)
        else if (event.key === 'ArrowDown') moveWithinWorkspace(folder.x, folder.y + distance)
        else return
        event.preventDefault()
      }}
      aria-label={`Open ${folder.label} folder. Drag to move, or use arrow keys to reposition.`}
      title="Drag to move; click to open"
      data-folder-id={folder.id}
      style={{
        left: `${folder.x}%`,
        top: `${folder.y}%`,
        transform: isDragging ? 'rotate(0deg) scale(1.05)' : `rotate(${folder.rotation}deg)`,
      }}
    >
      <span className="folder-shape" aria-hidden="true"><i>{String(index + 1).padStart(2, '0')}</i></span>
      <strong>{corrupted ? corruptLabel(folder.label) : folder.label}</strong>
      <small>{isDragging ? 'moving' : corrupted ? 'corrupted' : 'folder'}</small>
    </button>
  )
}

export default DraggableDesktopFolder

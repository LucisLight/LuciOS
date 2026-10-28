import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import type { DesktopWindowState } from './model'

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
        <span aria-hidden="true">{windowState.kind === 'folder' ? '▰' : windowState.kind === 'document' ? '▤' : windowState.kind === 'app' ? '◆' : '■'}</span>
        <strong id={`${windowState.id}-title`}>{windowState.title}</strong>
        <small>{windowState.kind === 'shell' ? 'allowlisted' : windowState.kind}</small>
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

export default DraggableWindow

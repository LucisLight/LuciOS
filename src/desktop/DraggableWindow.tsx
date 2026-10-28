import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import type { DesktopWindowState } from './model'

type DraggableWindowProps = {
  windowState: DesktopWindowState
  children: ReactNode
  onClose: (id: string) => void
  onFocus: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
  onResize: (id: string, x: number, y: number, width: number, height: number) => void
}

function DraggableWindow({ windowState, children, onClose, onFocus, onMove, onResize }: DraggableWindowProps) {
  const frameRef = useRef<HTMLElement>(null)
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null)
  const resizeRef = useRef<{ pointerId: number; startX: number; startY: number; width: number; height: number; direction: 'east' | 'south' | 'corner' } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

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

  const beginResize = (event: ReactPointerEvent<HTMLButtonElement>, direction: 'east' | 'south' | 'corner') => {
    event.stopPropagation()
    const bounds = frameRef.current?.getBoundingClientRect()
    if (!bounds) return
    resizeRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, width: bounds.width, height: bounds.height, direction }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsResizing(true)
    onFocus(windowState.id)
  }

  const resize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const active = resizeRef.current
    if (!active || active.pointerId !== event.pointerId) return
    const minWidth = windowState.kind === 'app' || windowState.kind === 'shell' ? 320 : 260
    const minHeight = windowState.kind === 'app' || windowState.kind === 'shell' ? 260 : 190
    const width = active.direction === 'south' ? active.width : Math.min(Math.max(minWidth, active.width + event.clientX - active.startX), window.innerWidth - windowState.x - 8)
    const height = active.direction === 'east' ? active.height : Math.min(Math.max(minHeight, active.height + event.clientY - active.startY), window.innerHeight - windowState.y - 8)
    onResize(windowState.id, windowState.x, windowState.y, width, height)
  }

  const endResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (resizeRef.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    resizeRef.current = null
    setIsResizing(false)
  }

  return (
    <section
      className={`desktop-window desktop-window-${windowState.kind}${isDragging ? ' is-dragging' : ''}${isResizing ? ' is-resizing' : ''}`}
      data-window-id={windowState.id}
      ref={frameRef}
      style={{ left: windowState.x, top: windowState.y, width: windowState.width, height: windowState.height, zIndex: windowState.z }}
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
      {(['east', 'south', 'corner'] as const).map((direction) => (
        <button className={`window-resize-handle window-resize-${direction}`} type="button" tabIndex={direction === 'corner' ? 0 : -1}
          aria-label={`Resize ${windowState.title} from the ${direction} edge`} key={direction}
          onPointerDown={(event) => beginResize(event, direction)} onPointerMove={resize}
          onPointerUp={endResize} onPointerCancel={endResize}
          onKeyDown={(event) => {
            if (direction !== 'corner') return
            const amount = event.shiftKey ? 32 : 12
            const width = event.key === 'ArrowLeft' ? windowState.width - amount : event.key === 'ArrowRight' ? windowState.width + amount : windowState.width
            const height = event.key === 'ArrowUp' ? windowState.height - amount : event.key === 'ArrowDown' ? windowState.height + amount : windowState.height
            if (width === windowState.width && height === windowState.height) return
            event.preventDefault()
            onResize(windowState.id, windowState.x, windowState.y, Math.max(260, width), Math.max(190, height))
          }} />
      ))}
    </section>
  )
}

export default DraggableWindow

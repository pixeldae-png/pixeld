import { useRef, type ReactNode, type PointerEvent } from 'react'

export function MotionCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    root.current?.style.setProperty('--card-rx', `${(y - .5) * -7}deg`)
    root.current?.style.setProperty('--card-ry', `${(x - .5) * 7}deg`)
    root.current?.style.setProperty('--light-x', `${x * 100}%`)
    root.current?.style.setProperty('--light-y', `${y * 100}%`)
  }
  function reset() {
    root.current?.style.setProperty('--card-rx', '0deg')
    root.current?.style.setProperty('--card-ry', '0deg')
  }
  return <div ref={root} className="motion-card-shell" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <div className={`motion-card-surface ${className}`}>{children}<span aria-hidden="true" className="motion-card-light" /></div>
  </div>
}

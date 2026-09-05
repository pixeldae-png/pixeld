import { useEffect, useRef } from 'react'

export function KineticOverlay() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let x = tx
    let y = ty

    const onPointerMove = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      x += (tx - x) * 0.16
      y += (ty - y) * 0.16
      root.style.setProperty('--kx', `${x}px`)
      root.style.setProperty('--ky', `${y}px`)

      if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="kinetic-overlay" aria-hidden="true">
      <span className="kinetic-overlay-line kinetic-overlay-line-x" />
      <span className="kinetic-overlay-line kinetic-overlay-line-y" />
      <span className="kinetic-overlay-cursor" />
    </div>
  )
}

import { useEffect, useRef, type ReactNode } from 'react'

// Adapted from ibelick/motion-primitives Infinite Slider (MIT), featured on 21st.dev.
// Duplicated content and reversible linear translation; CSS handles continuous motion.
export function InfiniteSlider({ children, reverse = false, paused = false }: { children: ReactNode; reverse?: boolean; paused?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => { el.dataset.visible = String(entry.isIntersecting) })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={root} className="infinite-slider" data-paused={paused} data-reverse={reverse}>
    <div className="infinite-slider-track"><div className="infinite-slider-group">{children}</div><div aria-hidden="true" className="infinite-slider-group infinite-slider-copy">{children}</div></div>
  </div>
}

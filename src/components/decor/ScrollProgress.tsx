import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsapSetup'
export function ScrollProgress() {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(root.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2, invalidateOnRefresh: true } })
    })
    return () => ctx.revert()
  }, [])
  return <div ref={root} className="site-scroll-progress" aria-hidden="true" />
}

import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsapSetup'

// Adapted from ibelick/motion-primitives Text Shimmer (MIT), featured on 21st.dev.
export function TextShimmer({ children }: { children: string }) {
  const root = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(root.current, { backgroundPosition: '100% center' }, { backgroundPosition: '0% center', duration: 1.8, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 92%', toggleActions: 'play none none reverse' } })
      }, root)
      return () => ctx.revert()
    })
    return () => media.revert()
  }, [])
  return <span ref={root} className="text-shimmer">{children}</span>
}

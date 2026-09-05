import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsapSetup'

// Adapted from ibelick/motion-primitives Text Effect (MIT), featured on 21st.dev.
// Retains word/character segmentation and blur/slide presets; uses the site's GSAP runtime.
export function TextEffect({ children, per = 'word', preset = 'blur', className = '' }: {
  children: string; per?: 'word' | 'char'; preset?: 'blur' | 'slide' | 'scroll'; className?: string
}) {
  const root = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const segments = root.current?.querySelectorAll('.text-effect-segment')
        if (!segments?.length) return
        const scrub = preset === 'scroll'
        gsap.fromTo(segments,
          { opacity: scrub ? .35 : 0, yPercent: scrub ? 0 : 75, filter: preset === 'blur' ? 'blur(5px)' : 'blur(0px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: .7, ease: scrub ? 'none' : 'power3.out',
            stagger: { amount: scrub ? 1 : Math.min(.55, segments.length * .035) },
            scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'bottom 55%', scrub: scrub ? .4 : false, once: !scrub },
          })
      }, root)
      return () => ctx.revert()
    })
    return () => media.revert()
  }, [children, per, preset])
  return <span ref={root} className={`text-effect ${className}`}>
    <span className="sr-only">{children}</span>
    <span aria-hidden="true">{children.split(/(\s+)/).map((word, i) => /^\s+$/.test(word) ? word :
      <span key={i} className="text-effect-word">{per === 'char' ? Array.from(word).map((char, j) =>
        <span key={j} className="text-effect-segment">{char}</span>) : <span className="text-effect-segment">{word}</span>}</span>)}</span>
  </span>
}

import { forwardRef, useId } from 'react'

export type ShapeKind = 'sphere' | 'cube' | 'pyramid' | 'star' | 'cylinder' | 'gem'

const palette: Record<string, [string, string]> = {
  coral: ['#ff9a7b', '#ff6b4a'],
  teal: ['#7fe3d1', '#3ec9b0'],
  violet: ['#a99bff', '#7c6cf2'],
  sky: ['#8ec0ff', '#4f8ef7'],
  lime: ['#d7ef8a', '#b8d94a'],
}

interface ShapeProps {
  kind: ShapeKind
  color?: keyof typeof palette
  size?: number
  className?: string
  style?: React.CSSProperties
}

/** Soft, glossy floating decoration used across sections — CSS-transform driven so GSAP can animate it directly. */
export const Shape = forwardRef<HTMLDivElement, ShapeProps>(
  ({ kind, color = 'coral', size = 96, className = '', style }, ref) => {
    const [light, dark] = palette[color]
    const gid = `shape-${useId().replace(/:/g, '')}`

    return (
      <div
        ref={ref}
        className={`pointer-events-none will-change-transform drop-shadow-[0_18px_30px_rgba(0,0,0,0.14)] ${className}`}
        style={{ width: size, height: size, ...style }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <radialGradient id={gid} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor={light} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
          </defs>

          {kind === 'sphere' && <circle cx="50" cy="50" r="42" fill={`url(#${gid})`} />}

          {kind === 'cube' && (
            <rect x="14" y="14" width="72" height="72" rx="18" fill={`url(#${gid})`} />
          )}

          {kind === 'pyramid' && (
            <path d="M50 8 L92 88 L8 88 Z" fill={`url(#${gid})`} strokeLinejoin="round" />
          )}

          {kind === 'star' && (
            <path
              d="M50 6c4 16 10 22 26 26-16 4-22 10-26 26-4-16-10-22-26-26 16-4 22-10 26-26Z"
              fill={`url(#${gid})`}
            />
          )}

          {kind === 'cylinder' && (
            <>
              <rect x="20" y="22" width="60" height="56" rx="10" fill={`url(#${gid})`} />
              <ellipse cx="50" cy="22" rx="30" ry="10" fill={light} opacity={0.9} />
            </>
          )}

          {kind === 'gem' && (
            <path d="M50 10 L86 38 L64 90 L36 90 L14 38 Z" fill={`url(#${gid})`} />
          )}
        </svg>
      </div>
    )
  },
)
Shape.displayName = 'Shape'

import { useState } from 'react'
import { site } from '../../data/site'
import { InfiniteSlider } from '../ui/infinite-slider'
import { TextEffect } from '../ui/text-effect'
import { TextShimmer } from '../ui/text-shimmer'

export function Stack() {
  const [paused, setPaused] = useState(false)
  const rows = [site.stack.slice(0, 6), site.stack.slice(6)]
  return <section id="stack" className="toolkit-section relative py-24 sm:py-32">
    <div className="mx-auto mb-12 max-w-lg px-6 text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[.16em] text-mist"><TextShimmer>My Stack</TextShimmer></p>
      <h2 className="font-display text-[8vw] font-800 leading-tight text-ink sm:text-[42px]"><TextEffect per="char">Tools I build with</TextEffect></h2>
    </div>
    <div className="toolkit-rows">{rows.map((tools, row) => <InfiniteSlider key={row} reverse={row === 1} paused={paused}>
      {tools.map((tool, i) => <div className={`toolkit-tile toolkit-tone-${(i + row) % 3}`} key={tool}>
        <span aria-hidden="true" className="toolkit-symbol">{tool.slice(0, 2)}</span><span className="toolkit-name">{tool}</span><span aria-hidden="true" className="toolkit-arrow">↗</span>
      </div>)}
    </InfiniteSlider>)}</div>
    <div className="mt-7 text-center"><button type="button" onClick={() => setPaused(p => !p)} aria-pressed={paused} className="toolkit-pause min-h-11 rounded-full border border-line px-5 py-2 text-sm text-mist">{paused ? 'Play toolkit animation' : 'Pause toolkit animation'}</button></div>
  </section>
}

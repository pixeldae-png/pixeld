import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { Stack } from '../components/sections/Stack'
import { ServicesStory } from '../components/sections/ServicesStory'
import { Testimonials } from '../components/sections/Testimonials'
import { Projects } from '../components/sections/Projects'
import { Pricing } from '../components/sections/Pricing'
import { Contact } from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Stack />
      <ServicesStory />
      <Testimonials />
      <Projects />
      <Pricing />
      <Contact />
    </>
  )
}

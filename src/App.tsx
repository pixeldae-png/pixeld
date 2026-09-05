import { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/admin/ProtectedRoute'
import { initSmoothScroll, destroySmoothScroll } from './lib/smoothScroll'
import { ScrollTrigger } from './lib/gsapSetup'
import { ParticleTextEffect } from './components/ui/particle-text-effect'
import { ScrollProgress } from './components/decor/ScrollProgress'
import { KineticOverlay } from './components/decor/KineticOverlay'

import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import NotFound from './pages/NotFound'

// Admin is code-split from the public bundle — visitors never pay for it.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const AdminProjectForm = lazy(() => import('./pages/admin/AdminProjectForm'))
const AdminSocial = lazy(() => import('./pages/admin/AdminSocial'))
const AdminContact = lazy(() => import('./pages/admin/AdminContact'))

function SiteShell() {
  const location = useLocation()
  const [introFinished, setIntroFinished] = useState(false)
  if (location.pathname === '/' && !location.hash && !introFinished) {
    return <ParticleTextEffect onComplete={() => setIntroFinished(true)} />
  }
  return (
    <>
      <Nav />
      <ScrollProgress />
      <KineticOverlay />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    if (isAdmin) return
    initSmoothScroll()

    // Section positions are calculated from live layout, which shifts once
    // the custom web font swaps in and once images report their real size —
    // refresh after both so later sections don't inherit stale trigger points.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts?.ready?.then(() => ScrollTrigger.refresh())

    const images = Array.from(document.images)
    const onImageLoad = () => ScrollTrigger.refresh()
    images.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onImageLoad, { once: true })
    })

    return () => {
      cancelAnimationFrame(id)
      images.forEach((img) => img.removeEventListener('load', onImageLoad))
      destroySmoothScroll()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [isAdmin])

  if (isAdmin) {
    return (
      <AuthProvider>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-[14px] text-mist">Loading…</div>}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="contact" element={<AdminContact />} />
              <Route path="social" element={<AdminSocial />} />
              <Route path="projects/new" element={<AdminProjectForm />} />
              <Route path="projects/:id" element={<AdminProjectForm />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    )
  }

  return <SiteShell />
}

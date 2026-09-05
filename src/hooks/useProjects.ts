import { useEffect, useState } from 'react'
import { supabase, supabaseEnabled } from '../lib/supabase'
import type { Project } from '../types'

export function useProjects(opts: { onlyVisible?: boolean } = {}) {
  const { onlyVisible = true } = opts
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!supabaseEnabled) {
        setLoading(false)
        return
      }
      setLoading(true)
      let query = supabase
        .from('projects')
        .select('*, images:project_images(*)')
        .order('sort_order', { ascending: true })

      if (onlyVisible) query = query.eq('visible', true)

      const { data, error } = await query
      if (cancelled) return
      if (error) setError(error.message)
      else setProjects((data as Project[]) || [])
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [onlyVisible])

  return { projects, loading, error }
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<
    { id: string; name: string; company: string | null; quote: string; avatar_url: string | null }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!supabaseEnabled) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('visible', true)
        .order('sort_order', { ascending: true })
      if (!cancelled) {
        setTestimonials(data || [])
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { testimonials, loading }
}

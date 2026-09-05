import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, supabaseEnabled } from '../lib/supabase'
import type { Project } from '../types'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!supabaseEnabled || !slug) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('projects')
        .select('*, images:project_images(*)')
        .eq('slug', slug)
        .eq('visible', true)
        .maybeSingle()
      if (!cancelled) {
        setProject(data as Project | null)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) return <div className="min-h-[100svh]" />

  if (!project) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <p className="text-[16px] font-semibold text-ink">Project not found</p>
        <Link to="/#projects" className="mt-4 text-[14px] text-mist underline">
          Back to projects
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-32">
      <Link to="/#projects" className="text-[13px] text-mist hover:text-ink">
        ← Back
      </Link>
      <h1 className="mt-6 font-display text-[10vw] font-800 leading-tight text-ink sm:text-[48px]">
        {project.title}
      </h1>
      <div className="mt-4 flex flex-wrap gap-4 text-[14px] text-mist">
        {project.client && <span>{project.client}</span>}
        {project.year && <span>{project.year}</span>}
        {project.category && <span>{project.category}</span>}
      </div>

      {project.cover_image && (
        <img src={project.cover_image} alt={project.title} className="mt-10 w-full rounded-3xl object-cover" />
      )}

      {project.description && (
        <p className="mt-10 max-w-2xl text-[16px] leading-relaxed text-mist">{project.description}</p>
      )}

      {project.technologies?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <span key={t} className="rounded-full border border-line px-3 py-1 text-[12px] text-ink/70">
              {t}
            </span>
          ))}
        </div>
      )}

      {project.website_url && (
        <a
          href={project.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-white"
        >
          Visit Website ↗
        </a>
      )}

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {project.images?.map((img) => (
          <img key={img.id} src={img.url} alt="" className="w-full rounded-2xl object-cover" />
        ))}
      </div>
    </div>
  )
}

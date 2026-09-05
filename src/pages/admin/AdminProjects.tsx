import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Project } from '../../types'

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })
    setProjects((data as Project[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggle(id: string, field: 'visible' | 'featured', value: boolean) {
    await supabase.from('projects').update({ [field]: value }).eq('id', id)
    load()
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await supabase.from('projects').delete().eq('id', id)
    load()
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= projects.length) return
    const a = projects[index]
    const b = projects[target]
    await supabase.from('projects').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('projects').update({ sort_order: a.sort_order }).eq('id', b.id)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-[22px] font-800">Projects</h1>
        <Link to="/admin/projects/new" className="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white">
          + New Project
        </Link>
      </div>

      {loading ? (
        <p className="text-[14px] text-mist">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-[14px] text-mist">No projects yet.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-line p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-line">
                {p.cover_image && <img src={p.cover_image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">{p.title}</p>
                <p className="truncate text-[12px] text-mist">{p.category}</p>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => move(i, -1)} className="rounded-lg px-2 py-1 text-mist hover:bg-ink/5">↑</button>
                <button onClick={() => move(i, 1)} className="rounded-lg px-2 py-1 text-mist hover:bg-ink/5">↓</button>
              </div>

              <label className="flex items-center gap-1.5 text-[12px] text-mist">
                <input type="checkbox" checked={p.visible} onChange={(e) => toggle(p.id, 'visible', e.target.checked)} />
                Visible
              </label>
              <label className="flex items-center gap-1.5 text-[12px] text-mist">
                <input type="checkbox" checked={p.featured} onChange={(e) => toggle(p.id, 'featured', e.target.checked)} />
                Featured
              </label>

              <Link to={`/admin/projects/${p.id}`} className="text-[13px] font-medium text-ink hover:underline">
                Edit
              </Link>
              <button onClick={() => remove(p.id, p.title)} className="text-[13px] text-red-600 hover:underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useProjects } from '../../hooks/useProjects'

export default function AdminDashboard() {
  const { projects, loading } = useProjects({ onlyVisible: false })

  const visible = projects.filter((p) => p.visible).length
  const featured = projects.filter((p) => p.featured).length

  return (
    <div>
      <h1 className="mb-6 font-display text-[22px] font-800">Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Projects" value={loading ? '—' : projects.length} />
        <StatCard label="Visible" value={loading ? '—' : visible} />
        <StatCard label="Featured" value={loading ? '—' : featured} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-line p-6">
      <p className="text-[13px] text-mist">{label}</p>
      <p className="mt-2 font-display text-[28px] font-800">{value}</p>
    </div>
  )
}

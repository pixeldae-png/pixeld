import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[80px] font-800 text-ink">404</p>
      <p className="mt-2 text-[15px] text-mist">This page doesn&rsquo;t exist.</p>
      <Link to="/" className="mt-6 rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-white">
        Back home
      </Link>
    </div>
  )
}

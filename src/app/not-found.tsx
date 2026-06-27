import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="relative text-center max-w-md">
        <p
          className="text-8xl font-bold tracking-tighter mb-4"
          style={{
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </p>
        <h1
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Page not found
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </div>
    </div>
  )
}

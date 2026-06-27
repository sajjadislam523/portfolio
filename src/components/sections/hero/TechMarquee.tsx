'use client'

interface TechMarqueeProps {
  techs: string[]
}

export function TechMarquee({ techs }: TechMarqueeProps) {
  // Double the array so the marquee loops seamlessly
  const doubled = [...techs, ...techs]

  return (
    <div
      className="relative overflow-hidden border-y py-3"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 inset-y-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }}
      />
      <div
        className="absolute right-0 inset-y-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }}
      />

      <div
        className="flex items-center gap-6 w-max"
        style={{
          animation: 'marquee 30s linear infinite',
          willChange: 'transform',
        }}
      >
        {doubled.map((tech, i) => (
          <span
            key={i}
            className="text-xs font-mono whitespace-nowrap"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {tech}
            <span className="ml-6" style={{ color: 'var(--border-strong)' }}>·</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee { animation: none; }
        }
      `}</style>
    </div>
  )
}

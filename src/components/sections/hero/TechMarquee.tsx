"use client";

interface TechMarqueeProps {
    techs: string[];
}

// Icon-like colored dots per category — purely decorative accent
const ACCENT_COLORS = [
    "var(--accent)",
    "#38BDF8",
    "#22C55E",
    "#F59E0B",
    "#EC4899",
    "#A78BFA",
    "#FB7185",
    "#34D399",
];

export function TechMarquee({ techs }: TechMarqueeProps) {
    const doubled = [...techs, ...techs];

    return (
        <div
            className="relative overflow-hidden py-4 border-y"
            style={{ borderColor: "var(--border)" }}
        >
            {/* Left fade */}
            <div
                className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to right, var(--bg-primary), transparent)",
                }}
            />
            {/* Right fade */}
            <div
                className="absolute right-0 inset-y-0 w-24 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to left, var(--bg-primary), transparent)",
                }}
            />

            <div
                className="flex items-center w-max"
                style={{
                    animation: "marquee 35s linear infinite",
                    willChange: "transform",
                    gap: "0",
                }}
            >
                {doubled.map((tech, i) => {
                    const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                    return (
                        <div
                            key={`${tech}-${i}`}
                            className="inline-flex items-center"
                            style={{ paddingInline: "20px" }}
                        >
                            {/* Pill */}
                            <span
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                                style={{
                                    background: "var(--bg-elevated)",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-secondary)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {/* Colored dot accent */}
                                <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ background: color, opacity: 0.85 }}
                                />
                                {tech}
                            </span>

                            {/* Separator dot between pills */}
                            <span
                                className="ml-5 w-1 h-1 rounded-full shrink-0"
                                style={{
                                    background: "var(--border-strong)",
                                    opacity: 0.5,
                                }}
                            />
                        </div>
                    );
                })}
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
    );
}

// The project's "technical signature" — an editorial list rather than a
// wall of pill badges. Reads straight from project.technologies; no
// categorisation is invented since the schema doesn't group technologies
// by type.

export function TechnologyList({ technologies }: { technologies: string[] }) {
    if (technologies.length === 0) return null;

    return (
        <div>
            <div className="mb-6 flex items-center gap-3">
                <span
                    className="font-mono text-eyebrow uppercase"
                    style={{ color: "var(--accent)" }}
                >
                    Technology
                </span>
                <span className="h-px flex-1" style={{ background: "var(--line)" }} aria-hidden />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
                {technologies.map((tech, i) => (
                    <span
                        key={tech}
                        className="font-mono text-body transition-colors duration-200 hover:text-[var(--accent-on-canvas)]"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        <span
                            className="mr-2 tabular-nums opacity-40"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    );
}

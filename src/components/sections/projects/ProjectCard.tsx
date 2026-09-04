import type { IProject } from "@/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// lucide-react ships no brand icons — inline SVG, same path used elsewhere
// in the codebase (e.g. the hero's GitHub social link).
function GithubIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

// Featured-project card for the homepage grid. Cover image (or a gradient
// placeholder when none is set) up top, then title/year, tagline, tech
// pills, and live/github links — see the project detail page for the rest.
export function ProjectCard({ project }: { project: IProject }) {
    const { live, github } = project.links ?? {};

    return (
        <div className="card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
            <Link href={`/projects/${project.slug}`} className="block">
                {project.coverImage ? (
                    <div
                        className="relative overflow-hidden"
                        style={{ aspectRatio: "16/9" }}
                    >
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                ) : (
                    <div
                        className="relative flex items-center overflow-hidden px-5"
                        style={{
                            aspectRatio: "16/9",
                            background: "var(--accent-glow)",
                        }}
                    >
                        <span
                            className="text-4xl font-display font-bold leading-none truncate opacity-20"
                            style={{ color: "var(--accent)" }}
                        >
                            {project.title}
                        </span>
                    </div>
                )}
            </Link>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3 mb-1.5">
                    <Link href={`/projects/${project.slug}`}>
                        <h3
                            className="text-h3 font-display hover:opacity-80 transition-opacity"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {project.title}
                        </h3>
                    </Link>
                    <span
                        className="text-xs font-mono shrink-0"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        {project.year}
                    </span>
                </div>

                <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {project.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="pill">
                            {tech}
                        </span>
                    ))}
                </div>

                {(live || github) && (
                    <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                        {live && (
                            <a
                                href={live}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View live ${project.title}`}
                                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                                style={{
                                    background: "var(--bg-subtle)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                        {github && (
                            <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View ${project.title} on GitHub`}
                                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                                style={{
                                    background: "var(--bg-subtle)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                <GithubIcon className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

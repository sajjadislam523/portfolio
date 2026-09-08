// The cinematic case-study layout for featured projects. Two renderers:
//
//   ProjectShowcase   — the "major" treatment for the first two featured
//                        projects. Large, alternating text/visual sides,
//                        a browser-chrome preview, full metadata.
//   ProjectFeatureRow — a deliberately different, more compact composition
//                        for any featured project beyond the top two — still
//                        substantial, not reduced to the archive's plain
//                        list, but visibly secondary to the two majors.
//
// Hierarchy is the point: not every project should look the same size.

import { ProjectPreview } from "@/components/sections/projects/ProjectPreview";
import { truncate } from "@/lib/utils";
import type { IProject } from "@/types";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

function getHostname(url?: string): string | undefined {
    if (!url) return undefined;
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return undefined;
    }
}

function GithubIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

interface ProjectShowcaseProps {
    project: IProject;
    displayIndex: string;
    reverse?: boolean;
}

export function ProjectShowcase({
    project,
    displayIndex,
    reverse = false,
}: ProjectShowcaseProps) {
    const { live, github } = project.links ?? {};
    const description = project.overview ? truncate(project.overview, 170) : "";

    return (
        <div className="group grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Text */}
            <div
                className={`flex flex-col gap-5 lg:col-span-5 ${reverse ? "lg:order-2" : "lg:order-1"}`}
            >
                <div className="flex items-baseline gap-3">
                    <span
                        className="index-mark font-display text-3xl"
                        style={{ color: "var(--text-tertiary)", opacity: 0.35 }}
                    >
                        {displayIndex}
                    </span>
                    {project.role && (
                        <span
                            className="font-mono text-eyebrow uppercase"
                            style={{ color: "var(--accent)" }}
                        >
                            {project.role}
                        </span>
                    )}
                </div>

                <div>
                    <Link href={`/projects/${project.slug}`} className="group/title w-fit">
                        <h3
                            className="m-0 text-h1 font-display transition-opacity group-hover/title:opacity-70"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {project.title}
                        </h3>
                    </Link>
                    <p
                        className="mt-3 max-w-[42ch] text-body-lg"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {project.tagline}
                    </p>
                </div>

                {description && (
                    <p
                        className="max-w-[46ch] text-body"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        {description}
                    </p>
                )}

                {project.technologies.length > 0 && (
                    <div
                        className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-wide"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        {project.technologies.map((tech, i) => (
                            <span key={tech}>
                                {tech}
                                {i < project.technologies.length - 1 && (
                                    <span className="ml-4 opacity-30" aria-hidden>
                                        /
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-5 pt-1 transition-transform duration-300 group-hover:-translate-y-0.5">
                    <span
                        className="font-mono text-small"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        {project.year}
                    </span>
                    {live && (
                        <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} live`}
                            className="inline-flex items-center gap-1.5 font-mono text-small transition-colors hover:text-[var(--accent-on-canvas)]"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Live <ArrowUpRight className="h-3 w-3" />
                        </a>
                    )}
                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} source`}
                            className="inline-flex items-center gap-1.5 font-mono text-small transition-colors hover:text-[var(--accent-on-canvas)]"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Source <GithubIcon className="h-3 w-3" />
                        </a>
                    )}
                </div>
            </div>

            {/* Visual */}
            <div className={`lg:col-span-7 ${reverse ? "lg:order-1" : "lg:order-2"}`}>
                <Link href={`/projects/${project.slug}`} aria-label={`Open ${project.title} case study`}>
                    <ProjectPreview
                        src={project.coverImage}
                        alt={project.title}
                        chromeLabel={getHostname(live) ?? project.title}
                        aspect="4/3"
                    />
                </Link>
            </div>
        </div>
    );
}

/** The compact composition for featured projects beyond the top two. */
export function ProjectFeatureRow({
    project,
    displayIndex,
}: {
    project: IProject;
    displayIndex: string;
}) {
    const { live, github } = project.links ?? {};

    return (
        <div
            className="group grid grid-cols-1 gap-6 border-t py-10 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-10 lg:gap-16"
            style={{ borderColor: "var(--line)" }}
        >
            <Link href={`/projects/${project.slug}`} aria-label={`Open ${project.title} case study`}>
                <ProjectPreview
                    src={project.coverImage}
                    alt={project.title}
                    aspect="4/3"
                    sizes="240px"
                />
            </Link>

            <div className="flex flex-col justify-center gap-3">
                <div className="flex items-baseline gap-3">
                    <span className="index-mark" style={{ color: "var(--text-tertiary)" }}>
                        {displayIndex}
                    </span>
                    {project.role && (
                        <span
                            className="font-mono text-[11px] uppercase tracking-wide"
                            style={{ color: "var(--accent)" }}
                        >
                            {project.role}
                        </span>
                    )}
                </div>

                <Link href={`/projects/${project.slug}`} className="group/title w-fit">
                    <h3
                        className="m-0 text-h3 font-display transition-opacity group-hover/title:opacity-70"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {project.title}
                    </h3>
                </Link>

                <p
                    className="max-w-[52ch] text-body"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {project.tagline}
                </p>

                <div
                    className="flex flex-wrap items-center gap-4 font-mono text-small transition-transform duration-300 group-hover:-translate-y-0.5"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    <span>{project.year}</span>
                    {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="uppercase tracking-wide">
                            {tech}
                        </span>
                    ))}
                    {live && (
                        <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} live`}
                            className="transition-colors hover:text-[var(--accent-on-canvas)]"
                        >
                            Live ↗
                        </a>
                    )}
                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} source`}
                            className="transition-colors hover:text-[var(--accent-on-canvas)]"
                        >
                            Source ↗
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

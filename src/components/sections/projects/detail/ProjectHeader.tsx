// The case-study header — back navigation, index/role eyebrow, dominant
// title, tagline, an optional short excerpt of the overview (only when
// truncating it actually shortens it, so the header never repeats the full
// Overview section verbatim), a compact tech line, and the primary/secondary
// actions. All from fields that already exist on IProject — nothing here is
// invented (role is a real, already-CMS-authored field ProjectShowcase
// already surfaces the same way).

import { FadeIn } from "@/components/motion/ScrollReveal";
import { ProjectActions } from "@/components/sections/projects/detail/ProjectActions";
import { truncate } from "@/lib/utils";
import type { IProject } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProjectHeaderProps {
    project: IProject;
    indexLabel: string;
}

export function ProjectHeader({ project, indexLabel }: ProjectHeaderProps) {
    const teaser = project.overview ? truncate(project.overview, 180) : "";
    const showTeaser = teaser.length > 0 && teaser !== project.overview;

    return (
        <FadeIn>
            <Link
                href="/#projects"
                className="group/back inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide transition-colors hover:text-[var(--accent-on-canvas)]"
                style={{ color: "var(--text-tertiary)" }}
            >
                <ArrowLeft className="h-3 w-3 transition-transform duration-300 group-hover/back:-translate-x-1" />
                Back to work
            </Link>

            <div className="mt-10 flex items-center gap-3">
                <span
                    className="font-mono text-small tabular-nums"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {indexLabel}
                </span>
                {project.role && (
                    <>
                        <span
                            className="h-px w-4"
                            style={{ background: "var(--line)" }}
                            aria-hidden
                        />
                        <span
                            className="font-mono text-eyebrow uppercase"
                            style={{ color: "var(--accent)" }}
                        >
                            {project.role}
                        </span>
                    </>
                )}
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <h1
                    className="text-h1 sm:text-display font-display leading-[0.95] wrap-break-word"
                    style={{ color: "var(--text-primary)" }}
                >
                    {project.title}
                </h1>
                <span
                    className="shrink-0 font-mono text-body tabular-nums"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {project.year}
                </span>
            </div>

            <p
                className="mt-6 max-w-[52ch] text-h4 font-display"
                style={{ color: "var(--text-secondary)" }}
            >
                {project.tagline}
            </p>

            {showTeaser && (
                <p
                    className="mt-3 max-w-[62ch] text-body-lg"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {teaser}
                </p>
            )}

            {project.technologies.length > 0 && (
                <div
                    className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] uppercase tracking-wide"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {project.technologies.map((tech, i) => (
                        <span key={tech}>
                            {tech}
                            {i < project.technologies.length - 1 && (
                                <span className="ml-3 opacity-30" aria-hidden>
                                    ·
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            )}

            <ProjectActions
                live={project.links?.live}
                github={project.links?.github}
                className="mt-8"
            />
        </FadeIn>
    );
}

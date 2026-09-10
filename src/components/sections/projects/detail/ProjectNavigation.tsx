// Previous/next case-study navigation. Pure CSS hover (no client JS) — the
// optional desktop thumbnail is just an absolutely-positioned Image revealed
// via group-hover opacity, the same technique used for the archive list's
// cursor preview elsewhere in the app, minus the cursor-tracking.

import type { IProject } from "@/types";
import Image from "next/image";
import Link from "next/link";

export type NavProject = Pick<IProject, "slug" | "title" | "coverImage">;

interface ProjectNavigationProps {
    prev: NavProject | null;
    next: NavProject | null;
}

export function ProjectNavigation({ prev, next }: ProjectNavigationProps) {
    if (!prev && !next) return null;

    return (
        <div
            className="grid grid-cols-1 border-t sm:grid-cols-2"
            style={{ borderColor: "var(--line)" }}
        >
            {prev ? <NavLink project={prev} direction="prev" /> : <div />}
            {next ? <NavLink project={next} direction="next" /> : <div />}
        </div>
    );
}

function NavLink({
    project,
    direction,
}: {
    project: NavProject;
    direction: "prev" | "next";
}) {
    const isNext = direction === "next";

    return (
        <Link
            href={`/projects/${project.slug}`}
            className={`group/nav relative flex flex-col gap-2 border-b py-10 transition-colors sm:border-b-0 ${
                isNext ? "sm:items-end sm:border-l sm:pl-10 sm:text-right" : "sm:pr-10"
            }`}
            style={{ borderColor: "var(--line)" }}
        >
            <span
                className="font-mono text-[11px] uppercase tracking-wide"
                style={{ color: "var(--text-tertiary)" }}
            >
                {isNext ? "Next project →" : "← Previous project"}
            </span>
            <span
                className="text-h3 font-display transition-opacity duration-300 group-hover/nav:opacity-70"
                style={{ color: "var(--text-primary)" }}
            >
                {project.title}
            </span>

            {project.coverImage && (
                <div
                    className={`pointer-events-none absolute top-1/2 hidden h-24 w-36 -translate-y-1/2 overflow-hidden rounded-lg opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100 lg:block ${
                        isNext ? "right-full mr-6" : "left-full ml-6"
                    }`}
                    style={{ border: "1px solid var(--line-strong)", boxShadow: "var(--shadow-md)" }}
                    aria-hidden
                >
                    <Image src={project.coverImage} alt="" fill className="object-cover" sizes="144px" />
                </div>
            )}
        </Link>
    );
}

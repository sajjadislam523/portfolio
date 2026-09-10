// Text-link actions for the case-study header — live site is primary
// (text-primary weight), source is secondary (text-secondary). Both share
// the same arrow-nudge hover so they read as one action language rather
// than a filled-button + outline-button pair.

import { ArrowUpRight } from "lucide-react";

interface ProjectActionsProps {
    live?: string;
    github?: string;
    className?: string;
}

export function ProjectActions({ live, github, className = "" }: ProjectActionsProps) {
    if (!live && !github) return null;

    return (
        <div className={`flex flex-wrap items-center gap-x-8 gap-y-3 ${className}`}>
            {live && (
                <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/action inline-flex items-center gap-2 font-mono text-small font-medium uppercase tracking-wide transition-colors hover:text-[var(--accent-on-canvas)]"
                    style={{ color: "var(--text-primary)" }}
                >
                    Visit live site
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5" />
                </a>
            )}
            {github && (
                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/action inline-flex items-center gap-2 font-mono text-small uppercase tracking-wide transition-colors hover:text-[var(--accent-on-canvas)]"
                    style={{ color: "var(--text-secondary)" }}
                >
                    View source
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5" />
                </a>
            )}
        </div>
    );
}

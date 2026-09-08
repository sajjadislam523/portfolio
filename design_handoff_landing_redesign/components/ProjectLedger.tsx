import type { IProject } from "@/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// ProjectLedger — Redesign Blueprint §06, rev 2.
//
// Rev 1 was a bordered card holding a four-column table. Four problems, all
// fixed here:
//   1. 44px · 1fr · 150px · 72px + three 20px gaps committed 326px of chrome
//      before the content column began. The row grid is now 26px · 1fr · 150px
//      and collapses to two columns below sm.
//   2. The column header promised alignment that variable-height rows could
//      not keep. It is gone; meta is labelled by position and register.
//   3. Six identical rows kept rev 1's problem — no project was first. The
//      lead row now carries the hand-picked `featured` project at double
//      weight with a 16:9 cover.
//   4. `live · src` was a 20px target nested inside a row-wide link. The rows
//      are no longer links (the title is), and the anchors are .ledger-chip —
//      44px on touch, 32px from sm up.
//
// No container chrome: the rows sit directly on the canvas between one
// --line-strong rule and hairlines. Hover raises a single row to
// --zone-surface, so the lift belongs to the row and not to a wrapper.
//
//   density="full"    — cover plate + tagline. The #projects section.
//   density="compact" — no plate, no tagline. Home preview and archive.
// ─────────────────────────────────────────────────────────────────────────────

type Density = "full" | "compact";

interface ProjectLedgerProps {
    projects: IProject[];
    density?: Density;
    /**
     * Renders the project flagged `featured: true` first, at double weight with
     * a 16:9 cover. Falls back to the first project in the list if none is
     * flagged. Off for the archive.
     */
    leadRow?: boolean;
    /** Continues numbering from an offset — for an archive below a featured set. */
    indexOffset?: number;
    muted?: boolean;
}

const META = "font-mono text-[12.5px] leading-[1.5]";
const LABEL = "font-mono text-[11px] font-[550] uppercase tracking-[0.14em]";
const ROW_GRID =
    "grid grid-cols-[26px_minmax(0,1fr)] gap-x-[clamp(12px,2.2vw,26px)] gap-y-3 sm:grid-cols-[26px_minmax(0,1fr)_minmax(0,150px)]";

function GithubIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

/** Bordered anchors beside the row, never inside a row-wide link. */
function LinkChips({
    project,
    long = false,
}: {
    project: IProject;
    long?: boolean;
}) {
    const { live, github } = project.links ?? {};
    if (!live && !github) return null;

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {live && (
                <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} live`}
                    className="ledger-chip"
                >
                    <ExternalLink className="h-3 w-3" />
                    {long ? "Live ↗" : "Live"}
                </a>
            )}
            {github && (
                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} on GitHub`}
                    className="ledger-chip"
                >
                    <GithubIcon className="h-3 w-3" />
                    {long ? "Source ↗" : "Src"}
                </a>
            )}
        </div>
    );
}

function CoverPlate({
    project,
    wide = false,
}: {
    project: IProject;
    wide?: boolean;
}) {
    const shell = {
        boxShadow: "inset 0 0 0 1px var(--line)",
        background: "var(--zone-canvas-alt)",
        aspectRatio: wide ? "16/9" : "3/2",
    };

    if (!project.coverImage) {
        return (
            <div
                className={`relative flex shrink-0 items-end overflow-hidden rounded-lg p-3 ${wide ? "w-full" : "w-24"}`}
                style={shell}
            >
                <span
                    className="truncate font-display text-xl font-semibold leading-none opacity-20"
                    style={{ color: "var(--accent-on-canvas)" }}
                >
                    {project.title}
                </span>
            </div>
        );
    }

    return (
        <div
            className={`relative shrink-0 overflow-hidden rounded-lg ${wide ? "w-full" : "w-24"}`}
            style={shell}
        >
            <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
                sizes={wide ? "(max-width: 1024px) 100vw, 420px" : "96px"}
            />
        </div>
    );
}

function TechPills({ project, limit }: { project: IProject; limit: number }) {
    if (project.technologies.length === 0) return null;
    return (
        <div className="mt-0.5 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, limit).map((tech) => (
                <span key={tech} className="pill">
                    {tech}
                </span>
            ))}
        </div>
    );
}

/** Row 01 — the hand-picked project, at double weight. */
function LeadRow({ project, index }: { project: IProject; index: number }) {
    return (
        <div
            className="grid grid-cols-1 items-start gap-[clamp(20px,3vw,40px)] px-1 py-7 transition-colors hover:bg-[var(--zone-surface)] lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]"
            style={{ borderBottom: "1px solid var(--line-hairline)" }}
        >
            <div className="flex min-w-0 flex-col gap-3">
                <div
                    className={`${META} flex items-baseline gap-3`}
                    style={{ color: "var(--text-secondary)" }}
                >
                    <span>{String(index).padStart(2, "0")}</span>
                    <span
                        className={LABEL}
                        style={{
                            background: "var(--accent-glow)",
                            color: "var(--accent-on-canvas)",
                            borderRadius: "999px",
                            padding: "3px 9px",
                        }}
                    >
                        Featured
                    </span>
                </div>

                <Link href={`/projects/${project.slug}`} className="group min-w-0">
                    <h3
                        className="m-0 max-w-[22ch] font-display text-[clamp(1.5rem,2.6vw,1.875rem)] font-[520] leading-[1.12] tracking-[-0.026em] transition-opacity group-hover:opacity-70"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {project.title}
                    </h3>
                </Link>

                <p
                    className="m-0 max-w-[52ch] text-[1.0625rem] leading-[1.6] tracking-[-0.008em]"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {project.tagline}
                </p>

                <TechPills project={project} limit={6} />

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <LinkChips project={project} long />
                    <span className={`${META} ml-1`} style={{ color: "var(--text-secondary)" }}>
                        {project.year} · {project.role}
                    </span>
                </div>
            </div>

            <CoverPlate project={project} wide />
        </div>
    );
}

function LedgerRow({
    project,
    index,
    density,
    muted,
}: {
    project: IProject;
    index: number;
    density: Density;
    muted: boolean;
}) {
    const full = density === "full";

    return (
        <div
            className={`${ROW_GRID} items-start px-1 py-5 transition-colors hover:bg-[var(--zone-surface)]`}
            style={{ borderBottom: "1px solid var(--line-hairline)" }}
        >
            <span
                className={`${META} leading-[1.7]`}
                style={{ color: "var(--text-secondary)" }}
            >
                {String(index).padStart(2, "0")}
            </span>

            <div className="flex min-w-0 flex-wrap gap-4">
                {full && <CoverPlate project={project} />}

                <div className="flex min-w-[190px] flex-1 flex-col gap-2">
                    <Link href={`/projects/${project.slug}`} className="group min-w-0">
                        <h3
                            className="m-0 font-display text-[1.1875rem] font-[560] leading-[1.28] tracking-[-0.014em] transition-opacity group-hover:opacity-70"
                            style={{
                                color: muted
                                    ? "var(--text-secondary)"
                                    : "var(--text-primary)",
                            }}
                        >
                            {project.title}
                        </h3>
                    </Link>

                    {full && (
                        <p
                            className="m-0 max-w-[48ch] text-[0.9375rem] leading-[1.55]"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {project.tagline}
                        </p>
                    )}

                    <TechPills project={project} limit={3} />

                    {/* Below sm the meta rail folds under the title */}
                    <div
                        className={`${META} flex gap-3 sm:hidden`}
                        style={{ color: "var(--text-secondary)" }}
                    >
                        <span style={{ color: "var(--text-primary)" }}>
                            {project.year}
                        </span>
                        <span>{project.role}</span>
                    </div>
                </div>
            </div>

            {/* Meta rail — year over role, links beneath, right-aligned */}
            <div className="col-span-2 flex flex-col items-start gap-2.5 sm:col-span-1 sm:items-end">
                <div
                    className={`${META} hidden flex-col items-end gap-0.5 sm:flex`}
                    style={{ color: "var(--text-secondary)" }}
                >
                    <span style={{ color: "var(--text-primary)" }}>
                        {project.year}
                    </span>
                    <span>{project.role}</span>
                </div>
                <LinkChips project={project} />
            </div>
        </div>
    );
}

export function ProjectLedger({
    projects,
    density = "full",
    leadRow = false,
    indexOffset = 0,
    muted = false,
}: ProjectLedgerProps) {
    if (projects.length === 0) return null;

    // The lead row is hand-picked in the admin (featured: boolean), not
    // inferred from `order` — see handoff/model-changes.md.
    const lead = leadRow
        ? (projects.find((p) => p.featured) ?? projects[0])
        : null;
    const rest = lead ? projects.filter((p) => p._id !== lead._id) : projects;

    return (
        <div style={{ borderTop: "1px solid var(--line-strong)" }}>
            {lead && <LeadRow project={lead} index={indexOffset + 1} />}
            {rest.map((project, i) => (
                <LedgerRow
                    key={project._id}
                    project={project}
                    index={indexOffset + i + (lead ? 2 : 1)}
                    density={density}
                    muted={muted}
                />
            ))}
        </div>
    );
}

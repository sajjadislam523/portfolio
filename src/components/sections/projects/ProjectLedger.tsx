import { cn } from "@/lib/utils";
import type { IProject } from "@/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// ProjectLedger — Bento Grid / Card Showcase rev.
//
// Replaces the ledger-row layout (a table-like list of rows separated by
// hairlines) with a padded card grid: the hand-picked `featured` project runs
// as a double-wide lead tile, the rest sit in evenly sized cells below.
//
// Cards use a real 1px semi-transparent border rather than shadcn's default
// ring-based Card border, because it needs to stay visible on the light
// canvas too — a literal white/10 border disappears against a white
// background, so it's tied to --line-strong (our existing hairline token)
// instead, and rides the same value that already darkens/lightens per theme.
//
// Cards are not themselves links — the title is — so the Live/Source chip
// anchors can sit as siblings inside the card without nesting <a> in <a>.
// Hover lifts and scales the whole card and its border warms toward the
// accent, via CSS only (no client component needed).
//
//   density="full"    — cover image + tagline. The #projects section.
//   density="compact" — no cover, no tagline, tighter grid. Archive.
// ─────────────────────────────────────────────────────────────────────────────

type Density = "full" | "compact";

interface ProjectLedgerProps {
    projects: IProject[];
    density?: Density;
    /**
     * Renders the project flagged `featured: true` first, as a double-wide
     * lead tile with a 16:10 cover. Falls back to the first project in the
     * list if none is flagged. Off for the archive.
     */
    leadRow?: boolean;
    /** Continues numbering from an offset — for an archive below a featured set. */
    indexOffset?: number;
    muted?: boolean;
}

const META = "font-mono text-[12.5px] leading-[1.5]";
const LABEL = "font-mono text-[11px] font-[550] uppercase tracking-[0.14em]";

const CARD =
    "group/card relative flex flex-col overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--zone-surface)] shadow-[var(--elev-1)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[var(--elev-3)] hover:border-[color-mix(in_srgb,var(--accent-on-canvas)_45%,var(--line-strong))]";

function GithubIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

/** Bordered anchors beside the title, never nested inside the card link. */
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
                    className="ledger-chip relative z-10"
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
                    className="ledger-chip relative z-10"
                >
                    <GithubIcon className="h-3 w-3" />
                    {long ? "Source ↗" : "Src"}
                </a>
            )}
        </div>
    );
}

function CoverImage({ project, tall = false }: { project: IProject; tall?: boolean }) {
    return (
        <div
            className="relative w-full shrink-0 overflow-hidden"
            style={{
                aspectRatio: tall ? "16/10" : "16/9",
                background: "var(--zone-canvas-alt)",
            }}
        >
            {project.coverImage ? (
                <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 480px"
                />
            ) : (
                <div className="flex h-full items-end p-4">
                    <span
                        className="truncate font-display text-2xl font-semibold leading-none opacity-20"
                        style={{ color: "var(--accent-on-canvas)" }}
                    >
                        {project.title}
                    </span>
                </div>
            )}
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

/** The hand-picked project — a double-wide tile with a taller cover. */
function LeadCard({ project, index }: { project: IProject; index: number }) {
    return (
        <div className={cn(CARD, "sm:col-span-2")}>
            <CoverImage project={project} tall />
            <div className="flex flex-1 flex-col gap-3 p-7">
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

                <Link href={`/projects/${project.slug}`} className="group relative z-10 min-w-0">
                    <h3
                        className="m-0 max-w-[32ch] font-display text-[clamp(1.4rem,2.2vw,1.75rem)] font-[560] leading-[1.15] tracking-[-0.022em] transition-opacity group-hover:opacity-70"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {project.title}
                    </h3>
                </Link>

                <p
                    className="m-0 max-w-[60ch] text-[1.0625rem] leading-[1.6] tracking-[-0.008em]"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {project.tagline}
                </p>

                <TechPills project={project} limit={6} />

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <span className={META} style={{ color: "var(--text-secondary)" }}>
                        {project.year} · {project.role}
                    </span>
                    <LinkChips project={project} long />
                </div>
            </div>
        </div>
    );
}

function ProjectCard({
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
        <div className={cn(CARD, full ? "" : "shadow-none")}>
            {full && <CoverImage project={project} />}
            <div className={cn("flex flex-1 flex-col gap-2.5", full ? "p-6" : "p-4")}>
                <div
                    className={`${META}`}
                    style={{ color: "var(--text-secondary)" }}
                >
                    {String(index).padStart(2, "0")}
                </div>

                <Link href={`/projects/${project.slug}`} className="group relative z-10 min-w-0">
                    <h3
                        className={cn(
                            "m-0 font-display leading-[1.28] tracking-[-0.014em] transition-opacity group-hover:opacity-70",
                            full ? "text-[1.1875rem] font-[560]" : "text-[1.0625rem] font-[550]",
                        )}
                        style={{
                            color: muted ? "var(--text-secondary)" : "var(--text-primary)",
                        }}
                    >
                        {project.title}
                    </h3>
                </Link>

                {full && (
                    <p
                        className="m-0 text-[0.9375rem] leading-[1.55]"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {project.tagline}
                    </p>
                )}

                <TechPills project={project} limit={full ? 3 : 2} />

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <span className={META} style={{ color: "var(--text-secondary)" }}>
                        {project.year} · {project.role}
                    </span>
                    <LinkChips project={project} />
                </div>
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

    // The lead tile is hand-picked in the admin (featured: boolean), not
    // inferred from `order` — see handoff/model-changes.md.
    const lead = leadRow
        ? (projects.find((p) => p.featured) ?? projects[0])
        : null;
    const rest = lead ? projects.filter((p) => p._id !== lead._id) : projects;

    return (
        <div
            className={cn(
                "grid gap-5",
                density === "full"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
            )}
        >
            {lead && <LeadCard project={lead} index={indexOffset + 1} />}
            {rest.map((project, i) => (
                <ProjectCard
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

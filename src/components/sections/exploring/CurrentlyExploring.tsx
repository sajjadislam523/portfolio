// The one place on the site that isn't about the stack — what's being
// actively learned, built, or experimented with right now, as opposed to
// what technologies are already in use (that's Stack's job). Built around a
// single oversized statement (the primary exploration's own title), a
// signal line carrying one restrained traveling pulse down to up to three
// smaller supporting explorations, and small coordinate/status detailing —
// never a card grid, since a grid would read as "more technology tiles"
// exactly like the thing this section exists to be different from.

import { CornerMarks } from "@/components/shared/TechnicalMotifs";
import { formatDate } from "@/lib/utils";
import type { IExploration } from "@/types";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface CurrentlyExploringProps {
    primary: IExploration | null;
    secondary: IExploration[];
}

export function CurrentlyExploring({ primary, secondary }: CurrentlyExploringProps) {
    if (!primary) return null;

    const ctaHref = primary.ctaUrl || primary.link;
    const ctaLabel = primary.ctaLabel || (primary.ctaUrl ? "View" : "Read more");

    return (
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_300px] lg:gap-20">
            {/* ── Primary focus — the one strong statement ─────────────────── */}
            <div>
                <div
                    className="flex items-center gap-2 font-mono text-small uppercase tracking-wide"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent-glow)" }}
                        aria-hidden
                    />
                    Active — since {formatDate(primary.startDate)}
                </div>

                <h3
                    className="m-0 mt-5 max-w-2xl text-display font-display"
                    style={{ color: "var(--text-primary)" }}
                >
                    {primary.title}
                </h3>

                <p
                    className="mt-6 max-w-lg text-body-lg"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {primary.description}
                </p>

                {primary.topics.length > 0 && (
                    <div
                        className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wide"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        {primary.topics.map((topic, i) => (
                            <span key={topic} className="flex items-center gap-2">
                                {i > 0 && <span aria-hidden>·</span>}
                                {topic}
                            </span>
                        ))}
                    </div>
                )}

                {primary.image && (
                    <div
                        className="relative mt-10 max-w-md overflow-hidden"
                        style={{ aspectRatio: "16 / 10", border: "1px solid var(--border)" }}
                    >
                        <Image
                            src={primary.image}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 420px, 90vw"
                            className="object-cover"
                        />
                        <CornerMarks />
                    </div>
                )}

                {ctaHref && (
                    <a
                        href={ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-10 inline-flex items-center gap-1.5 font-mono text-small uppercase tracking-wide transition-colors hover:text-[var(--accent)]"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {ctaLabel}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                )}
            </div>

            {/* ── Supporting explorations — smaller, carried by the signal
                line rather than duplicating the primary's full treatment ── */}
            {secondary.length > 0 && (
                <div className="relative pl-7">
                    <SignalRail count={secondary.length} />

                    <span
                        className="block font-mono text-[10px] uppercase tracking-widest"
                        style={{ color: "var(--text-tertiary)", opacity: 0.7 }}
                    >
                        Also in progress
                    </span>

                    <ul className="m-0 mt-4 flex list-none flex-col p-0">
                        {secondary.map((exploration, i) => (
                            <li
                                key={exploration._id}
                                className={i > 0 ? "border-t" : ""}
                                style={{ borderColor: "var(--line-hairline)" }}
                            >
                                <div className="flex flex-col gap-1 py-3">
                                    {exploration.link ? (
                                        <a
                                            href={exploration.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-body-lg transition-colors hover:text-[var(--accent)]"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            {exploration.title}
                                        </a>
                                    ) : (
                                        <span
                                            className="text-body-lg"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            {exploration.title}
                                        </span>
                                    )}
                                    {exploration.topics[0] && (
                                        <span
                                            className="font-mono text-[11px] uppercase tracking-wide"
                                            style={{ color: "var(--text-tertiary)" }}
                                        >
                                            {exploration.topics[0]}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// A thin vertical rail with a waypoint mark at its origin and one restrained
// pulse that travels its length on a long loop — mostly invisible, briefly
// present, never a continuous slide. `motion-reduce:hidden` drops the
// traveling node entirely for reduced-motion users; the static rail line
// stays either way, so the "signal" reads as a real diagram at rest too.
function SignalRail({ count }: { count: number }) {
    const bottom = Math.min(92, 24 + count * 26);

    return (
        <svg
            className="pointer-events-none absolute top-0 left-0 hidden h-full w-7 sm:block"
            viewBox="0 0 28 100"
            preserveAspectRatio="none"
            aria-hidden
        >
            <path
                id="signal-rail-path"
                d={`M 6 4 L 6 ${bottom}`}
                fill="none"
                stroke="var(--line)"
                strokeWidth="0.6"
                vectorEffect="non-scaling-stroke"
            />
            {/* Waypoint mark — a small crosshair at the rail's origin */}
            <line x1="2.5" y1="4" x2="9.5" y2="4" stroke="var(--line-strong)" strokeWidth="0.5" />
            <line x1="6" y1="0.5" x2="6" y2="7.5" stroke="var(--line-strong)" strokeWidth="0.5" />
            <g className="motion-reduce:hidden">
                <circle r="1.6" fill="var(--accent)">
                    <animateMotion
                        dur="7s"
                        repeatCount="indefinite"
                        keyTimes="0;0.04;0.32;1"
                        keyPoints="0;0;1;1"
                        calcMode="linear"
                    >
                        <mpath href="#signal-rail-path" />
                    </animateMotion>
                    <animate
                        attributeName="opacity"
                        dur="7s"
                        repeatCount="indefinite"
                        keyTimes="0;0.03;0.07;0.29;0.33;1"
                        values="0;0;1;1;0;0"
                    />
                </circle>
            </g>
        </svg>
    );
}

// A career timeline integrated directly into the page — text, a thin
// connecting line, and a subtle divider between entries, rather than a
// stack of bordered/shadowed cards. Every entry is always expanded; there
// is nothing to click. The only interactivity is a quiet CSS group-hover
// (node brightens, role brightens, tech line nudges) and a one-time reveal
// as the section scrolls into view — no client state needed, so this stays
// a server component apart from the two small motion islands it composes.

import { StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import { TimelineLine } from "@/components/sections/experience/TimelineLine";
import type { IExperience } from "@/types";
import { Fragment } from "react";

// Highlights metric-shaped substrings ($40k, 35%, 3x, 10,000, 500+) in an
// accomplishment line — never invented, only what's already in the text.
const METRIC_PATTERN =
    /(\$[\d,.]+[kKmMbB]?|\d+(?:\.\d+)?%|\d+(?:\.\d+)?x\b|\d{1,3}(?:,\d{3})+|\d+\+)/g;

function highlightMetrics(text: string): React.ReactNode {
    const parts = text.split(METRIC_PATTERN);
    if (parts.length === 1) return text;
    return parts.map((part, i) =>
        i % 2 === 1 ? (
            <span key={i} style={{ color: "var(--accent)", fontWeight: 600 }}>
                {part}
            </span>
        ) : (
            <Fragment key={i}>{part}</Fragment>
        ),
    );
}

/** Compact year label — "2025" for a single year, "2024—" ongoing, "2022—24" spanning years. */
function yearLabel(startDate: string, endDate: string | null): string {
    const startYear = new Date(startDate).getFullYear();
    if (!endDate) return `${startYear}—`;
    const endYear = new Date(endDate).getFullYear();
    return startYear === endYear
        ? `${startYear}`
        : `${startYear}—${String(endYear).slice(2)}`;
}

export function ExperienceTimeline({
    experiences,
}: {
    experiences: IExperience[];
}) {
    if (experiences.length === 0) {
        return (
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                No experience entries yet.
            </p>
        );
    }

    return (
        <div className="relative">
            {/* Continuous connecting line — thin, low-contrast, never glowing.
                Its horizontal offset matches the node column's center at each
                breakpoint: 12px on mobile, 108px at sm (72px date + 24px gap +
                half the 24px node column), 140px at lg (96px date + 32px gap). */}
            <TimelineLine className="absolute top-2 bottom-2 left-3 w-px sm:left-27 lg:left-35" />

            <StaggerContainer className="flex flex-col">
                {experiences.map((exp, index) => {
                    const isCurrent = !exp.endDate;
                    const contributions = exp.accomplishments.slice(0, 4);

                    return (
                        <StaggerItem key={exp._id}>
                            <div className="group grid grid-cols-[24px_minmax(0,1fr)] gap-x-6 pb-14 last:pb-0 sm:grid-cols-[72px_24px_minmax(0,1fr)] lg:grid-cols-[96px_24px_minmax(0,1fr)] lg:gap-x-8">
                                {/* Date column — sm and up only */}
                                <div className="hidden pt-1 sm:block">
                                    <span
                                        className="font-mono text-small"
                                        style={{ color: "var(--text-tertiary)" }}
                                    >
                                        {yearLabel(exp.startDate, exp.endDate)}
                                    </span>
                                </div>

                                {/* Node */}
                                <div className="flex justify-center pt-1.5">
                                    <span
                                        className="block h-2.5 w-2.5 rounded-full border-2 transition-all duration-300"
                                        style={
                                            isCurrent
                                                ? {
                                                      background: "var(--accent)",
                                                      borderColor: "var(--accent)",
                                                      boxShadow:
                                                          "0 0 6px var(--accent-glow)",
                                                  }
                                                : {
                                                      background: "transparent",
                                                      borderColor: "var(--line-strong)",
                                                  }
                                        }
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-3">
                                    {index > 0 && (
                                        <div
                                            className="mb-2 h-px w-full"
                                            style={{ background: "var(--line-hairline)" }}
                                            aria-hidden
                                        />
                                    )}

                                    {/* Mobile-only date — sm and up rely on the column */}
                                    <span
                                        className="font-mono text-small sm:hidden"
                                        style={{ color: "var(--text-tertiary)" }}
                                    >
                                        {yearLabel(exp.startDate, exp.endDate)}
                                    </span>

                                    <div>
                                        <h3
                                            className="m-0 text-h3 font-display transition-colors duration-200"
                                            style={{ color: "var(--text-primary)" }}
                                        >
                                            <span className="group-hover:text-accent">
                                                {exp.role}
                                            </span>
                                        </h3>
                                        <p
                                            className="mt-1 text-body"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            {exp.company}
                                            <span style={{ color: "var(--text-tertiary)" }}>
                                                {" "}
                                                · {exp.location}
                                            </span>
                                        </p>
                                    </div>

                                    {exp.description && (
                                        <p
                                            className="max-w-[62ch] text-body-lg"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            {exp.description}
                                        </p>
                                    )}

                                    {contributions.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                            <span
                                                className="font-mono text-eyebrow uppercase"
                                                style={{ color: "var(--text-tertiary)" }}
                                            >
                                                Selected contributions
                                            </span>
                                            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                                                {contributions.map((item, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex gap-2.5 text-body-lg"
                                                        style={{ color: "var(--text-secondary)" }}
                                                    >
                                                        <span
                                                            className="mt-0.75 shrink-0"
                                                            style={{ color: "var(--text-tertiary)" }}
                                                            aria-hidden
                                                        >
                                                            ·
                                                        </span>
                                                        <span>{highlightMetrics(item)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {exp.technologies.length > 0 && (
                                        <div
                                            className="pt-1 font-mono text-small uppercase tracking-wide transition-transform duration-300 group-hover:-translate-y-0.5"
                                            style={{ color: "var(--text-tertiary)" }}
                                        >
                                            {exp.technologies.join(" / ")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </StaggerItem>
                    );
                })}
            </StaggerContainer>
        </div>
    );
}

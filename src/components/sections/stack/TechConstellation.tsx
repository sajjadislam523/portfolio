"use client";

// The desktop "technical constellation" — a spatial map, not a dashboard.
// Typography carries the hierarchy (no progress bars, no pills): Core
// technologies anchor the top band in display type, Working knowledge and
// Exploring technologies sit in progressively quieter bands beneath. Thin
// SVG lines connect real relationships (shared projects, see
// constellation.ts) radiating outward from the core anchors only, so the
// graph stays sparse. Hovering a node highlights its neighborhood — the
// node itself scales up a hair, connected nodes and lines brighten toward
// the accent, everything else dims slightly — and reveals that skill's
// category as a small contextual label. Nothing here moves on its own;
// every effect is hover-driven.
//
// Positions are pure percentages (see layoutSkills), and the SVG uses the
// same 0–100 coordinate space with preserveAspectRatio="none" so the line
// endpoints always land exactly on the HTML nodes regardless of the
// container's actual rendered size — no ResizeObserver or measurement
// pass needed.

import {
    CATEGORY_LABELS,
    TIER_LABEL,
    TIER_NAME_CLASS,
    TIER_NAME_COLOR,
    TIER_ORDER,
} from "@/components/sections/stack/constants";
import { buildAdjacency, edgeList, layoutSkills } from "@/components/sections/stack/constellation";
import { GridFragment } from "@/components/shared/TechnicalMotifs";
import type { ISkill } from "@/types";
import { useMemo, useState } from "react";

const TIER_DOT_SIZE: Record<ISkill["tier"], number> = {
    core: 7,
    "working-knowledge": 5,
    exploring: 3.5,
};

export function TechConstellation({
    skills,
    className = "",
}: {
    skills: ISkill[];
    className?: string;
}) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const positions = useMemo(() => layoutSkills(skills), [skills]);
    const adjacency = useMemo(() => buildAdjacency(skills), [skills]);
    const edges = useMemo(() => edgeList(adjacency), [adjacency]);

    const hoveredNeighbors = hoveredId ? new Set(adjacency[hoveredId] ?? []) : null;

    return (
        <div
            className={`relative h-[460px] overflow-hidden ${className}`}
            onMouseLeave={() => setHoveredId(null)}
        >
            <GridFragment className="top-0 right-0 -z-10" size={220} />

            {/* Tier legends — the section-numbering + tiny-label motif,
                doubling as the graph's axis labels. */}
            {TIER_ORDER.map((tier, i) => (
                <span
                    key={tier}
                    className="pointer-events-none absolute left-0 font-mono text-[10px] uppercase tracking-widest"
                    style={{
                        top: `${
                            tier === "core" ? 20 : tier === "working-knowledge" ? 53 : 86
                        }%`,
                        transform: "translateY(-2.4rem)",
                        color: tier === "core" ? "var(--accent)" : "var(--text-tertiary)",
                        opacity: tier === "core" ? 0.8 : 0.5,
                    }}
                >
                    {String(i + 1).padStart(2, "0")} — {TIER_LABEL[tier]}
                </span>
            ))}

            <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
            >
                {edges.map(([a, b]) => {
                    const pa = positions.get(a);
                    const pb = positions.get(b);
                    if (!pa || !pb) return null;
                    const isActive = hoveredId === a || hoveredId === b;
                    return (
                        <line
                            key={`${a}-${b}`}
                            x1={pa.x}
                            y1={pa.y}
                            x2={pb.x}
                            y2={pb.y}
                            stroke={isActive ? "var(--accent-strong)" : "var(--line)"}
                            strokeWidth={isActive ? 0.3 : 0.12}
                            opacity={isActive ? 0.9 : 1}
                            style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                        />
                    );
                })}
            </svg>

            {skills.map((skill) => {
                const pos = positions.get(skill._id);
                if (!pos) return null;

                const isSelf = hoveredId === skill._id;
                const isConnected = hoveredNeighbors?.has(skill._id) ?? false;
                const isDimmed = hoveredId !== null && !isSelf && !isConnected;

                return (
                    <button
                        key={skill._id}
                        type="button"
                        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 border-0 bg-transparent p-2 whitespace-nowrap"
                        style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            opacity: isDimmed ? 0.4 : 1,
                            transition: "opacity 0.3s ease",
                        }}
                        onMouseEnter={() => setHoveredId(skill._id)}
                        onFocus={() => setHoveredId(skill._id)}
                        onBlur={() => setHoveredId(null)}
                    >
                        <span
                            className="block rounded-full border-2 transition-transform duration-300"
                            style={{
                                width: TIER_DOT_SIZE[skill.tier],
                                height: TIER_DOT_SIZE[skill.tier],
                                background:
                                    skill.tier === "core" || isConnected
                                        ? "var(--accent)"
                                        : "transparent",
                                borderColor:
                                    isConnected || isSelf
                                        ? "var(--accent-strong)"
                                        : "var(--line-strong)",
                                transform: isSelf ? "scale(1.3)" : "scale(1)",
                            }}
                        />
                        <span
                            className={`${TIER_NAME_CLASS[skill.tier]} leading-none transition-transform duration-300`}
                            style={{
                                color:
                                    isConnected || isSelf
                                        ? "var(--text-primary)"
                                        : TIER_NAME_COLOR[skill.tier],
                                transform: isSelf ? "scale(1.06) translateY(-1px)" : "scale(1)",
                            }}
                        >
                            {skill.name}
                        </span>
                        <span
                            className="font-mono text-[10px] uppercase tracking-wide transition-opacity duration-200"
                            style={{
                                color: "var(--text-tertiary)",
                                opacity: isSelf ? 1 : 0,
                            }}
                        >
                            {CATEGORY_LABELS[skill.category]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

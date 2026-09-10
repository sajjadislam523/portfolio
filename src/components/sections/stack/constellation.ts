// Pure layout/graph logic for the technical constellation — no JSX, no
// client-only APIs, so it can be unit-reasoned about independently of the
// component that renders it.
//
// Connections are anchored from CORE (expert-tier) technologies outward,
// never between two non-core skills — this keeps the graph a sparse
// hub-and-spoke diagram (matching "core technologies as visual anchors")
// instead of a dense mesh across every pair, which would read as a
// cluttered "glowing web". An edge is real data, not invented: two skills
// are connected when they list a shared project slug (the same field the
// admin panel already edits as "Projects" on each skill). If a core skill
// has never been tagged onto a shared project, it falls back to a capped
// number of same-category skills so the diagram never looks broken for a
// sparsely-tagged dataset.

import { TIER_ORDER } from "@/components/sections/stack/constants";
import type { ISkill } from "@/types";

const MAX_CATEGORY_FALLBACK_EDGES = 3;

export function buildAdjacency(skills: ISkill[]): Record<string, string[]> {
    const adjacency: Record<string, Set<string>> = {};
    const add = (a: string, b: string) => {
        (adjacency[a] ??= new Set()).add(b);
        (adjacency[b] ??= new Set()).add(a);
    };

    const cores = skills.filter((s) => s.tier === "core");

    for (const core of cores) {
        let found = 0;
        for (const other of skills) {
            if (other._id === core._id) continue;
            if (core.projects.some((p) => other.projects.includes(p))) {
                add(core._id, other._id);
                found++;
            }
        }
        if (found === 0) {
            skills
                .filter((s) => s._id !== core._id && s.category === core.category)
                .slice(0, MAX_CATEGORY_FALLBACK_EDGES)
                .forEach((s) => add(core._id, s._id));
        }
    }

    return Object.fromEntries(
        Object.entries(adjacency).map(([id, set]) => [id, Array.from(set)]),
    );
}

/** Every unique edge as a sorted [a, b] pair — for drawing each line once. */
export function edgeList(adjacency: Record<string, string[]>): [string, string][] {
    const seen = new Set<string>();
    const edges: [string, string][] = [];
    for (const [a, neighbors] of Object.entries(adjacency)) {
        for (const b of neighbors) {
            const key = [a, b].sort().join("|");
            if (seen.has(key)) continue;
            seen.add(key);
            edges.push([a, b]);
        }
    }
    return edges;
}

// A small deterministic hash so the same skill always lands at the same
// spot on every render (server and client alike) without needing real
// randomness or a measured layout pass.
function seededOffset(seed: string, range: number): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }
    const normalized = (Math.abs(hash) % 1000) / 1000;
    return (normalized - 0.5) * 2 * range;
}

const TIER_BAND: Record<ISkill["tier"], { yCenter: number; yJitter: number }> = {
    core: { yCenter: 20, yJitter: 8 },
    "working-knowledge": { yCenter: 53, yJitter: 9 },
    exploring: { yCenter: 86, yJitter: 8 },
};

export interface Point {
    x: number;
    y: number;
}

/** Percentage coordinates (0–100) for every skill, banded by tier. */
export function layoutSkills(skills: ISkill[]): Map<string, Point> {
    const positions = new Map<string, Point>();
    const marginX = 11;

    for (const tier of TIER_ORDER) {
        const items = skills.filter((s) => s.tier === tier);
        const band = TIER_BAND[tier];
        items.forEach((skill, i) => {
            const slot = items.length === 1 ? 0.5 : (i + 0.5) / items.length;
            const x = marginX + slot * (100 - marginX * 2) + seededOffset(`${skill._id}x`, 2.5);
            const y = band.yCenter + seededOffset(`${skill._id}y`, band.yJitter);
            positions.set(skill._id, { x, y });
        });
    }

    return positions;
}

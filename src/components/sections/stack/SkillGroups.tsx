// A technical capability map, not a dashboard — three proficiency tiers
// (Core / Working knowledge / Exploring, mapped straight from ISkill's
// existing `proficiency` field) rendered as an editorial list. Hierarchy
// comes from typography — size, weight, color — never from a percentage,
// a progress bar, or a colored pill. No client state: the one hover effect
// (an accent tick + a quiet category label) is pure CSS `group-hover`, so
// this stays a server component.

import { CATEGORY_LABELS } from "@/components/sections/stack/constants";
import type { ISkill } from "@/types";

type Tier = ISkill["proficiency"];

const TIER_ORDER: Tier[] = ["expert", "proficient", "familiar"];

const TIER_LABEL: Record<Tier, string> = {
    expert: "Core",
    proficient: "Working knowledge",
    familiar: "Exploring",
};

// Substance steps down with each tier — display weight and the largest
// size for what I use daily, down to quiet body text for what I'm still
// learning. The typography itself is the "skill level" signal.
const TIER_NAME_CLASS: Record<Tier, string> = {
    expert: "text-h3 font-display",
    proficient: "text-body-lg",
    familiar: "text-body",
};
const TIER_NAME_COLOR: Record<Tier, string> = {
    expert: "var(--text-primary)",
    proficient: "var(--text-secondary)",
    familiar: "var(--text-tertiary)",
};
const TIER_LABEL_COLOR: Record<Tier, string> = {
    expert: "var(--accent)",
    proficient: "var(--text-tertiary)",
    familiar: "var(--text-tertiary)",
};

const GRID_COLS: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
};

export function SkillGroups({ skills }: { skills: ISkill[] }) {
    const groups = TIER_ORDER.map((tier) => ({
        tier,
        items: skills.filter((s) => s.proficiency === tier),
    })).filter((g) => g.items.length > 0);

    if (groups.length === 0) return null;

    return (
        <div
            className={`grid grid-cols-1 gap-x-12 gap-y-14 ${GRID_COLS[groups.length] ?? "lg:grid-cols-3"}`}
        >
            {groups.map(({ tier, items }) => (
                <div key={tier} className="flex flex-col">
                    <span
                        className="mb-6 font-mono text-eyebrow uppercase"
                        style={{ color: TIER_LABEL_COLOR[tier] }}
                    >
                        {TIER_LABEL[tier]}
                    </span>

                    <ul className="m-0 flex list-none flex-col p-0">
                        {items.map((skill, i) => (
                            <li
                                key={skill._id}
                                className={i > 0 ? "border-t" : ""}
                                style={{ borderColor: "var(--line-hairline)" }}
                            >
                                <div className="group relative -ml-3 flex items-baseline gap-3 py-2.5 pl-3">
                                    {/* Accent tick — the hover indicator, not a border/shadow */}
                                    <span
                                        className="absolute top-1/2 left-0 h-4 w-0.5 origin-center -translate-y-1/2 scale-y-0 transition-transform duration-200 group-hover:scale-y-100"
                                        style={{ background: "var(--accent)" }}
                                        aria-hidden
                                    />
                                    <span
                                        className={`${TIER_NAME_CLASS[tier]} opacity-90 transition-opacity duration-200 group-hover:opacity-100`}
                                        style={{ color: TIER_NAME_COLOR[tier] }}
                                    >
                                        {skill.name}
                                    </span>
                                    {/* Tiny contextual label — real data (category), not decoration */}
                                    <span
                                        className="font-mono text-[11px] uppercase tracking-wide opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                        style={{ color: "var(--text-tertiary)" }}
                                    >
                                        {CATEGORY_LABELS[skill.category]}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

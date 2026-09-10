import type { SkillCategory, SkillTier } from "@/types";

export const CATEGORY_ORDER: SkillCategory[] = [
    "frontend",
    "backend",
    "database",
    "devops",
    "tooling",
];

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    devops: "DevOps",
    tooling: "Tooling",
};

// Three stack tiers — what's actually used, not how it's felt about. Shared
// between the desktop constellation and the mobile stacked fallback so both
// read the same hierarchy.
export type Tier = SkillTier;

export const TIER_ORDER: Tier[] = ["core", "working-knowledge", "exploring"];

export const TIER_LABEL: Record<Tier, string> = {
    core: "Core",
    "working-knowledge": "Working knowledge",
    exploring: "Exploring",
};

// Substance steps down with each tier — display weight and the largest
// size for what's used daily, down to quiet body text for what's newly
// being adopted. The typography itself is the "tier" signal.
export const TIER_NAME_CLASS: Record<Tier, string> = {
    core: "text-h3 font-display",
    "working-knowledge": "text-body-lg",
    exploring: "text-body",
};
export const TIER_NAME_COLOR: Record<Tier, string> = {
    core: "var(--text-primary)",
    "working-knowledge": "var(--text-secondary)",
    exploring: "var(--text-tertiary)",
};
export const TIER_LABEL_COLOR: Record<Tier, string> = {
    core: "var(--accent)",
    "working-knowledge": "var(--text-tertiary)",
    exploring: "var(--text-tertiary)",
};

// Mirrors scripts/migrate-skill-tiers.ts's mapping exactly. Kept here (not
// just in the migration script) so a skill document that predates the
// Skill.proficiency -> Skill.tier rename and hasn't been migrated in the
// database yet still gets the *correct* tier at read time — not just a
// safe-but-wrong fallback — everywhere ISkill data is read (public site,
// admin panel), with no dependency on the migration having been run.
const PROFICIENCY_TO_TIER: Record<string, Tier> = {
    expert: "core",
    proficient: "working-knowledge",
    familiar: "working-knowledge",
};

/** A skill shape wide enough to read either the current `tier` field or the
 *  legacy `proficiency` field a pre-migration document might still have. */
interface SkillTierSource {
    tier?: string;
    proficiency?: string;
}

export function deriveSkillTier(skill: SkillTierSource): Tier {
    if (skill.tier && (TIER_ORDER as string[]).includes(skill.tier)) {
        return skill.tier as Tier;
    }
    if (skill.proficiency && skill.proficiency in PROFICIENCY_TO_TIER) {
        return PROFICIENCY_TO_TIER[skill.proficiency];
    }
    return "working-knowledge";
}

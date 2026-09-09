import type { ISkill, SkillCategory } from "@/types";

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

// Three proficiency tiers, mapped straight from ISkill's existing
// `proficiency` field — shared between the desktop constellation and the
// mobile stacked fallback so both read the same hierarchy.
export type Tier = ISkill["proficiency"];

export const TIER_ORDER: Tier[] = ["expert", "proficient", "familiar"];

export const TIER_LABEL: Record<Tier, string> = {
    expert: "Core",
    proficient: "Working knowledge",
    familiar: "Exploring",
};

// Substance steps down with each tier — display weight and the largest
// size for what's used daily, down to quiet body text for what's still
// being learned. The typography itself is the "skill level" signal.
export const TIER_NAME_CLASS: Record<Tier, string> = {
    expert: "text-h3 font-display",
    proficient: "text-body-lg",
    familiar: "text-body",
};
export const TIER_NAME_COLOR: Record<Tier, string> = {
    expert: "var(--text-primary)",
    proficient: "var(--text-secondary)",
    familiar: "var(--text-tertiary)",
};
export const TIER_LABEL_COLOR: Record<Tier, string> = {
    expert: "var(--accent)",
    proficient: "var(--text-tertiary)",
    familiar: "var(--text-tertiary)",
};

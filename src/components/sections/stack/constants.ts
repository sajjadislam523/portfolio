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

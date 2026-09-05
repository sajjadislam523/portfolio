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

export const PROFICIENCY_STYLE: Record<
    ISkill["proficiency"],
    { label: string; color: string; bg: string; border: string }
> = {
    expert: {
        label: "Expert",
        color: "var(--accent)",
        bg: "var(--accent-glow)",
        border: "var(--border-strong)",
    },
    proficient: {
        label: "Proficient",
        color: "var(--text-primary)",
        bg: "var(--bg-subtle)",
        border: "var(--border)",
    },
    familiar: {
        label: "Familiar",
        color: "var(--text-tertiary)",
        bg: "transparent",
        border: "var(--border)",
    },
};

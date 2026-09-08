import type { SkillCategory } from "@/types";

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

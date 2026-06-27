import { FadeIn } from "@/components/motion/ScrollReveal";
import { connectDB, Skill } from "@/lib/db";
import type { ISkill, SkillCategory } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Stack",
    description:
        "The technologies I work with — frontend, backend, database, DevOps, and tooling.",
};

export const revalidate = 60;

const CATEGORY_ORDER: SkillCategory[] = [
    "frontend",
    "backend",
    "database",
    "devops",
    "tooling",
];

const CATEGORY_LABELS: Record<SkillCategory, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    devops: "DevOps",
    tooling: "Tooling",
};

const CATEGORY_DESCRIPTIONS: Record<SkillCategory, string> = {
    frontend: "UI frameworks, styling, and client-side tooling",
    backend: "Server runtimes, APIs, and authentication",
    database: "Data storage, ODMs, and real-time services",
    devops: "Deployment, containerisation, and hosting",
    tooling: "Development workflow and collaboration tools",
};

const PROFICIENCY_STYLE: Record<
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

async function getSkills(): Promise<ISkill[]> {
    try {
        await connectDB();
        const docs = await Skill.find().sort({ category: 1, order: 1 }).lean();
        return JSON.parse(JSON.stringify(docs));
    } catch {
        return [];
    }
}

export default async function StackPage() {
    const skills = await getSkills();

    const grouped = CATEGORY_ORDER.reduce<Record<SkillCategory, ISkill[]>>(
        (acc, cat) => {
            acc[cat] = skills.filter((s) => s.category === cat);
            return acc;
        },
        {} as Record<SkillCategory, ISkill[]>,
    );

    return (
        <div className="pt-28 pb-24">
            <div className="container max-w-3xl">
                <FadeIn>
                    <p
                        className="text-xs font-medium uppercase tracking-widest mb-3"
                        style={{ color: "var(--accent)" }}
                    >
                        Technology
                    </p>
                    <h1
                        className="text-h1 mb-4"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Stack
                    </h1>
                    <p
                        className="text-base mb-6"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        The tools and technologies I use to design, build, and
                        ship production software.
                    </p>

                    {/* Proficiency legend */}
                    <div className="flex items-center gap-4 mb-16">
                        {Object.entries(PROFICIENCY_STYLE).map(
                            ([key, style]) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-1.5"
                                >
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: style.color }}
                                    />
                                    <span
                                        className="text-xs"
                                        style={{
                                            color: "var(--text-tertiary)",
                                        }}
                                    >
                                        {style.label}
                                    </span>
                                </div>
                            ),
                        )}
                    </div>
                </FadeIn>

                <div className="flex flex-col gap-12">
                    {CATEGORY_ORDER.map((cat, catIdx) => {
                        const catSkills = grouped[cat];
                        if (catSkills.length === 0) return null;

                        return (
                            <div key={cat}>
                                <div className="grid grid-cols-[140px_1fr] gap-8 items-start">
                                    <div className="pt-1">
                                        <h2
                                            className="text-sm font-semibold"
                                            style={{
                                                color: "var(--text-primary)",
                                            }}
                                        >
                                            {CATEGORY_LABELS[cat]}
                                        </h2>
                                        <p
                                            className="text-xs mt-1 leading-relaxed"
                                            style={{
                                                color: "var(--text-tertiary)",
                                            }}
                                        >
                                            {CATEGORY_DESCRIPTIONS[cat]}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {catSkills.map((skill) => {
                                            const style =
                                                PROFICIENCY_STYLE[
                                                    skill.proficiency
                                                ];
                                            return (
                                                <span
                                                    key={skill._id}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium"
                                                    style={{
                                                        background: style.bg,
                                                        border: `1px solid ${style.border}`,
                                                        color: style.color,
                                                    }}
                                                    title={`${skill.proficiency.charAt(0).toUpperCase() + skill.proficiency.slice(1)}${skill.projects.length > 0 ? ` · used in ${skill.projects.length} project${skill.projects.length > 1 ? "s" : ""}` : ""}`}
                                                >
                                                    {skill.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                {catIdx < CATEGORY_ORDER.length - 1 && (
                                    <hr
                                        className="mt-12"
                                        style={{ borderColor: "var(--border)" }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {skills.length === 0 && (
                    <p
                        className="text-sm py-16 text-center"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        No skills yet — check back soon.
                    </p>
                )}
            </div>
        </div>
    );
}

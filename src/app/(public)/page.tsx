import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { ExperienceTimeline } from "@/components/sections/experience/ExperienceTimeline";
import { Hero } from "@/components/sections/hero/Hero";
import { TechMarquee } from "@/components/sections/hero/TechMarquee";
import { ProjectLedger } from "@/components/sections/projects/ProjectLedger";
import { CATEGORY_ORDER, PROFICIENCY_STYLE } from "@/components/sections/stack/constants";
import { SkillTabs } from "@/components/sections/stack/SkillTabs";
import { JsonLdPerson } from "@/components/shared/JsonLd";
import { connectDB, Experience, Project, SiteSettings, Skill } from "@/lib/db";
import type {
    IExperience,
    IProject,
    ISiteSettings,
    ISkill,
    SkillCategory,
} from "@/types";
import type { Metadata } from "next";

// Cache the homepage at the edge for 5 minutes.
// This means Vercel serves it from CDN on cold starts instead of
// hitting the serverless function + MongoDB every time.
export const revalidate = 300;

async function getData() {
    try {
        await connectDB();
        const [settingsDoc, projectDocs, experienceDocs, skillDocs] =
            await Promise.all([
                SiteSettings.findOne({}).lean(),
                Project.find().sort({ order: 1 }).lean(),
                Experience.find().sort({ order: 1 }).lean(),
                Skill.find().sort({ category: 1, order: 1 }).lean(),
            ]);

        const allProjects = JSON.parse(
            JSON.stringify(projectDocs),
        ) as IProject[];
        const experiences = JSON.parse(
            JSON.stringify(experienceDocs),
        ) as IExperience[];
        const skills = JSON.parse(JSON.stringify(skillDocs)) as ISkill[];

        const earliestStart = experiences.reduce<Date | null>((min, e) => {
            const start = new Date(e.startDate);
            return !min || start < min ? start : min;
        }, null);
        const experienceYears = earliestStart
            ? Math.max(
                  1,
                  Math.floor(
                      (Date.now() - earliestStart.getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000),
                  ),
              )
            : null;

        return {
            settings: settingsDoc
                ? (JSON.parse(JSON.stringify(settingsDoc)) as ISiteSettings)
                : null,
            featuredProjects: allProjects.filter(
                (p) => p.status === "featured",
            ),
            archivedProjects: allProjects.filter(
                (p) => p.status === "archived",
            ),
            experiences,
            latestRole: experiences[0] ?? null,
            skills,
            experienceYears,
            projectCount: allProjects.length,
            skillCount: skills.length,
        };
    } catch {
        return {
            settings: null,
            featuredProjects: [],
            archivedProjects: [],
            experiences: [],
            latestRole: null,
            skills: [],
            experienceYears: null,
            projectCount: 0,
            skillCount: 0,
        };
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const { settings } = await getData();
    return {
        title: settings?.seo.title ?? "Sajjadul Islam — Full Stack Engineer",
        description: settings?.seo.description,
        openGraph: {
            images: settings?.seo.ogImage ? [settings.seo.ogImage] : [],
        },
    };
}

const TECH_STACK = [
    "React.js",
    "Next.js",
    "TypeScript",
    "TailwindCSS",
    "Node.js",
    "Express.js",
    "MongoDB",
    "JWT",
    "Stripe",
    "TanStack Query",
    "Docker",
    "Vercel",
    "shadcn/ui",
    "Framer Motion",
    "Git",
];

export default async function HomePage() {
    const {
        settings,
        featuredProjects,
        archivedProjects,
        experiences,
        latestRole,
        skills,
        experienceYears,
        projectCount,
        skillCount,
    } = await getData();

    const experienceLabel = experienceYears ? `${experienceYears}+ yr` : "1+ yr";
    const projectsLabel = projectCount > 0 ? `${projectCount}+` : "20+";
    const stackLabel = skillCount > 0 ? `${skillCount}+` : "20+";

    const name = settings?.name ?? "Sajjadul Islam";
    const bio = settings?.bio ?? "";
    const socialLinks = settings?.socialLinks ?? [];
    const availableForWork = settings?.availableForWork ?? false;

    const groupedSkills = CATEGORY_ORDER.reduce<Record<SkillCategory, ISkill[]>>(
        (acc, cat) => {
            acc[cat] = skills.filter((s) => s.category === cat);
            return acc;
        },
        {} as Record<SkillCategory, ISkill[]>,
    );

    return (
        <>
            <JsonLdPerson
                name={name}
                url={process.env.NEXT_PUBLIC_URL ?? "https://sajjadulislam.dev"}
                email={settings?.email}
                jobTitle={latestRole?.role ?? "Full Stack Engineer"}
                description={bio || undefined}
                sameAs={socialLinks.map((l) => l.url)}
            />
            {/* ── Hero ───────────────────────────────────────────────────────────── */}
            <Hero
                settings={settings}
                latestRole={latestRole}
                experienceLabel={experienceLabel}
                projectsLabel={projectsLabel}
                stackLabel={stackLabel}
                groupedSkills={groupedSkills}
            />

            {/* ── Tech marquee ───────────────────────────────────────────────────── */}
            <TechMarquee techs={TECH_STACK} />

            {/* ── Projects ─────────────────────────────────────────────────────────── */}
            <section id="projects" className="section zone-canvas">
                <div className="container">
                    <ScrollReveal>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-6 h-px"
                                style={{ background: "var(--accent)" }}
                            />
                            <p
                                className="text-xs font-medium uppercase tracking-widest"
                                style={{ color: "var(--accent)" }}
                            >
                                Selected work
                            </p>
                        </div>
                        <h2
                            className="text-h2 font-display mb-10"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Featured projects
                        </h2>
                    </ScrollReveal>

                    {featuredProjects.length > 0 ? (
                        <ProjectLedger
                            projects={featuredProjects}
                            density="full"
                            leadRow
                        />
                    ) : (
                        <p
                            className="text-sm py-16 text-center"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            No projects yet — check back soon.
                        </p>
                    )}

                    {/* ── Archive ──────────────────────────────────────────────────── */}
                    {archivedProjects.length > 0 && (
                        <div className="mt-16">
                            <div className="flex items-center gap-3 mb-6">
                                <span
                                    className="text-xs font-medium uppercase tracking-widest"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    Archive
                                </span>
                                <div
                                    className="flex-1 h-px"
                                    style={{ background: "var(--border)" }}
                                />
                            </div>

                            <ProjectLedger
                                projects={archivedProjects}
                                density="compact"
                                muted
                                indexOffset={featuredProjects.length}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* ── Experience ───────────────────────────────────────────────────────── */}
            <section
                id="experience"
                className="section"
                style={{ background: "var(--bg-secondary)" }}
            >
                <div className="container">
                    <ScrollReveal>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-6 h-px"
                                style={{ background: "var(--accent)" }}
                            />
                            <p
                                className="text-xs font-medium uppercase tracking-widest"
                                style={{ color: "var(--accent)" }}
                            >
                                Career
                            </p>
                        </div>
                        <h2
                            className="text-h2 font-display mb-10"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Experience
                        </h2>
                    </ScrollReveal>

                    <div className="max-w-2xl">
                        <ExperienceTimeline experiences={experiences} />
                    </div>
                </div>
            </section>

            {/* ── Stack ────────────────────────────────────────────────────────────── */}
            <section id="stack" className="section">
                <div className="container">
                    <ScrollReveal>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-6 h-px"
                                style={{ background: "var(--accent)" }}
                            />
                            <p
                                className="text-xs font-medium uppercase tracking-widest"
                                style={{ color: "var(--accent)" }}
                            >
                                Technology
                            </p>
                        </div>
                        <h2
                            className="text-h2 font-display mb-6"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Stack
                        </h2>

                        {/* Proficiency legend */}
                        <div className="flex items-center gap-4 mb-12">
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
                    </ScrollReveal>

                    {skills.length > 0 ? (
                        <SkillTabs
                            groupedSkills={groupedSkills}
                            proficiencyStyle={PROFICIENCY_STYLE}
                        />
                    ) : (
                        <p
                            className="text-sm py-16 text-center"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            No skills yet — check back soon.
                        </p>
                    )}
                </div>
            </section>

            {/* ── Contact ──────────────────────────────────────────────────────────── */}
            <section
                id="contact"
                className="section"
                style={{ background: "var(--bg-secondary)" }}
            >
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <ScrollReveal>
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className="w-6 h-px"
                                    style={{ background: "var(--accent)" }}
                                />
                                <p
                                    className="text-xs font-medium uppercase tracking-widest"
                                    style={{ color: "var(--accent)" }}
                                >
                                    Contact
                                </p>
                            </div>
                            <h2
                                className="text-h2 font-display mb-4"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Get in touch
                            </h2>
                            <p
                                className="text-base mb-3 max-w-md"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                I&apos;m currently{" "}
                                <span
                                    style={{
                                        color: availableForWork
                                            ? "var(--accent)"
                                            : "var(--text-secondary)",
                                    }}
                                >
                                    {availableForWork
                                        ? "open to new opportunities"
                                        : "not actively looking"}
                                </span>
                                . Whether you have a project, a question, or
                                just want to say hello — my inbox is open.
                            </p>
                            {settings?.email && (
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
                                    style={{ color: "var(--accent)" }}
                                    aria-label={`Email ${settings.email}`}
                                >
                                    {settings.email} ↗
                                </a>
                            )}
                        </ScrollReveal>

                        <ScrollReveal delay={0.08}>
                            <div
                                className="rounded-xl p-6"
                                style={{
                                    background: "var(--bg-elevated)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <p
                                    className="text-sm font-medium mb-5"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    Send a message
                                </p>
                                <ContactForm />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </>
    );
}

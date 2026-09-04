import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { ExperienceTimeline } from "@/components/sections/experience/ExperienceTimeline";
import { HeroVisual } from "@/components/sections/hero/HeroVisual";
import { RotatingWord } from "@/components/sections/hero/RotatingWord";
import { TechMarquee } from "@/components/sections/hero/TechMarquee";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";
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
import { ArrowUpRight, FileText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
    const resumeUrl = settings?.resumeUrl ?? "";
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
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0 bg-grid pointer-events-none" />

                {/* Radial glow */}
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)",
                        filter: "blur(40px)",
                        opacity: "var(--hero-glow-opacity)",
                    }}
                />

                {/* Orb top-right */}
                <div
                    className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
                    style={{
                        background: "var(--accent-glow)",
                        filter: "blur(80px)",
                        opacity: 0.6,
                        transform: "translate(30%, -30%)",
                    }}
                />
                {/* Orb bottom-left */}
                <div
                    className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
                    style={{
                        background: "var(--accent-glow)",
                        filter: "blur(60px)",
                        opacity: 0.4,
                        transform: "translate(-30%, 30%)",
                    }}
                />

                <div className="container relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
                        {/* Left — text */}
                        <div>
                            {/* Status badge */}
                            {availableForWork && (
                                <FadeIn>
                                    <div
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-8"
                                        style={{
                                            background:
                                                "color-mix(in srgb, var(--accent) 8%, transparent)",
                                            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                                            color: "var(--accent)",
                                        }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                                        Open to opportunities
                                    </div>
                                </FadeIn>
                            )}

                            {/* Headline */}
                            <FadeIn delay={0.05}>
                                <div className="flex flex-col mb-6" style={{ gap: "0.05em" }}>
                                    {/* Line 1 — intro label */}
                                    <span
                                        className="text-sm font-mono tracking-wider mb-3"
                                        style={{ color: "var(--text-tertiary)" }}
                                    >
                                        Hi, I&apos;m {name} —
                                    </span>

                                    {/* Lines 2–4 — the main headline block */}
                                    <h1 style={{ lineHeight: 1, margin: 0 }}>
                                        <span
                                            className="block font-display font-extrabold tracking-tight"
                                            style={{
                                                fontSize: "clamp(3.5rem, 7vw, 6rem)",
                                                color: "var(--text-primary)",
                                                lineHeight: 1,
                                            }}
                                        >
                                            Full Stack
                                        </span>

                                        <span
                                            className="block"
                                            style={{
                                                fontSize: "clamp(3rem, 6vw, 5.2rem)",
                                                lineHeight: 1.1,
                                            }}
                                        >
                                            <RotatingWord />
                                        </span>

                                        <span
                                            className="block font-display font-extrabold tracking-tight"
                                            style={{
                                                fontSize: "clamp(3.5rem, 7vw, 6rem)",
                                                color: "var(--text-primary)",
                                                lineHeight: 1,
                                            }}
                                        >
                                            Engineer
                                        </span>
                                    </h1>
                                </div>
                            </FadeIn>

                            {/* Context line */}
                            <FadeIn delay={0.1}>
                                <div
                                    className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 mt-4 text-sm"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    <span>{name}</span>
                                    <span>·</span>
                                    {latestRole && (
                                        <>
                                            <span>{latestRole.role}</span>
                                            <span>·</span>
                                            <span>{latestRole.company}</span>
                                            <span>·</span>
                                        </>
                                    )}
                                    <span>
                                        {settings?.location ?? "Dhaka, Bangladesh"}
                                    </span>
                                </div>
                            </FadeIn>

                            {bio && (
                                <FadeIn delay={0.15}>
                                    <p
                                        className="text-sm leading-relaxed mb-8 max-w-md"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        {bio}
                                    </p>
                                </FadeIn>
                            )}

                            {/* CTAs */}
                            <FadeIn delay={0.2}>
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <Link
                                        href="#projects"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                                        style={{
                                            background: "var(--accent)",
                                            color: "var(--accent-foreground)",
                                        }}
                                    >
                                        View projects{" "}
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="#contact"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-colors"
                                        style={{
                                            background: "var(--bg-elevated)",
                                            border: "1px solid var(--border-strong)",
                                            color: "var(--text-primary)",
                                        }}
                                    >
                                        Get in touch
                                    </Link>
                                </div>
                            </FadeIn>

                            {/* Social links */}
                            <FadeIn delay={0.25} className="flex items-center gap-3">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.platform}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
                                        style={{
                                            color: "var(--text-tertiary)",
                                        }}
                                    >
                                        {link.platform === "GitHub" && (
                                            <svg
                                                className="w-3.5 h-3.5"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        )}
                                        {link.platform === "LinkedIn" && (
                                            <svg
                                                className="w-3.5 h-3.5"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        )}
                                        {link.platform}
                                    </a>
                                ))}
                                {resumeUrl && (
                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
                                        style={{
                                            color: "var(--text-tertiary)",
                                        }}
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        Resume
                                    </a>
                                )}
                            </FadeIn>
                        </div>

                        {/* Right — terminal code card */}
                        <FadeIn
                            delay={0.15}
                            className="hidden lg:flex items-center justify-center"
                        >
                            <HeroVisual
                                experienceLabel={experienceLabel}
                                projectsLabel={projectsLabel}
                                stackLabel={stackLabel}
                            />
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ── Tech marquee ───────────────────────────────────────────────────── */}
            <TechMarquee techs={TECH_STACK} />

            {/* ── Projects ─────────────────────────────────────────────────────────── */}
            <section id="projects" className="section">
                <div className="container">
                    <FadeIn>
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
                    </FadeIn>

                    {featuredProjects.length > 0 ? (
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featuredProjects.map((project) => (
                                <StaggerItem key={project._id}>
                                    <ProjectCard project={project} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
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

                            <div className="flex flex-col gap-3">
                                {archivedProjects.map((project) => (
                                    <Link
                                        key={project._id}
                                        href={`/projects/${project.slug}`}
                                        className="group flex items-center justify-between gap-4 py-3 border-b transition-colors"
                                        style={{ borderColor: "var(--border)" }}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            {project.coverImage && (
                                                <div
                                                    className="relative shrink-0 rounded-md overflow-hidden"
                                                    style={{
                                                        width: "48px",
                                                        height: "32px",
                                                        border: "1px solid var(--border)",
                                                    }}
                                                >
                                                    <Image
                                                        src={project.coverImage}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p
                                                    className="text-sm font-medium truncate group-hover:opacity-80 transition-opacity"
                                                    style={{
                                                        color: "var(--text-primary)",
                                                    }}
                                                >
                                                    {project.title}
                                                </p>
                                                <p
                                                    className="text-xs truncate"
                                                    style={{
                                                        color: "var(--text-tertiary)",
                                                    }}
                                                >
                                                    {project.tagline}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span
                                                className="text-xs font-mono"
                                                style={{
                                                    color: "var(--text-tertiary)",
                                                }}
                                            >
                                                {project.year}
                                            </span>
                                            <ArrowUpRight
                                                className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{
                                                    color: "var(--accent)",
                                                }}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
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
                    <FadeIn>
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
                    </FadeIn>

                    <div className="max-w-2xl">
                        <ExperienceTimeline experiences={experiences} />
                    </div>
                </div>
            </section>

            {/* ── Stack ────────────────────────────────────────────────────────────── */}
            <section id="stack" className="section">
                <div className="container">
                    <FadeIn>
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
                    </FadeIn>

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
                        <FadeIn>
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
                        </FadeIn>

                        <FadeIn delay={0.08}>
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
                        </FadeIn>
                    </div>
                </div>
            </section>
        </>
    );
}

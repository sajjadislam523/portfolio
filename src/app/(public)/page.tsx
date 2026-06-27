import { FadeIn } from "@/components/motion/ScrollReveal";
import { HeroVisual } from "@/components/sections/hero/ArchitectureDiagram";
import { TechMarquee } from "@/components/sections/hero/TechMarquee";
import { JsonLdPerson } from "@/components/shared/JsonLd";
import { connectDB, Experience, Project, SiteSettings } from "@/lib/db";
import type { IExperience, IProject, ISiteSettings } from "@/types";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

async function getData() {
    try {
        await connectDB();
        const [settingsDoc, projectDocs, experienceDocs] = await Promise.all([
            SiteSettings.findOne({}).lean(),
            Project.find({ status: "featured" })
                .sort({ order: 1 })
                .limit(3)
                .lean(),
            Experience.find().sort({ order: 1 }).limit(1).lean(),
        ]);
        return {
            settings: settingsDoc
                ? (JSON.parse(JSON.stringify(settingsDoc)) as ISiteSettings)
                : null,
            projects: JSON.parse(JSON.stringify(projectDocs)) as IProject[],
            latestRole: experienceDocs[0]
                ? (JSON.parse(JSON.stringify(experienceDocs[0])) as IExperience)
                : null,
        };
    } catch {
        return { settings: null, projects: [], latestRole: null };
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
    const { settings, projects, latestRole } = await getData();

    const name = settings?.name ?? "Sajjadul Islam";
    const tagline =
        settings?.tagline ??
        "Full stack engineer. Product-minded. Builder by default.";
    const bio = settings?.bio ?? "";
    const socialLinks = settings?.socialLinks ?? [];
    const resumeUrl = settings?.resumeUrl ?? "";
    const availableForWork = settings?.availableForWork ?? false;

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
                <div className="absolute inset-0 bg-grid opacity-[0.35] pointer-events-none" />

                {/* Radial glow */}
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)",
                        filter: "blur(40px)",
                    }}
                />

                <div className="container relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
                        {/* Left — text */}
                        <div>
                            {/* Status badge */}
                            {availableForWork && (
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-8"
                                    style={{
                                        background: "rgba(34,197,94,0.08)",
                                        border: "1px solid rgba(34,197,94,0.2)",
                                        color: "#22C55E",
                                    }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                                    Open to opportunities
                                </div>
                            )}

                            {/* Headline */}
                            <h1
                                className="text-h1 leading-[1.08] tracking-tight mb-6"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {tagline}
                            </h1>

                            {/* Context line */}
                            <div
                                className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-sm"
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

                            {bio && (
                                <p
                                    className="text-sm leading-relaxed mb-8 max-w-md"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {bio}
                                </p>
                            )}

                            {/* CTAs */}
                            <div className="flex flex-wrap items-center gap-3 mb-10">
                                <Link
                                    href="/projects"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                                    style={{
                                        background: "var(--accent)",
                                        color: "var(--accent-foreground)",
                                    }}
                                >
                                    View projects{" "}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-colors"
                                    style={{
                                        background: "var(--bg-elevated)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    Get in touch
                                </Link>
                            </div>

                            {/* Social links */}
                            <div className="flex items-center gap-3">
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
                                        className="text-xs transition-colors hover:opacity-80"
                                        style={{
                                            color: "var(--text-tertiary)",
                                        }}
                                    >
                                        Resume ↗
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Right — terminal code card */}
                        <div className="hidden lg:flex items-center justify-center">
                            <HeroVisual />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Tech marquee ───────────────────────────────────────────────────── */}
            <TechMarquee techs={TECH_STACK} />

            {/* ── Featured projects preview ───────────────────────────────────────── */}
            {projects.length > 0 && (
                <section className="section">
                    <div className="container">
                        <FadeIn>
                            <div className="flex items-end justify-between mb-10">
                                <div>
                                    <p
                                        className="text-xs font-medium uppercase tracking-widest mb-2"
                                        style={{ color: "var(--accent)" }}
                                    >
                                        Selected work
                                    </p>
                                    <h2
                                        className="text-h2"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        Featured projects
                                    </h2>
                                </div>
                                <Link
                                    href="/projects"
                                    className="text-sm flex items-center gap-1.5 transition-colors"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    All projects{" "}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </FadeIn>

                        <div className="flex flex-col gap-px">
                            {projects.map((project) => (
                                <div key={project._id}>
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="group flex flex-col sm:flex-row sm:items-center gap-4 py-5 border-b transition-colors"
                                        style={{ borderColor: "var(--border)" }}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3
                                                    className="text-base font-medium group-hover:opacity-80 transition-opacity"
                                                    style={{
                                                        color: "var(--text-primary)",
                                                    }}
                                                >
                                                    {project.title}
                                                </h3>
                                                <span
                                                    className="text-xs"
                                                    style={{
                                                        color: "var(--text-tertiary)",
                                                    }}
                                                >
                                                    {project.year}
                                                </span>
                                            </div>
                                            <p
                                                className="text-sm"
                                                style={{
                                                    color: "var(--text-secondary)",
                                                }}
                                            >
                                                {project.tagline}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 sm:justify-end">
                                            {project.technologies
                                                .slice(0, 4)
                                                .map((t) => (
                                                    <span
                                                        key={t}
                                                        className="pill"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                        </div>
                                        <ArrowRight
                                            className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -rotate-45"
                                            style={{ color: "var(--accent)" }}
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

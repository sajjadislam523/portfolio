import { FadeIn } from "@/components/motion/ScrollReveal";
import { connectDB, Project } from "@/lib/db";
import type { IProject } from "@/types";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Projects",
    description:
        "Full stack projects built with React, Next.js, Node.js and MongoDB.",
};

export const revalidate = 300;

async function getProjects(): Promise<{
    featured: IProject[];
    archived: IProject[];
}> {
    try {
        await connectDB();
        const docs = await Project.find().sort({ order: 1 }).lean();
        const all = JSON.parse(JSON.stringify(docs)) as IProject[];
        return {
            featured: all.filter((p) => p.status === "featured"),
            archived: all.filter((p) => p.status === "archived"),
        };
    } catch {
        return { featured: [], archived: [] };
    }
}

export default async function ProjectsPage() {
    const { featured, archived } = await getProjects();
    const hasArchived = archived.length > 0;

    return (
        <>
            <div className="pt-28 pb-20">
                <div className="container max-w-3xl">
                    <FadeIn>
                        <p
                            className="text-xs font-medium uppercase tracking-widest mb-3"
                            style={{ color: "var(--accent)" }}
                        >
                            Work
                        </p>
                        <h1
                            className="text-h1 mb-4"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Projects
                        </h1>
                        <p
                            className="text-base mb-16"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            A selection of projects I&apos;ve designed, built,
                            and shipped.
                        </p>
                    </FadeIn>

                    {/* ── Featured ─────────────────────────────────────────────────── */}
                    <div className="flex flex-col gap-8">
                        {featured.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>

                    {featured.length === 0 && !hasArchived && (
                        <p
                            className="text-sm py-16 text-center"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            No projects yet — check back soon.
                        </p>
                    )}

                    {/* ── Archived ─────────────────────────────────────────────────── */}
                    {hasArchived && (
                        <div className="mt-20">
                            <div className="flex items-center gap-3 mb-8">
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
                                {archived.map((project) => (
                                    <Link
                                        key={project._id}
                                        href={`/projects/${project.slug}`}
                                        className="group flex items-center justify-between gap-4 py-3 border-b transition-colors"
                                        style={{ borderColor: "var(--border)" }}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            {/* Small thumbnail if cover exists */}
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
            </div>
        </>
    );
}

// Shared project card for featured projects
function ProjectCard({ project }: { project: IProject }) {
    return (
        <Link href={`/projects/${project.slug}`} className="group block">
            <div
                className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg-elevated)",
                }}
            >
                {/* Cover image */}
                {project.coverImage && (
                    <div
                        className="relative overflow-hidden"
                        style={{ aspectRatio: "16/9" }}
                    >
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 768px"
                        />
                        <div
                            className="absolute inset-x-0 bottom-0 h-20"
                            style={{
                                background:
                                    "linear-gradient(to top, var(--bg-elevated), transparent)",
                            }}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                                <h2
                                    className="text-base font-semibold tracking-tight"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {project.title}
                                </h2>
                                <span
                                    className="text-xs font-mono"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    {project.year}
                                </span>
                            </div>
                            <p
                                className="text-sm mb-3"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {project.tagline}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {project.technologies.map((tech) => (
                                    <span key={tech} className="pill">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <ArrowUpRight
                            className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "var(--accent)" }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}

import { FadeIn } from "@/components/motion/ScrollReveal";
import { connectDB, Project } from "@/lib/db";
import type { IProject } from "@/types";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Projects",
    description:
        "Full stack projects built with React, Next.js, Node.js and MongoDB.",
};

export const revalidate = 60;

async function getProjects(): Promise<IProject[]> {
    try {
        await connectDB();
        const docs = await Project.find({ status: "featured" })
            .sort({ order: 1 })
            .lean();
        return JSON.parse(JSON.stringify(docs));
    } catch {
        return [];
    }
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
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
                        A selection of projects I&apos;ve designed, built, and
                        shipped.
                    </p>
                </FadeIn>

                <div className="flex flex-col">
                    {projects.map((project) => (
                        <Link
                            key={project._id}
                            href={`/projects/${project.slug}`}
                            className="group block py-8 border-b transition-colors"
                            style={{ borderColor: "var(--border)" }}
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2
                                            className="text-lg font-semibold tracking-tight group-hover:opacity-80 transition-opacity"
                                            style={{
                                                color: "var(--text-primary)",
                                            }}
                                        >
                                            {project.title}
                                        </h2>
                                        <span
                                            className="text-xs font-mono"
                                            style={{
                                                color: "var(--text-tertiary)",
                                            }}
                                        >
                                            {project.year}
                                        </span>
                                    </div>
                                    <p
                                        className="text-sm mb-4 max-w-lg"
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
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
                                    className="w-5 h-5 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ color: "var(--accent)" }}
                                />
                            </div>
                        </Link>
                    ))}
                </div>

                {projects.length === 0 && (
                    <p
                        className="text-sm py-16 text-center"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        No projects yet — check back soon.
                    </p>
                )}
            </div>
        </div>
    );
}

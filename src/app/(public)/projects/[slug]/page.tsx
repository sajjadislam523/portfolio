import { FadeIn } from "@/components/motion/ScrollReveal";
import { ProjectGallery } from "@/components/sections/projects/ProjectGallery";
import { connectDB, Project, SiteSettings } from "@/lib/db";
import type { IProject } from "@/types";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

async function getProject(slug: string): Promise<IProject | null> {
    try {
        await connectDB();
        const doc = await Project.findOne({ slug }).lean();
        return doc ? JSON.parse(JSON.stringify(doc)) : null;
    } catch {
        return null;
    }
}

export async function generateStaticParams() {
    try {
        await connectDB();
        const projects = await Project.find({ status: "featured" })
            .select("slug")
            .lean();
        return projects.map((p) => ({ slug: p.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) return { title: "Project not found" };

    // Fall back to site-wide OG image if project has no cover
    let fallbackOg = "";
    try {
        await connectDB();
        const s = (await SiteSettings.findOne({}).select("seo").lean()) as any;
        fallbackOg = s?.seo?.ogImage ?? "";
    } catch {}

    const ogImage = project.coverImage || fallbackOg;

    return {
        title: project.title,
        description: project.tagline,
        openGraph: {
            title: project.title,
            description: project.tagline,
            images: ogImage
                ? [
                      {
                          url: ogImage,
                          width: 1200,
                          height: 630,
                          alt: project.title,
                      },
                  ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: project.title,
            description: project.tagline,
            images: ogImage ? [ogImage] : [],
        },
    };
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) notFound();

    const hasGallery = (project.images?.length ?? 0) > 0;

    return (
        <div className="pt-28 pb-24">
            <div className="container max-w-2xl">
                {/* Back link */}
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors hover:opacity-80"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> All projects
                </Link>

                <FadeIn>
                    {/* Cover image — full-width hero at top of detail page */}
                    {project.coverImage && !hasGallery && (
                        <div
                            className="relative rounded-xl overflow-hidden mb-8"
                            style={{
                                aspectRatio: "16/9",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <Image
                                src={project.coverImage}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 672px"
                            />
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h1
                                className="text-h1 leading-tight"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {project.title}
                            </h1>
                            <span
                                className="text-sm font-mono mt-3 shrink-0"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                {project.year}
                            </span>
                        </div>
                        <p
                            className="text-base mb-5"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {project.tagline}
                        </p>

                        {/* Links */}
                        <div className="flex items-center gap-3">
                            {project.links.live && (
                                <a
                                    href={project.links.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                                    style={{
                                        background: "var(--accent)",
                                        color: "var(--accent-foreground)",
                                    }}
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />{" "}
                                    Live site
                                </a>
                            )}
                            {project.links.github && (
                                <a
                                    href={project.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors"
                                    style={{
                                        background: "var(--bg-elevated)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    <svg
                                        className="w-3.5 h-3.5"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    GitHub
                                </a>
                            )}
                        </div>
                    </div>

                    <hr style={{ borderColor: "var(--border)" }} />
                </FadeIn>

                {/* Gallery slider — shown when project has gallery images */}
                {hasGallery && (
                    <div className="mt-8">
                        <ProjectGallery
                            images={project.images!}
                            title={project.title}
                        />
                    </div>
                )}

                {/* Content sections — no animation, always visible */}
                {project.overview && (
                    <div className="my-10">
                        <Section title="Overview" content={project.overview} />
                    </div>
                )}

                {project.challenges && (
                    <div className="my-10">
                        <Section
                            title="Challenges"
                            content={project.challenges}
                        />
                    </div>
                )}

                {project.solutions && (
                    <div className="my-10">
                        <Section
                            title="Solutions"
                            content={project.solutions}
                        />
                    </div>
                )}

                <div className="my-10">
                    <h2
                        className="text-xs font-semibold uppercase tracking-widest mb-4"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        Tech stack
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1.5 rounded-lg text-sm font-mono"
                                style={{
                                    background: "var(--bg-elevated)",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, content }: { title: string; content: string }) {
    return (
        <div>
            <h2
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-tertiary)" }}
            >
                {title}
            </h2>
            <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
            >
                {content}
            </p>
        </div>
    );
}

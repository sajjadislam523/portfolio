import { FadeIn } from "@/components/motion/ScrollReveal";
import { CaseStudySection } from "@/components/sections/projects/detail/CaseStudySection";
import { ProjectAtmosphere } from "@/components/sections/projects/detail/ProjectAtmosphere";
import { ProjectHeader } from "@/components/sections/projects/detail/ProjectHeader";
import {
    ProjectNavigation,
    type NavProject,
} from "@/components/sections/projects/detail/ProjectNavigation";
import { ProjectVisual } from "@/components/sections/projects/detail/ProjectVisual";
import { TechnologyList } from "@/components/sections/projects/detail/TechnologyList";
import { connectDB, Project, SiteSettings } from "@/lib/db";
import type { IProject } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

export const revalidate = 300;

// Cached per-request — generateMetadata and the page body both need the
// project document, and Mongoose calls aren't deduped by Next's fetch cache
// the way `fetch()` is, so without this it's two DB round trips instead of
// one (the same fix already applied to the homepage's data loader).
const getProject = cache(async (slug: string): Promise<IProject | null> => {
    try {
        await connectDB();
        // Same `{ $ne: false }` gate the listing queries use — an
        // unpublished project must 404 on its direct URL too, not just be
        // absent from the index list.
        const doc = await Project.findOne({
            slug,
            published: { $ne: false },
        }).lean();
        return doc ? JSON.parse(JSON.stringify(doc)) : null;
    } catch {
        return null;
    }
});

// Same published/order query the homepage uses to render the project index,
// trimmed to the fields the case-study index/prev/next controls need — no
// new CMS field, no extra project-level configuration.
const getOrderedProjects = cache(async (): Promise<NavProject[]> => {
    try {
        await connectDB();
        const docs = await Project.find({ published: { $ne: false } })
            .sort({ order: 1 })
            .select("slug title coverImage")
            .lean();
        return JSON.parse(JSON.stringify(docs));
    } catch {
        return [];
    }
});

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
        const s = (await SiteSettings.findOne({}).select("seo").lean()) as {
            seo?: { ogImage?: string };
        } | null;
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
    const [project, orderedProjects] = await Promise.all([
        getProject(slug),
        getOrderedProjects(),
    ]);
    if (!project) notFound();

    const idx = orderedProjects.findIndex((p) => p.slug === slug);
    const total = orderedProjects.length;
    const indexLabel =
        idx >= 0
            ? `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
            : "SELECTED WORK";

    // Wraps around at either end so the bottom nav is always fully
    // populated rather than leaving a single dangling button on the first
    // or last project — never shown at all when there's nothing to link to.
    const prevProject =
        idx >= 0 && total > 1 ? orderedProjects[(idx - 1 + total) % total] : null;
    const nextProject =
        idx >= 0 && total > 1 ? orderedProjects[(idx + 1) % total] : null;

    const caseStudySections = (
        [
            project.overview && {
                label: "Overview",
                content: project.overview,
                variant: "open" as const,
            },
            project.challenges && {
                label: "Challenge",
                content: project.challenges,
                variant: "compact" as const,
            },
            project.solutions && {
                label: "Solution",
                content: project.solutions,
                variant: "emphasized" as const,
            },
        ] as const
    ).filter(
        (s): s is { label: string; content: string; variant: "open" | "compact" | "emphasized" } =>
            Boolean(s),
    );

    return (
        <div className="relative pt-28 pb-32">
            <ProjectAtmosphere />

            <div className="container max-w-330">
                <ProjectHeader project={project} indexLabel={indexLabel} />
            </div>

            <div className="container mt-14 max-w-330 sm:mt-20">
                <FadeIn delay={0.1}>
                    <ProjectVisual project={project} />
                </FadeIn>
            </div>

            {caseStudySections.length > 0 && (
                <div className="container mt-20 max-w-190 sm:mt-28">
                    {caseStudySections.map((section, i) => (
                        <CaseStudySection
                            key={section.label}
                            index={String(i + 1).padStart(2, "0")}
                            label={section.label}
                            content={section.content}
                            variant={section.variant}
                            withTopBorder={i > 0}
                        />
                    ))}
                </div>
            )}

            {project.technologies.length > 0 && (
                <div className="container mt-20 max-w-330 sm:mt-28">
                    <TechnologyList technologies={project.technologies} />
                </div>
            )}

            {(prevProject || nextProject) && (
                <div className="container mt-24 max-w-330 sm:mt-32">
                    <ProjectNavigation prev={prevProject} next={nextProject} />
                </div>
            )}
        </div>
    );
}

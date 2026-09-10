// The page's primary visual slot. A gallery (when the project has one)
// takes over this role entirely; otherwise the cover image gets the same
// "major editorial visual" treatment the gallery's main frame uses. When
// neither exists, this renders nothing — no placeholder box, no empty
// aspect-ratio container.

import { ProjectGallery } from "@/components/sections/projects/ProjectGallery";
import { CornerMarks } from "@/components/shared/TechnicalMotifs";
import type { IProject } from "@/types";
import Image from "next/image";

export function ProjectVisual({ project }: { project: IProject }) {
    const hasGallery = (project.images?.length ?? 0) > 0;

    if (hasGallery) {
        return <ProjectGallery images={project.images!} title={project.title} />;
    }

    if (!project.coverImage) return null;

    return (
        <div className="relative">
            {/* `inset-0` (not a negative inset) so the blur's visual bleed
                stays pure "ink overflow" — it paints past the box without
                enlarging it, so it can never push the page's scrollable
                width past the viewport the way an actual negative inset
                would on a narrow screen. */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse at center, var(--accent-wash) 0%, transparent 70%)",
                    filter: "blur(80px)",
                    opacity: 0.55,
                }}
                aria-hidden
            />
            <CornerMarks />
            <div
                className="relative overflow-hidden rounded-xl"
                style={{
                    aspectRatio: "16/9",
                    border: "1px solid var(--line)",
                    boxShadow: "var(--shadow-md)",
                }}
            >
                <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1320px) 100vw, 1320px"
                />
            </div>
        </div>
    );
}

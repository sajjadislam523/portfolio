"use client";

// The quiet technical backdrop for the project detail page — deliberately
// NOT the homepage's interactive star field. One consistent, automatic
// environment (no CMS/project configuration) built from the same
// blueprint/guide-line/coordinate-tag vocabulary as SectionAtmosphere, but
// composed once for the whole page rather than picked per-section, since
// this page is a single continuous case study rather than a sequence of
// distinct homepage sections.

import { CoordTag, GridFragment, GuideLine } from "@/components/shared/TechnicalMotifs";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export function ProjectAtmosphere() {
    const shouldReduceMotion = useReducedMotionSafe();

    return (
        <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-205 overflow-hidden"
            style={{
                animation: shouldReduceMotion ? undefined : "fadeIn 1.2s ease forwards",
                opacity: shouldReduceMotion ? 1 : 0,
            }}
            aria-hidden
        >
            {/* Confined to the header/visual zone rather than spanning the
                full (very tall, content-length-dependent) case-study page —
                a page-length radial wash or a motif anchored to the
                document's bottom edge would either balloon in size or end
                up stranded in empty space above the footer, well past
                anything it's meant to accent. */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 55% at 84% 10%, var(--accent-wash) 0%, transparent 70%)",
                    filter: "blur(90px)",
                    opacity: 0.4,
                }}
            />

            <GridFragment className="top-24 right-14 hidden lg:block" size={260} />
            <GuideLine
                orientation="vertical"
                length={520}
                className="top-44 left-12 hidden lg:block"
            />
            <GuideLine
                orientation="horizontal"
                length={110}
                className="top-150 right-16 hidden lg:block"
            />
            <CoordTag className="top-157 left-12 hidden lg:block">
                {"// case_study.render"}
            </CoordTag>
        </div>
    );
}

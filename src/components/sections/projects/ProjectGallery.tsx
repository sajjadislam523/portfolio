"use client";

// The premium product-walkthrough gallery for the project detail page. A
// large main frame (corner marks + a contained atmospheric wash, echoing
// ProjectPreview's language) with a crossfade+scale transition, token-driven
// nav controls that only exist when there's more than one image, and a
// caption row with the counter outside the photo (so it never has to fight
// the image for contrast in either theme) plus a compact thumbnail strip
// that's hidden below `sm` — swipe/drag covers mobile navigation instead of
// six thumbnails competing for a small screen.

import { CornerMarks } from "@/components/shared/TechnicalMotifs";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProjectGalleryProps {
    images: string[];
    title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [direction, setDirection] = useState(0);

    if (images.length === 0) return null;

    const hasMultiple = images.length > 1;

    function goTo(idx: number) {
        setDirection(idx > activeIdx ? 1 : -1);
        setActiveIdx(idx);
    }

    function next() {
        setDirection(1);
        setActiveIdx((i) => (i + 1) % images.length);
    }

    function prev() {
        setDirection(-1);
        setActiveIdx((i) => (i - 1 + images.length) % images.length);
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
    }

    return (
        <div
            className="flex flex-col gap-4"
            role="region"
            aria-label={`${title} image gallery`}
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            <div className="relative">
                {/* Contained atmospheric wash — matches ProjectVisual's cover
                    treatment so both paths read as the same visual system.
                    `inset-0`, not a negative inset: the blur's bleed is pure
                    paint ("ink overflow") this way, so it can never push the
                    page's scrollable width past the viewport on a narrow
                    screen the way an enlarged box would. */}
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
                    className="group relative overflow-hidden rounded-xl select-none"
                    style={{
                        background: "var(--zone-canvas-alt)",
                        border: "1px solid var(--line)",
                        boxShadow: "var(--shadow-md)",
                        aspectRatio: "16/9",
                    }}
                >
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={activeIdx}
                            custom={direction}
                            initial={{ opacity: 0, x: direction * 32, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: direction * -32, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0"
                            drag={hasMultiple ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -80) next();
                                else if (info.offset.x > 80) prev();
                            }}
                        >
                            <Image
                                src={images[activeIdx]}
                                alt={`${title} — image ${activeIdx + 1} of ${images.length}`}
                                fill
                                className="object-cover"
                                priority={activeIdx === 0}
                                sizes="(max-width: 1320px) 100vw, 1320px"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {hasMultiple && (
                        <>
                            <button
                                type="button"
                                onClick={prev}
                                aria-label="Previous image"
                                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md opacity-100 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                                style={{
                                    background: "var(--zone-surface)",
                                    border: "1px solid var(--line-strong)",
                                    color: "var(--text-primary)",
                                    boxShadow: "var(--shadow-sm)",
                                }}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                aria-label="Next image"
                                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md opacity-100 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                                style={{
                                    background: "var(--zone-surface)",
                                    border: "1px solid var(--line-strong)",
                                    color: "var(--text-primary)",
                                    boxShadow: "var(--shadow-sm)",
                                }}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Caption row — counter lives outside the photo, never overlaid
                on it, so contrast never depends on what the image looks like. */}
            <div className="flex items-center justify-between gap-4">
                <span
                    className="font-mono text-small tabular-nums"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {String(activeIdx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </span>

                {hasMultiple && (
                    <div className="hidden gap-2 overflow-x-auto sm:flex">
                        {images.map((url, idx) => (
                            <button
                                key={url}
                                type="button"
                                onClick={() => goTo(idx)}
                                aria-label={`Go to image ${idx + 1}`}
                                aria-current={idx === activeIdx}
                                className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md transition-opacity"
                                style={{
                                    border: `1px solid ${
                                        idx === activeIdx ? "var(--accent)" : "var(--line)"
                                    }`,
                                    opacity: idx === activeIdx ? 1 : 0.5,
                                }}
                            >
                                <Image src={url} alt="" fill className="object-cover" sizes="56px" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

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
            className="flex flex-col gap-3"
            role="region"
            aria-label={`${title} image gallery`}
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            {/* Main image */}
            <div
                className="relative rounded-xl overflow-hidden select-none"
                style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    aspectRatio: "16/10",
                }}
            >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={activeIdx}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -40 }}
                        transition={{
                            duration: 0.25,
                            ease: [0.21, 0.47, 0.32, 0.98],
                        }}
                        className="absolute inset-0"
                        drag={images.length > 1 ? "x" : false}
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
                            sizes="(max-width: 768px) 100vw, 672px"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Prev/next arrows — only when multiple images */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Previous image"
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity opacity-0 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100"
                            style={{
                                background: "rgba(0,0,0,0.55)",
                                color: "#fff",
                            }}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            aria-label="Next image"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity opacity-0 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100"
                            style={{
                                background: "rgba(0,0,0,0.55)",
                                color: "#fff",
                            }}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Index indicator */}
                        <div
                            className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-full font-mono"
                            style={{
                                background: "rgba(0,0,0,0.55)",
                                color: "#fff",
                            }}
                        >
                            {activeIdx + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Filmstrip — only when multiple images */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((url, idx) => (
                        <button
                            key={url}
                            type="button"
                            onClick={() => goTo(idx)}
                            aria-label={`Go to image ${idx + 1}`}
                            aria-current={idx === activeIdx}
                            className="relative shrink-0 rounded-lg overflow-hidden transition-all"
                            style={{
                                width: "72px",
                                height: "48px",
                                border: `2px solid ${idx === activeIdx ? "var(--accent)" : "var(--border)"}`,
                                opacity: idx === activeIdx ? 1 : 0.6,
                            }}
                        >
                            <Image
                                src={url}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="72px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

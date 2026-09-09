"use client";

// The one reusable "product screenshot" surface for the cinematic case-study
// layout — an optional browser-chrome frame (echoing the hero's terminal
// panel, so the "developer workstation" motif recurs rather than being a
// one-off), a contained atmospheric wash, and a restrained cursor-reactive
// tilt + spotlight. All three hover effects are capped deliberately small —
// this should feel expensive, not like a tilt-card demo.

import { CoordTag, CornerMarks } from "@/components/shared/TechnicalMotifs";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface ProjectPreviewProps {
    src?: string;
    alt: string;
    /** Shown in the optional chrome bar's address slot — a hostname or the title. */
    chromeLabel?: string;
    aspect?: string;
    priority?: boolean;
    sizes?: string;
    /** A small caption-plate annotation below the frame, e.g. "FIG.01 — 4:3". Reserved for the two major showcases. */
    frameLabel?: string;
}

const TILT = 2.5; // degrees — deliberately small, never "aggressive 3D"

export function ProjectPreview({
    src,
    alt,
    chromeLabel,
    aspect = "4/3",
    priority = false,
    sizes = "(max-width: 1024px) 100vw, 56vw",
    frameLabel,
}: ProjectPreviewProps) {
    const ref = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotionSafe();
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    // Tilt is a transform-based effect, exactly what prefers-reduced-motion
    // is meant to suppress — collapse the range to 0 rather than skip the
    // hooks (keeps the hook order stable across renders).
    const tilt = shouldReduceMotion ? 0 : TILT;
    const rotateX = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), {
        stiffness: 220,
        damping: 26,
    });
    const rotateY = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), {
        stiffness: 220,
        damping: 26,
    });

    function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        px.set(x);
        py.set(y);
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
    }

    function onPointerLeave() {
        px.set(0.5);
        py.set(0.5);
    }

    return (
        <div className="group/preview relative">
            {/* Contained atmospheric wash — not a giant glow, doesn't leak
                past the preview's own footprint. */}
            <div
                className="pointer-events-none absolute -inset-10 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse at center, var(--accent-wash) 0%, transparent 70%)",
                    filter: "blur(56px)",
                }}
                aria-hidden
            />

            {/* Blueprint-plate corner marks — unclipped, so they float just
                outside the frame rather than being cropped by it. Static by
                default; illuminate to the accent on the same hover the
                image/spotlight already react to. */}
            <CornerMarks illuminate />

            {frameLabel && (
                <CoordTag className="-bottom-6 left-0">{frameLabel}</CoordTag>
            )}

            <motion.div
                ref={ref}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                whileHover={{ scale: 1.015 }}
                style={{ rotateX, rotateY, transformPerspective: 1200 }}
                transition={{ type: "spring", stiffness: 240, damping: 26 }}
                className="relative overflow-hidden rounded-xl"
            >
                <div
                    style={{
                        background: "var(--zone-canvas-alt)",
                        border: "1px solid var(--line)",
                        boxShadow: "var(--shadow-sm)",
                    }}
                >
                    {chromeLabel && (
                        <div
                            className="flex items-center gap-1.5 border-b px-3 py-2.5"
                            style={{
                                borderColor: "var(--line)",
                                background: "var(--zone-canvas)",
                            }}
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ background: "#EF4444", opacity: 0.4 }}
                            />
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ background: "#F59E0B", opacity: 0.4 }}
                            />
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ background: "#22C55E", opacity: 0.4 }}
                            />
                            <span
                                className="ml-2 truncate font-mono text-[10px]"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                {chromeLabel}
                            </span>
                        </div>
                    )}

                    <div className="relative" style={{ aspectRatio: aspect }}>
                        {src ? (
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                priority={priority}
                                sizes={sizes}
                                className="object-cover transition-transform duration-500 ease-out group-hover/preview:scale-[1.03]"
                            />
                        ) : (
                            <div className="flex h-full items-end p-5">
                                <span
                                    className="truncate font-display text-2xl font-semibold leading-none opacity-20"
                                    style={{ color: "var(--accent-on-canvas)" }}
                                >
                                    {alt}
                                </span>
                            </div>
                        )}

                        {/* Cursor-following highlight — a soft spotlight, not a glow */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/preview:opacity-100"
                            style={{
                                background:
                                    "radial-gradient(circle 260px at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%)",
                            }}
                            aria-hidden
                        />
                    </div>
                </div>

                {/* Border illumination — the frame's edge picks up the accent
                    on hover, echoing the corner marks outside it. */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/preview:opacity-100"
                    style={{ boxShadow: "inset 0 0 0 1px var(--accent-strong)" }}
                    aria-hidden
                />
            </motion.div>
        </div>
    );
}

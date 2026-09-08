"use client";

// Replaces the small Archive cards with a clean numbered index — rows, not
// cards. The one flourish is a small preview thumbnail that follows the
// cursor on hover, using spring-driven motion values (no per-pixel React
// state) so it stays smooth without re-rendering the list.

import type { IProject } from "@/types";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProjectIndexListProps {
    projects: IProject[];
    indexOffset?: number;
}

export function ProjectIndexList({ projects, indexOffset = 0 }: ProjectIndexListProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 30 });
    const springY = useSpring(y, { stiffness: 300, damping: 30 });

    if (projects.length === 0) return null;

    const hovered = projects.find((p) => p._id === hoveredId);

    function onMouseMove(e: React.MouseEvent) {
        x.set(e.clientX + 24);
        y.set(e.clientY - 90);
    }

    return (
        <div
            className="relative border-t"
            style={{ borderColor: "var(--line)" }}
            onMouseMove={onMouseMove}
        >
            {projects.map((project, i) => {
                const isHovered = hoveredId === project._id;
                return (
                    <Link
                        key={project._id}
                        href={`/projects/${project.slug}`}
                        className="group flex items-center gap-4 border-b py-4 sm:gap-8"
                        style={{ borderColor: "var(--line-hairline)" }}
                        onMouseEnter={() => setHoveredId(project._id)}
                        onMouseLeave={() =>
                            setHoveredId((id) => (id === project._id ? null : id))
                        }
                    >
                        <span
                            className="index-mark w-7 shrink-0 sm:w-10"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            {String(indexOffset + i + 1).padStart(2, "0")}
                        </span>
                        <span
                            className="min-w-0 flex-1 truncate font-display text-body-lg transition-colors duration-200"
                            style={{
                                color: isHovered
                                    ? "var(--text-primary)"
                                    : "var(--text-secondary)",
                            }}
                        >
                            {project.title}
                        </span>
                        {project.technologies.length > 0 && (
                            <span
                                className="hidden shrink-0 font-mono text-small sm:block"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                {project.technologies.slice(0, 2).join(" / ")}
                            </span>
                        )}
                        <span
                            className="w-10 shrink-0 text-right font-mono text-small"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            {project.year}
                        </span>
                        <span
                            className="shrink-0 transition-opacity duration-200"
                            style={{ color: "var(--accent)", opacity: isHovered ? 1 : 0 }}
                            aria-hidden
                        >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                    </Link>
                );
            })}

            {/* Floating cursor preview */}
            <AnimatePresence>
                {hovered?.coverImage && (
                    <motion.div
                        key={hovered._id}
                        className="pointer-events-none fixed top-0 left-0 z-30 hidden overflow-hidden rounded-lg lg:block"
                        style={{
                            x: springX,
                            y: springY,
                            width: 220,
                            height: 140,
                            border: "1px solid var(--line-strong)",
                            boxShadow: "var(--shadow-md)",
                            background: "var(--zone-canvas-alt)",
                        }}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image
                            src={hovered.coverImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="220px"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

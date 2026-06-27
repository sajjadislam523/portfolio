"use client";

import { formatDateRange } from "@/lib/utils";
import type { IExperience } from "@/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function ExperienceTimeline({
    experiences,
}: {
    experiences: IExperience[];
}) {
    const [openId, setOpenId] = useState<string | null>(
        experiences[0]?._id ?? null,
    );
    const [hoverId, setHoverId] = useState<string | null>(null);

    if (experiences.length === 0) {
        return (
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                No experience entries yet.
            </p>
        );
    }

    return (
        <div className="relative flex flex-col">
            {/* Vertical timeline line */}
            <div
                className="absolute left-[7px] top-3 bottom-3 w-px"
                style={{ background: "var(--border)" }}
            />

            {experiences.map((exp) => {
                const isOpen = openId === exp._id;
                const isHovered = hoverId === exp._id;
                const isCurrent = !exp.endDate;

                return (
                    <div key={exp._id} className="relative pl-8 pb-8">
                        {/* Timeline dot */}
                        <div
                            className="absolute left-0 top-[18px] w-3.5 h-3.5 rounded-full border-2 transition-all duration-200"
                            style={{
                                background:
                                    isOpen || isHovered
                                        ? "var(--accent)"
                                        : "var(--bg-secondary)",
                                borderColor:
                                    isOpen || isHovered
                                        ? "var(--accent)"
                                        : "var(--border-strong)",
                                boxShadow: isOpen
                                    ? "0 0 8px var(--accent-glow)"
                                    : "none",
                            }}
                        />

                        {/* Card */}
                        <div
                            className="rounded-xl overflow-hidden transition-all duration-200"
                            style={{
                                background: "var(--bg-elevated)",
                                border: `1px solid ${isOpen ? "var(--accent)" : isHovered ? "var(--border-strong)" : "var(--border)"}`,
                                boxShadow: isOpen
                                    ? "0 0 0 1px var(--accent-glow)"
                                    : "none",
                            }}
                            onMouseEnter={() => setHoverId(exp._id)}
                            onMouseLeave={() => setHoverId(null)}
                        >
                            {/* Clickable header — type=button prevents any form submission */}
                            <button
                                type="button"
                                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left transition-colors duration-150"
                                style={{
                                    WebkitTapHighlightColor: "transparent",
                                    background:
                                        isHovered && !isOpen
                                            ? "var(--bg-subtle)"
                                            : "transparent",
                                }}
                                onClick={() =>
                                    setOpenId(isOpen ? null : exp._id)
                                }
                                aria-expanded={isOpen}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span
                                            className="text-sm font-semibold transition-colors duration-150"
                                            style={{
                                                color:
                                                    isOpen || isHovered
                                                        ? "var(--accent)"
                                                        : "var(--text-primary)",
                                            }}
                                        >
                                            {exp.role}
                                        </span>
                                        {isCurrent && (
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                                                style={{
                                                    background:
                                                        "rgba(34,197,94,0.1)",
                                                    border: "1px solid rgba(34,197,94,0.25)",
                                                    color: "#22C55E",
                                                }}
                                            >
                                                <span className="w-1 h-1 rounded-full bg-[#22C55E]" />
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className="text-sm mt-0.5 transition-colors duration-150"
                                        style={{
                                            color: isHovered
                                                ? "var(--text-primary)"
                                                : "var(--text-secondary)",
                                        }}
                                    >
                                        {exp.company}
                                        <span
                                            style={{
                                                color: "var(--text-tertiary)",
                                            }}
                                        >
                                            {" "}
                                            · {exp.location}
                                        </span>
                                    </p>
                                    <p
                                        className="text-xs mt-1 font-mono"
                                        style={{
                                            color: "var(--text-tertiary)",
                                        }}
                                    >
                                        {formatDateRange(
                                            exp.startDate,
                                            exp.endDate,
                                        )}
                                    </p>
                                </div>

                                <ChevronDown
                                    className="w-4 h-4 shrink-0 mt-1 transition-all duration-200"
                                    style={{
                                        color: isOpen
                                            ? "var(--accent)"
                                            : "var(--text-tertiary)",
                                        transform: isOpen
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                    }}
                                />
                            </button>

                            {/* Expanded content — always in DOM, CSS grid row transition */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                                    transition: "grid-template-rows 0.28s ease",
                                }}
                            >
                                <div style={{ overflow: "hidden" }}>
                                    <div
                                        className="px-5 pb-5 border-t"
                                        style={{ borderColor: "var(--border)" }}
                                    >
                                        {exp.description && (
                                            <p
                                                className="text-sm leading-relaxed mt-4 mb-4"
                                                style={{
                                                    color: "var(--text-secondary)",
                                                }}
                                            >
                                                {exp.description}
                                            </p>
                                        )}

                                        {exp.accomplishments.length > 0 && (
                                            <ul className="flex flex-col gap-2 mb-4">
                                                {exp.accomplishments.map(
                                                    (item, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex gap-2.5 text-sm"
                                                            style={{
                                                                color: "var(--text-secondary)",
                                                            }}
                                                        >
                                                            <span
                                                                className="shrink-0 mt-[3px]"
                                                                style={{
                                                                    color: "var(--accent)",
                                                                }}
                                                            >
                                                                ·
                                                            </span>
                                                            {item}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        )}

                                        {exp.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {exp.technologies.map(
                                                    (tech) => (
                                                        <span
                                                            key={tech}
                                                            className="pill"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

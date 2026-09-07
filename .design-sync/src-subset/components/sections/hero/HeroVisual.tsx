// Terminal-style code card showing real tech choices in a format engineers
// immediately recognise. Server-renderable — no "use client" needed; the
// only interactivity (hover, the blinking cursor) is pure CSS.
//
// design-sync fork: the real component uses next/link for the stat links
// (there's no router in this preview environment anyway); this curated copy
// swaps it for a plain <a> so the bundle doesn't pull in Next internals that
// reference process.env.* and crash the whole design-system bundle — see
// .design-sync/NOTES.md.

import type { ISkill, SkillCategory } from "@/types";
import React from "react";

interface HeroVisualProps {
    experienceLabel: string;
    projectsLabel: string;
    stackLabel: string;
    groupedSkills?: Partial<Record<SkillCategory, ISkill[]>>;
}

// Real skills win when present; this is only the fallback for an empty CMS.
const FALLBACK_STACK: { prop: string; items: string[] }[] = [
    { prop: "frontend", items: ["React", "Next.js", "TypeScript", "Tailwind"] },
    { prop: "backend", items: ["Node", "Express"] },
    { prop: "database", items: ["MongoDB"] },
    { prop: "deploy", items: ["Docker", "Vercel"] },
];

const CATEGORY_TO_PROP: Partial<Record<SkillCategory, string>> = {
    frontend: "frontend",
    backend: "backend",
    database: "database",
    devops: "deploy",
};

function chunk<T>(items: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
    return out;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({
    experienceLabel,
    projectsLabel,
    stackLabel,
    groupedSkills,
}) => {
    const stack = groupedSkills
        ? (Object.entries(CATEGORY_TO_PROP) as [SkillCategory, string][])
              .map(([category, prop]) => ({
                  prop,
                  items: (groupedSkills[category] ?? [])
                      .slice(0, 4)
                      .map((s) => s.name),
              }))
              .filter((row) => row.items.length > 0)
        : [];
    const rows = stack.length > 0 ? stack : FALLBACK_STACK;

    return (
        <div className="w-full max-w-sm select-none">
            {/* Terminal window */}
            <div
                className="rounded-xl overflow-hidden"
                style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    boxShadow:
                        "0 24px 64px color-mix(in srgb, var(--text-primary) 20%, transparent)",
                }}
            >
                {/* Title bar */}
                <div
                    className="flex items-center gap-2 px-4 py-3 border-b"
                    style={{
                        borderColor: "var(--border)",
                        background: "var(--bg-secondary)",
                    }}
                >
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: "#EF4444" }}
                    />
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: "#F59E0B" }}
                    />
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: "#22C55E" }}
                    />
                    <span
                        className="ml-2 text-xs font-mono"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        stack.ts
                    </span>
                </div>

                {/* Code body */}
                <div className="p-5 font-mono text-xs leading-relaxed">
                    <Line>
                        <Dim>{/* // Full stack engineer */}</Dim>
                    </Line>
                    <Line>
                        <Kw>const</Kw> <Var>stack</Var> <Dim>=</Dim> {"{"}
                    </Line>
                    {rows.map(({ prop, items }, i) => (
                        <React.Fragment key={prop}>
                            <Line indent={1}>
                                <Prop>{prop}</Prop>
                                <Dim>:</Dim> [
                            </Line>
                            {chunk(items, 2).map((pair, j) => (
                                <Line indent={2} key={j}>
                                    {pair.map((name, k) => (
                                        <React.Fragment key={name}>
                                            <Str>&apos;{name}&apos;</Str>
                                            {k < pair.length - 1 && <Dim>, </Dim>}
                                        </React.Fragment>
                                    ))}
                                    <Dim>,</Dim>
                                </Line>
                            ))}
                            <Line indent={1}>
                                ]<Dim>{i < rows.length - 1 ? "," : ""}</Dim>
                            </Line>
                        </React.Fragment>
                    ))}
                    <Line>{"}"}</Line>
                    <Line>&nbsp;</Line>
                    <Line>
                        <Dim>{/* // Currently building */}</Dim>
                    </Line>
                    <Line>
                        <Kw>export default</Kw> <Fn>portfolio</Fn>()
                    </Line>

                    {/* Blinking cursor */}
                    <div className="flex items-center gap-1 mt-1">
                        <span style={{ color: "var(--accent)" }}>▸</span>
                        <span
                            className="inline-block w-2 h-4 align-middle"
                            style={{
                                background: "var(--accent)",
                                animation: "blink 1.2s step-end infinite",
                                opacity: 0.9,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Floating stats below the card — real links into the matching sections */}
            <div className="flex items-center justify-center gap-6 mt-5">
                {[
                    { label: "Experience", value: experienceLabel, href: "#experience" },
                    { label: "Projects", value: projectsLabel, href: "#projects" },
                    { label: "Stack", value: stackLabel, href: "#stack" },
                ].map(({ label, value, href }) => (
                    <a key={label} href={href} className="hero-stat text-center">
                        <p className="hero-stat-value text-base font-semibold">
                            {value}
                        </p>
                        <p className="hero-stat-label text-xs">{label}</p>
                    </a>
                ))}
            </div>

            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .hero-stat-value { color: var(--text-primary); transition: color 0.15s; }
        .hero-stat-label { color: var(--text-tertiary); transition: color 0.15s; }
        .hero-stat:hover .hero-stat-value,
        .hero-stat:hover .hero-stat-label { color: var(--accent); }
      `}</style>
        </div>
    );
};

// ── Tiny primitives for readable code coloring ────────────────────────────────

function Line({
    children,
    indent = 0,
}: {
    children: React.ReactNode;
    indent?: 0 | 1 | 2;
}) {
    return (
        <div style={{ paddingLeft: `${indent * 16}px`, minHeight: "1.5em" }}>
            {children}
        </div>
    );
}

function Kw({ children }: { children: React.ReactNode }) {
    return <span style={{ color: "#C792EA" }}>{children} </span>;
}

function Var({ children }: { children: React.ReactNode }) {
    return <span style={{ color: "#82AAFF" }}>{children}</span>;
}

function Prop({ children }: { children: React.ReactNode }) {
    return <span style={{ color: "var(--accent)" }}>{children}</span>;
}

function Str({ children }: { children: React.ReactNode }) {
    return <span style={{ color: "#C3E88D" }}>{children}</span>;
}

function Fn({ children }: { children: React.ReactNode }) {
    return <span style={{ color: "#82AAFF" }}>{children}</span>;
}

function Dim({ children }: { children?: React.ReactNode }) {
    return <span style={{ color: "var(--text-tertiary)" }}>{children}</span>;
}

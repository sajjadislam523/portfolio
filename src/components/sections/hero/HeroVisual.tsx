// Terminal-style code card — a personal `engineer.ts` object rather than a
// generic tech-stack dump, so the panel reads as identity, not a spec sheet.
// Server-renderable — no "use client" needed; the only interactivity
// (hover, the blinking cursor) is pure CSS.

import type { ISkill, SkillCategory } from "@/types";
import Link from "next/link";
import React from "react";

interface HeroVisualProps {
    experienceLabel: string;
    projectsLabel: string;
    stackLabel: string;
    groupedSkills?: Partial<Record<SkillCategory, ISkill[]>>;
}

// The conceptual, curated framing — always shown, not CMS-driven.
const FOCUS = ["Digital Products", "Interactive Web", "Product Engineering"];

// Real skills win when present; this is only the fallback for an empty CMS.
// Trimmed to frontend/backend only — the panel got smaller and more
// personal, not a full stack inventory (that's what the Stack section is for).
const FALLBACK_ROWS: { prop: string; items: string[] }[] = [
    { prop: "frontend", items: ["React", "Next.js"] },
    { prop: "backend", items: ["Node.js", "PostgreSQL"] },
];

const CATEGORY_TO_PROP: Partial<Record<SkillCategory, string>> = {
    frontend: "frontend",
    backend: "backend",
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
    const skillRows = groupedSkills
        ? (Object.entries(CATEGORY_TO_PROP) as [SkillCategory, string][])
              .map(([category, prop]) => ({
                  prop,
                  items: (groupedSkills[category] ?? []).slice(0, 2).map((s) => s.name),
              }))
              .filter((row) => row.items.length > 0)
        : [];
    const rows = skillRows.length > 0 ? skillRows : FALLBACK_ROWS;

    return (
        <div className="w-full max-w-60 select-none sm:max-w-68 lg:max-w-80">
            {/* Terminal window */}
            <div
                className="overflow-hidden rounded-xl"
                style={{
                    // The one raised surface inside the hero zone — reads
                    // --zone-hero-raised rather than the generic --bg-elevated,
                    // so it participates in the same zone/surface model as the
                    // canvas cards below the fold instead of a separate scale.
                    background: "var(--zone-hero-raised)",
                    border: "1px solid var(--hero-line)",
                    boxShadow: "var(--shadow-hero)",
                }}
            >
                {/* Title bar */}
                <div
                    className="flex items-center gap-2 px-4 py-3 border-b"
                    style={{
                        borderColor: "var(--hero-line)",
                        background: "var(--hero-surface-soft)",
                    }}
                >
                    {/* Traffic-light chrome — a quiet, recognizable convention, not
                        a decorative accent, so it's muted rather than saturated. */}
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: "#EF4444", opacity: 0.55 }}
                    />
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: "#F59E0B", opacity: 0.55 }}
                    />
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: "#22C55E", opacity: 0.55 }}
                    />
                    <span
                        className="ml-2 text-xs font-mono"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        engineer.ts
                    </span>
                </div>

                {/* Code body */}
                <div className="p-5 font-mono text-xs leading-relaxed">
                    <Line>
                        <Kw>const</Kw> <Var>engineer</Var> <Dim>=</Dim> {"{"}
                    </Line>

                    <Line indent={1}>
                        <Prop>role</Prop>
                        <Dim>:</Dim> <Str>&apos;Full Stack Engineer&apos;</Str>
                        <Dim>,</Dim>
                    </Line>

                    <Line indent={1}>
                        <Prop>focus</Prop>
                        <Dim>:</Dim> [
                    </Line>
                    {FOCUS.map((item) => (
                        <Line indent={2} key={item}>
                            <Str>&apos;{item}&apos;</Str>
                            <Dim>,</Dim>
                        </Line>
                    ))}
                    <Line indent={1}>],</Line>

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
                        <Dim>{/* // currently building → */}</Dim>
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
                    <Link key={label} href={href} className="hero-stat text-center">
                        <p className="hero-stat-value text-sm font-semibold">
                            {value}
                        </p>
                        <p className="hero-stat-label text-[11px]">{label}</p>
                    </Link>
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
// Two muted, cool-toned hues (--code-keyword, --code-string) plus the site's
// one accent (on property names — the content that matters) give the panel
// realistic, recognizable syntax differentiation without reintroducing a
// rainbow IDE theme.

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
    return <span style={{ color: "var(--code-keyword)" }}>{children} </span>;
}

function Var({ children }: { children: React.ReactNode }) {
    return <span style={{ color: "var(--text-primary)" }}>{children}</span>;
}

function Prop({ children }: { children: React.ReactNode }) {
    return <span style={{ color: "var(--accent)" }}>{children}</span>;
}

function Str({ children }: { children: React.ReactNode }) {
    return <span style={{ color: "var(--code-string)" }}>{children}</span>;
}

function Fn({ children }: { children: React.ReactNode }) {
    return <span style={{ color: "var(--text-primary)" }}>{children}</span>;
}

function Dim({ children }: { children?: React.ReactNode }) {
    return <span style={{ color: "var(--text-tertiary)" }}>{children}</span>;
}

// Terminal-style code card — replaces the generic SVG architecture diagram.
// Shows real tech choices in a format engineers immediately recognise.
// Pure CSS, no JS, works before hydration.

import React from "react";

export const HeroVisual: React.FC = () => {
    return (
        <div className="w-full max-w-sm select-none">
            {/* Terminal window */}
            <div
                className="rounded-xl overflow-hidden"
                style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
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
                    <Line indent={1}>
                        <Prop>frontend</Prop>
                        <Dim>:</Dim> [
                    </Line>
                    <Line indent={2}>
                        <Str>&apos;React&apos;</Str>
                        <Dim>,</Dim> <Str>&apos;Next.js&apos;</Str>
                        <Dim>,</Dim>
                    </Line>
                    <Line indent={2}>
                        <Str>&apos;TypeScript&apos;</Str>
                        <Dim>,</Dim> <Str>&apos;Tailwind&apos;</Str>
                        <Dim>,</Dim>
                    </Line>
                    <Line indent={1}>
                        ]<Dim>,</Dim>
                    </Line>
                    <Line indent={1}>
                        <Prop>backend</Prop>
                        <Dim>:</Dim> [<Str>&apos;Node&apos;</Str>
                        <Dim>,</Dim> <Str>&apos;Express&apos;</Str>]<Dim>,</Dim>
                    </Line>
                    <Line indent={1}>
                        <Prop>database</Prop>
                        <Dim>:</Dim> <Str>&apos;MongoDB&apos;</Str>
                        <Dim>,</Dim>
                    </Line>
                    <Line indent={1}>
                        <Prop>deploy</Prop>
                        <Dim>:</Dim> [<Str>&apos;Docker&apos;</Str>
                        <Dim>,</Dim> <Str>&apos;Vercel&apos;</Str>]<Dim>,</Dim>
                    </Line>
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

            {/* Floating badge below the card */}
            <div className="flex items-center justify-center gap-6 mt-5">
                {[
                    { label: "Experience", value: "1+ yr" },
                    { label: "Projects", value: "20+" },
                    { label: "Stack", value: "20+" },
                ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                        <p
                            className="text-base font-semibold"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {value}
                        </p>
                        <p
                            className="text-xs"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            {label}
                        </p>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
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

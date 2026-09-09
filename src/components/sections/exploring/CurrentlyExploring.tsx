// A compact, personal interlude between Stack and Contact — an editorial
// beat, not a fourth content section. States the same curated focus
// already authored in HeroVisual's `engineer.ts` code card (real, existing
// copy, not invented interests), given room to breathe as oversized
// typography instead of buried in a terminal panel. No card grid, no
// badges — the shared SectionAtmosphere's "orbital" variant carries the
// "engineer's workspace" feeling instead, so Projects (blueprint) and
// Experience (signal) each get their own backdrop rather than repeating
// this one.

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { FOCUS } from "@/components/sections/hero/HeroVisual";
import { SectionAtmosphere } from "@/components/shared/SectionAtmosphere";

export function CurrentlyExploring() {
    return (
        <section id="exploring" className="section-sm relative overflow-hidden">
            <SectionAtmosphere variant="orbital" label={"focus.map()"} />

            <div className="container relative z-10">
                <ScrollReveal>
                    <div className="max-w-3xl">
                        <span
                            className="font-mono text-eyebrow uppercase"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            {"// active"}
                        </span>
                        <h2
                            className="m-0 mt-4 text-h1 font-display"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Currently exploring
                        </h2>

                        <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4">
                            {FOCUS.map((theme, i) => (
                                <div key={theme} className="flex items-baseline gap-3">
                                    {i > 0 && (
                                        <span
                                            className="h-1 w-1 rounded-full"
                                            style={{ background: "var(--line-strong)" }}
                                            aria-hidden
                                        />
                                    )}
                                    <span
                                        className="text-h3 font-display"
                                        style={{
                                            color:
                                                i === 0
                                                    ? "var(--text-primary)"
                                                    : "var(--text-secondary)",
                                        }}
                                    >
                                        {theme}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}

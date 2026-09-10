// About / Capabilities — an editorial composition, not a bento grid. One
// dominant block (the real bio, given room to breathe as display type) and
// four quiet supporting facts living directly on the page as plain
// typography, separated by hairlines rather than boxed into cards. Every
// value here is real: the statement is the same `settings.bio` (and
// fallback) Hero already reads, "Current focus" reuses HeroVisual's
// authored FOCUS list, "Location" reuses Hero's location fallback, and
// "Availability" reuses the exact conditional copy already shown in Hero
// and Contact. "Approach" is the one curated exception — three phrases
// lifted directly from the real seed bio ("clean architecture, thoughtful
// UI, and shipping things that work"), not invented values.
//
// Two deliberately different treatments in the rail, not four identical
// ones: Approach/Current focus are value statements and read at body-lg
// weight as a single joined line; Location/Availability are plain
// logistics facts and read as quiet inline mono metadata. The two-tier
// split is the hierarchy signal — no numbering is layered on top of it,
// since these four facts aren't a sequence.
//
// No client state needed beyond the one hover tick per block (pure CSS
// group-hover) and the shared ScrollReveal entrance, so this stays a
// server component.

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { FOCUS } from "@/components/sections/hero/HeroVisual";
import { SectionAtmosphere } from "@/components/shared/SectionAtmosphere";
import type { ISiteSettings } from "@/types";

const APPROACH = ["Clean architecture", "Thoughtful UI", "Shipping things that work"];

// Dividers work as a vertical list — mobile's single column and the
// desktop rail both are one, so they get border-t. Tablet's 2-column grid
// isn't a list (item 2 sits beside item 1, not below it), so a top border
// there would land inconsistently; it relies on gap spacing alone instead.
const DIVIDER =
    "border-t first:border-t-0 first:pt-0 md:border-t-0 md:pt-0 lg:border-t lg:first:border-t-0 lg:first:pt-0";

function ValueLine({ label, items }: { label: string; items: string[] }) {
    return (
        <div className={`group py-6 lg:py-6 ${DIVIDER}`}>
            <span
                className="font-mono text-[10px] uppercase tracking-widest transition-colors duration-200 group-hover:text-accent"
                style={{ color: "var(--text-tertiary)" }}
            >
                {label}
            </span>
            <p className="m-0 mt-2 text-body-lg" style={{ color: "var(--text-secondary)" }}>
                {items.join(" · ")}
            </p>
        </div>
    );
}

function FactLine({ label, value }: { label: string; value: string }) {
    return (
        <div className={`flex items-baseline gap-3 py-4 lg:py-4 ${DIVIDER}`}>
            <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "var(--text-tertiary)", opacity: 0.6 }}
            >
                {label}
            </span>
            <span className="font-mono text-small" style={{ color: "var(--text-tertiary)" }}>
                {value}
            </span>
        </div>
    );
}

export function AboutSection({ settings }: { settings: ISiteSettings | null }) {
    const statement =
        settings?.bio ||
        "I build production-grade digital products and web experiences where engineering meets thoughtful product design.";
    const location = settings?.location ?? "Dhaka, Bangladesh";
    const availableForWork = settings?.availableForWork ?? false;

    return (
        <section id="about" className="section-sm relative overflow-hidden">
            <SectionAtmosphere variant="measurement" />

            <div className="container">
                <ScrollReveal>
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
                        {/* Dominant block — the primary personal statement */}
                        <div className="lg:col-span-7">
                            <span
                                className="font-mono text-eyebrow uppercase"
                                style={{ color: "var(--accent)" }}
                            >
                                {"// about"}
                            </span>
                            <p
                                className="m-0 mt-5 max-w-[30ch] text-h2 sm:text-h1 font-display"
                                style={{ color: "var(--text-primary)", textWrap: "pretty" }}
                            >
                                {statement}
                            </p>
                        </div>

                        {/* Supporting rail — two value statements, then two
                            quiet facts. A single list on mobile and desktop;
                            a 2-column grid on tablet, where a side-by-side
                            rail next to the statement would be too cramped
                            but a plain single-column stack would waste the
                            width. */}
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 md:gap-y-2 lg:col-span-5 lg:grid-cols-1 lg:gap-y-0 lg:border-l lg:pl-10"
                            style={{ borderColor: "var(--line)" }}
                        >
                            <ValueLine label="Approach" items={APPROACH} />
                            <ValueLine label="Current focus" items={FOCUS} />
                            <FactLine label="Location" value={location} />
                            <FactLine
                                label="Availability"
                                value={
                                    availableForWork
                                        ? "Open to new opportunities"
                                        : "Not actively looking, but always happy to talk"
                                }
                            />
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}

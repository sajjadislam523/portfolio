import { FadeIn } from "@/components/motion/ScrollReveal";
import { HeroStars } from "@/components/sections/hero/HeroStars";
import { HeroVisual } from "@/components/sections/hero/HeroVisual";
import { ScrollCue } from "@/components/sections/hero/ScrollCue";
import type {
    IExperience,
    ISiteSettings,
    ISkill,
    SkillCategory,
} from "@/types";
import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Hero — "Cinematic Technical / Sci-Fi Editorial" refinement pass 2.
//
// Pass 1 fixed the confusing three-line rotating headline but over-corrected
// into a hero that read as a clean, generic developer-template hero: too
// much empty space, too little identity. This pass restores content —
// a real positioning statement, a three-tier technical-identity block, a
// scroll cue — without reintroducing the things pass 1 removed on purpose
// (the rotating word, the filled availability capsule, the oversized panel).
// ─────────────────────────────────────────────────────────────────────────────

interface HeroProps {
    settings: ISiteSettings | null;
    latestRole: IExperience | null;
    experienceLabel: string;
    projectsLabel: string;
    stackLabel: string;
    groupedSkills?: Partial<Record<SkillCategory, ISkill[]>>;
}

const META = "font-mono text-[12.5px] leading-[1.5]";

// The site's own curated core stack, kept short and personal rather than
// an exhaustive inventory (that's what the Stack section is for).
const CORE_STACK = ["React", "Next.js", "TypeScript", "Node.js"];

/** Interleaves a faint "/" between metadata nodes — one separator rule for
 *  the whole technical-identity line instead of ad hoc conditionals. */
function withSeparators(nodes: React.ReactNode[]): React.ReactNode[] {
    return nodes.flatMap((node, i) =>
        i === 0
            ? [node]
            : [
                  <span key={`sep-${i}`} className="opacity-40" aria-hidden>
                      /
                  </span>,
                  node,
              ],
    );
}

export function Hero({
    settings,
    latestRole,
    experienceLabel,
    projectsLabel,
    stackLabel,
    groupedSkills,
}: HeroProps) {
    const name = settings?.name ?? "Sajjadul Islam";
    const positioningStatement =
        settings?.bio ||
        "I build production-grade digital products and web experiences where engineering meets thoughtful product design.";
    const socialLinks = settings?.socialLinks ?? [];
    const resumeUrl = settings?.resumeUrl ?? "";
    const availableForWork = settings?.availableForWork ?? false;

    return (
        <section className="zone-hero relative flex min-h-screen items-center pt-20">
            {/* The star field carries the ground — toned down to an atmospheric
                resting state so it never competes with the headline. */}
            <HeroStars />

            {/* One extremely subtle blue light source, aimed at the panel —
                the only atmospheric effect on the page, not a decorative glow. */}
            <div
                className="pointer-events-none absolute"
                style={{
                    top: "-6%",
                    right: "-4%",
                    width: "40%",
                    height: "62%",
                    background:
                        "radial-gradient(ellipse at center, var(--accent-wash) 0%, transparent 70%)",
                    filter: "blur(52px)",
                }}
            />

            <div className="relative z-10 flex w-full flex-col">
                <div className="container grid grid-cols-1 items-center gap-[clamp(28px,4vw,56px)] py-[clamp(28px,4.5vw,56px)] lg:grid-cols-12">
                    {/* ── Left — 7 of 12 ── */}
                    <div className="flex min-w-0 flex-col gap-5.5 lg:col-span-7">
                        {/* 1. Status — a light source (a dot), not a filled badge */}
                        {availableForWork && (
                            <FadeIn>
                                <div
                                    className="inline-flex items-center gap-2 font-mono text-xs"
                                    style={{ color: "var(--hero-fg-faint)" }}
                                >
                                    <span
                                        className="h-1.5 w-1.5 animate-pulse rounded-full"
                                        style={{
                                            background: "var(--accent)",
                                            boxShadow: "0 0 6px var(--accent-glow)",
                                        }}
                                    />
                                    Open to opportunities
                                </div>
                            </FadeIn>
                        )}

                        {/* 2 + 3. Kicker + headline — one static statement, uppercase,
                            not a rotating one. */}
                        <FadeIn delay={0.05}>
                            <div
                                className="-mx-3 -my-2 rounded-lg px-3 py-2 backdrop-blur-sm"
                                style={{
                                    background:
                                        "color-mix(in srgb, var(--zone-hero) 45%, transparent)",
                                }}
                            >
                                <span
                                    className={`${META} mb-3 block tracking-wider`}
                                    style={{ color: "var(--hero-fg-faint)" }}
                                >
                                    Hi, I&apos;m {name}.
                                </span>

                                <h1
                                    className="m-0 text-display font-display uppercase"
                                    style={{
                                        color: "var(--hero-fg)",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    <span className="block">Full Stack</span>
                                    <span className="block">Engineer</span>
                                </h1>
                            </div>
                        </FadeIn>

                        {/* 4. Positioning statement */}
                        <FadeIn delay={0.1}>
                            <p
                                className="max-w-[54ch] text-body-lg"
                                style={{
                                    color: "var(--hero-fg-muted)",
                                    textWrap: "pretty",
                                }}
                            >
                                {positioningStatement}
                            </p>
                        </FadeIn>

                        {/* 5 + 6. Primary / secondary CTA */}
                        <FadeIn delay={0.15}>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <Link href="#projects" className="btn btn-primary">
                                    View projects <ArrowUpRight className="h-4 w-4" />
                                </Link>
                                <Link href="#contact" className="btn btn-secondary">
                                    Get in touch
                                </Link>
                            </div>
                        </FadeIn>

                        {/* 7. Technical identity metadata — three understated tiers:
                            who/what/where, the core stack, then links. */}
                        <FadeIn delay={0.2}>
                            <div className="flex flex-col gap-2">
                                <div
                                    className={`${META} flex flex-wrap items-center gap-3 uppercase tracking-wide`}
                                    style={{ color: "var(--hero-fg-muted)" }}
                                >
                                    {withSeparators([
                                        <span key="name">{name}</span>,
                                        <span key="role">
                                            {latestRole?.role ?? "Full Stack Engineer"}
                                        </span>,
                                        <span key="location">
                                            {settings?.location ?? "Dhaka, Bangladesh"}
                                        </span>,
                                    ])}
                                </div>

                                <div
                                    className={`${META} uppercase tracking-wide`}
                                    style={{ color: "var(--hero-fg-faint)" }}
                                >
                                    {CORE_STACK.join(" · ")}
                                </div>

                                {(socialLinks.length > 0 || resumeUrl) && (
                                    <div
                                        className={`${META} flex flex-wrap items-center gap-4`}
                                        style={{ color: "var(--hero-fg-faint)" }}
                                    >
                                        {socialLinks.map((link) => (
                                            <a
                                                key={link.platform}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="transition-opacity hover:opacity-70"
                                            >
                                                {link.platform} ↗
                                            </a>
                                        ))}
                                        {resumeUrl && (
                                            <a
                                                href={resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
                                            >
                                                <FileText className="h-3.5 w-3.5" />
                                                Résumé ↗
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </FadeIn>
                    </div>

                    {/* ── Right — 5 of 12 — 8. floating system panel. Smaller, and
                        nudged toward the upper edge of its row rather than
                        vertically centred, so it doesn't anchor the composition's
                        weight as heavily as it did in pass 1. Visible (not hidden)
                        below `lg` now too — centred beneath the text on mobile
                        instead of disappearing. ── */}
                    <FadeIn
                        delay={0.15}
                        className="flex min-w-0 justify-center lg:col-span-5 lg:mt-6 lg:justify-end lg:self-start"
                    >
                        <HeroVisual
                            experienceLabel={experienceLabel}
                            projectsLabel={projectsLabel}
                            stackLabel={stackLabel}
                            groupedSkills={groupedSkills}
                        />
                    </FadeIn>
                </div>
            </div>

            {/* 9. Scroll cue */}
            <ScrollCue />
        </section>
    );
}

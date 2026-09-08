import { FadeIn } from "@/components/motion/ScrollReveal";
import { HeroStars } from "@/components/sections/hero/HeroStars";
import { HeroVisual } from "@/components/sections/hero/HeroVisual";
import { RotatingWord } from "@/components/sections/hero/RotatingWord";
import type {
    IExperience,
    ISiteSettings,
    ISkill,
    SkillCategory,
} from "@/types";
import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Hero — Redesign Blueprint §05, rev 2.
//
// Changes from the current hero:
//   1. Asymmetric 7/5 split. The headline gets the wide column; the terminal
//      card gets the narrow one. Equal columns are what read as a template.
//   2. ONE directional wash behind the card, replacing the centred radial
//      glow + two blurred orbs. Four unshaped effects became one.
//   3. The grid is gone. <HeroStars /> carries the ground instead, and lights
//      up under the cursor. See §01.
//   4. The ground is .zone-hero — derived from the theme, not pinned to black,
//      so the toggle reaches the hero while it still reads as its own plate.
//
// Rev 2 also drops the client rail: the plate now ends on the CTA row.
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

export function Hero({
    settings,
    latestRole,
    experienceLabel,
    projectsLabel,
    stackLabel,
    groupedSkills,
}: HeroProps) {
    const name = settings?.name ?? "Sajjadul Islam";
    const bio = settings?.bio ?? "";
    const socialLinks = settings?.socialLinks ?? [];
    const resumeUrl = settings?.resumeUrl ?? "";
    const availableForWork = settings?.availableForWork ?? false;

    return (
        <section className="zone-hero flex min-h-screen items-center pt-20">
            {/* §01 — the star field owns its own alpha, animation and spotlight */}
            <HeroStars count={56} />

            {/* §05 — the one remaining background effect, aimed at the card */}
            <div
                className="pointer-events-none absolute"
                style={{
                    top: "-10%",
                    right: "-6%",
                    width: "46%",
                    height: "78%",
                    background:
                        "radial-gradient(ellipse at center, var(--accent-wash) 0%, transparent 70%)",
                    filter: "blur(44px)",
                }}
            />

            <div className="relative z-10 flex w-full flex-col">
                <div className="container grid grid-cols-1 items-center gap-[clamp(28px,4vw,56px)] py-[clamp(28px,4.5vw,56px)] lg:grid-cols-12">
                    {/* ── Left — 7 of 12 ── */}
                    <div className="flex min-w-0 flex-col gap-[22px] lg:col-span-7">
                        {availableForWork && (
                            <FadeIn>
                                <div
                                    className="inline-flex items-center gap-[9px] rounded-full py-1.5 pl-[11px] pr-[13px] font-mono text-xs"
                                    style={{
                                        background: "var(--accent-glow)",
                                        border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                                        color: "var(--accent-on-canvas)",
                                    }}
                                >
                                    <span
                                        className="h-1.5 w-1.5 animate-pulse rounded-full"
                                        style={{ background: "var(--accent-on-canvas)" }}
                                    />
                                    Open to opportunities
                                </div>
                            </FadeIn>
                        )}

                        <FadeIn delay={0.05}>
                            <span
                                className={`${META} mb-3 block tracking-wider`}
                                style={{ color: "var(--hero-fg-faint)" }}
                            >
                                Hi, I&apos;m {name} —
                            </span>

                            {/* §03 — font-semibold, NOT font-extrabold: Space Grotesk
                                loads 500/600/700, so 800 was being synthesised.
                                line-height 1 on all three lines so the script
                                face in the middle sits on the same baseline. */}
                            <h1 className="m-0" style={{ lineHeight: 1 }}>
                                <span
                                    className="block font-display font-semibold tracking-[-0.042em]"
                                    style={{
                                        fontSize: "clamp(3.25rem, 6.4vw, 5.25rem)",
                                        lineHeight: 1,
                                        color: "var(--hero-fg)",
                                    }}
                                >
                                    Full Stack
                                </span>

                                {/* Dancing Script sized 1.18x to compensate for its
                                    lower x-height — see §03. */}
                                <span
                                    className="block"
                                    style={{
                                        fontSize: "clamp(3.8rem, 7.5vw, 6.2rem)",
                                        lineHeight: 1,
                                    }}
                                >
                                    <RotatingWord />
                                </span>

                                <span
                                    className="block font-display font-semibold tracking-[-0.042em]"
                                    style={{
                                        fontSize: "clamp(3.25rem, 6.4vw, 5.25rem)",
                                        lineHeight: 1,
                                        color: "var(--hero-fg)",
                                    }}
                                >
                                    Engineer
                                </span>
                            </h1>
                        </FadeIn>

                        {bio && (
                            <FadeIn delay={0.1}>
                                <p
                                    className="max-w-[54ch] text-[1.0625rem] leading-[1.62] tracking-[-0.008em]"
                                    style={{
                                        color: "var(--hero-fg-muted)",
                                        textWrap: "pretty",
                                    }}
                                >
                                    {bio}
                                </p>
                            </FadeIn>
                        )}

                        <FadeIn delay={0.15}>
                            <div
                                className={`${META} flex flex-wrap gap-3`}
                                style={{ color: "var(--hero-fg-faint)" }}
                            >
                                <span>{name}</span>
                                {latestRole && (
                                    <>
                                        <span className="opacity-45">/</span>
                                        <span>{latestRole.role}</span>
                                        <span className="opacity-45">/</span>
                                        <span>{latestRole.company}</span>
                                    </>
                                )}
                                <span className="opacity-45">/</span>
                                <span>{settings?.location ?? "Dhaka, Bangladesh"}</span>
                            </div>
                        </FadeIn>

                        {/* ── CTA row — the plate now ends here (rev 2) ── */}
                        <FadeIn delay={0.2}>
                            <div className="flex flex-wrap items-center gap-[10px]">
                                <Link
                                    href="#projects"
                                    className="inline-flex items-center gap-[9px] rounded-lg px-5 py-[11px] text-[0.9375rem] font-[520] transition-opacity hover:opacity-90"
                                    style={{
                                        background: "var(--hero-cta-bg)",
                                        color: "var(--hero-cta-fg)",
                                        boxShadow: "var(--hero-cta-shadow)",
                                    }}
                                >
                                    View projects <ArrowUpRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="#contact"
                                    className="inline-flex items-center gap-2 rounded-lg px-5 py-[11px] text-[0.9375rem] font-[450] transition-colors"
                                    style={{
                                        background: "var(--hero-surface-soft)",
                                        border: "1px solid var(--hero-line)",
                                        color: "var(--hero-fg-muted)",
                                    }}
                                >
                                    Get in touch
                                </Link>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.25}>
                            <div
                                className={`${META} flex flex-wrap items-center gap-[18px]`}
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
                        </FadeIn>
                    </div>

                    {/* ── Right — 5 of 12 ── */}
                    <FadeIn
                        delay={0.15}
                        className="hidden min-w-0 justify-end lg:col-span-5 lg:flex"
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
        </section>
    );
}

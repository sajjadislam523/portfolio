import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AboutSection } from "@/components/sections/about/AboutSection";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { MagneticCTA } from "@/components/sections/contact/MagneticCTA";
import { CurrentlyExploring } from "@/components/sections/exploring/CurrentlyExploring";
import { ExperienceTimeline } from "@/components/sections/experience/ExperienceTimeline";
import { Hero } from "@/components/sections/hero/Hero";
import { ProjectIndexList } from "@/components/sections/projects/ProjectIndexList";
import {
    ProjectFeatureRow,
    ProjectShowcase,
} from "@/components/sections/projects/ProjectShowcase";
import { CATEGORY_ORDER, deriveSkillTier } from "@/components/sections/stack/constants";
import { SkillGroups } from "@/components/sections/stack/SkillGroups";
import { TechConstellation } from "@/components/sections/stack/TechConstellation";
import { JsonLdPerson } from "@/components/shared/JsonLd";
import { SectionAtmosphere } from "@/components/shared/SectionAtmosphere";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
    connectDB,
    Experience,
    Exploration,
    Project,
    SiteSettings,
    Skill,
} from "@/lib/db";
import { ArrowUpRight } from "lucide-react";
import type {
    IExperience,
    IExploration,
    IProject,
    ISiteSettings,
    ISkill,
    SkillCategory,
} from "@/types";
import type { Metadata } from "next";
import { cache, type CSSProperties } from "react";

// Cache the homepage at the edge for 5 minutes.
// This means Vercel serves it from CDN on cold starts instead of
// hitting the serverless function + MongoDB every time.
export const revalidate = 300;

// `generateMetadata` and the page component both call this — without
// `cache()` that's 5 Mongoose queries twice (10 total) per render, since
// Mongoose calls aren't deduped by Next's fetch cache the way `fetch()`
// calls are. `cache()` memoizes per request instead.
const getData = cache(async () => {
    try {
        await connectDB();
        // `{ $ne: false }` (not `{ $eq: true }`) so documents saved before
        // these gates existed — which have no `published`/`visible` key at
        // all — stay visible by default rather than silently disappearing.
        const [settingsDoc, projectDocs, experienceDocs, skillDocs, explorationDocs] =
            await Promise.all([
                SiteSettings.findOne({}).lean(),
                Project.find({ published: { $ne: false } }).sort({ order: 1 }).lean(),
                Experience.find({ published: { $ne: false } }).sort({ order: 1 }).lean(),
                Skill.find({ visible: { $ne: false } }).sort({ order: 1 }).lean(),
                Exploration.find({ status: "active", published: { $ne: false } })
                    .sort({ order: 1 })
                    .lean(),
            ]);

        const allProjects = JSON.parse(
            JSON.stringify(projectDocs),
        ) as IProject[];
        const experiences = JSON.parse(
            JSON.stringify(experienceDocs),
        ) as IExperience[];
        const skills = JSON.parse(JSON.stringify(skillDocs)) as (ISkill & {
            proficiency?: string;
        })[];
        // Derives the correct tier even for a skill document that predates
        // the Skill.proficiency -> Skill.tier rename and hasn't been migrated
        // in the database yet (see scripts/migrate-skill-tiers.ts) — reads
        // the legacy `proficiency` field, still present on the raw Mongo
        // document even though it's no longer in the ISkill type, instead of
        // just falling back to a generic tier and losing the constellation's
        // "core" anchors/connections for every unmigrated skill.
        for (const s of skills) {
            s.tier = deriveSkillTier(s);
        }
        const activeExplorations = JSON.parse(
            JSON.stringify(explorationDocs),
        ) as IExploration[];

        const primaryExploration =
            activeExplorations.find((e) => e.isPrimary) ?? activeExplorations[0] ?? null;
        const secondaryExplorations = activeExplorations
            .filter((e) => e._id !== primaryExploration?._id)
            .slice(0, 3);

        const earliestStart = experiences.reduce<Date | null>((min, e) => {
            const start = new Date(e.startDate);
            return !min || start < min ? start : min;
        }, null);
        const experienceYears = earliestStart
            ? Math.max(
                  1,
                  Math.floor(
                      (Date.now() - earliestStart.getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000),
                  ),
              )
            : null;

        return {
            settings: settingsDoc
                ? (JSON.parse(JSON.stringify(settingsDoc)) as ISiteSettings)
                : null,
            // The admin "Lead row on the homepage" toggle (project.featured)
            // promises this project renders first — stable-sort it to the
            // front rather than just filtering, so `.order` still decides
            // everything else. `clearOtherFeatured()` (features/projects/
            // actions.ts) keeps this true for at most one project at a time.
            featuredProjects: allProjects
                .filter((p) => p.status === "featured")
                .sort((a, b) => Number(b.featured) - Number(a.featured)),
            archivedProjects: allProjects.filter(
                (p) => p.status === "archived",
            ),
            experiences,
            latestRole: experiences[0] ?? null,
            skills,
            experienceYears,
            projectCount: allProjects.length,
            skillCount: skills.length,
            primaryExploration,
            secondaryExplorations,
        };
    } catch {
        return {
            settings: null,
            featuredProjects: [],
            archivedProjects: [],
            experiences: [],
            latestRole: null,
            skills: [],
            experienceYears: null,
            projectCount: 0,
            skillCount: 0,
            primaryExploration: null as IExploration | null,
            secondaryExplorations: [] as IExploration[],
        };
    }
});

const DEFAULT_DESCRIPTION =
    "I build production-grade digital products and web experiences where engineering meets thoughtful product design.";

export async function generateMetadata(): Promise<Metadata> {
    const { settings } = await getData();
    // `||`, not `??` — an SEO field an admin has cleared back to its schema
    // default ("") should fall back too, not render an empty <title>/description.
    const seo = settings?.seo;
    const title = seo?.title || "Sajjadul Islam — Full Stack Engineer";
    return {
        // `absolute` bypasses the root layout's "%s | Sajjadul Islam"
        // template — without it the homepage's own already-complete title
        // gets the site name appended a second time ("… Engineer | Sajjadul
        // Islam"). Every other page (already just a plain string) is
        // supposed to get that suffix; the homepage IS the site, so it
        // shouldn't.
        title: { absolute: title },
        description: seo?.description || DEFAULT_DESCRIPTION,
        openGraph: {
            images: seo?.ogImage ? [seo.ogImage] : [],
        },
    };
}

// A restrained echo of the hero's star field for Contact — a handful of
// fixed positions rendered with the existing `.hero-star` CSS keyframe, not
// a second canvas/pointer-tracked instance. Deliberately sparse: this is a
// closing whisper, not a second interactive effect.
const CONTACT_STARS: { top: string; left: string; size: number; dur: string; delay: string }[] = [
    { top: "12%", left: "8%", size: 2, dur: "5.2s", delay: "0.4s" },
    { top: "22%", left: "88%", size: 1.5, dur: "4.6s", delay: "1.1s" },
    { top: "68%", left: "14%", size: 1.5, dur: "6s", delay: "0.2s" },
    { top: "78%", left: "92%", size: 2, dur: "5.5s", delay: "2s" },
    { top: "40%", left: "5%", size: 1, dur: "4.2s", delay: "1.6s" },
    { top: "8%", left: "60%", size: 1, dur: "5.8s", delay: "0.8s" },
    { top: "85%", left: "48%", size: 1.5, dur: "5s", delay: "1.3s" },
    { top: "30%", left: "95%", size: 1, dur: "4.9s", delay: "2.4s" },
    { top: "55%", left: "3%", size: 2, dur: "6.2s", delay: "0.6s" },
    { top: "15%", left: "40%", size: 1, dur: "4.4s", delay: "1.9s" },
];

export default async function HomePage() {
    const {
        settings,
        featuredProjects,
        archivedProjects,
        experiences,
        latestRole,
        skills,
        experienceYears,
        projectCount,
        skillCount,
        primaryExploration,
        secondaryExplorations,
    } = await getData();

    const experienceLabel = experienceYears ? `${experienceYears}+ yr` : "1+ yr";
    const projectsLabel = projectCount > 0 ? `${projectCount}+` : "20+";
    const stackLabel = skillCount > 0 ? `${skillCount}+` : "20+";

    const name = settings?.name ?? "Sajjadul Islam";
    const bio = settings?.bio ?? "";
    const socialLinks = settings?.socialLinks ?? [];
    const availableForWork = settings?.availableForWork ?? false;

    const groupedSkills = CATEGORY_ORDER.reduce<Record<SkillCategory, ISkill[]>>(
        (acc, cat) => {
            acc[cat] = skills.filter((s) => s.category === cat);
            return acc;
        },
        {} as Record<SkillCategory, ISkill[]>,
    );

    return (
        <>
            <JsonLdPerson
                name={name}
                url={process.env.NEXT_PUBLIC_URL ?? "https://sajjadulislam.dev"}
                email={settings?.email}
                jobTitle={latestRole?.role ?? "Full Stack Engineer"}
                description={bio || undefined}
                sameAs={socialLinks.map((l) => l.url)}
            />
            {/* ── Hero ───────────────────────────────────────────────────────────── */}
            <Hero
                settings={settings}
                latestRole={latestRole}
                experienceLabel={experienceLabel}
                projectsLabel={projectsLabel}
                stackLabel={stackLabel}
                groupedSkills={groupedSkills}
            />

            <AboutSection settings={settings} />

            {/* ── Projects — the visual centerpiece ───────────────────────────────── */}
            <section id="projects" className="section zone-canvas relative overflow-hidden">
                <SectionAtmosphere variant="blueprint" />

                <div className="container relative z-10">
                    {/* Bespoke header — deliberately not the shared SectionHeading;
                        this section is meant to be a bigger visual moment than
                        Experience/Stack/Contact, so it earns its own composition
                        instead of reusing theirs. */}
                    <ScrollReveal>
                        <div className="mb-20 lg:mb-28">
                            <span
                                className="font-mono text-eyebrow uppercase"
                                style={{ color: "var(--accent)" }}
                            >
                                01 / Selected work
                            </span>
                            <h2
                                className="m-0 mt-4 max-w-2xl text-h1 font-display"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Projects where engineering, product thinking and
                                interface design meet.
                            </h2>
                        </div>
                    </ScrollReveal>

                    {featuredProjects.length > 0 ? (
                        <div className="flex flex-col gap-24 lg:gap-32">
                            {featuredProjects.slice(0, 2).map((project, i) => (
                                <ScrollReveal key={project._id}>
                                    <ProjectShowcase
                                        project={project}
                                        displayIndex={String(i + 1).padStart(2, "0")}
                                        reverse={i % 2 === 1}
                                    />
                                </ScrollReveal>
                            ))}

                            {featuredProjects.length > 2 && (
                                <div className="flex flex-col">
                                    {featuredProjects.slice(2).map((project, i) => (
                                        <ScrollReveal key={project._id}>
                                            <ProjectFeatureRow
                                                project={project}
                                                displayIndex={String(i + 3).padStart(2, "0")}
                                            />
                                        </ScrollReveal>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p
                            className="text-sm py-16 text-center"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            No projects yet — check back soon.
                        </p>
                    )}

                    {/* ── Archive — a project index, not a second row of cards ───────── */}
                    {archivedProjects.length > 0 && (
                        <div className="mt-28 lg:mt-36">
                            <div className="mb-8 flex items-baseline justify-between">
                                <span
                                    className="font-mono text-eyebrow uppercase"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    Archive
                                </span>
                                <span
                                    className="font-mono text-[11px]"
                                    style={{ color: "var(--text-tertiary)", opacity: 0.6 }}
                                >
                                    {archivedProjects.length} project
                                    {archivedProjects.length === 1 ? "" : "s"}
                                </span>
                            </div>
                            <ScrollReveal>
                                <ProjectIndexList
                                    projects={archivedProjects}
                                    indexOffset={featuredProjects.length}
                                />
                            </ScrollReveal>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Experience ───────────────────────────────────────────────────────── */}
            <section
                id="experience"
                className="section relative overflow-hidden"
                style={{ background: "var(--bg-secondary)" }}
            >
                <SectionAtmosphere variant="signal" label={"// career_log"} />

                <div className="container relative z-10">
                    <ScrollReveal>
                        <SectionHeading
                            index="02"
                            eyebrow="Career"
                            heading="Experience"
                            className="mb-14"
                        />
                    </ScrollReveal>

                    <div className="max-w-4xl">
                        <ExperienceTimeline experiences={experiences} />
                    </div>
                </div>
            </section>

            {/* ── Stack — quieter than Projects; supporting evidence, not the
                main attraction ──────────────────────────────────────────────── */}
            <section id="stack" className="section relative overflow-hidden">
                {/* The quietest variant — TechConstellation already carries
                    its own grid fragment and orbital lines as part of the
                    visualization itself, so the section-level backdrop
                    stays out of its way rather than doubling up. */}
                <SectionAtmosphere variant="grain" />

                <div className="container">
                    <ScrollReveal>
                        <SectionHeading
                            index="03"
                            eyebrow="Technology"
                            heading="Tools I use to turn ideas into products."
                            className="mb-14"
                        />
                    </ScrollReveal>

                    {skills.length > 0 ? (
                        <ScrollReveal>
                            {/* Desktop — the spatial constellation. Mobile — a
                                clean stacked list that keeps the same node +
                                tier-numbering motif without any horizontal
                                layout to break. */}
                            <TechConstellation skills={skills} className="hidden lg:block" />
                            <SkillGroups skills={skills} className="lg:hidden" />
                        </ScrollReveal>
                    ) : (
                        <p
                            className="text-sm py-16 text-center"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            No skills yet — check back soon.
                        </p>
                    )}
                </div>
            </section>

            {/* ── Currently exploring — activity, not another technology
                category; distinct from Stack's "what I use". The section
                wrapper (and its #exploring anchor, which NavClient's
                "Exploring" nav link points at) always renders, even with no
                active entry, so the nav link is never dead — only the
                content inside is conditional; this is bonus content, not
                a core section every visit is guaranteed to have something
                to show. ──────────────────────────────────────────────── */}
            <section id="exploring" className="section relative overflow-hidden">
                <SectionAtmosphere variant="orbital" label="// exploration_log" />

                <div className="container relative z-10">
                    <ScrollReveal>
                        <span
                            className="mb-14 block font-mono text-eyebrow uppercase"
                            style={{ color: "var(--accent)" }}
                        >
                            04 / Currently exploring
                        </span>
                    </ScrollReveal>

                    {primaryExploration ? (
                        <ScrollReveal>
                            <CurrentlyExploring
                                primary={primaryExploration}
                                secondary={secondaryExplorations}
                            />
                        </ScrollReveal>
                    ) : (
                        <p
                            className="text-sm py-16 text-center"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            Nothing marked as currently exploring — check back soon.
                        </p>
                    )}
                </div>
            </section>

            {/* ── Contact — the emotional and visual conclusion of the site ──────── */}
            <section
                id="contact"
                className="section bg-noise relative overflow-hidden"
                style={{ background: "var(--bg-secondary)" }}
            >
                {/* Restrained star-field continuation — a quiet echo of the hero,
                    pure CSS, no canvas or pointer tracking. A closing whisper,
                    not a second interactive effect. */}
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                    {CONTACT_STARS.map((s, i) => (
                        <span
                            key={i}
                            className="hero-star"
                            style={
                                {
                                    top: s.top,
                                    left: s.left,
                                    width: s.size,
                                    height: s.size,
                                    opacity: 0.6,
                                    "--dur": s.dur,
                                    "--delay": s.delay,
                                } as CSSProperties
                            }
                        />
                    ))}
                </div>

                {/* One extremely subtle blue illumination — not a second glow */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 55% 45% at 50% 35%, var(--accent-wash) 0%, transparent 70%)",
                        filter: "blur(64px)",
                    }}
                    aria-hidden
                />

                <div className="container relative z-10">
                    <ScrollReveal>
                        <div className="mx-auto max-w-3xl text-center">
                            <span
                                className="font-mono text-eyebrow uppercase"
                                style={{ color: "var(--accent)" }}
                            >
                                05 / Contact
                            </span>

                            {/* text-display's clamp floor (60px) is sized for
                                two-word Hero lines — "interesting." as one
                                unbreakable word at that size overflows a
                                320–375px viewport and gets clipped by the
                                section's overflow-hidden. Step down to text-h1
                                below sm, where there's no room to spare. */}
                            <h2
                                className="m-0 mt-4 text-h1 font-display uppercase sm:text-display"
                                style={{
                                    color: "var(--text-primary)",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                <span className="block">Let&apos;s build</span>
                                <span className="block">something</span>
                                <span className="block">interesting.</span>
                            </h2>

                            <p
                                className="mx-auto mt-6 max-w-md text-body-lg"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                If you&apos;re working on something ambitious,
                                I&apos;d love to hear about it.
                            </p>

                            <div className="mt-10 flex flex-col items-center gap-5">
                                <MagneticCTA
                                    href="#contact-form"
                                    className="btn btn-primary-canvas px-8 py-4 text-base"
                                >
                                    Start a conversation
                                    <ArrowUpRight className="h-4 w-4" />
                                </MagneticCTA>

                                {settings?.email && (
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="font-mono text-small transition-colors hover:text-[var(--accent-on-canvas)]"
                                        style={{ color: "var(--text-tertiary)" }}
                                        aria-label={`Email ${settings.email}`}
                                    >
                                        {settings.email}
                                    </a>
                                )}

                                <div
                                    className="flex items-center gap-2 font-mono text-small"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{
                                            background: availableForWork
                                                ? "var(--accent)"
                                                : "var(--text-tertiary)",
                                            boxShadow: availableForWork
                                                ? "0 0 6px var(--accent-glow)"
                                                : "none",
                                        }}
                                    />
                                    {availableForWork
                                        ? "Open to new opportunities"
                                        : "Not actively looking, but always happy to talk"}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* The form — kept functional, deliberately quiet */}
                    <ScrollReveal delay={0.1}>
                        <div id="contact-form" className="mx-auto mt-24 max-w-xl scroll-mt-24">
                            <div className="surface rounded-md p-6">
                                <span
                                    className="mb-5 block font-mono text-[11px] uppercase tracking-wide"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    Or send a message
                                </span>
                                <ContactForm />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}

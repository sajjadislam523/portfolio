"use client";

import { CornerMarks, GridFragment } from "@/components/shared/TechnicalMotifs";
import { Logo } from "@/components/shared/Logo";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Resolves to false during SSR and the first client render (matching the
// server), then true after hydration — avoids the theme-icon mismatching
// between the server's theme guess and next-themes' actual resolved value.
const subscribeNoop = () => () => {};
function useHasMounted() {
    return useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false,
    );
}

// Desktop labels are also the mobile labels — the nav's own copy, not a
// restatement of each section's on-page heading (Projects' eyebrow still
// says "Selected work"; the nav says "Work").
const NAV_LINKS = [
    { href: "/#projects", label: "Work", number: "01" },
    { href: "/#experience", label: "Experience", number: "02" },
    { href: "/#stack", label: "Stack", number: "03" },
    { href: "/#exploring", label: "Now", number: "04" },
    { href: "/#contact", label: "Contact", number: "05" },
];

interface SocialLink {
    platform: string;
    url: string;
}

interface NavClientProps {
    resumeUrl: string;
    name?: string;
    email?: string;
    socialLinks?: SocialLink[];
}

export function NavClient({
    resumeUrl,
    name = "Sajjadul Islam",
    email,
    socialLinks = [],
}: NavClientProps) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const { resolvedTheme, setTheme } = useTheme();
    const isLight = useHasMounted() && resolvedTheme === "light";
    const shouldReduceMotion = useReducedMotionSafe();
    const menuPanelRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuLinks = email
        ? [...socialLinks, { platform: "Email", url: `mailto:${email}` }]
        : socialLinks;

    const { scrollYProgress } = useScroll();
    const progressScaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 34 });

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        handler();
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    // Scroll-spy — highlights the nav link for whichever section is nearest
    // the vertical center of the viewport. Only relevant on the single-page
    // landing; other routes (e.g. a project detail page) have no matching ids.
    useEffect(() => {
        if (pathname !== "/") return;
        const ids = NAV_LINKS.map((l) => l.href.split("#")[1]);
        const sections = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                }
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
        );
        sections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [pathname]);

    const prevPathname = useRef(pathname);

    useEffect(() => {
        if (prevPathname.current === pathname) return;
        prevPathname.current = pathname;
        // Defer to next tick — avoids synchronous setState inside effect body
        const t = setTimeout(() => setMenuOpen(false), 0);
        return () => clearTimeout(t);
    }, [pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    // Focus trap + Escape-to-close while the full-screen menu is open, and
    // restore focus to the trigger button on close — the panel unmounts via
    // AnimatePresence, so this effect's own cleanup (which fires on close)
    // is what returns focus, not a separate "was it open" branch.
    useEffect(() => {
        if (!menuOpen) return;

        const panel = menuPanelRef.current;
        if (!panel) return;

        const getFocusable = () =>
            Array.from(
                panel.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ),
            ).filter((el) => el.offsetParent !== null);

        getFocusable()[0]?.focus();

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                e.preventDefault();
                setMenuOpen(false);
                return;
            }
            if (e.key !== "Tab") return;
            const items = getFocusable();
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", onKeyDown);
        const triggerButton = menuButtonRef.current;
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            triggerButton?.focus();
        };
    }, [menuOpen]);

    // Mobile menu row choreography — two beats per row, not three: the
    // number and label reveal together as one unit (they're one semantic
    // item, "01 WORK"), then the separator draws in just after. Rows
    // themselves cascade via rowContainerVariants' staggerChildren.
    const rowContainerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    };
    const contentVariants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
    };
    const lineVariants = {
        hidden: { scaleX: 0 },
        visible: {
            scaleX: 1,
            transition: { duration: 0.3, ease: EASE_OUT, delay: 0.12 },
        },
    };

    return (
        <>
            {/* ── Top bar — a minimal command nav with a subtle HUD frame.
                Three-zone grid (mark / index nav / instrument cluster) so the
                center links sit on the bar's true center regardless of how
                wide the left and right clusters are. ── */}
            <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-3 sm:pt-4 px-3 sm:px-4 pointer-events-none">
                <nav
                    className="pointer-events-auto relative grid grid-cols-[auto_1fr_auto] items-center w-full max-w-6xl gap-3 sm:gap-6 h-14 min-[1200px]:h-16 px-4 min-[1200px]:px-6 rounded-md transition-colors duration-300"
                    style={{
                        background: scrolled
                            ? "color-mix(in srgb, var(--bg-primary) 82%, transparent)"
                            : "color-mix(in srgb, var(--bg-primary) 52%, transparent)",
                        backdropFilter: scrolled ? "blur(10px)" : "blur(5px)",
                        WebkitBackdropFilter: scrolled ? "blur(10px)" : "blur(5px)",
                        border: `1px solid ${scrolled || menuOpen ? "var(--border-strong)" : "var(--line-hairline)"}`,
                        boxShadow: scrolled ? "var(--shadow-xs)" : "none",
                    }}
                >
                    <CornerMarks />

                    {/* Very thin scroll-progress hairline, tucked just under
                        the bar's own bottom edge — a discovered detail, not a
                        headline element. */}
                    <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-3 -bottom-0.75 h-px origin-left"
                        style={{
                            background: "color-mix(in srgb, var(--accent) 55%, transparent)",
                            scaleX: progressScaleX,
                        }}
                    />

                    {/* Mark */}
                    <Link
                        href="/"
                        className="relative z-10 col-start-1 flex items-center gap-2.5 justify-self-start"
                    >
                        <Logo size={26} />
                        <span
                            className="whitespace-nowrap font-mono text-[11px] min-[1200px]:text-xs uppercase tracking-[0.08em]"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {name}
                        </span>
                    </Link>

                    {/* Index nav — number (secondary, mono) + label (primary
                        typeface). Active state is a thin cold-blue line that
                        slides between links via layoutId, never a pill or a
                        glow. */}
                    <div className="hidden min-[1200px]:flex items-center gap-1 col-start-2 justify-self-center">
                        {NAV_LINKS.map(({ href, label, number }) => {
                            const id = href.split("#")[1];
                            const active = pathname === "/" && activeSection === id;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="group relative flex items-center gap-2 px-4 py-2 text-body"
                                >
                                    <span
                                        className="index-mark text-[10px] transition-colors duration-200"
                                        style={{
                                            color: active
                                                ? "var(--accent)"
                                                : "var(--text-tertiary)",
                                        }}
                                    >
                                        {number}
                                    </span>
                                    <span
                                        className="inline-block transition-transform duration-200 ease-out group-hover:-translate-y-px"
                                        style={{
                                            color: active
                                                ? "var(--text-primary)"
                                                : "var(--text-secondary)",
                                            fontWeight: active ? 500 : 400,
                                        }}
                                    >
                                        {label}
                                    </span>
                                    {active ? (
                                        <motion.span
                                            layoutId="nav-active-line"
                                            className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px"
                                            style={{ background: "var(--accent)" }}
                                            transition={{ duration: 0.35, ease: EASE_OUT }}
                                        />
                                    ) : (
                                        <span
                                            className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                                            style={{
                                                background:
                                                    "color-mix(in srgb, var(--accent) 55%, transparent)",
                                            }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Instrument cluster — theme toggle, the one CTA.
                        Hamburger takes over below 1200px so labels never
                        have to shrink to fit. */}
                    <div className="flex items-center gap-3 col-start-3 justify-self-end">
                        <div className="hidden min-[1200px]:flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                                }
                                className="flex items-center justify-center w-8 h-8 rounded-sm text-(--text-secondary) transition-colors duration-200 hover:text-(--text-primary)"
                                aria-label={
                                    isLight ? "Switch to dark theme" : "Switch to light theme"
                                }
                            >
                                {isLight ? (
                                    <Moon className="w-3.5 h-3.5" />
                                ) : (
                                    <Sun className="w-3.5 h-3.5" />
                                )}
                            </button>
                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/resume inline-flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 font-mono text-xs tracking-wide text-accent transition-colors duration-200 hover:bg-(--accent-glow)"
                                    style={{
                                        border:
                                            "1px solid color-mix(in srgb, var(--accent) 38%, var(--border-strong))",
                                    }}
                                >
                                    Resume
                                    <span className="inline-block transition-transform duration-200 group-hover/resume:translate-x-0.5 group-hover/resume:-translate-y-0.5">
                                        ↗
                                    </span>
                                </a>
                            )}
                        </div>

                        {/* Hamburger — sub-1200px only, 44×44 minimum tap target */}
                        <button
                            ref={menuButtonRef}
                            type="button"
                            className="min-[1200px]:hidden relative z-10 flex items-center justify-center rounded-md"
                            style={{
                                width: "44px",
                                height: "44px",
                                background: "transparent",
                                border: "1px solid transparent",
                                WebkitTapHighlightColor: "transparent",
                                cursor: "pointer",
                            }}
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-nav-panel"
                        >
                            {/* Pure CSS hamburger — no JS animation libs, works before hydration */}
                            <span className="flex flex-col gap-1.25 pointer-events-none w-5">
                                <span
                                    className="block h-[1.5px] w-5 rounded-full origin-center"
                                    style={{
                                        background: "var(--text-primary)",
                                        transform: menuOpen
                                            ? "translateY(6.5px) rotate(45deg)"
                                            : "none",
                                        transition: "transform 0.25s ease",
                                    }}
                                />
                                <span
                                    className="block h-[1.5px] w-5 rounded-full origin-center"
                                    style={{
                                        background: "var(--text-primary)",
                                        opacity: menuOpen ? 0 : 1,
                                        transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
                                        transition: "opacity 0.2s ease, transform 0.2s ease",
                                    }}
                                />
                                <span
                                    className="block h-[1.5px] w-5 rounded-full origin-center"
                                    style={{
                                        background: "var(--text-primary)",
                                        transform: menuOpen
                                            ? "translateY(-6.5px) rotate(-45deg)"
                                            : "none",
                                        transition: "transform 0.25s ease",
                                    }}
                                />
                            </span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* ── Mobile / tablet menu — a full-screen cinematic overlay
                below 1200px, not a compressed desktop bar. Fade/slide
                entrance, a manual focus trap (Escape closes, Tab wraps
                within the panel, focus returns to the trigger button on
                close — see the effect above), restrained easing
                throughout, no spring, no bounce. ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        id="mobile-nav-panel"
                        ref={menuPanelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site navigation"
                        className="fixed inset-0 z-50 flex flex-col overflow-hidden min-[1200px]:hidden"
                        style={{ background: "var(--bg-primary)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                    >
                        <GridFragment className="-top-12 -right-12 -z-10" size={280} />
                        <div
                            className="pointer-events-none absolute inset-0 -z-10"
                            style={{
                                background:
                                    "radial-gradient(640px circle at 88% 8%, var(--accent-glow), transparent 62%)",
                            }}
                            aria-hidden
                        />

                        {/* Panel header */}
                        <div
                            className="flex items-center justify-between px-6 h-16 shrink-0 border-b"
                            style={{ borderColor: "var(--line)" }}
                        >
                            <span
                                className="font-mono text-eyebrow uppercase"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                {"// menu"}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTheme(
                                            resolvedTheme === "dark" ? "light" : "dark",
                                        )
                                    }
                                    className="flex items-center justify-center rounded-md"
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        color: "var(--text-secondary)",
                                    }}
                                    aria-label={
                                        isLight
                                            ? "Switch to dark theme"
                                            : "Switch to light theme"
                                    }
                                >
                                    {isLight ? (
                                        <Moon className="h-4 w-4" />
                                    ) : (
                                        <Sun className="h-4 w-4" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center rounded-md"
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        color: "var(--text-primary)",
                                    }}
                                    aria-label="Close menu"
                                >
                                    <span className="relative block h-4 w-4">
                                        <span
                                            className="absolute top-1/2 left-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                            style={{
                                                background: "currentColor",
                                                transform: "translate(-50%, -50%) rotate(45deg)",
                                            }}
                                        />
                                        <span
                                            className="absolute top-1/2 left-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                            style={{
                                                background: "currentColor",
                                                transform: "translate(-50%, -50%) rotate(-45deg)",
                                            }}
                                        />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-10 pb-8">
                            {/* Wordmark */}
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 }}
                            >
                                <Logo size={30} />
                                <span
                                    className="font-display text-h2 uppercase"
                                    style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                                >
                                    {name}
                                </span>
                            </motion.div>

                            {/* Nav links — large, monospace-numbered, one per
                                row. Each row's number+label reveal together,
                                then its separator draws in — see the
                                variants above. */}
                            <motion.div
                                className="mt-10 flex flex-col"
                                variants={rowContainerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {NAV_LINKS.map(({ href, label, number }) => {
                                    const id = href.split("#")[1];
                                    const active = pathname === "/" && activeSection === id;
                                    return (
                                        <motion.div
                                            key={href}
                                            variants={{ hidden: {}, visible: {} }}
                                            className="relative"
                                        >
                                            <Link
                                                href={href}
                                                onClick={() => setMenuOpen(false)}
                                                className="group block py-4"
                                            >
                                                <motion.span
                                                    variants={contentVariants}
                                                    className="flex items-baseline gap-5"
                                                >
                                                    <span
                                                        className="index-mark text-sm"
                                                        style={{
                                                            color: active
                                                                ? "var(--accent)"
                                                                : "var(--text-tertiary)",
                                                        }}
                                                    >
                                                        {number}
                                                    </span>
                                                    <span
                                                        className="text-h2 font-display uppercase transition-colors duration-200"
                                                        style={{
                                                            letterSpacing: "-0.02em",
                                                            color: active
                                                                ? "var(--text-primary)"
                                                                : "var(--text-secondary)",
                                                        }}
                                                    >
                                                        {label}
                                                    </span>
                                                </motion.span>
                                            </Link>
                                            <motion.span
                                                variants={lineVariants}
                                                className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left"
                                                style={{
                                                    background: active
                                                        ? "var(--accent)"
                                                        : "var(--line-hairline)",
                                                }}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </motion.div>

                            {/* Divider, then Resume first (the one CTA),
                                followed by whatever social links are
                                actually configured in the CMS. */}
                            <motion.div
                                className="mt-auto flex flex-col pt-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.85, duration: 0.3, ease: EASE_OUT }}
                            >
                                <div
                                    className="mb-6 h-px w-full"
                                    style={{ background: "var(--line)" }}
                                    aria-hidden
                                />

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                    {resumeUrl && (
                                        <a
                                            href={resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono text-body uppercase tracking-wide transition-colors hover:text-[var(--accent-on-canvas)]"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            Resume ↗
                                        </a>
                                    )}
                                    {menuLinks.map((link) => (
                                        <a
                                            key={link.platform}
                                            href={link.url}
                                            target={
                                                link.platform === "Email" ? undefined : "_blank"
                                            }
                                            rel={
                                                link.platform === "Email"
                                                    ? undefined
                                                    : "noopener noreferrer"
                                            }
                                            className="font-mono text-body uppercase tracking-wide transition-colors hover:text-[var(--accent-on-canvas)]"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            {link.platform}
                                            {link.platform !== "Email" ? " ↗" : ""}
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

"use client";

import { StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import { GridFragment } from "@/components/shared/TechnicalMotifs";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { AnimatePresence, motion } from "framer-motion";
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

// `mobileLabel` lets the full-screen mobile menu say "Work" (language the
// Projects section's own eyebrow already uses — "Selected work") while the
// desktop bar keeps "Projects", without a second parallel data source.
const NAV_LINKS = [
    { href: "/#projects", label: "Projects", mobileLabel: "Work", number: "01" },
    { href: "/#experience", label: "Experience", number: "02" },
    { href: "/#stack", label: "Stack", number: "03" },
    { href: "/#exploring", label: "Exploring", number: "04" },
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

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
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

    return (
        <>
            {/* ── Top bar ── */}
            <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
                <nav
                    className="pointer-events-auto w-full max-w-4xl flex items-center justify-between h-11 px-4 rounded-md transition-all duration-300"
                    style={{
                        background:
                            scrolled || menuOpen
                                ? "color-mix(in srgb, var(--bg-primary) 78%, transparent)"
                                : "color-mix(in srgb, var(--bg-primary) 46%, transparent)",
                        backdropFilter: "blur(14px)",
                        border: "1px solid var(--border-strong)",
                        boxShadow: scrolled ? "var(--shadow-sm)" : "var(--shadow-xs)",
                    }}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-sm font-medium z-10"
                        style={{ color: "var(--text-primary)" }}
                    >
                        <span
                            className="w-6 h-6 rounded flex items-center justify-center font-mono text-[11px] shrink-0"
                            style={{
                                border: "1px solid var(--border-strong)",
                                color: "var(--accent)",
                            }}
                        >
                            S
                        </span>
                        Sajjadul Islam
                    </Link>

                    {/* Desktop nav — index number + label; a thin underline is the
                        only active indicator, no filled pill. */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ href, label, number }) => {
                            const active =
                                pathname === "/" &&
                                activeSection === href.split("#")[1];
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="group relative flex items-center gap-1.5 px-3 py-1.5 text-sm"
                                >
                                    <span
                                        className="index-mark text-[10px]"
                                        style={{
                                            color: active
                                                ? "var(--accent)"
                                                : "var(--text-secondary)",
                                        }}
                                    >
                                        {number}
                                    </span>
                                    <span
                                        style={{
                                            color: active
                                                ? "var(--text-primary)"
                                                : "var(--text-secondary)",
                                        }}
                                    >
                                        {label}
                                    </span>
                                    {/* Small active indicator — a thin underline with a
                                        faint glow, still no filled pill. */}
                                    <span
                                        className={`absolute inset-x-3 -bottom-px h-[1.5px] transition-opacity duration-300 ${
                                            active
                                                ? "opacity-100"
                                                : "opacity-0 group-hover:opacity-50"
                                        }`}
                                        style={{
                                            background: "var(--accent)",
                                            boxShadow: active
                                                ? "0 0 4px var(--accent-glow)"
                                                : "none",
                                        }}
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop right side — thin-bordered ghost controls, no filled
                        backgrounds. */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                setTheme(
                                    resolvedTheme === "dark" ? "light" : "dark",
                                )
                            }
                            className="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
                            style={{
                                border: "1px solid var(--border-strong)",
                                color: "var(--text-secondary)",
                            }}
                            aria-label={
                                isLight
                                    ? "Switch to dark theme"
                                    : "Switch to light theme"
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
                                className="px-3 py-1.5 rounded-md font-mono text-xs transition-opacity hover:opacity-80"
                                style={{
                                    border: "1px solid var(--border-strong)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                Resume ↗
                            </a>
                        )}
                    </div>

                    {/* Hamburger — mobile only, 44×44 minimum tap target */}
                    <button
                        ref={menuButtonRef}
                        type="button"
                        className="md:hidden relative z-10 flex items-center justify-center rounded-md"
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
                                    transform: menuOpen
                                        ? "scaleX(0)"
                                        : "scaleX(1)",
                                    transition:
                                        "opacity 0.2s ease, transform 0.2s ease",
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
                </nav>
            </header>

            {/* ── Mobile menu — a full-screen cinematic overlay, not a side
                drawer. Fade/slide entrance, staggered items, a manual focus
                trap (Escape closes, Tab wraps within the panel, focus
                returns to the trigger button on close — see the effect
                above), restrained easing throughout, no spring. ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        ref={menuPanelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site navigation"
                        className="fixed inset-0 z-50 flex flex-col overflow-hidden md:hidden"
                        style={{ background: "var(--bg-primary)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                    >
                        <GridFragment className="-top-12 -right-12 -z-10" size={280} />

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
                            <motion.span
                                className="font-display text-h2 uppercase"
                                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 }}
                            >
                                {name}
                            </motion.span>

                            {/* Nav links — large, monospace-numbered, one per row */}
                            <StaggerContainer className="mt-10 flex flex-col" staggerDelay={0.06}>
                                {NAV_LINKS.map(({ href, label, mobileLabel, number }) => {
                                    const active =
                                        pathname === "/" &&
                                        activeSection === href.split("#")[1];
                                    return (
                                        <StaggerItem key={href}>
                                            <Link
                                                href={href}
                                                onClick={() => setMenuOpen(false)}
                                                className="group flex items-baseline gap-5 border-b py-4 transition-colors"
                                                style={{ borderColor: "var(--line-hairline)" }}
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
                                                    {mobileLabel ?? label}
                                                </span>
                                            </Link>
                                        </StaggerItem>
                                    );
                                })}
                            </StaggerContainer>

                            {/* Divider, then real social links (not every
                                route, just what's actually configured) */}
                            <motion.div
                                className="mt-auto flex flex-col pt-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25, duration: 0.3, ease: EASE_OUT }}
                            >
                                <div
                                    className="mb-6 h-px w-full"
                                    style={{ background: "var(--line)" }}
                                    aria-hidden
                                />

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
                                        </a>
                                    ))}
                                    {resumeUrl && (
                                        <a
                                            href={resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono text-body uppercase tracking-wide transition-colors hover:text-[var(--accent-on-canvas)]"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            Resume ↗
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

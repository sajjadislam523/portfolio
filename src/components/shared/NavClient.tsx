"use client";

import { StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

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

const NAV_LINKS = [
    { href: "/#projects", label: "Projects", number: "01" },
    { href: "/#experience", label: "Experience", number: "02" },
    { href: "/#stack", label: "Stack", number: "03" },
    { href: "/#contact", label: "Contact", number: "04" },
];

interface NavClientProps {
    availableForWork: boolean;
    resumeUrl: string;
}

export function NavClient({ availableForWork, resumeUrl }: NavClientProps) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const { resolvedTheme, setTheme } = useTheme();
    const isLight = useHasMounted() && resolvedTheme === "light";

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
                        backgrounds; "Available" is a status dot, not a badge. */}
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
                        {availableForWork && (
                            <div
                                className="flex items-center gap-1.5 font-mono text-xs"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{
                                        background: "var(--accent)",
                                        boxShadow: "0 0 6px var(--accent-glow)",
                                    }}
                                />
                                Available
                            </div>
                        )}
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

            {/* ── Mobile menu — mounted only while open, animated via framer-motion ── */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background:
                                    "color-mix(in srgb, var(--bg-primary) 50%, transparent)",
                                backdropFilter: "blur(4px)",
                            }}
                            onClick={() => setMenuOpen(false)}
                        />

                        {/* Slide-in panel */}
                        <motion.div
                            className="fixed top-0 right-0 bottom-0 z-50 md:hidden flex flex-col w-70"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            style={{
                                background: "var(--bg-secondary)",
                                borderLeft: "1px solid var(--border)",
                            }}
                        >
                            {/* Panel header */}
                            <div
                                className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    Menu
                                </span>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                    style={{
                                        background: "var(--bg-subtle)",
                                        color: "var(--text-tertiary)",
                                    }}
                                    aria-label="Close menu"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Nav links */}
                            <StaggerContainer
                                className="flex flex-col px-4 pt-6 flex-1 gap-1"
                                staggerDelay={0.05}
                            >
                                {NAV_LINKS.map(({ href, label, number }) => {
                                    const active =
                                        pathname === "/" &&
                                        activeSection === href.split("#")[1];
                                    return (
                                        <StaggerItem key={href}>
                                            {/* Left accent tick — the same restrained active
                                                indicator as the desktop underline, not a
                                                filled highlight box. */}
                                            <Link
                                                href={href}
                                                className="flex items-center justify-between px-4 py-3.5 transition-colors"
                                                style={{
                                                    borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                                                    background: active
                                                        ? "var(--bg-subtle)"
                                                        : "transparent",
                                                }}
                                            >
                                                <span
                                                    className="text-base font-medium"
                                                    style={{
                                                        color: active
                                                            ? "var(--text-primary)"
                                                            : "var(--text-secondary)",
                                                    }}
                                                >
                                                    {label}
                                                </span>
                                                <span
                                                    className="index-mark text-xs"
                                                    style={{
                                                        color: active
                                                            ? "var(--accent)"
                                                            : "var(--text-tertiary)",
                                                    }}
                                                >
                                                    {number}
                                                </span>
                                            </Link>
                                        </StaggerItem>
                                    );
                                })}
                            </StaggerContainer>

                            {/* Panel footer */}
                            <motion.div
                                className="px-6 pb-8 pt-4 flex flex-col gap-3 border-t"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.2 }}
                                style={{ borderColor: "var(--border)" }}
                            >
                                {availableForWork && (
                                    <div
                                        className="flex items-center gap-2 font-mono text-xs w-fit"
                                        style={{ color: "var(--text-tertiary)" }}
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                                            style={{
                                                background: "var(--accent)",
                                                boxShadow: "0 0 6px var(--accent-glow)",
                                            }}
                                        />
                                        Open to opportunities
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTheme(
                                            resolvedTheme === "dark"
                                                ? "light"
                                                : "dark",
                                        )
                                    }
                                    className="flex items-center gap-2 px-4 py-3 rounded-md text-sm transition-colors w-fit"
                                    style={{
                                        border: "1px solid var(--border)",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    {isLight ? (
                                        <Moon className="w-3.5 h-3.5" />
                                    ) : (
                                        <Sun className="w-3.5 h-3.5" />
                                    )}
                                    {isLight ? "Dark theme" : "Light theme"}
                                </button>
                                {resumeUrl && (
                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between px-4 py-3 rounded-md text-sm transition-colors"
                                        style={{
                                            border: "1px solid var(--border)",
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        Download Resume
                                        <span style={{ color: "var(--accent)" }}>
                                            ↗
                                        </span>
                                    </a>
                                )}
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

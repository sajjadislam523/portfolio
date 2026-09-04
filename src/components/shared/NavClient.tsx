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
                    className="pointer-events-auto w-full max-w-4xl flex items-center justify-between h-12 px-4 rounded-2xl transition-all duration-300"
                    style={{
                        background:
                            scrolled || menuOpen
                                ? "color-mix(in srgb, var(--bg-primary) 88%, transparent)"
                                : "color-mix(in srgb, var(--bg-primary) 60%, transparent)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid var(--border)",
                        boxShadow: scrolled
                            ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px var(--border)"
                            : "0 2px 12px rgba(0,0,0,0.2)",
                    }}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-sm font-medium z-10"
                        style={{ color: "var(--text-primary)" }}
                    >
                        <span
                            className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                                background: "var(--accent)",
                                color: "var(--accent-foreground)",
                            }}
                        >
                            S
                        </span>
                        Sajjadul Islam
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ href, label }) => {
                            const active =
                                pathname === "/" &&
                                activeSection === href.split("#")[1];
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                        active
                                            ? ""
                                            : "hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                                    }`}
                                    style={{
                                        color: active
                                            ? "var(--text-primary)"
                                            : "var(--text-tertiary)",
                                        background: active
                                            ? "var(--bg-elevated)"
                                            : "transparent",
                                    }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop right side */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                setTheme(
                                    resolvedTheme === "dark" ? "light" : "dark",
                                )
                            }
                            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                            style={{
                                background: "var(--bg-elevated)",
                                border: "1px solid var(--border)",
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
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                                style={{
                                    background:
                                        "color-mix(in srgb, var(--accent) 10%, transparent)",
                                    border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                                    color: "var(--accent)",
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                                Available
                            </div>
                        )}
                        {resumeUrl && (
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                                style={{
                                    background: "var(--bg-elevated)",
                                    border: "1px solid var(--border)",
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
                        className="md:hidden relative z-10 flex items-center justify-center rounded-lg"
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
                                            <Link
                                                href={href}
                                                className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors group"
                                                style={{
                                                    background: active
                                                        ? "var(--accent-glow)"
                                                        : "transparent",
                                                    border: `1px solid ${active ? "var(--border-strong)" : "transparent"}`,
                                                }}
                                            >
                                                <span
                                                    className="text-base font-medium"
                                                    style={{
                                                        color: active
                                                            ? "var(--accent)"
                                                            : "var(--text-primary)",
                                                    }}
                                                >
                                                    {label}
                                                </span>
                                                <span
                                                    className="text-xs font-mono"
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
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs w-fit"
                                        style={{
                                            background:
                                                "color-mix(in srgb, var(--accent) 8%, transparent)",
                                            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                                            color: "var(--accent)",
                                        }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
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
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-colors w-fit"
                                    style={{
                                        background: "var(--bg-elevated)",
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
                                        className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors"
                                        style={{
                                            background: "var(--bg-elevated)",
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

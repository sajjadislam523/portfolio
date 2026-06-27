"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
    { href: "/projects", label: "Projects", number: "01" },
    { href: "/experience", label: "Experience", number: "02" },
    { href: "/stack", label: "Stack", number: "03" },
    { href: "/contact", label: "Contact", number: "04" },
];

interface NavClientProps {
    availableForWork: boolean;
    resumeUrl: string;
}

export function NavClient({ availableForWork, resumeUrl }: NavClientProps) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

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
                                ? "rgba(10,10,11,0.88)"
                                : "rgba(10,10,11,0.6)",
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
                                pathname === href ||
                                pathname.startsWith(href + "/");
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="px-3 py-1.5 rounded-lg text-sm transition-colors"
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
                        {availableForWork && (
                            <div
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                                style={{
                                    background: "rgba(34,197,94,0.1)",
                                    border: "1px solid rgba(34,197,94,0.25)",
                                    color: "#22C55E",
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
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

            {/* ── Mobile menu — always in DOM, toggled via CSS transform ── */}
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 md:hidden transition-all duration-300"
                style={{
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                    opacity: menuOpen ? 1 : 0,
                    pointerEvents: menuOpen ? "auto" : "none",
                }}
                onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in panel */}
            <div
                className="fixed top-0 right-0 bottom-0 z-50 md:hidden flex flex-col w-70"
                style={{
                    background: "var(--bg-secondary)",
                    borderLeft: "1px solid var(--border)",
                    transform: menuOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    willChange: "transform",
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
                <nav className="flex flex-col px-4 pt-6 flex-1 gap-1">
                    {NAV_LINKS.map(({ href, label, number }, idx) => {
                        const active =
                            pathname === href ||
                            pathname.startsWith(href + "/");
                        return (
                            <div
                                key={href}
                                style={{
                                    opacity: menuOpen ? 1 : 0,
                                    transform: menuOpen
                                        ? "translateX(0)"
                                        : "translateX(20px)",
                                    transition: `opacity 0.25s ease ${0.05 + idx * 0.05}s, transform 0.25s ease ${0.05 + idx * 0.05}s`,
                                }}
                            >
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
                            </div>
                        );
                    })}
                </nav>

                {/* Panel footer */}
                <div
                    className="px-6 pb-8 pt-4 flex flex-col gap-3 border-t"
                    style={{
                        borderColor: "var(--border)",
                        opacity: menuOpen ? 1 : 0,
                        transition: "opacity 0.25s ease 0.25s",
                    }}
                >
                    {availableForWork && (
                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs w-fit"
                            style={{
                                background: "rgba(34,197,94,0.08)",
                                border: "1px solid rgba(34,197,94,0.2)",
                                color: "#22C55E",
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                            Open to opportunities
                        </div>
                    )}
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
                            <span style={{ color: "var(--accent)" }}>↗</span>
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}

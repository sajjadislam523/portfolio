"use client";

import { updateActiveTheme } from "@/features/settings/actions";
import { applyThemeToDOM, THEME_LABELS, THEME_NAMES } from "@/lib/themes/utils";
import type { ThemeName } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
    Briefcase,
    FileText,
    FolderKanban,
    Home,
    Mail,
    Search,
    Sun,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Command {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
    action: () => void;
    group: string;
}

export function CommandPalette({ resumeUrl }: { resumeUrl?: string }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIdx, setSelectedIdx] = useState(0);
    const router = useRouter();

    const navigate = useCallback(
        (path: string) => {
            setOpen(false);
            router.push(path);
        },
        [router],
    );

    const commands: Command[] = [
        {
            id: "home",
            label: "Home",
            group: "Navigate",
            icon: <Home className="w-4 h-4" />,
            action: () => navigate("/"),
        },
        {
            id: "projects",
            label: "Projects",
            group: "Navigate",
            icon: <FolderKanban className="w-4 h-4" />,
            action: () => navigate("/projects"),
        },
        {
            id: "experience",
            label: "Experience",
            group: "Navigate",
            icon: <Briefcase className="w-4 h-4" />,
            action: () => navigate("/experience"),
        },
        {
            id: "stack",
            label: "Stack",
            group: "Navigate",
            icon: <Zap className="w-4 h-4" />,
            action: () => navigate("/stack"),
        },
        {
            id: "contact",
            label: "Contact",
            group: "Navigate",
            icon: <Mail className="w-4 h-4" />,
            action: () => navigate("/contact"),
        },
        ...(resumeUrl
            ? [
                  {
                      id: "resume",
                      label: "Download Resume",
                      group: "Actions",
                      icon: <FileText className="w-4 h-4" />,
                      action: () => {
                          setOpen(false);
                          window.open(resumeUrl, "_blank");
                      },
                  },
              ]
            : []),
        ...THEME_NAMES.map((theme) => ({
            id: `theme-${theme}`,
            label: `${THEME_LABELS[theme]} theme`,
            group: "Theme",
            icon: <Sun className="w-4 h-4" />,
            action: () => {
                setOpen(false);
                applyThemeToDOM(theme as ThemeName);
                void updateActiveTheme(theme);
            },
        })),
    ];

    const filtered = query.trim()
        ? commands.filter(
              (c) =>
                  c.label.toLowerCase().includes(query.toLowerCase()) ||
                  c.group.toLowerCase().includes(query.toLowerCase()),
          )
        : commands;

    const clampedIdx = Math.min(selectedIdx, Math.max(0, filtered.length - 1));

    // Keyboard shortcut
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((v) => !v);
                setQuery("");
            }
            if (!open) return;
            if (e.key === "Escape") {
                setOpen(false);
                setQuery("");
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIdx((i) => Math.max(i - 1, 0));
            }
            if (e.key === "Enter" && filtered[clampedIdx]) {
                filtered[clampedIdx].action();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, filtered, selectedIdx, clampedIdx]);

    // Group commands for display
    const groups = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
        if (!acc[cmd.group]) acc[cmd.group] = [];
        acc[cmd.group].push(cmd);
        return acc;
    }, {});

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-100"
                        style={{
                            background: "rgba(0,0,0,0.6)",
                            backdropFilter: "blur(4px)",
                        }}
                        onClick={() => setOpen(false)}
                    />

                    {/* Palette */}
                    <motion.div
                        key="palette"
                        initial={{ opacity: 0, scale: 0.97, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -8 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                        }}
                        className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-101 w-full max-w-md rounded-xl overflow-hidden shadow-2xl"
                        style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-strong)",
                        }}
                    >
                        {/* Search input */}
                        <div
                            className="flex items-center gap-3 px-4 py-3 border-b"
                            style={{ borderColor: "var(--border)" }}
                        >
                            <Search
                                className="w-4 h-4 shrink-0"
                                style={{ color: "var(--text-tertiary)" }}
                            />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type a command or search…"
                                className="flex-1 bg-transparent text-sm outline-none"
                                style={{ color: "var(--text-primary)" }}
                            />
                            <kbd
                                className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono"
                                style={{
                                    background: "var(--bg-subtle)",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-tertiary)",
                                }}
                            >
                                esc
                            </kbd>
                        </div>

                        {/* Results */}
                        <div className="py-2 max-h-72 overflow-y-auto">
                            {filtered.length === 0 ? (
                                <p
                                    className="px-4 py-6 text-center text-sm"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    No results for &quot;{query}&quot;
                                </p>
                            ) : (
                                Object.entries(groups).map(([group, cmds]) => (
                                    <div key={group}>
                                        <p
                                            className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider"
                                            style={{
                                                color: "var(--text-tertiary)",
                                            }}
                                        >
                                            {group}
                                        </p>
                                        {cmds.map((cmd) => {
                                            const globalIdx =
                                                filtered.indexOf(cmd);
                                            const isActive =
                                                globalIdx === clampedIdx;
                                            return (
                                                <button
                                                    key={cmd.id}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                                                    style={{
                                                        background: isActive
                                                            ? "var(--accent-glow)"
                                                            : "transparent",
                                                        color: isActive
                                                            ? "var(--accent)"
                                                            : "var(--text-secondary)",
                                                    }}
                                                    onMouseEnter={() =>
                                                        setSelectedIdx(
                                                            globalIdx,
                                                        )
                                                    }
                                                    onClick={cmd.action}
                                                >
                                                    <span
                                                        style={{
                                                            color: isActive
                                                                ? "var(--accent)"
                                                                : "var(--text-tertiary)",
                                                        }}
                                                    >
                                                        {cmd.icon}
                                                    </span>
                                                    {cmd.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer hint */}
                        <div
                            className="flex items-center justify-between px-4 py-2 border-t"
                            style={{
                                borderColor: "var(--border)",
                                background: "var(--bg-secondary)",
                            }}
                        >
                            <span
                                className="text-xs"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                ↑↓ navigate · ↵ select
                            </span>
                            <span
                                className="text-xs"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                ⌘K to close
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

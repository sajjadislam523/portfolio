"use client";

import { cn } from "@/lib/utils";
import {
    Award,
    Briefcase,
    Compass,
    ExternalLink,
    FileText,
    FolderKanban,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Navigation as NavigationIcon,
    Search,
    Settings,
    Share2,
    User,
    X,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface NavItem {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
}

interface NavGroup {
    label: string | null;
    items: NavItem[];
}

// Grouped IA — Dashboard stands alone, then Content / Media / Site / System.
// Certifications and Messages aren't part of the requested groups but are
// kept (not hidden) since they're real existing content-management
// features — Certifications reads as content, Messages as an operational
// system inbox.
const NAV_GROUPS: NavGroup[] = [
    { label: null, items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
    {
        label: "Content",
        items: [
            { href: "/admin/profile", label: "Profile", icon: User },
            { href: "/admin/hero", label: "Hero", icon: Zap },
            { href: "/admin/projects", label: "Projects", icon: FolderKanban },
            { href: "/admin/experience", label: "Experience", icon: Briefcase },
            { href: "/admin/skills", label: "Stack", icon: Zap },
            { href: "/admin/exploring", label: "Currently Exploring", icon: Compass },
            { href: "/admin/certifications", label: "Certifications", icon: Award },
        ],
    },
    {
        label: "Media",
        items: [
            { href: "/admin/media", label: "Files", icon: ImageIcon },
            { href: "/admin/resume", label: "Resume", icon: FileText },
        ],
    },
    {
        label: "Site",
        items: [
            { href: "/admin/navigation", label: "Navigation", icon: NavigationIcon },
            { href: "/admin/social-links", label: "Social Links", icon: Share2 },
            { href: "/admin/seo", label: "SEO", icon: Search },
        ],
    },
    {
        label: "System",
        items: [
            { href: "/admin/messages", label: "Messages", icon: MessageSquare },
            { href: "/admin/settings", label: "Settings", icon: Settings },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        toast.success("Logged out");
        router.push("/admin/login");
        router.refresh();
    }

    // Close the drawer on route change, lock body scroll while open.
    // Deferred via setTimeout (same pattern as NavClient's mobile menu) —
    // avoids a synchronous setState-in-effect on every pathname change,
    // including the initial mount.
    const prevPathname = useRef(pathname);
    useEffect(() => {
        if (prevPathname.current === pathname) return;
        prevPathname.current = pathname;
        const t = setTimeout(() => setMobileOpen(false), 0);
        return () => clearTimeout(t);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    useEffect(() => {
        if (!mobileOpen) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setMobileOpen(false);
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [mobileOpen]);

    const content = (
        <>
            {/* Brand */}
            <div
                className="flex h-14 items-center justify-between gap-2.5 border-b px-4"
                style={{ borderColor: "var(--border)" }}
            >
                <div className="flex items-center gap-2.5">
                    <div
                        className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
                        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
                    >
                        S
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        Portfolio CMS
                    </span>
                </div>
                <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md p-1 lg:hidden"
                    style={{ color: "var(--text-tertiary)" }}
                    aria-label="Close menu"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-2">
                {NAV_GROUPS.map((group, gi) => (
                    <div key={gi} className="flex flex-col gap-0.5">
                        {group.label && (
                            <span
                                className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                {group.label}
                            </span>
                        )}
                        {group.items.map(({ href, label, icon: Icon }) => {
                            const active =
                                pathname === href ||
                                (href !== "/admin/dashboard" && pathname.startsWith(href));
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                                        active ? "font-medium" : "hover:opacity-100",
                                    )}
                                    style={{
                                        background: active ? "var(--accent-glow)" : "transparent",
                                        color: active ? "var(--accent)" : "var(--text-secondary)",
                                        border: active
                                            ? "1px solid var(--border-strong)"
                                            : "1px solid transparent",
                                    }}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div
                className="flex flex-col gap-0.5 border-t p-2"
                style={{ borderColor: "var(--border)" }}
            >
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    View site
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sign out
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile trigger — overlaps the topbar's left side, lg:hidden */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed left-4 top-3 z-40 flex h-8 w-8 items-center justify-center rounded-md lg:hidden"
                style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-secondary)",
                }}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
            >
                <Menu className="h-4 w-4" />
            </button>

            {/* Desktop — always-visible fixed column */}
            <aside
                className="hidden h-full w-56 shrink-0 flex-col overflow-y-auto border-r lg:flex"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
            >
                {content}
            </aside>

            {/* Mobile — off-canvas drawer + backdrop */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="absolute inset-0"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                        onClick={() => setMobileOpen(false)}
                        aria-hidden
                    />
                    <aside
                        className="relative flex h-full w-64 max-w-[80vw] flex-col overflow-y-auto border-r"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                    >
                        {content}
                    </aside>
                </div>
            )}
        </>
    );
}

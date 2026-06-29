"use client";

import { cn } from "@/lib/utils";
import {
    Award,
    Briefcase,
    ExternalLink,
    FolderKanban,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Palette,
    Settings,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const NAV_ITEMS = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/admin/experience", label: "Experience", icon: Briefcase },
    { href: "/admin/skills", label: "Skills", icon: Zap },
    { href: "/admin/certifications", label: "Certifications", icon: Award },
    { href: "/admin/themes", label: "Themes", icon: Palette },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        toast.success("Logged out");
        router.push("/admin/login");
        router.refresh();
    }

    return (
        <aside
            className="flex flex-col w-56 h-full shrink-0 border-r overflow-y-auto"
            style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
            }}
        >
            {/* Brand */}
            <div
                className="flex items-center gap-2.5 px-4 h-14 border-b"
                style={{ borderColor: "var(--border)" }}
            >
                <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                    style={{
                        background: "var(--accent)",
                        color: "var(--accent-foreground)",
                    }}
                >
                    S
                </div>
                <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                >
                    Portfolio CMS
                </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-0.5 p-2 flex-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active =
                        pathname === href ||
                        (href !== "/admin/dashboard" &&
                            pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                                active ? "font-medium" : "hover:opacity-100",
                            )}
                            style={{
                                background: active
                                    ? "var(--accent-glow)"
                                    : "transparent",
                                color: active
                                    ? "var(--accent)"
                                    : "var(--text-secondary)",
                                border: active
                                    ? "1px solid var(--border-strong)"
                                    : "1px solid transparent",
                            }}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div
                className="p-2 border-t flex flex-col gap-0.5"
                style={{ borderColor: "var(--border)" }}
            >
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    View site
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}

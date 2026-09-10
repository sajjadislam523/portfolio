import { AdminCard } from "@/components/admin/AdminCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireSession } from "@/features/auth/session";
import { getSiteSettings } from "@/features/settings/actions";
import { getResumeVersions } from "@/features/settings/resumeActions";
import { connectDB, Exploration } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Navigation" };

// The public nav bar's links (Projects/Experience/Stack/Exploring/Contact)
// are wired directly to real page sections in code — reordering, renaming,
// or hiding one is a code change, not content, so this page doesn't try to
// make navigation itself dynamic. What IS real data is surfaced here
// instead: the things that determine what actually shows in the nav and
// on the page right now.
export default async function AdminNavigationPage() {
    await requireSession();
    await connectDB();

    const [settings, resume, activeExploration] = await Promise.all([
        getSiteSettings(),
        getResumeVersions(),
        Exploration.findOne({ status: "active", published: { $ne: false } })
            .sort({ order: 1 })
            .lean(),
    ]);

    const activeResume = resume.versions.find((v) => v.isActive) ?? null;

    return (
        <div className="max-w-2xl">
            <PageHeader
                title="Navigation"
                description="What currently drives the public nav bar and optional sections — nav structure itself is defined in code"
            />

            <AdminCard title="Live state">
                <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
                    <Row
                        label="Resume link"
                        value={activeResume ? activeResume.label || activeResume.filename : "Not set"}
                        badge={
                            activeResume ? (
                                <StatusBadge label="Shown in nav" tone="success" />
                            ) : (
                                <StatusBadge label="Hidden" tone="neutral" />
                            )
                        }
                        href="/admin/resume"
                    />
                    <Row
                        label="Availability status"
                        value={settings?.availableForWork ? "Open to opportunities" : "Not actively looking"}
                        badge={
                            settings?.availableForWork ? (
                                <StatusBadge label="Shown" tone="success" />
                            ) : (
                                <StatusBadge label="Hidden" tone="neutral" />
                            )
                        }
                        href="/admin/hero"
                    />
                    <Row
                        label="Currently Exploring section"
                        value={
                            activeExploration
                                ? `Showing — "${activeExploration.title}"`
                                : "Hidden — no active, published exploration"
                        }
                        badge={
                            activeExploration ? (
                                <StatusBadge label="Showing" tone="success" />
                            ) : (
                                <StatusBadge label="Hidden" tone="neutral" />
                            )
                        }
                        href="/admin/exploring"
                    />
                </div>
            </AdminCard>

            <AdminCard title="Nav structure" className="mt-4">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    The nav bar&apos;s links (Projects, Experience, Stack, Exploring, Contact) are wired
                    to real sections on the single-page site and numbered in code — reordering or
                    renaming them is a code change, not something this page edits. Everything above
                    is the actual content that determines what shows.
                </p>
            </AdminCard>
        </div>
    );
}

function Row({
    label,
    value,
    badge,
    href,
}: {
    label: string;
    value: string;
    badge: React.ReactNode;
    href: string;
}) {
    return (
        <Link href={href} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 transition-opacity hover:opacity-80">
            <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {label}
                </p>
                <p className="truncate text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {value}
                </p>
            </div>
            {badge}
        </Link>
    );
}

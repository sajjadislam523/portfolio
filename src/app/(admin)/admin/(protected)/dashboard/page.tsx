import { AdminCard } from "@/components/admin/AdminCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireSession } from "@/features/auth/session";
import { getResumeVersions } from "@/features/settings/resumeActions";
import {
    connectDB,
    ContactMessage,
    Experience,
    Exploration,
    Project,
    Skill,
    SiteSettings,
} from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
    ArrowRight,
    Briefcase,
    CheckCircle,
    Clock,
    Compass,
    FolderKanban,
    MessageSquare,
    Upload,
    Zap,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

interface ActivityItem {
    label: string;
    detail: string;
    href: string;
    updatedAt: string;
}

// Runs on the server — no loading state needed, data is ready at render.
// Every number here comes straight from a real query; nothing is invented.
async function getDashboardData() {
    await connectDB();

    const [
        settingsDoc,
        publishedProjectCount,
        draftProjectCount,
        recentProjects,
        publishedExperienceCount,
        recentExperiences,
        skillCount,
        activeExplorations,
        unreadMessages,
        recentMessages,
        resume,
    ] = await Promise.all([
        SiteSettings.findOne({}).lean(),
        Project.countDocuments({ published: { $ne: false } }),
        Project.countDocuments({ published: false }),
        Project.find().sort({ updatedAt: -1 }).limit(5).select("title slug updatedAt").lean(),
        Experience.countDocuments({ published: { $ne: false } }),
        Experience.find().sort({ updatedAt: -1 }).limit(5).select("role company updatedAt").lean(),
        Skill.countDocuments({ visible: { $ne: false } }),
        Exploration.find({ status: "active" }).sort({ order: 1 }).lean(),
        ContactMessage.countDocuments({ status: "unread" }),
        ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
        getResumeVersions(),
    ]);

    const settings = settingsDoc
        ? (JSON.parse(JSON.stringify(settingsDoc)) as {
              name?: string;
              email?: string;
              bio?: string;
              location?: string;
          })
        : null;
    const missingProfileFields = ["name", "email", "bio", "location"].filter(
        (key) => !settings?.[key as keyof typeof settings],
    );

    const primaryExploration =
        activeExplorations.find((e) => e.isPrimary) ?? activeExplorations[0] ?? null;

    const activeResume = resume.versions.find((v) => v.isActive) ?? null;

    const activity: ActivityItem[] = [
        ...recentProjects.map((p) => ({
            label: p.title,
            detail: "Project updated",
            href: `/admin/projects/${p._id}`,
            updatedAt: (p as { updatedAt?: Date }).updatedAt?.toISOString() ?? "",
        })),
        ...recentExperiences.map((e) => ({
            label: `${e.role} — ${e.company}`,
            detail: "Experience updated",
            href: "/admin/experience",
            updatedAt: (e as { updatedAt?: Date }).updatedAt?.toISOString() ?? "",
        })),
    ]
        .filter((item) => item.updatedAt)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    return {
        publishedProjectCount,
        draftProjectCount,
        publishedExperienceCount,
        skillCount,
        primaryExploration,
        unreadMessages,
        recentMessages,
        activeResume,
        profileComplete: missingProfileFields.length === 0,
        missingProfileFields,
        activity,
    };
}

export default async function AdminDashboardPage() {
    await requireSession();
    const data = await getDashboardData();

    return (
        <div className="max-w-5xl">
            <PageHeader title="Dashboard" description="Overview of your portfolio content" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard label="Published projects" value={data.publishedProjectCount} icon={FolderKanban} />
                <StatCard label="Experience entries" value={data.publishedExperienceCount} icon={Briefcase} />
                <StatCard label="Technologies" value={data.skillCount} icon={Zap} />
                <StatCard
                    label="Unread messages"
                    value={data.unreadMessages}
                    icon={MessageSquare}
                    sub={data.unreadMessages > 0 ? "Needs attention" : "All caught up"}
                />
            </div>

            {/* Status overview */}
            <AdminCard title="Status" className="mt-4">
                <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
                    <StatusRow
                        label="Publishing"
                        value={`${data.publishedProjectCount} published`}
                        badge={
                            data.draftProjectCount > 0 ? (
                                <StatusBadge label={`${data.draftProjectCount} draft`} tone="neutral" />
                            ) : (
                                <StatusBadge label="All published" tone="success" />
                            )
                        }
                    />
                    <StatusRow
                        label="Profile"
                        value={
                            data.profileComplete
                                ? "All key fields filled in"
                                : `Missing: ${data.missingProfileFields.join(", ")}`
                        }
                        badge={
                            <StatusBadge
                                label={data.profileComplete ? "Complete" : "Incomplete"}
                                tone={data.profileComplete ? "success" : "accent"}
                            />
                        }
                        href="/admin/profile"
                    />
                    <StatusRow
                        label="Active resume"
                        value={
                            data.activeResume
                                ? `${data.activeResume.label || data.activeResume.filename} · ${formatDate(data.activeResume.uploadedAt)}`
                                : "No resume uploaded yet"
                        }
                        badge={
                            data.activeResume ? (
                                <StatusBadge label="Set" tone="success" />
                            ) : (
                                <StatusBadge label="Missing" tone="accent" />
                            )
                        }
                        href="/admin/resume"
                    />
                    <StatusRow
                        label="Active exploration"
                        value={data.primaryExploration ? data.primaryExploration.title : "None set"}
                        badge={
                            data.primaryExploration ? (
                                <StatusBadge label="Active" tone="success" />
                            ) : (
                                <StatusBadge label="None" tone="neutral" />
                            )
                        }
                        href="/admin/exploring"
                    />
                </div>
            </AdminCard>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Recent activity */}
                <AdminCard title="Recent activity">
                    {data.activity.length === 0 && data.recentMessages.length === 0 ? (
                        <p className="py-4 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
                            No recent activity
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {data.recentMessages.slice(0, 3).map((msg) => (
                                <Link
                                    key={String(msg._id)}
                                    href="/admin/messages"
                                    className="flex items-start gap-2.5 rounded-lg p-2.5 transition-colors"
                                    style={{ background: "var(--bg-subtle)" }}
                                >
                                    {msg.status === "unread" ? (
                                        <Clock
                                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                            style={{ color: "var(--accent)" }}
                                        />
                                    ) : (
                                        <CheckCircle
                                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                            style={{ color: "var(--text-tertiary)" }}
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <p
                                            className="truncate text-xs font-medium"
                                            style={{ color: "var(--text-primary)" }}
                                        >
                                            {msg.name} — {msg.subject}
                                        </p>
                                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                            Message received
                                        </p>
                                    </div>
                                    <span
                                        className="ml-auto shrink-0 text-xs"
                                        style={{ color: "var(--text-tertiary)" }}
                                    >
                                        {formatDate(String(msg.createdAt))}
                                    </span>
                                </Link>
                            ))}
                            {data.activity.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="flex items-start gap-2.5 rounded-lg p-2.5 transition-colors"
                                    style={{ background: "var(--bg-subtle)" }}
                                >
                                    <div className="min-w-0">
                                        <p
                                            className="truncate text-xs font-medium"
                                            style={{ color: "var(--text-primary)" }}
                                        >
                                            {item.label}
                                        </p>
                                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                            {item.detail}
                                        </p>
                                    </div>
                                    <span
                                        className="ml-auto shrink-0 text-xs"
                                        style={{ color: "var(--text-tertiary)" }}
                                    >
                                        {formatDate(item.updatedAt)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </AdminCard>

                {/* Quick actions */}
                <AdminCard title="Quick actions">
                    <div className="flex flex-col gap-2">
                        {[
                            { href: "/admin/projects/new", label: "+ New Project", icon: FolderKanban },
                            { href: "/admin/experience", label: "+ New Experience", icon: Briefcase },
                            { href: "/admin/exploring", label: "+ Update Current Focus", icon: Compass },
                            { href: "/admin/resume", label: "Upload Resume", icon: Upload },
                        ].map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors"
                                style={{
                                    background: "var(--bg-subtle)",
                                    color: "var(--text-secondary)",
                                    border: "1px solid transparent",
                                }}
                            >
                                <span className="flex items-center gap-2.5">
                                    <Icon className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                                    {label}
                                </span>
                                <ArrowRight
                                    className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                                    style={{ color: "var(--accent)" }}
                                />
                            </Link>
                        ))}
                    </div>
                </AdminCard>
            </div>
        </div>
    );
}

function StatusRow({
    label,
    value,
    badge,
    href,
}: {
    label: string;
    value: string;
    badge: React.ReactNode;
    href?: string;
}) {
    const inner = (
        <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {label}
                </p>
                <p className="truncate text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {value}
                </p>
            </div>
            {badge}
        </div>
    );
    return href ? (
        <Link href={href} className="transition-opacity hover:opacity-80">
            {inner}
        </Link>
    ) : (
        inner
    );
}

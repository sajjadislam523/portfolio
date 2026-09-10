import { cn } from "@/lib/utils";

interface AdminListRowProps {
    media?: React.ReactNode;
    primary: React.ReactNode;
    badges?: React.ReactNode;
    secondary?: React.ReactNode;
    meta?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

/** One row primitive shared by every redesigned list (Projects, Experience,
 *  Stack, Explorations, Media, Certifications) — a horizontal row on `sm+`,
 *  a stacked card on mobile, via Tailwind responsive classes on a single
 *  markup tree rather than two separate implementations. */
export function AdminListRow({
    media,
    primary,
    badges,
    secondary,
    meta,
    actions,
    className,
}: AdminListRowProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:gap-4",
                className,
            )}
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
        >
            {media && <div className="shrink-0">{media}</div>}

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className="truncate text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {primary}
                    </span>
                    {badges}
                </div>
                {secondary && (
                    <div className="mt-0.5 truncate text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {secondary}
                    </div>
                )}
            </div>

            {meta && (
                <div className="shrink-0 text-xs sm:text-right" style={{ color: "var(--text-tertiary)" }}>
                    {meta}
                </div>
            )}

            {actions && (
                <div className="flex shrink-0 items-center gap-1 sm:justify-end">{actions}</div>
            )}
        </div>
    );
}

import { cn } from "@/lib/utils";

interface AdminCardProps {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

/** Bordered rounded container — replaces the repeated ad hoc
 *  `rounded-xl border` divs hand-rolled per admin page. */
export function AdminCard({ title, action, children, className }: AdminCardProps) {
    return (
        <div
            className={cn("rounded-lg border", className)}
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
        >
            {(title || action) && (
                <div
                    className="flex items-center justify-between border-b px-4 py-3"
                    style={{ borderColor: "var(--border)" }}
                >
                    {title && (
                        <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {title}
                        </h3>
                    )}
                    {action}
                </div>
            )}
            <div className="p-4">{children}</div>
        </div>
    );
}

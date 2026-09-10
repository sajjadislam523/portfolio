import { cn } from "@/lib/utils";

type StatusTone = "accent" | "success" | "neutral" | "danger";

const TONE_STYLE: Record<StatusTone, { bg: string; color: string; border: string }> = {
    accent: { bg: "var(--accent-glow)", color: "var(--accent)", border: "var(--border-strong)" },
    success: { bg: "var(--success-glow)", color: "var(--success)", border: "var(--border)" },
    neutral: { bg: "var(--bg-subtle)", color: "var(--text-tertiary)", border: "var(--border)" },
    danger: {
        bg: "rgba(239,68,68,0.12)",
        color: "var(--destructive)",
        border: "rgba(239,68,68,0.3)",
    },
};

interface StatusBadgeProps {
    label: string;
    tone?: StatusTone;
    className?: string;
}

/** Token-based status pill — draft/published/archived, active/experimenting/
 *  completed, featured, etc. — replacing the hardcoded-hex pill styling that
 *  used to be hand-rolled per admin page. */
export function StatusBadge({ label, tone = "neutral", className }: StatusBadgeProps) {
    const s = TONE_STYLE[tone];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                className,
            )}
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
        >
            {label}
        </span>
    );
}

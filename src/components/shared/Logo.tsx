// The site's monogram — a small, deliberate identity mark (not just a
// letter dropped in a box). Two opposing corner ticks turn the badge into
// a miniature instance of the same corner-bracket motif TechnicalMotifs
// uses everywhere else, so the mark reads as part of this site's system
// rather than a generic avatar-style initial. Decorative only: pair it
// with visible text wherever it's used, hence aria-hidden.

export function Logo({
    size = 26,
    className = "",
}: {
    size?: number;
    className?: string;
}) {
    return (
        <span
            className={`relative inline-flex shrink-0 items-center justify-center font-mono font-semibold ${className}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.42,
                color: "var(--accent)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-xs)",
            }}
            aria-hidden
        >
            S
            <span
                className="absolute -left-px -top-px h-[5px] w-[5px] border-l border-t"
                style={{ borderColor: "var(--accent)" }}
            />
            <span
                className="absolute -right-px -bottom-px h-[5px] w-[5px] border-r border-b"
                style={{ borderColor: "var(--accent)" }}
            />
        </span>
    );
}

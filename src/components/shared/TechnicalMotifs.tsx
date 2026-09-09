// Blueprint/schematic decorative primitives — corner marks, coordinate tags,
// guide lines and grid fragments. These carry no content of their own: they
// sit behind or around real content (pointer-events-none, -z-10 like the
// atmospheric wash in ProjectPreview) and exist purely to reinforce the
// "engineering diagram" register of the Cinematic Technical direction.
//
// CornerMarks assumes it renders inside an ancestor carrying a `group/preview`
// class (the convention ProjectPreview already establishes) so its optional
// illuminated state can react to that same hover, rather than wiring up a
// second hover source.

interface CornerMarksProps {
    className?: string;
    /** Brighten to the accent color on the ancestor's `group/preview` hover. */
    illuminate?: boolean;
}

export function CornerMarks({ className = "", illuminate = false }: CornerMarksProps) {
    const mark = illuminate
        ? "pointer-events-none absolute h-3.5 w-3.5 transition-colors duration-500 [border-color:var(--line-strong)] group-hover/preview:[border-color:var(--accent-strong)]"
        : "pointer-events-none absolute h-3.5 w-3.5 [border-color:var(--line-strong)]";

    return (
        <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
            <span className={`${mark} -left-[7px] -top-[7px] border-l border-t`} />
            <span className={`${mark} -right-[7px] -top-[7px] border-r border-t`} />
            <span className={`${mark} -bottom-[7px] -left-[7px] border-b border-l`} />
            <span className={`${mark} -bottom-[7px] -right-[7px] border-b border-r`} />
        </div>
    );
}

export function GridFragment({
    className = "",
    size = 140,
}: {
    className?: string;
    size?: number;
}) {
    // .bg-grid's line color already sits at ~0.15 alpha (var(--border-strong))
    // — that's the ceiling for how visible a single hairline can read, so
    // there's no low "opacity" dial here layered on top of it; that only
    // multiplies an already-faint color down to nothing. The mask holds a
    // solid inner zone before fading, and the line is nudged to 1.5px, so
    // the fragment reads as a quiet grid patch rather than disappearing.
    return (
        <div
            className={`bg-grid pointer-events-none absolute ${className}`}
            style={
                {
                    width: size,
                    height: size,
                    "--grid-line-width": "1.5px",
                    maskImage:
                        "radial-gradient(circle at center, black 0%, black 40%, transparent 80%)",
                    WebkitMaskImage:
                        "radial-gradient(circle at center, black 0%, black 40%, transparent 80%)",
                } as React.CSSProperties
            }
            aria-hidden
        />
    );
}

export function GuideLine({
    orientation = "vertical",
    length,
    className = "",
}: {
    orientation?: "vertical" | "horizontal";
    length?: number | string;
    className?: string;
}) {
    const style =
        orientation === "vertical"
            ? { width: 1, height: length ?? "100%", background: "var(--line)" }
            : { height: 1, width: length ?? "100%", background: "var(--line)" };

    return (
        <div className={`pointer-events-none absolute ${className}`} style={style} aria-hidden />
    );
}

export function Crosshair({
    className = "",
    size = 14,
    color,
}: {
    className?: string;
    size?: number;
    color?: string;
}) {
    const c = color ?? "var(--line-strong)";
    return (
        <span
            className={`pointer-events-none absolute block ${className}`}
            style={{ width: size, height: size }}
            aria-hidden
        >
            <span
                className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2"
                style={{ background: c }}
            />
            <span
                className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2"
                style={{ background: c }}
            />
        </span>
    );
}

export function CoordTag({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={`pointer-events-none absolute whitespace-nowrap font-mono text-[10px] uppercase tracking-wide ${className}`}
            style={{ color: "var(--text-tertiary)" }}
            aria-hidden
        >
            {children}
        </span>
    );
}

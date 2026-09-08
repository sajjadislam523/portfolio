import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    /** Zero-padded index, e.g. "01" — matches the number already shown in NavClient's
     *  desktop/mobile nav, so the same numbering scheme reads as one system site-wide. */
    index: string;
    eyebrow: string;
    heading: string;
    /** Optional supporting copy (a paragraph, a link) rendered under the heading. */
    children?: React.ReactNode;
    className?: string;
}

/**
 * Replaces the accent-dash + uppercase-eyebrow block that used to be
 * hand-copied into every section of page.tsx. A narrow label column (index
 * number + eyebrow) sits beside the heading rather than stacked centrally
 * above it — an asymmetric split instead of a centered header, and the one
 * recurring structural motif (numbering) that ties the whole page together.
 */
export function SectionHeading({
    index,
    eyebrow,
    heading,
    children,
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 items-start gap-3 sm:grid-cols-[96px_1fr] sm:gap-8 lg:grid-cols-[140px_1fr] lg:gap-12",
                className,
            )}
        >
            <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                <span
                    className="index-mark font-display text-3xl leading-none sm:text-4xl"
                    style={{ color: "var(--text-tertiary)", opacity: 0.35 }}
                    aria-hidden
                >
                    {index}
                </span>
                <span
                    className="font-mono text-eyebrow uppercase"
                    style={{ color: "var(--accent)" }}
                >
                    {eyebrow}
                </span>
            </div>

            <div>
                <h2
                    className="m-0 text-h2 font-display"
                    style={{ color: "var(--text-primary)" }}
                >
                    {heading}
                </h2>
                {children}
            </div>
        </div>
    );
}

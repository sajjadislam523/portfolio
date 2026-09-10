// Editorial case-study block for Overview / Challenge / Solution. All three
// share one system (numbered label, mono eyebrow, subtle divider, ~70ch
// reading width) but each variant nudges composition and type weight so
// the three sections don't read as identical templates:
//   - open       (Overview)  — stacked label, generous padding, body-lg copy
//   - compact    (Challenge) — asymmetric label rail beside the copy, tighter padding
//   - emphasized (Solution)  — stacked like Overview but larger, primary-toned
//                               copy with a thin accent rule, the section's
//                               visual high point

import { ScrollReveal } from "@/components/motion/ScrollReveal";

export type CaseStudyVariant = "open" | "compact" | "emphasized";

interface CaseStudySectionProps {
    index: string;
    label: string;
    content: string;
    variant: CaseStudyVariant;
    withTopBorder: boolean;
}

export function CaseStudySection({
    index,
    label,
    content,
    variant,
    withTopBorder,
}: CaseStudySectionProps) {
    const padding = variant === "compact" ? "py-10" : "py-14";

    return (
        <>
            {withTopBorder && (
                <div className="h-px w-full" style={{ background: "var(--line)" }} aria-hidden />
            )}
            <ScrollReveal className={padding}>
                {variant === "compact" ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr] sm:gap-8">
                        <Label index={index} label={label} />
                        <p
                            className="max-w-[62ch] text-body-lg leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {content}
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="mb-5">
                            <Label index={index} label={label} />
                        </div>
                        <div
                            className={variant === "emphasized" ? "pl-5" : undefined}
                            style={
                                variant === "emphasized"
                                    ? { borderLeft: "2px solid var(--accent)" }
                                    : undefined
                            }
                        >
                            <p
                                className={
                                    variant === "emphasized"
                                        ? "max-w-[68ch] text-h4 font-display leading-relaxed"
                                        : "max-w-[70ch] text-body-lg leading-relaxed"
                                }
                                style={{
                                    color:
                                        variant === "emphasized"
                                            ? "var(--text-primary)"
                                            : "var(--text-secondary)",
                                }}
                            >
                                {content}
                            </p>
                        </div>
                    </div>
                )}
            </ScrollReveal>
        </>
    );
}

function Label({ index, label }: { index: string; label: string }) {
    return (
        <div className="flex items-baseline gap-3">
            <span className="index-mark" style={{ color: "var(--text-tertiary)" }}>
                {index}
            </span>
            <span
                className="font-mono text-eyebrow uppercase"
                style={{ color: "var(--accent)" }}
            >
                {label}
            </span>
        </div>
    );
}

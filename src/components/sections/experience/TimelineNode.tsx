"use client";

// The timeline's node — a small fade/scale entrance as it scrolls into view,
// its own "use client" island so ExperienceTimeline stays a server
// component (same pattern as TimelineLine). The current role additionally
// gets a static crosshair reticle — a signal being tracked, not decoration
// repeated on every node — plus a short leader-line stub into the content
// column, echoing a schematic callout.

import { Crosshair } from "@/components/shared/TechnicalMotifs";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { motion } from "framer-motion";

export function TimelineNode({ isCurrent }: { isCurrent: boolean }) {
    const shouldReduceMotion = useReducedMotionSafe();

    return (
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            {isCurrent && (
                <Crosshair
                    size={20}
                    color="var(--accent-strong)"
                    className="top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 opacity-40 sm:block"
                />
            )}

            <span
                className="pointer-events-none absolute top-1/2 left-full hidden h-px w-3 -translate-y-1/2 sm:block lg:w-4"
                style={{ background: "var(--line)" }}
                aria-hidden
            />

            <motion.span
                className="block h-2.5 w-2.5 rounded-full border-2 transition-colors duration-300 group-hover:[border-color:var(--accent-strong)]"
                style={
                    isCurrent
                        ? {
                              background: "var(--accent)",
                              borderColor: "var(--accent)",
                              boxShadow: "0 0 6px var(--accent-glow)",
                          }
                        : {
                              background: "transparent",
                              borderColor: "var(--line-strong)",
                          }
                }
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            />
        </span>
    );
}

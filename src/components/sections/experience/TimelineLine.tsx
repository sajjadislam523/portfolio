"use client";

// The one animated element in the timeline — a thin, low-contrast line that
// draws downward once as the section enters the viewport. Kept as its own
// "use client" island so ExperienceTimeline itself stays a server component.

import { motion, useReducedMotion } from "framer-motion";

export function TimelineLine({ className }: { className?: string }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            style={{ background: "var(--line)", transformOrigin: "top" }}
            initial={{ scaleY: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        />
    );
}

"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * A quiet scroll affordance at the foot of the hero — the one new piece of
 * motion in this pass, restrained to a slow, small vertical bob so it reads
 * as a cue, not a distraction. Kept as its own "use client" island (like
 * HeroStars) so Hero itself stays a server component.
 */
export function ScrollCue() {
    const shouldReduceMotion = useReducedMotionSafe();

    return (
        <motion.a
            href="#projects"
            className="absolute inset-x-0 bottom-6 z-10 hidden flex-col items-center gap-2 transition-opacity hover:opacity-70 sm:flex"
            style={{ color: "var(--hero-fg-faint)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            aria-label="Scroll to explore"
        >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                Scroll to explore
            </span>
            <motion.span
                animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
                <ChevronDown className="h-3.5 w-3.5" />
            </motion.span>
        </motion.a>
    );
}

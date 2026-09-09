"use client";

// A slight magnetic pull toward the cursor — capped small and spring-damped
// so it reads as "expensive," not gimmicky. The only per-item motion in the
// Contact section; everything else is a one-time entrance.

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

const PULL = 0.35; // fraction of pointer offset the button follows
const MAX_OFFSET = 8; // px — "slight", never a big yank

interface MagneticCTAProps {
    href: string;
    className?: string;
    children: ReactNode;
}

export function MagneticCTA({ href, className, children }: MagneticCTAProps) {
    const ref = useRef<HTMLAnchorElement>(null);
    const shouldReduceMotion = useReducedMotionSafe();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 20 });
    const springY = useSpring(y, { stiffness: 200, damping: 20 });

    function onPointerMove(e: React.PointerEvent<HTMLAnchorElement>) {
        if (shouldReduceMotion) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relX * PULL)));
        y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relY * PULL)));
    }

    function onPointerLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.a
            ref={ref}
            href={href}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            style={{ x: springX, y: springY }}
            className={className}
        >
            {children}
        </motion.a>
    );
}

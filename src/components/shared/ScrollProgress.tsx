"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-[100] origin-left"
            style={{
                height: "2px",
                background: "var(--accent)",
                scaleX,
            }}
        />
    );
}

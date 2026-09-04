"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = [
    "Product-Minded",
    "Builder",
    "Problem Solver",
    "Detail Oriented",
    "Passionate",
];

export function RotatingWord() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <span className="relative inline-block" style={{ minWidth: "10ch" }}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={WORDS[index]}
                    className="font-script"
                    style={{ color: "var(--accent)", display: "inline-block" }}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                    {WORDS[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

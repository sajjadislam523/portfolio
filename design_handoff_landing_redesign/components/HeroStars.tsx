"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// HeroStars — Redesign Blueprint §01.
//
// Replaces .bg-grid, the centred radial glow and both blurred orbs. A scattered
// field of small dots, each twinkling on its own 3–7s cycle, plus a second copy
// of the same field in --hero-star-lit that a 200px spotlight follows the cursor
// through. The field is quiet at rest and brightens locally under the pointer,
// which is what the grid never did.
//
// Positions come from a seeded PRNG evaluated at MODULE scope, so the server
// and the client generate byte-identical markup — no hydration mismatch, and no
// layout shift. Nothing here reads window during render.
//
// prefers-reduced-motion is handled in globals.css: the twinkle stops and the
// lit layer is display:none, so the field renders as a still starfield.
// ─────────────────────────────────────────────────────────────────────────────

type Star = {
    x: number;
    y: number;
    d: number;
    dLit: number;
    dur: number;
    delay: number;
};

const MAX_STARS = 120;
const SEED = 20260907;

function buildField(count: number, seed: number): Star[] {
    let s = seed;
    const rnd = () => {
        s = (s * 1103515245 + 12345) % 2147483648;
        return s / 2147483648;
    };
    return Array.from({ length: count }, () => {
        const d = 1 + rnd() * 1.9;
        return {
            x: Number((rnd() * 100).toFixed(2)),
            y: Number((rnd() * 100).toFixed(2)),
            d: Number(d.toFixed(2)),
            dLit: Number((d + 1.7).toFixed(2)),
            dur: Number((2.9 + rnd() * 4.2).toFixed(2)),
            delay: Number((rnd() * 6).toFixed(2)),
        };
    });
}

const FIELD = buildField(MAX_STARS, SEED);

interface HeroStarsProps {
    /** How many dots to render. 56 is the §01 density. Max 120. */
    count?: number;
}

export function HeroStars({ count = 56 }: HeroStarsProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);
    const stars = FIELD.slice(0, Math.min(count, MAX_STARS));

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let frame = 0;
        const onMove = (event: PointerEvent) => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                const el = ref.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const inside =
                    x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
                setSpot(inside ? { x, y } : null);
            });
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onMove);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div ref={ref} className="hero-stars" aria-hidden>
            {stars.map((star, i) => (
                <span
                    key={i}
                    className="hero-star"
                    style={
                        {
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.d}px`,
                            height: `${star.d}px`,
                            "--dur": `${star.dur}s`,
                            "--delay": `${star.delay}s`,
                        } as React.CSSProperties
                    }
                />
            ))}

            {/* Lit copy of the same field, revealed only where the cursor is */}
            <div
                className="hero-stars-lit"
                style={
                    {
                        opacity: spot ? 1 : 0,
                        "--mx": `${spot?.x ?? 0}px`,
                        "--my": `${spot?.y ?? 0}px`,
                    } as React.CSSProperties
                }
            >
                {stars.map((star, i) => (
                    <span
                        key={i}
                        className="hero-star-lit"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.dLit}px`,
                            height: `${star.dLit}px`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

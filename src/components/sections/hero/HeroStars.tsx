"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// HeroStars — canvas star field, three depth layers.
//
// The DOM-based version (56 twinkling <span> dots) read as sparse and flat.
// This redraws the same idea on a single <canvas> so density can go up by an
// order of magnitude without paying per-node DOM/CSS cost.
//
// Tuned down for the "cinematic technical" pass: fewer stars, lower ceiling
// opacity, a slower twinkle, and a tighter/softer cursor bloom. The field is
// meant to read as atmosphere behind the headline, not as a second focal
// point — see the brief's "never let the stars compete with the typography."
//
// Canvas has no server-rendered content, so there is no SSR/hydration
// mismatch to guard against — star positions are generated once on mount and
// animated entirely on the client via requestAnimationFrame.
// ─────────────────────────────────────────────────────────────────────────────

type Layer = {
    count: number;
    minR: number;
    maxR: number;
    minOpacity: number;
    maxOpacity: number;
    speed: number;
    twinkleSpeed: number;
    lit: boolean;
};

const LAYERS: Layer[] = [
    { count: 80, minR: 0.4, maxR: 0.9, minOpacity: 0.08, maxOpacity: 0.2, speed: 0.4, twinkleSpeed: 0.35, lit: false },
    { count: 55, minR: 0.8, maxR: 1.5, minOpacity: 0.14, maxOpacity: 0.36, speed: 0.75, twinkleSpeed: 0.55, lit: false },
    { count: 28, minR: 1.3, maxR: 2.2, minOpacity: 0.22, maxOpacity: 0.55, speed: 1.2, twinkleSpeed: 0.8, lit: true },
];

const SPOTLIGHT_RADIUS = 170;

type Star = {
    x: number; // 0..1 of canvas width
    y: number; // 0..1 of canvas height
    r: number;
    baseOpacity: number;
    swing: number;
    phase: number;
    twinkleSpeed: number;
    driftAngle: number;
    speed: number;
    lit: boolean;
};

function buildStars(): Star[] {
    const stars: Star[] = [];
    for (const layer of LAYERS) {
        for (let i = 0; i < layer.count; i++) {
            const base =
                layer.minOpacity + Math.random() * (layer.maxOpacity - layer.minOpacity);
            stars.push({
                x: Math.random(),
                y: Math.random(),
                r: layer.minR + Math.random() * (layer.maxR - layer.minR),
                baseOpacity: base,
                swing: base * (0.45 + Math.random() * 0.15),
                phase: Math.random() * Math.PI * 2,
                twinkleSpeed: layer.twinkleSpeed * (0.7 + Math.random() * 0.6),
                driftAngle: Math.random() * Math.PI * 2,
                speed: layer.speed * (0.5 + Math.random()),
                lit: layer.lit,
            });
        }
    }
    return stars;
}

export function HeroStars() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        const stars = buildStars();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let width = 0;
        let height = 0;
        let dotColor = "rgba(255,255,255,0.4)";
        let litColor = "rgba(255,255,255,0.9)";
        let glowColor = "rgba(255,255,255,0.6)";

        function readColors() {
            const cs = getComputedStyle(container as HTMLDivElement);
            dotColor = cs.getPropertyValue("--hero-star").trim() || dotColor;
            litColor = cs.getPropertyValue("--hero-star-lit").trim() || litColor;
            glowColor = cs.getPropertyValue("--hero-star-glow").trim() || glowColor;
        }
        readColors();

        function resize() {
            if (!container || !canvas) return;
            const rect = container.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }
        resize();

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        const themeObserver = new MutationObserver(readColors);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "data-theme"],
        });

        let spot: { x: number; y: number } | null = null;
        function onPointerMove(event: PointerEvent) {
            const rect = container!.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            spot =
                x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
                    ? { x, y }
                    : null;
        }
        function onPointerLeave() {
            spot = null;
        }

        if (!reduceMotion) {
            window.addEventListener("pointermove", onPointerMove, { passive: true });
            container.addEventListener("pointerleave", onPointerLeave, { passive: true });
        }

        let raf = 0;
        const start = performance.now();

        function draw(now: number) {
            if (!ctx) return;
            const t = (now - start) / 1000;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            for (const star of stars) {
                let x = star.x * width;
                let y = star.y * height;

                if (!reduceMotion) {
                    const dist = (star.speed * t) % (Math.max(width, height) + 40);
                    x = (star.x * width + Math.cos(star.driftAngle) * dist + width) % width;
                    y = (star.y * height + Math.sin(star.driftAngle) * dist + height) % height;
                }

                const twinkle = reduceMotion
                    ? 0
                    : Math.sin(t * star.twinkleSpeed + star.phase);
                let opacity = star.baseOpacity + twinkle * star.swing;

                let radius = star.r;
                let color = star.lit ? litColor : dotColor;
                let glow = 0;

                if (spot) {
                    const dx = x - spot.x;
                    const dy = y - spot.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < SPOTLIGHT_RADIUS) {
                        const boost = 1 - d / SPOTLIGHT_RADIUS;
                        opacity = Math.min(1, opacity + boost * 0.35);
                        radius = star.r + boost * 0.8;
                        color = litColor;
                        glow = boost * 4;
                    }
                }

                ctx.beginPath();
                ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
                ctx.fillStyle = color;
                if (glow > 0) {
                    ctx.shadowBlur = glow;
                    ctx.shadowColor = glowColor;
                } else {
                    ctx.shadowBlur = 0;
                }
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            if (!reduceMotion) raf = requestAnimationFrame(draw);
        }

        raf = requestAnimationFrame(draw);
        if (reduceMotion) draw(performance.now());

        return () => {
            if (raf) cancelAnimationFrame(raf);
            resizeObserver.disconnect();
            themeObserver.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            container.removeEventListener("pointerleave", onPointerLeave);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden" aria-hidden>
            <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
    );
}

"use client";

// A single reusable background-atmosphere system for section-level ambient
// decoration. Each section picks exactly ONE named variant — never a
// mix-and-match of grid + orbit + crosshair + lines all at once in the same
// section — so the site reads as one consistent technical vocabulary
// instead of a different one-off treatment hand-rolled per section (which
// is what Projects/Experience/Stack/CurrentlyExploring had each accumulated
// across separate passes before this component existed).
//
// Every variant is:
//   - absolutely positioned behind content (-z-10) inside its own
//     `overflow-hidden` wrapper, so a motif can never be the thing that
//     causes horizontal scroll, regardless of the offsets used inside it
//   - low-opacity, built only from existing design tokens
//   - fully static except Orbital's one-time draw-in reveal, which respects
//     prefers-reduced-motion via the same SSR-safe hook used sitewide
//   - hidden below `lg`/`md` — this is ambient decoration for the roomy
//     desktop canvas, not something mobile needs to render or pay for

import {
    CoordTag,
    Crosshair,
    GridFragment,
    GuideLine,
} from "@/components/shared/TechnicalMotifs";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { motion } from "framer-motion";

export type AtmosphereVariant = "blueprint" | "signal" | "orbital" | "grain" | "measurement";

interface SectionAtmosphereProps {
    /** The one primary motif this section gets — pick a different one per
     *  neighboring section so the page doesn't repeat the same backdrop. */
    variant: AtmosphereVariant;
    /** A small coordinate-style caption, e.g. "// career_log". Optional. */
    label?: string;
    className?: string;
}

export function SectionAtmosphere({ variant, label, className = "" }: SectionAtmosphereProps) {
    const shouldReduceMotion = useReducedMotionSafe();

    return (
        <div
            className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
            aria-hidden
        >
            <Glow variant={variant} />
            {variant === "blueprint" && <Blueprint label={label} />}
            {variant === "signal" && <Signal label={label} />}
            {variant === "orbital" && <Orbital label={label} shouldReduceMotion={shouldReduceMotion} />}
            {variant === "grain" && <Grain />}
            {variant === "measurement" && <Measurement label={label} />}
        </div>
    );
}

// The one element every variant shares — a whisper of accent light, never a
// glow — positioned slightly differently per variant so neighboring
// sections don't all light up from the identical corner.
const GLOW_POSITION: Record<AtmosphereVariant, string> = {
    blueprint: "ellipse 55% 55% at 85% 15%",
    signal: "ellipse 55% 65% at 88% 35%",
    orbital: "ellipse 55% 65% at 88% 35%",
    grain: "ellipse 60% 50% at 50% 15%",
    measurement: "ellipse 50% 55% at 80% 40%",
};

function Glow({ variant }: { variant: AtmosphereVariant }) {
    return (
        <div
            className="absolute inset-0"
            style={{
                background: `radial-gradient(${GLOW_POSITION[variant]}, var(--accent-wash) 0%, transparent 70%)`,
                filter: "blur(76px)",
                opacity: 0.5,
            }}
        />
    );
}

// Blueprint grid — a fine technical grid fragment in one corner, the
// quietest and most literal "engineering diagram" motif.
function Blueprint({ label }: { label?: string }) {
    return (
        <>
            <GridFragment className="top-8 right-10 hidden lg:block" size={340} />
            {label && (
                <CoordTag className="right-10 bottom-10 hidden lg:block">{label}</CoordTag>
            )}
        </>
    );
}

// Signal path — thin technical lines with a couple of small nodes riding
// one of them, reading as a data/career signal rather than a static grid.
function Signal({ label }: { label?: string }) {
    return (
        <>
            <GuideLine
                orientation="vertical"
                length={240}
                className="top-20 right-[18%] hidden lg:block"
            />
            <GuideLine
                orientation="horizontal"
                length={130}
                className="top-1/3 right-10 hidden lg:block"
            />
            <span
                className="absolute top-20 right-[18%] hidden h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
                style={{ background: "var(--line-strong)" }}
            />
            <span
                className="absolute top-1/2 right-[18%] hidden h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
                style={{ background: "var(--line-strong)" }}
            />
            {label && (
                <CoordTag className="right-10 bottom-10 hidden lg:block">{label}</CoordTag>
            )}
        </>
    );
}

// Orbital ring — one thin arc, mostly off-canvas, that draws in once as the
// section scrolls into view, with a crosshair waypoint marking where it
// crosses into frame.
function Orbital({
    label,
    shouldReduceMotion,
}: {
    label?: string;
    shouldReduceMotion: boolean;
}) {
    return (
        <>
            <svg
                className="absolute inset-0 hidden h-full w-full md:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <motion.path
                    d="M 58 -20 A 65 65 0 0 1 112 62"
                    fill="none"
                    stroke="var(--line)"
                    strokeWidth="0.15"
                    initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                />
            </svg>
            <Crosshair
                size={16}
                color="var(--line-strong)"
                className="top-[38%] right-[10%] hidden lg:block"
            />
            {label && (
                <CoordTag className="right-10 bottom-10 hidden lg:block">{label}</CoordTag>
            )}
        </>
    );
}

// Grain — the quietest option: noise texture and the ambient light only, no
// grid/lines/crosshair. For a short editorial beat that shouldn't compete
// with a technical diagram.
function Grain() {
    return <div className="bg-noise absolute inset-0" />;
}

// Measurement marks — a ruler-like scale of tick marks and tiny numeric
// labels down one edge, the quietest and most "discovered rather than
// noticed" of the set. No grid, no lines crossing the content — just a
// technical margin note.
const MEASUREMENT_TICKS = [8, 30, 52, 74, 96];

function Measurement({ label }: { label?: string }) {
    return (
        <>
            {MEASUREMENT_TICKS.map((pos) => (
                <div
                    key={pos}
                    className="absolute right-12 hidden -translate-y-1/2 items-center gap-2 lg:flex"
                    style={{ top: `${pos}%` }}
                >
                    <span className="h-px w-3" style={{ background: "var(--line)" }} />
                    <span
                        className="font-mono text-[9px] tabular-nums"
                        style={{ color: "var(--text-tertiary)", opacity: 0.45 }}
                    >
                        {String(pos).padStart(2, "0")}
                    </span>
                </div>
            ))}
            {label && (
                <CoordTag className="right-12 bottom-8 hidden lg:block">{label}</CoordTag>
            )}
        </>
    );
}

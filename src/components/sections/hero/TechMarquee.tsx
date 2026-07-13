"use client";

import Image from "next/image";

interface TechMarqueeProps {
    techs: string[];
}

const ICON_SLUGS: Record<string, string> = {
    "React.js": "react",
    "Next.js": "nextdotjs",
    TypeScript: "typescript",
    TailwindCSS: "tailwindcss",
    "Node.js": "nodedotjs",
    "Express.js": "express",
    MongoDB: "mongodb",
    JWT: "jsonwebtokens",
    Stripe: "stripe",
    "TanStack Query": "reactquery",
    Docker: "docker",
    Vercel: "vercel",
    "shadcn/ui": "shadcnui",
    "Framer Motion": "framer",
    Git: "git",
    "Git & GitHub": "git",
    GitHub: "github",
    Figma: "figma",
    Postman: "postman",
    Vite: "vite",
    Firebase: "firebase",
    Netlify: "netlify",
    Axios: "axios",
    "Material-UI": "mui",
    Mongoose: "mongoose",
    Hostinger: "hostinger",
};

// Icon color matches --text-tertiary in Midnight theme — muted and consistent
// const ICON_COLOR = "6b6b76";

function TechIcon({ tech }: { tech: string }) {
    const slug = ICON_SLUGS[tech];
    if (!slug) return null;

    return (
        <Image
            src={`https://cdn.simpleicons.org/${slug}`}
            alt={`${tech} icon`}
            width={14}
            height={14}
            className="shrink-0 tech-marquee-icon"
            style={{ opacity: 0.85 }}
            unoptimized
        />
    );
}

export function TechMarquee({ techs }: TechMarqueeProps) {
    const doubled = [...techs, ...techs];

    return (
        <div
            className="relative overflow-hidden py-4 border-y"
            style={{ borderColor: "var(--border)" }}
        >
            {/* Left fade */}
            <div
                className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to right, var(--bg-primary), transparent)",
                }}
            />
            {/* Right fade */}
            <div
                className="absolute right-0 inset-y-0 w-24 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to left, var(--bg-primary), transparent)",
                }}
            />

            <div
                className="flex items-center w-max"
                style={{
                    animation: "marquee 40s linear infinite",
                    willChange: "transform",
                }}
            >
                {doubled.map((tech, i) => (
                    <div
                        key={`${tech}-${i}`}
                        className="inline-flex items-center"
                        style={{ paddingInline: "10px" }}
                    >
                        <span
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{
                                background: "var(--bg-elevated)",
                                border: "1px solid var(--border)",
                                color: "var(--text-secondary)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <TechIcon tech={tech} />
                            {tech}
                        </span>

                        <span
                            className="ml-5 w-1 h-1 rounded-full shrink-0"
                            style={{
                                background: "var(--border-strong)",
                                opacity: 0.4,
                            }}
                        />
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
          .tech-marquee-icon {
              filter: invert(1) brightness(var(--icon-brightness, 0.45));
              opacity: 0.9;
          }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation: marquee"] { animation: none; }
        }
      `}</style>
        </div>
    );
}

import type { NextConfig } from "next";

const isDocker = process.env.DOCKER_BUILD === "true";

const nextConfig: NextConfig = {
    // standalone output is required for Docker — creates a minimal self-contained build
    // Disabled in dev because it causes Server Actions to resolve against NEXT_PUBLIC_URL
    // instead of the actual request origin when accessed from other devices
    ...(isDocker ? { output: "standalone" } : {}),

    experimental: {
        serverActions: {
            allowedOrigins: [
                "localhost:3000",
                "127.0.0.1:3000",
                "192.168.1.219:3000",
                "https://sajjadulislam.vercel.app",
                "https://sajjadulislamportfolio-eyzlbz60d-sajjadul-islams-projects.vercel.app/",
            ],
        },
    },

    images: {
        remotePatterns: [
            { protocol: "https", hostname: "avatars.githubusercontent.com" },
            { protocol: "https", hostname: "github.com" },
            { protocol: "https", hostname: "raw.githubusercontent.com" },
            { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
            // Simple Icons CDN — used for tech stack icons in TechMarquee
            { protocol: "https", hostname: "cdn.simpleicons.org" },
        ],
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },

    async redirects() {
        return [
            {
                source: "/admin",
                destination: "/admin/dashboard",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;

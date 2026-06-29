"use client";

import { usePathname } from "next/navigation";

interface SocialLink {
    platform: string;
    url: string;
}

interface SiteFooterProps {
    name: string;
    socialLinks: SocialLink[];
}

export function SiteFooter({ name, socialLinks }: SiteFooterProps) {
    const pathName = usePathname();

    const isHomepage = pathName === "/";

    return (
        <footer
            className="border-t mt-20"
            style={{ borderColor: "var(--border)" }}
        >
            <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    Designed & built with ❤️ by{" "}
                    <span style={{ color: "var(--text-secondary)" }}>
                        {name}
                    </span>{" "}
                    — {new Date().getFullYear()}
                </p>

                {!isHomepage && socialLinks.length > 0 && (
                    <div className="flex items-center gap-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.platform}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs transition-colors hover:opacity-80"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                {link.platform}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </footer>
    );
}

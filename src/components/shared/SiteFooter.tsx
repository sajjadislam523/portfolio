// A closing signature, not another content section — a small technical
// identity block, the same social links shown elsewhere on the site, a
// hairline divider, and a two-line credit row. No client state needed
// (the old route check that hid social links on the homepage is gone —
// a footer repeating links already shown mid-page is normal, expected
// footer behavior, and dropping it lets this stay a server component).

interface SocialLink {
    platform: string;
    url: string;
}

interface SiteFooterProps {
    name: string;
    tagline?: string;
    location?: string;
    email?: string;
    socialLinks: SocialLink[];
}

export function SiteFooter({
    name,
    tagline,
    location,
    email,
    socialLinks,
}: SiteFooterProps) {
    const year = new Date().getFullYear();
    const links = email
        ? [...socialLinks, { platform: "Email", url: `mailto:${email}` }]
        : socialLinks;

    return (
        <footer className="mt-20 border-t" style={{ borderColor: "var(--line)" }}>
            <div className="container flex flex-col gap-10 py-12 sm:py-14">
                {/* Identity + links */}
                <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-3">
                        {/* Echoes the nav's own wordmark badge — the same mark
                            bookends the page rather than the footer inventing
                            a separate "closing" treatment. */}
                        <span
                            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-[11px]"
                            style={{ border: "1px solid var(--border-strong)", color: "var(--accent)" }}
                            aria-hidden
                        >
                            {name.charAt(0)}
                        </span>
                        <div className="flex flex-col gap-1 font-mono text-small uppercase tracking-wide">
                            <span style={{ color: "var(--text-primary)" }}>{name}</span>
                            <span style={{ color: "var(--text-tertiary)" }}>
                                {tagline || "Full Stack Engineer"}
                            </span>
                            {location && (
                                <span style={{ color: "var(--text-tertiary)" }}>{location}</span>
                            )}
                        </div>
                    </div>

                    {links.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            {links.map((link) => (
                                <a
                                    key={link.platform}
                                    href={link.url}
                                    target={link.platform === "Email" ? undefined : "_blank"}
                                    rel={
                                        link.platform === "Email"
                                            ? undefined
                                            : "noopener noreferrer"
                                    }
                                    className="font-mono text-small transition-colors duration-200 hover:text-[var(--accent-on-canvas)]"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {link.platform}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div
                    className="h-px w-full"
                    style={{ background: "var(--line-hairline)" }}
                    aria-hidden
                />

                {/* Signature */}
                <div className="flex flex-col gap-2 text-small sm:flex-row sm:items-center sm:justify-between">
                    <span style={{ color: "var(--text-tertiary)" }}>
                        © {year} {name}
                    </span>
                    <span
                        className="font-mono text-[11px] uppercase tracking-wide"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        Designed + engineered by {name}
                    </span>
                </div>
            </div>
        </footer>
    );
}

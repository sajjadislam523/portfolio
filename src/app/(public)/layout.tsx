import { CommandPalette } from "@/components/shared/CommandPalette";
import { NavClient } from "@/components/shared/NavClient";
import { connectDB, SiteSettings } from "@/lib/db";
import type { ISiteSettings } from "@/types";

async function getSettings(): Promise<ISiteSettings | null> {
    try {
        await connectDB();
        const doc = await SiteSettings.findOne({}).lean();
        return doc ? JSON.parse(JSON.stringify(doc)) : null;
    } catch {
        return null;
    }
}

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSettings();

    return (
        <>
            <NavClient
                availableForWork={settings?.availableForWork ?? false}
                resumeUrl={settings?.resumeUrl ?? ""}
            />
            <CommandPalette resumeUrl={settings?.resumeUrl ?? ""} />
            <main>{children}</main>
            <footer
                className="border-t mt-24"
                style={{ borderColor: "var(--border)" }}
            >
                <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p
                        className="text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        Designed & built with ❤️ by{" "}
                        <span style={{ color: "var(--text-secondary)" }}>
                            {settings?.name ?? "Sajjadul Islam"}
                        </span>{" "}
                        — {new Date().getFullYear()}
                    </p>
                    <div className="flex items-center gap-4">
                        {settings?.socialLinks.map((link) => (
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
                </div>
            </footer>
        </>
    );
}

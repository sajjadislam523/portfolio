import { CommandPalette } from "@/components/shared/CommandPalette";
import { NavClient } from "@/components/shared/NavClient";
import { SiteFooter } from "@/components/shared/SiteFooter";
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
        <div className="min-h-screen flex flex-col">
            <NavClient
                availableForWork={settings?.availableForWork ?? false}
                resumeUrl={settings?.resumeUrl ?? ""}
            />
            <CommandPalette resumeUrl={settings?.resumeUrl ?? ""} />
            <main>{children}</main>
            <SiteFooter
                name={settings?.name ?? "Sajjadul Islam"}
                socialLinks={settings?.socialLinks ?? []}
            />
        </div>
    );
}

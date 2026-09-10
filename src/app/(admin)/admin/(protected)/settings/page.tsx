import { PageHeader } from "@/components/admin/PageHeader";
import { requireSession } from "@/features/auth/session";
import { getSiteSettings } from "@/features/settings/actions";
import { SystemSettingsPanel } from "./SystemSettingsPanel";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
    const session = await requireSession();
    const settings = await getSiteSettings();

    return (
        <div className="max-w-2xl">
            <PageHeader
                title="Settings"
                description="System-level status and account info — profile, hero, social links, SEO, and resume each have their own page now"
            />
            <SystemSettingsPanel
                availableForWork={settings?.availableForWork ?? true}
                accountEmail={session.email}
            />
        </div>
    );
}

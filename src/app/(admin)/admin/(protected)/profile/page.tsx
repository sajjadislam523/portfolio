import { PageHeader } from "@/components/admin/PageHeader";
import { requireSession } from "@/features/auth/session";
import { getSiteSettings } from "@/features/settings/actions";
import { ProfileForm } from "./ProfileForm";

export const metadata = { title: "Profile" };

export default async function AdminProfilePage() {
    await requireSession();
    const settings = await getSiteSettings();

    return (
        <div className="max-w-2xl">
            <PageHeader title="Profile" description="Your identity, contact details, and about copy" />
            <ProfileForm settings={settings} />
        </div>
    );
}

import { PageHeader } from "@/components/admin/PageHeader";
import { requireSession } from "@/features/auth/session";
import { getSiteSettings } from "@/features/settings/actions";
import { SocialLinksForm } from "./SocialLinksForm";

export const metadata = { title: "Social Links" };

export default async function AdminSocialLinksPage() {
    await requireSession();
    const settings = await getSiteSettings();

    return (
        <div className="max-w-2xl">
            <PageHeader title="Social Links" description="Links shown in the nav menu and footer" />
            <SocialLinksForm initialLinks={settings?.socialLinks ?? []} />
        </div>
    );
}

import { connectDB, SiteSettings } from "@/lib/db";
import {
    buildThemeCSS,
    defaultTheme,
    getThemeTokens,
} from "@/lib/themes/utils";
import { ISiteSettings, ThemeName } from "@/types";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

// Fetch settings fresh on every request — needed for OG metadata
async function getSettings() {
    try {
        await connectDB();
        const doc = (await SiteSettings.findOne(
            {},
        ).lean()) as ISiteSettings | null;
        console.log("Fetched settings:", doc);
        return doc;
    } catch {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const s = await getSettings();

    const title = s?.seo?.title ?? "Sajjadul Islam — Full Stack Engineer";
    const description =
        s?.seo?.description ??
        "Full stack engineer specialising in React, Next.js, TypeScript and Node.js. Building production-grade web applications.";
    const ogImage = s?.seo?.ogImage ?? "";
    const url =
        process.env.NEXT_PUBLIC_URL ?? "https://sajjadulislam.vercel.app";

    return {
        // metadataBase is REQUIRED — without it Next.js can't resolve relative OG image paths
        metadataBase: new URL(url),
        title: {
            template: "%s | Sajjadul Islam",
            default: title,
        },
        description,
        openGraph: {
            type: "website",
            url,
            siteName: s?.name ?? "Sajjadul Islam",
            title,
            description,
            locale: "en_US",
            // Must provide explicit width/height for LinkedIn to accept the image
            images: ogImage
                ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage ? [ogImage] : [],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true },
        },
    };
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const s = await getSettings();
    const activeTheme = (s?.activeTheme as ThemeName) ?? defaultTheme;
    const tokens = getThemeTokens(activeTheme);
    const themeCSS = buildThemeCSS(tokens);

    return (
        <html
            lang="en"
            data-theme={activeTheme}
            className={`${GeistSans.variable} ${GeistMono.variable}`}
            suppressHydrationWarning
        >
            <head>
                <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
            </head>
            <body>
                {children}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: "var(--bg-elevated)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-strong)",
                        },
                    }}
                />
            </body>
        </html>
    );
}

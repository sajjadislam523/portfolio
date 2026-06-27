import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from 'sonner'
import { connectDB, SiteSettings } from '@/lib/db'
import { getThemeTokens, buildThemeCSS } from '@/lib/themes/utils'
import { defaultTheme } from '@/lib/themes/tokens'
import type { ThemeName } from '@/types'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'),
  title: {
    template: '%s | Sajjadul Islam',
    default: 'Sajjadul Islam — Full Stack Engineer',
  },
  description:
    'Full stack engineer specialising in React, Next.js, TypeScript and Node.js. Building production-grade web applications.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Sajjadul Islam',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

async function getActiveTheme(): Promise<ThemeName> {
  try {
    await connectDB()
    const settings = await SiteSettings.findOne({}).lean()
    return (settings?.activeTheme as ThemeName) ?? defaultTheme
  } catch {
    return defaultTheme
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const activeTheme = await getActiveTheme()
  const tokens = getThemeTokens(activeTheme)
  const themeCSS = buildThemeCSS(tokens)

  return (
    <html
      lang="en"
      data-theme={activeTheme}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inject theme CSS variables before any paint — prevents FOUT */}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-strong)',
            },
          }}
        />
      </body>
    </html>
  )
}

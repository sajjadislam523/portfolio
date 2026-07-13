import type { ThemeName, ThemeTokens } from "@/types";

export const themes: Record<ThemeName, ThemeTokens> = {
    midnight: {
        bgPrimary: "#0A0A0B",
        bgSecondary: "#111113",
        bgElevated: "#18181C",
        bgSubtle: "#1E1E24",
        border: "rgba(255,255,255,0.07)",
        borderStrong: "rgba(255,255,255,0.13)",
        textPrimary: "#FAFAFA",
        textSecondary: "#A0A0AB",
        textTertiary: "#6B6B76",
        accent: "#7C6AF7",
        accentGlow: "rgba(124,106,247,0.15)",
        accentForeground: "#FFFFFF",
        iconBrightness: "0.45",
    },
    ocean: {
        bgPrimary: "#030B14",
        bgSecondary: "#061525",
        bgElevated: "#0A2035",
        bgSubtle: "#0E2A43",
        border: "rgba(56,189,248,0.09)",
        borderStrong: "rgba(56,189,248,0.18)",
        textPrimary: "#F0F9FF",
        textSecondary: "#94A3B8",
        textTertiary: "#475569",
        accent: "#38BDF8",
        accentGlow: "rgba(56,189,248,0.13)",
        accentForeground: "#030B14",
        iconBrightness: "0.35",
    },
    sunset: {
        bgPrimary: "#0D0608",
        bgSecondary: "#160B0E",
        bgElevated: "#200F14",
        bgSubtle: "#271319",
        border: "rgba(251,113,133,0.09)",
        borderStrong: "rgba(251,113,133,0.18)",
        textPrimary: "#FFF1F2",
        textSecondary: "#FDA4AF",
        textTertiary: "#F43F5E",
        accent: "#FB7185",
        accentGlow: "rgba(251,113,133,0.13)",
        accentForeground: "#0D0608",
        iconBrightness: "0.45",
    },
    matrix: {
        bgPrimary: "#000000",
        bgSecondary: "#050F05",
        bgElevated: "#091709",
        bgSubtle: "#0D200D",
        border: "rgba(34,197,94,0.1)",
        borderStrong: "rgba(34,197,94,0.2)",
        textPrimary: "#DCFCE7",
        textSecondary: "#86EFAC",
        textTertiary: "#4ADE80",
        accent: "#22C55E",
        accentGlow: "rgba(34,197,94,0.13)",
        accentForeground: "#000000",
        iconBrightness: "0.4",
    },
    aurora: {
        bgPrimary: "#06060E",
        bgSecondary: "#0C0C1C",
        bgElevated: "#10102A",
        bgSubtle: "#151530",
        border: "rgba(167,139,250,0.09)",
        borderStrong: "rgba(167,139,250,0.18)",
        textPrimary: "#FAF5FF",
        textSecondary: "#C4B5FD",
        textTertiary: "#A78BFA",
        accent: "#A78BFA",
        accentGlow: "rgba(167,139,250,0.13)",
        accentForeground: "#06060E",
        iconBrightness: "0.5",
    },
};

export const defaultTheme: ThemeName = "midnight";

// Converts a token map to a flat CSS custom-property object
// Output: { '--bg-primary': '#0A0A0B', '--accent': '#7C6AF7', … }
export function tokensToCSSVars(tokens: ThemeTokens): Record<string, string> {
    const kebab = (s: string) =>
        s.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);

    return Object.fromEntries(
        Object.entries(tokens).map(([key, value]) => [
            `--${kebab(key)}`,
            value,
        ]),
    );
}

// Builds a <style> tag string to inject into <head> server-side
export function buildThemeCSS(tokens: ThemeTokens): string {
    const vars = tokensToCSSVars(tokens);
    const declarations = Object.entries(vars)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join("\n");
    return `:root {\n${declarations}\n}`;
}

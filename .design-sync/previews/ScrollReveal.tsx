import { ScrollReveal } from "portfolio";

export function Default() {
  return (
    <ScrollReveal>
      <div
        style={{
          padding: "1.25rem",
          borderRadius: "12px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          fontSize: "0.875rem",
          maxWidth: "320px",
        }}
      >
        Reveals via IntersectionObserver — for content below the fold.
      </div>
    </ScrollReveal>
  );
}

export function WithDelay() {
  return (
    <ScrollReveal delay={0.15}>
      <div
        style={{
          padding: "1.25rem",
          borderRadius: "12px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          fontSize: "0.875rem",
          maxWidth: "320px",
        }}
      >
        Delayed 0.15s after entering the viewport.
      </div>
    </ScrollReveal>
  );
}

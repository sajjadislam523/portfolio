import { FadeIn } from "portfolio";

export function Default() {
  return (
    <FadeIn>
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
        Fades in on first paint — pure CSS, no observer.
      </div>
    </FadeIn>
  );
}

export function WithDelay() {
  return (
    <FadeIn delay={0.2}>
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
        Delayed 0.2s — useful for staggering above-the-fold hero content.
      </div>
    </FadeIn>
  );
}

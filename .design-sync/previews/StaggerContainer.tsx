import { StaggerContainer, StaggerItem } from "portfolio";

const ITEMS = ["Design", "Build", "Ship"];

export function Default() {
  return (
    <StaggerContainer style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "280px" }}>
      {ITEMS.map((label) => (
        <StaggerItem key={label}>
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
            }}
          >
            {label}
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

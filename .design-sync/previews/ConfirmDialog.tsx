import { ConfirmDialog } from "portfolio";
import { useEffect } from "react";

function AutoOpen({ open }: { open: () => void }) {
  useEffect(() => {
    open();
  }, [open]);
  return null;
}

export function Trigger() {
  return (
    <ConfirmDialog
      title="Delete project?"
      description="This will permanently remove the project and its images."
      onConfirm={() => {}}
    >
      {(open) => (
        <button
          onClick={open}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            background: "#EF4444",
            color: "#fff",
            fontSize: "0.875rem",
            border: "none",
          }}
        >
          Delete project
        </button>
      )}
    </ConfirmDialog>
  );
}

// The interesting state is the open <dialog> itself, not the trigger button —
// auto-open on mount so the card shows the real confirmation UI.
export function Open() {
  return (
    <ConfirmDialog
      title="Delete project?"
      description="This will permanently remove the project and its images."
      onConfirm={() => {}}
    >
      {(open) => <AutoOpen open={open} />}
    </ConfirmDialog>
  );
}

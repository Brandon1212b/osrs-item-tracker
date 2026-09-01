import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** Full-screen tap catcher. Stays under the finger until pointerup so the same tap cannot hit the page behind a popup. */
export function PopupDismissShield({ onDismiss }: { onDismiss: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden
      className="fixed inset-0 z-[70]"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDismiss();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />,
    document.body,
  );
}

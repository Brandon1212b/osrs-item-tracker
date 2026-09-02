import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * After a popup unmounts mid-gesture, iOS/Safari still delivers the leftover
 * click to whatever is now under the finger (item card, method row, the same
 * trigger). Keep a short document-level swallow so that click never lands.
 */
let swallowUntil = 0;
let swallowInstalled = false;

function eatIfSwallowing(e: Event) {
  if (Date.now() > swallowUntil) return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
}

function installSwallow() {
  if (swallowInstalled || typeof document === "undefined") return;
  swallowInstalled = true;
  document.addEventListener("click", eatIfSwallowing, true);
  document.addEventListener("pointerup", eatIfSwallowing, true);
  document.addEventListener("mouseup", eatIfSwallowing, true);
  document.addEventListener("touchend", eatIfSwallowing, true);
}

export function swallowBehindPopup(ms = 500) {
  installSwallow();
  swallowUntil = Date.now() + ms;
}

/** Full-screen tap catcher, portaled so stacking contexts cannot hide it. */
export function PopupDismissShield({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    installSwallow();
  }, []);

  const dismiss = () => {
    swallowBehindPopup();
    onDismiss();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden
      className="fixed inset-0 z-[60]"
      style={{ backgroundColor: "rgba(0,0,0,0.01)", touchAction: "none" }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dismiss();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />,
    document.body,
  );
}

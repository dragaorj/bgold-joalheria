import { useSyncExternalStore } from "react";

/**
 * A number that changes whenever text layout may have changed: once the web
 * fonts finish loading, and after the viewport width changes (debounced).
 * Height-only changes (the mobile address bar) are ignored on purpose.
 * Components that split text into lines rebuild when it changes, so the line
 * animations always follow the real line breaks at the current width.
 */
let key = 0;
const listeners = new Set<() => void>();
const bump = () => {
  key++;
  listeners.forEach((l) => l());
};

if (typeof window !== "undefined") {
  document.fonts?.ready.then(bump);
  let width = window.innerWidth;
  let t = 0;
  window.addEventListener("resize", () => {
    if (window.innerWidth === width) return;
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      width = window.innerWidth;
      bump();
    }, 180);
  });
}

export function useLayoutKey() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => key,
  );
}

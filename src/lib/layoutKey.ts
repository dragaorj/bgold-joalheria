import { useSyncExternalStore } from "react";

/**
 * A number that changes whenever text layout may have changed: once the web
 * fonts finish loading, and after the layout width changes (debounced).
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
  // watch the layout width (clientWidth), not the window: the scrollbar
  // comes and goes with the cover, and text must be re-split when it does
  let width = document.documentElement.clientWidth;
  let t = 0;
  new ResizeObserver(() => {
    const w = document.documentElement.clientWidth;
    if (w === width) return;
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      width = document.documentElement.clientWidth;
      bump();
    }, 180);
  }).observe(document.documentElement);
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

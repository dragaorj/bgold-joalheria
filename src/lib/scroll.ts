import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis: Lenis | null = null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarsePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/**
 * Lenis smooths wheel input on desktop only. Touch keeps native momentum
 * scrolling (syncTouch off), which is what phones are tuned for. ScrollTrigger
 * reads the same scroll position Lenis renders, so the film is always in sync
 * with what the visitor sees.
 */
export function initScroll() {
  if (lenis || prefersReducedMotion()) {
    ScrollTrigger.refresh();
    return lenis;
  }
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  if (import.meta.env.DEV) (window as unknown as { __lenis: Lenis }).__lenis = lenis;
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTarget(target: string | HTMLElement | number) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement | number, { duration: 1.6 });
  } else if (typeof el === "number") {
    window.scrollTo({ top: el, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

export function lockScroll(lock: boolean) {
  if (lenis) (lock ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

export { gsap, ScrollTrigger, SplitText };

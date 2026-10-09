import { useEffect, useRef } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { gsap, prefersReducedMotion } from "../lib/scroll";
import { Logo } from "./brand/Logo";

/**
 * The film is fetched in full before scrubbing starts. This screen measures
 * that load: a cut stone slides along a small ruler, then the screen lifts away.
 */
export function Loader({ progress, done, onExit }: { progress: number; done: boolean; onExit: () => void }) {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const exited = useRef(false);

  useEffect(() => {
    if (!done || exited.current || !root.current) return;
    exited.current = true;
    const reduced = prefersReducedMotion();
    gsap
      .timeline({ onComplete: onExit })
      .to(root.current.querySelector(".loader__inner"), { opacity: 0, y: reduced ? 0 : -16, duration: 0.5, ease: "power2.in" }, 0.25)
      .to(
        root.current,
        reduced
          ? { opacity: 0, duration: 0.4 }
          : { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" },
        0.55,
      )
      .set(root.current, { display: "none" });
  }, [done, onExit]);

  const pct = Math.round(progress * 100);
  return (
    <div ref={root} className="loader" role="status" aria-live="polite" aria-label={`${t.loader}, ${pct}%`}>
      <div className="loader__inner">
        <Logo className="loader__logo" />
        <div className="cota loader__cota" aria-hidden="true" style={{ "--x": progress } as React.CSSProperties}>
          <span className="loader__fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <p className="loader__pct" aria-hidden="true">
          {String(pct).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

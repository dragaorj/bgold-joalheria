import { useEffect, useRef } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { useI18n } from "../../i18n/I18nProvider";
import { ScrollTrigger, gsap, prefersReducedMotion, scrollToTarget } from "../../lib/scroll";

/** Appears once the visitor has left the opening frame; returns to the top of the film. */
export function ScrollTop() {
  const btn = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const el = btn.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    gsap.set(el, { autoAlpha: 0, y: reduced ? 0 : 12 });
    const st = ScrollTrigger.create({
      start: () => window.innerHeight * 0.9,
      end: "max",
      onToggle: (self) =>
        gsap.to(el, {
          autoAlpha: self.isActive ? 1 : 0,
          y: self.isActive || reduced ? 0 : 12,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        }),
    });
    return () => st.kill();
  }, []);

  return (
    <button
      ref={btn}
      type="button"
      className="scroll-top icon-btn"
      aria-label={t.nav.top}
      title={t.nav.top}
      onClick={() => scrollToTarget(0)}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}

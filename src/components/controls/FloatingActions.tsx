import { useEffect, useRef } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { WHATSAPP_URL } from "../../config/film";
import { useI18n } from "../../i18n/I18nProvider";
import { ScrollTrigger, gsap, prefersReducedMotion, scrollToTarget } from "../../lib/scroll";

/**
 * Bottom-right actions: WhatsApp (soft green, floating gently) above
 * "back to top". Both appear together once the visitor has left the opening
 * frame, and leave together when they scroll back to it.
 */
export function FloatingActions() {
  const group = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const el = group.current;
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
    <div ref={group} className="floating-actions">
      <a
        className="whatsapp-btn"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.nav.whatsapp}
        title={t.nav.whatsapp}
      >
        <img className="whatsapp-btn__icon" src="/brand/whatsapp.svg" alt="" width={28} height={28} />
      </a>
      <button
        type="button"
        className="scroll-top icon-btn"
        aria-label={t.nav.top}
        title={t.nav.top}
        onClick={() => scrollToTarget(0)}
      >
        <ArrowUp size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

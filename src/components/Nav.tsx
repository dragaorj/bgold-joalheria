import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { INSTAGRAM_URL } from "../config/film";
import { useI18n } from "../i18n/I18nProvider";
import { gsap, lockScroll, prefersReducedMotion, scrollToTarget } from "../lib/scroll";
import { Logo } from "./brand/Logo";
import { LangSwitch, ThemeToggle } from "./controls/Controls";

export function Nav({ ready }: { ready: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  const links = [
    { href: "#joalheria", label: t.nav.links.joalheria },
    { href: "#criacoes", label: t.nav.links.criacoes },
    { href: "#processo", label: t.nav.links.processo },
    { href: "#contato", label: t.nav.links.contato },
  ];

  // discreet entrance after the loader
  useEffect(() => {
    if (!ready || !header.current) return;
    gsap.fromTo(
      header.current,
      { autoAlpha: 0, y: prefersReducedMotion() ? 0 : -12 },
      { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", delay: 0.5 },
    );
  }, [ready]);

  // mobile menu: curtain from the top, links rise line by line
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    lockScroll(open);
    const reduced = prefersReducedMotion();
    if (open) {
      gsap.set(el, { display: "flex" });
      gsap.fromTo(
        el,
        { clipPath: reduced ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)", opacity: reduced ? 0 : 1 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: reduced ? 0.2 : 0.7, ease: "expo.out" },
      );
      gsap.fromTo(
        el.querySelectorAll("[data-menu-item]"),
        { yPercent: reduced ? 0 : 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "expo.out", delay: 0.15 },
      );
      el.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    if (el.style.display === "flex") {
      gsap.to(el, {
        clipPath: reduced ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        opacity: reduced ? 0 : 1,
        duration: 0.45,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
      toggle.current?.focus({ preventScroll: true });
    }
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    window.setTimeout(() => scrollToTarget(href), wasOpen ? 380 : 0);
  };

  return (
    <>
    <header ref={header} className="site-nav" data-open={open} style={{ visibility: "hidden" }}>
      <a href={INSTAGRAM_URL} className="brand" target="_blank" rel="noopener noreferrer" aria-label={t.nav.home}>
        <Logo alt="" />
      </a>

      <nav className="site-nav__links" aria-label={t.nav.primary}>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => go(e, l.href)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="site-nav__tools">
        <LangSwitch className="site-nav__lang" />
        <ThemeToggle />
        <a className="btn btn--gold site-nav__cta" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          {t.nav.cta}
        </a>
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="menu-panel"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="menu-toggle__label">{open ? t.nav.close : t.nav.menu}</span>
          <span className="menu-toggle__bars" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>

      {/* outside the header: the header carries a transform from its entrance,
          which would trap a fixed child inside it instead of the viewport */}
      <div
        ref={panel}
        id="menu-panel"
        className="menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        style={{ display: "none" }}
      >
        <ul>
          {links.map((l) => (
            <li key={l.href} className="line-mask">
              <a data-menu-item href={l.href} onClick={(e) => go(e, l.href)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="menu-panel__foot">
          <div className="line-mask">
            <a data-menu-item className="btn btn--gold" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              {t.nav.cta}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="line-mask">
            <div data-menu-item>
              <LangSwitch />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

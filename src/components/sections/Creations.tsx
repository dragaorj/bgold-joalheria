import { useEffect, useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { INSTAGRAM_URL } from "../../config/film";
import { useI18n } from "../../i18n/I18nProvider";
import { gsap, prefersReducedMotion } from "../../lib/scroll";

const PHOTOS = ["/media/creations/aliancas.jpg", "/media/creations/noivado.jpg", "/media/creations/personalizadas.jpg"];

/**
 * 03 · Nossas criações. An editorial index; hovering a line brings up a real
 * BGold photo that follows the pointer, unmasking from the bottom and leaning
 * slightly with the movement. Photos only appear on hover; touch screens keep
 * the plain index.
 */
export function Creations() {
  const { t, lang } = useI18n();
  const c = t.creations;
  const body = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const api = useRef<{ show: (i: number, at?: { x: number; y: number }) => void; hide: () => void } | null>(null);

  useEffect(() => {
    const wrap = body.current;
    const card = preview.current;
    if (!wrap || !card) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const reduced = prefersReducedMotion();
    const items = Array.from(card.querySelectorAll<HTMLElement>(".preview__item"));
    const xTo = gsap.quickTo(card, "x", { duration: reduced ? 0 : 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(card, "y", { duration: reduced ? 0 : 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(card, "rotation", { duration: 0.9, ease: "power3.out" });
    let current = -1;
    let z = 1;
    let lastX = 0;
    let settle: gsap.core.Tween | null = null;
    gsap.set(card, { autoAlpha: 0, scale: 0.86, xPercent: 0, yPercent: -50 });

    const place = (x: number, y: number) => {
      const w = card.offsetWidth;
      const right = x + 40 + w <= wrap.clientWidth;
      xTo(right ? x + 40 : x - 40 - w);
      yTo(y);
    };

    const show = (i: number, at?: { x: number; y: number }) => {
      if (at) {
        if (current === -1) gsap.set(card, { x: at.x + 40, y: at.y });
        place(at.x, at.y);
      }
      if (current === -1) {
        gsap.to(card, { autoAlpha: 1, scale: 1, duration: reduced ? 0.2 : 0.6, ease: "expo.out", overwrite: "auto" });
      }
      if (i === current) return;
      current = i;
      const item = items[i];
      item.style.zIndex = String(++z);
      gsap.fromTo(
        item,
        { clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", opacity: reduced ? 0 : 1 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.85, ease: "expo.out", overwrite: true },
      );
      gsap.fromTo(item.querySelector("img"), { scale: reduced ? 1 : 1.25 }, { scale: 1, duration: 1.2, ease: "expo.out", overwrite: true });
    };

    const hide = () => {
      current = -1;
      gsap.to(card, { autoAlpha: 0, scale: 0.86, rotation: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
    };

    const onMove = (e: PointerEvent) => {
      if (current === -1) return;
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      place(x, y);
      if (!reduced) {
        const dx = x - lastX;
        rTo(gsap.utils.clamp(-9, 9, dx * 0.35));
        settle?.kill();
        settle = gsap.delayedCall(0.12, () => rTo(0));
      }
      lastX = x;
    };

    wrap.addEventListener("pointermove", onMove);
    api.current = { show, hide };
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      settle?.kill();
      gsap.killTweensOf([card, ...items]);
      api.current = null;
    };
  }, []);

  const enter = (i: number) => (e: React.PointerEvent) => {
    const r = body.current?.getBoundingClientRect();
    if (!r) return;
    api.current?.show(i, { x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const focus = (i: number) => (e: React.FocusEvent<HTMLAnchorElement>) => {
    const r = body.current?.getBoundingClientRect();
    const row = e.currentTarget.getBoundingClientRect();
    if (!r) return;
    api.current?.show(i, { x: row.left - r.left + row.width * 0.55, y: row.top - r.top + row.height / 2 });
  };

  return (
    <section id="criacoes" className="creations section" aria-labelledby="creations-title">
      <div className="creations__head">
        <h2 key={`creations-title-${lang}`} id="creations-title" className="display creations__title" data-reveal="lines">
          {c.title.map((p) => (
            <span key={p} className="phrase">
              {p}
            </span>
          ))}
        </h2>
      </div>

      <div ref={body} className="creations__body" onPointerLeave={() => api.current?.hide()}>
        <ul className="creations__list">
          {c.items.map((item, i) => (
            <li key={`${lang}-${i}`} className="creation" data-reveal="row" onPointerEnter={enter(i)}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="creation__link"
                onFocus={focus(i)}
                onBlur={() => api.current?.hide()}
              >
                <h3 className="display creation__name" data-row-name>
                  {item.name}
                </h3>
                <span className="cota cota--hover" aria-hidden="true" />
                <p className="creation__text" data-row-text>
                  {item.text}
                </p>
                <span className="creation__more">
                  {c.more}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div ref={preview} className="creations__preview" aria-hidden="true">
          {c.items.map((item, i) => (
            <div key={item.alt} className="preview__item">
              <img src={PHOTOS[i]} alt={item.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>

      <p className="creations__note" data-reveal="fade">
        {c.note}{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          @bgold.joalheria
        </a>
        .
      </p>
    </section>
  );
}

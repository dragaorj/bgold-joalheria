import { balanceText } from "./balance";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "./scroll";

/**
 * Editorial reveals for the sections after the film. Declarative:
 *   data-reveal="lines"  headline rises line by line (real lines, via SplitText)
 *   data-reveal="words"  paragraph surfaces word by word
 *   data-reveal="row"    list row: name by lines, then its sentence by words
 *   data-reveal="fade"   opacity with a short rise
 *   data-reveal="cota"   the stone slides along the ruler with the scroll
 *   data-reveal="clip"   media unmasks from the bottom, scrubbed by scroll
 *   data-parallax="-8"   gentle scrubbed drift in percent
 * Everything reverses when scrolling back up. The caller re-runs this when
 * the language, the fonts or the viewport width change, so the split always
 * matches the text as it is actually laid out.
 */
export function initReveals(scope: HTMLElement) {
  const reduced = prefersReducedMotion();
  const d = reduced ? 0 : 1;
  const splits: { revert: () => void }[] = [];
  const enter = (el: Element, start = "top 86%") => ({
    trigger: el,
    start,
    toggleActions: "play none none reverse",
  });
  const splitLines = (el: Element) => {
    splits.push(balanceText(el as HTMLElement));
    const s = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "sl" });
    splits.push(s);
    return s.lines;
  };
  const splitWords = (el: Element) => {
    const s = SplitText.create(el, { type: "words", wordsClass: "sw" });
    splits.push(s);
    return s.words;
  };

  const ctx = gsap.context(() => {
    scope.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
      gsap.fromTo(
        splitLines(el),
        { yPercent: 105 * d, opacity: reduced ? 0 : 1 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.09, ease: "expo.out", scrollTrigger: enter(el) },
      );
    });

    scope.querySelectorAll<HTMLElement>('[data-reveal="words"]').forEach((el) => {
      gsap.fromTo(
        splitWords(el),
        { opacity: 0, yPercent: 40 * d },
        { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.018, ease: "power3.out", scrollTrigger: enter(el, "top 90%") },
      );
    });

    scope.querySelectorAll<HTMLElement>('[data-reveal="row"]').forEach((el) => {
      const name = el.querySelector("[data-row-name]");
      const text = el.querySelector("[data-row-text]");
      const tl = gsap.timeline({ scrollTrigger: enter(el, "top 90%") });
      if (name) {
        tl.fromTo(
          splitLines(name),
          { yPercent: 105 * d, opacity: reduced ? 0 : 1 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: "expo.out" },
        );
      }
      if (text) {
        tl.fromTo(
          splitWords(text),
          { opacity: 0, yPercent: 40 * d },
          { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.02, ease: "power3.out" },
          0.2,
        );
      }
    });

    scope.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 18 * d },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: enter(el, "top 92%"),
        },
      );
    });

    // the stone slides along the ruler as the line crosses the screen
    scope.querySelectorAll<HTMLElement>('[data-reveal="cota"]').forEach((el) => {
      gsap.fromTo(
        el,
        { "--x": 0 },
        { "--x": 1, ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "top 30%", scrub: true } },
      );
    });

    scope.querySelectorAll<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
      const media = el.querySelector("[data-reveal-media]") ?? el.querySelector("img");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true },
      });
      tl.fromTo(el, { clipPath: reduced ? "inset(0% 0% 0% 0% round 18px)" : "inset(22% 0% 0% 0% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none" }, 0);
      if (media) tl.fromTo(media, { scale: reduced ? 1 : 1.14 }, { scale: 1, ease: "none" }, 0);
    });

    if (!reduced) {
      scope.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = Number(el.dataset.parallax || 0);
        gsap.fromTo(
          el,
          { yPercent: -amt / 2 },
          {
            yPercent: amt / 2,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    }

    // Past the film, the nav gains its quiet background.
    scope.querySelectorAll<HTMLElement>(".section").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top+=72",
        end: "bottom top+=72",
        onToggle: (self) => {
          if (self.isActive) document.documentElement.dataset.section = "on";
        },
      });
    });
  }, scope);

  return () => {
    ctx.revert();
    splits.forEach((s) => s.revert());
  };
}

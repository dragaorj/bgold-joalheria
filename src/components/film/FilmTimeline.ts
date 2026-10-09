import { balanceText } from "../../lib/balance";
import { gsap, SplitText } from "../../lib/scroll";

/**
 * Builds the chapter choreography on a timeline of duration 1.
 * Positions are scroll progress values, identical to the numbers in
 * config/film.ts, so "0.30" here means the same moment as 0.30 in the
 * scroll-to-video map. The timeline is scrubbed by the film's ScrollTrigger,
 * which makes every transition reversible by construction.
 *
 * Copy wraps naturally; SplitText measures the real line breaks at the
 * current width, so line reveals never invent a break. The caller rebuilds
 * the timeline when the width or the fonts change.
 *
 * Readability comes from edge tints in the theme colour: a full-height
 * gradient rises from the side where the chapter's text sits and fades out
 * with it, so nothing sits as a shape between the text and the film.
 */
export function buildChapterTimeline(root: HTMLElement, reduced: boolean) {
  const q = gsap.utils.selector(root);
  const d = reduced ? 0 : 1; // distance multiplier: reduced motion keeps opacity only
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  const splits: { revert: () => void }[] = [];
  const balance = (sel: string) => q(sel).forEach((el: HTMLElement) => splits.push(balanceText(el)));
  const lines = (sel: string) => {
    balance(sel);
    const s = SplitText.create(q(sel), { type: "lines", mask: "lines", linesClass: "sl" });
    splits.push(s);
    return s.lines;
  };
  const words = (sel: string) => {
    balance(sel);
    const s = SplitText.create(q(sel), { type: "words", wordsClass: "sw" });
    splits.push(s);
    return s.words;
  };
  const show = (sel: string, at: number, dur = 0.025) =>
    tl.fromTo(q(sel), { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, ease: "power1.out" }, at);
  const hide = (sel: string, at: number, dur = 0.03) =>
    tl.to(q(sel), { autoAlpha: 0, duration: dur, ease: "power1.in" }, at);
  const rise = (targets: Element[], at: number, dur = 0.03, stagger = 0.006) =>
    tl.fromTo(
      targets,
      { yPercent: 105 * d, opacity: reduced ? 0 : 1 },
      { yPercent: 0, opacity: 1, duration: dur, stagger, ease: "power2.out" },
      at,
    );

  // Keep the timeline exactly 1 unit long.
  tl.set({}, {}, 1);

  /* ---------- paper only: hide the table edge during the drawing ---------- */
  // Landscape frames show a strip of wood and the ruler at the top while the
  // drawing is on screen. A small zoom anchored at the bottom keeps them out,
  // and eases back when the camera pulls away from the paper (~2s in).
  const zoom = window.matchMedia("(max-aspect-ratio: 1/1)").matches ? 1 : 1.12;
  tl.fromTo(q(".film-frame"), { scale: zoom }, { scale: 1, duration: 0.07, ease: "power1.inOut" }, 0.455);

  /* ---------- edge tints, in step with the chapters ---------- */
  const tint = (sel: string, from: number, to: number, fade = 0.03) => {
    if (from > 0) tl.fromTo(q(sel), { opacity: 0 }, { opacity: 1, duration: fade }, from);
    tl.to(q(sel), { opacity: 0, duration: fade }, to);
  };
  gsap.set(q(".tint"), { opacity: 0 });
  gsap.set(q(".tint--bl"), { opacity: 1 });
  tint(".tint--bl", 0, 0.075, 0.035);
  tint(".tint--br", 0.105, 0.27);
  tint(".tint--sides", 0.29, 0.455);
  tint(".tint--bottom", 0.485, 0.61);
  tint(".tint--tl", 0.68, 0.84);

  /* ---------- 01 Introdução: the sketch ---------- */
  lines(".ch-intro .ch-title");
  const introSupport = lines(".ch-intro .intro-support");
  show(".ch-intro .intro-support", 0.01, 0.015);
  rise(introSupport, 0.012);
  tl.to(q(".ch-intro"), { autoAlpha: 0, y: -48 * d, duration: 0.04, ease: "power1.in" }, 0.07);

  /* ---------- 02 O começo: the title wipes in from the right, body by lines ---------- */
  balance(".ch-inicio .ch-title");
  balance(".prec-a");
  balance(".prec-b");
  show(".ch-inicio", 0.115);
  const inicioLines = lines(".ch-inicio .ch-body");
  gsap.set(q(".inicio-inner"), { clipPath: "inset(0% 0% 0% 0%)" });
  tl.fromTo(
    q(".ch-inicio .ch-title"),
    { opacity: reduced ? 0 : 1, clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)", x: 40 * d },
    { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.06, ease: "power3.out" },
    0.12,
  );
  rise(inicioLines, 0.155);
  if (!reduced) {
    tl.to(q(".inicio-inner"), { clipPath: "inset(0% 0% 100% 0%)", duration: 0.04, ease: "power2.in" }, 0.25);
  }
  hide(".ch-inicio", 0.265, 0.025);

  /* ---------- 03 A arte: the words frame the ring from both sides ---------- */
  show(".arte-pos--left", 0.3);
  tl.fromTo(
    q(".arte-left"),
    { clipPath: "inset(0% 100% 0% 0%)", x: -60 * d },
    { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.07, ease: "power3.out" },
    0.3,
  );
  show(".arte-pos--right", 0.335);
  tl.fromTo(
    q(".arte-right"),
    { clipPath: "inset(0% 0% 0% 100%)", x: 60 * d },
    { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.07, ease: "power3.out" },
    0.335,
  );
  const arteLines = lines(".arte-support");
  show(".arte-support", 0.365);
  rise(arteLines, 0.37);
  tl.to(q(".arte-left"), { x: -90 * d, duration: 0.04, ease: "power1.in" }, 0.45);
  tl.to(q(".arte-right"), { x: 90 * d, duration: 0.04, ease: "power1.in" }, 0.45);
  hide(".arte-pos", 0.45, 0.04);
  hide(".arte-support", 0.45);

  /* ---------- 04 Precisão: one line is replaced by the next in the same slot ---------- */
  show(".ch-precisao", 0.495);
  const precLines = lines(".ch-precisao .prec-support");
  tl.fromTo(q(".prec-a"), { yPercent: 110 * d, opacity: reduced ? 0 : 1 }, { yPercent: 0, opacity: 1, duration: 0.035, ease: "power3.out" }, 0.5);
  tl.fromTo(q(".ch-precisao .cota"), { "--x": 0 }, { "--x": 1, duration: 0.1, ease: "none" }, 0.505);
  tl.to(q(".prec-a"), { yPercent: -110 * d, opacity: reduced ? 0 : 1, duration: 0.03, ease: "power2.in" }, 0.548);
  tl.fromTo(q(".prec-b"), { yPercent: 110 * d, opacity: reduced ? 0 : 1 }, { yPercent: 0, opacity: 1, duration: 0.035, ease: "power3.out" }, 0.556);
  rise(precLines, 0.568, 0.025, 0.005);
  tl.to(q(".ch-precisao"), { autoAlpha: 0, y: 24 * d, duration: 0.025, ease: "power1.in" }, 0.61);

  /* ---------- silence: the hand receives the ring, darkness falls ---------- */

  /* ---------- 05 A joia: words surface out of the dark ---------- */
  const joiaWords = words(".ch-joia .ch-title");
  const joiaLines = lines(".ch-joia .ch-body");
  show(".ch-joia", 0.695);
  tl.fromTo(
    joiaWords,
    { opacity: 0, y: 26 * d, scale: reduced ? 1 : 1.06 },
    { opacity: 1, y: 0, scale: 1, duration: 0.035, stagger: 0.005, ease: "power2.out" },
    0.7,
  );
  rise(joiaLines, 0.755);
  tl.to(q(".ch-joia"), { autoAlpha: 0, y: -28 * d, duration: 0.03, ease: "power1.in" }, 0.84);

  /* ---------- 06 Assinatura: the frame dims, the logo is drawn in ---------- */
  tl.fromTo(q(".film-dim"), { opacity: 0 }, { opacity: 1, duration: 0.07, ease: "power1.inOut" }, 0.86);
  tl.fromTo(q(".film-media"), { scale: 1 }, { scale: reduced ? 1 : 1.06, duration: 0.14 }, 0.86);
  show(".sig-name", 0.88, 0.02);
  tl.fromTo(
    q(".sig-logo"),
    { clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)", y: 14 * d },
    { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.05, ease: "power3.inOut" },
    0.885,
  );
  tl.fromTo(q(".ch-assinatura .cota"), { "--x": 0 }, { "--x": 1, duration: 0.09, ease: "none" }, 0.905);
  show(".sig-bottom", 0.91, 0.02);
  tl.fromTo(
    q(".ch-assinatura .sig-sub"),
    { opacity: 0, y: 14 * d },
    { opacity: 1, y: 0, duration: 0.04, ease: "power2.out" },
    0.915,
  );
  tl.fromTo(
    q(".ch-assinatura .sig-cta"),
    { autoAlpha: 0, y: 16 * d },
    { autoAlpha: 1, y: 0, duration: 0.03, ease: "power2.out" },
    0.935,
  );

  return { tl, splits };
}
